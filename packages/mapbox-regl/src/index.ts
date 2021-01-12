import REGL from 'regl';
import vs from './shaders/draw.vert.glsl';
import fs from './shaders/draw.frag.glsl';

export type ID = string | number;

export interface TileJSON {
  type: 'raster';
  tileSize: number;
  terrainTiles: string[];
  realTiles: string[];
  attribution: string;
}

export interface IOptions {
  opacity?: number;
  extrudeScale?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export interface ISource {
  on: (type: string, cb: (e: any) => void) => any;
}

type IMap = any;
type ITile = any;
type Pair<T> = [T, T];

export namespace DrawCommon {
  export interface Props {
    a_pos: REGL.Vec2[];
    elements: REGL.Elements;
    u_matrix: REGL.Mat4;
    u_image: REGL.Texture2D;
    u_tile: REGL.Texture2D;
    u_opacity: number;
    u_extrude_scale: number;
  }
  export interface Uniforms {
    u_matrix: REGL.Mat4;
    u_image: REGL.Texture2D;
    u_tile: REGL.Texture2D;
    u_opacity: number;
    u_extrude_scale: number;
  }
  export interface Attributes {
    a_pos: REGL.Vec2[];
  }
}

export default class TerrainLayer {
  public id: ID;
  public map: IMap;

  private gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  private tileJson: TileJSON;
  private type: 'custom';
  private readonly source: string;
  private readonly terrainSource: string;
  private tileSource: ISource | null;
  private terrainTileSource: ISource | null;
  private terrainSourceCache: any;
  private sourceCache: any;
  private regl: REGL.Regl;
  private command: REGL.DrawCommand<REGL.DefaultContext, DrawCommon.Props>;
  private options: IOptions;
  private renderingMode: string;

  constructor(id: ID, tileJson: TileJSON, options: IOptions = {}) {
    this.map = null;
    this.gl = null;
    this.id = id;
    this.tileSource = null;
    this.terrainTileSource = null;
    this.terrainSource = this.id + 'terrainSource'
    this.source = this.id + 'Source'
    this.type = 'custom';
    this.renderingMode = '3d';
    this.tileJson = tileJson;

    this.options = options;

    this.move = this.move.bind(this);
    this.onData = this.onData.bind(this);
    this.onTerrainData = this.onTerrainData.bind(this);
  }

  createTerrain() {
    this.map.addSource(this.terrainSource, {
      ...this.tileJson,
      tiles: this.tileJson.terrainTiles
    });
    this.terrainTileSource = this.map.getSource(this.terrainSource);
    if (this.terrainTileSource) {
      this.terrainTileSource.on('data', this.onTerrainData);
      this.terrainSourceCache = this.map.style.sourceCaches[this.terrainSource];
    }

    this.map.style._layers[this.id].source = this.terrainSource;
  }

  createTile() {
    if (!this.map) return;
    this.map.addSource(this.source, {
      ...this.tileJson,
      tiles: this.tileJson.realTiles
    });
    this.tileSource = this.map.getSource(this.source);
    if (this.tileSource) {
      this.tileSource.on('data', this.onData);
      this.sourceCache = this.map.style.sourceCaches[this.source];
    }

    const layer = {
      id: this.id + 'inner',
      type: 'custom',
      renderingMode: '3d',
      onAdd: () => {},
      render: () => {},
      onRemove: () => {}
    }

    this.map.addLayer(layer);

    this.map.style._layers[this.id + 'inner'].source = this.source;
  }

  onAdd(map: IMap, gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.map = map;
    this.gl = gl;
    map.on('move', this.move);

    this.createTerrain();

    this.createTile();

    this.regl = REGL({
      gl: gl,
      extensions: ['OES_texture_float', 'OES_element_index_uint', 'WEBGL_color_buffer_float'],
      attributes: {
        antialias: true,
        preserveDrawingBuffer: false,
      }
    });

    this.command = this.regl<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>({
      frag: fs,

      vert: vs,

      attributes: {
        a_pos: (_, { a_pos }) => a_pos,
        // a_texCoord: this.regl.prop('texCoord'),
      },

      uniforms: {
        u_matrix: (_, { u_matrix }) => u_matrix,
        u_image: (_, { u_image }) => u_image,
        u_tile: (_, { u_tile }) => u_tile,
        u_opacity: (_, { u_opacity }) => u_opacity,
        u_extrude_scale: (_, { u_extrude_scale }) => u_extrude_scale,
      },

      depth: {
        enable: false,
        mask: false,
        func: 'less',
        // range: [0, 1]
      },

      blend: {
        enable: false,
        func: {
          src: 'src alpha',
          dst: 'one minus src alpha',
        },
        color: [0, 0, 0, 0]
      },

      elements: (_, { elements }) => elements,
    });
  }

  move() {
    this.updateTiles('terrainSourceCache');
    this.updateTiles('sourceCache');
  }

  onData(e: any) {
    if (e.sourceDataType === 'content') {
      this.updateTiles('sourceCache');
    }
  }

  onTerrainData(e: any) {
    if (e.sourceDataType === 'content') {
      this.updateTiles('terrainSourceCache');
    }
  }

  updateTiles(key: string) {
    // @ts-ignore
    this[key].update(this.map.painter.transform);
  }

  getPlaneBuffer(tile: ITile, width: number, height: number, widthSegments: number, heightSegments: number) {
    if (tile._planeBuffer && tile.widthSegments === widthSegments && tile.heightSegments === heightSegments) {
      return tile._planeBuffer;
    }

    tile.widthSegments = widthSegments;
    tile.heightSegments = heightSegments;

    const width_half = width / 2;
    const height_half = height / 2;

    const gridX = Math.floor(widthSegments);
    const gridY = Math.floor(heightSegments);

    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    const segment_width = width / gridX;
    const segment_height = height / gridY;

    const indices = [];
    const vertices = [];
    const uvs = [];

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segment_height;
      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segment_width;
        vertices.push(x / width_half / 2, y / height_half / 2);
        // vertices.push(ix / gridX, 1 - (iy / gridY));
        uvs.push(ix / gridX, 1 - (iy / gridY));
      }
    }

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * (iy + 1);
        const c = (ix + 1) + gridX1 * (iy + 1);
        const d = (ix + 1) + gridX1 * iy;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    tile._planeBuffer = {
      vertices,
      indices,
      uvs,
      elements: this.regl.elements({
        data: indices,
        primitive: 'triangles',
        // primitive: 'line strip',
        type: 'uint32',
        count: indices.length,
      }),
      position: {
        buffer: this.regl.buffer({
          data: vertices,
          type: 'float',
        }),
        size: 2,
      },
    };

    return tile._planeBuffer;
  }

  render() {
    const tiles = this.terrainSourceCache.getVisibleCoordinates().map((tileid: any) => this.terrainSourceCache.getTile(tileid));
    if (this.command) {
      tiles.forEach((tile: ITile) => {
        if (!tile.texture) return;

        if (!tile._terrainTexture) {
          tile._terrainTexture = this.regl.texture({
            data: tile.texture.image,
            wrapS: 'clamp',
            wrapT: 'clamp',
            min: 'linear',
            mag: 'linear',
            mipmap: true,
          });
        }

        if (!tile._reglTexture) {
          // const { x, y, z } = tile.tileID.canonical;
          const realTile = this.sourceCache.getTile(tile.tileID);
          if (realTile && realTile.texture) {
            tile._reglTexture = this.regl.texture({
              data: realTile.texture.image,
              wrapS: 'clamp',
              wrapT: 'clamp',
              min: 'linear',
              mag: 'linear',
              mipmap: true,
            });
          }
          // const image = new Image();
          // image.onload = () => {
          //   tile._reglTexture = this.regl.texture({
          //     data: image,
          //     wrapS: 'clamp',
          //     wrapT: 'clamp',
          //     min: 'linear',
          //     mag: 'linear',
          //     mipmap: true,
          //   });
          // };
          // image.crossOrigin = '*';
          // // image.src = `https://mt0.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x=${x}&y=${y}&z=${z}&s=G`;
          // image.src = `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}.webp?sku=101XzrMiclXn4&access_token=${mapboxgl.accessToken}`;
        }

        if (tile._reglTexture) {
          const data = this.getPlaneBuffer(
            tile,
            256 + 0,
            256 + 0,
            this.options.widthSegments !== undefined ? this.options.widthSegments : 256,
            this.options.heightSegments !== undefined ? this.options.heightSegments : 256,
          );
          // [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]

          this.command({
            u_matrix: tile.tileID.posMatrix,
            u_image: tile._terrainTexture,
            u_tile: tile._reglTexture,
            elements: data.elements,
            a_pos: data.position,
            u_opacity: this.options.opacity !== undefined ? this.options.opacity : 1,
            u_extrude_scale: this.options.extrudeScale !== undefined ? this.options.extrudeScale : 1,
          });
        }
      });
    }
  }

  setOptions(options: IOptions) {
    this.options = {
      ...this.options,
      ...options,
    };
    if (this.map) {
      this.map.triggerRepaint();
    }
  }

  onRemove() {
    this.regl.destroy();

    this.map.off('move', this.move);
  }
}
