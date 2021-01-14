import REGL from 'regl';
// @ts-ignore
import { Canvas, renderer, TileLayer } from 'maptalks';

import { mat4 } from 'gl-matrix';
// import { load } from '@loaders.gl/core/dist/es5';
// @ts-ignore
// import { TerrainLoader } from '@loaders.gl/terrain/dist/es5';
// import { ImageLoader } from '@loaders.gl/images/dist/es5';

import vs from './shaders/draw.vert.glsl';
import fs from './shaders/draw.frag.glsl';

import {createContext, getDevicePixelRatio, getUrl} from './utils';

// @ts-ignore
registerLoaders([
  // jsonLoader,
  [
    // @ts-ignore
    ImageLoader,
    {
      imagebitmap: {
        premultiplyAlpha: 'none',
      },
    },
  ],
]);

const _options = {
  registerEvents: true, // register map events default
  renderer: 'gl',
  glOptions: {
    alpha: true,
    depth: false,
    antialias: true,
    stencil: true
  },
  forceRenderOnMoving: true,
  forceRenderOnZooming: true,
  elevationDecoder: {
    rScaler: 6553.6,
    gScaler: 25.6,
    bScaler: 0.1,
    offset: -10000
  },
  meshMaxError: 4,
  workerUrl: null,
};

export namespace DrawCommon {
  export interface Props {
    a_pos: REGL.Vec3[];
    a_texCoord: REGL.Vec2[];
    elements: REGL.Elements;
    u_matrix: REGL.Mat4;
    u_tile: REGL.Texture2D;
    u_tile_size: number;
    u_opacity: number;
    u_extrude_scale: number;
    zoom: number;
    canvasSize: [number, number];
  }
  export interface Uniforms {
    u_matrix: REGL.Mat4;
    u_tile: REGL.Texture2D;
    u_tile_size: number;
    u_opacity: number;
    u_extrude_scale: number;
  }
  export interface Attributes {
    a_pos: REGL.Vec3[];
    a_texCoord: REGL.Vec2[];
  }
}

interface Point {
  x: number;
  y: number;
}

type handleFunc = (...args: any[]) => void;

interface MTK {
  projViewMatrix: REGL.Mat4;
  getResolution: () => number;
  getMaxNativeZoom: () => number;
  getCenter: () => Point;
  getPitch: () => number;
  getBearing: () => number;
  on: (type: string, func: handleFunc, ctx: any) => void;
  off: (type: string, func: handleFunc, ctx: any) => void;
  getDevicePixelRatio: () => number;
  getSize: () => {
    width: number;
    height: number;
  }

  getGLScale(z: number): number;
}

interface ICanvasSize {
  width: number;
  height: number;
}

export interface IOptions {
  [key: string]: any;

  elevationDecoder: {
    rScaler: number;
    gScaler: number;
    bScaler: number;
    offset: number;
  },
  meshMaxError: number,
  workerUrl: null | string,

  urlTemplate: string;
  subdomains: (string|number)[]
  terrainTiles: string | string[];
  doubleBuffer?: boolean;
  animation?: boolean;
  fps?: number;
  attribution?: string;
  minZoom?: number;
  maxZoom?: number;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
  hitDetect?: boolean;
  renderer?: 'canvas' | 'gl';
  globalCompositeOperation?: string | null;
  cssFilter?: string | null;
  forceRenderOnMoving?: boolean;
  forceRenderOnZooming?: boolean;
  forceRenderOnRotating?: boolean;

  registerEvents?: boolean;

  renderStart?: () => void;
  renderEnd?: () => void;
  customCreateGLContext?: (canvas: HTMLCanvasElement, attrs: any) => WebGLRenderingContext | WebGL2RenderingContext;
}

class TerrainLayer extends TileLayer {
  public id: string | number;
  public options: Partial<IOptions>;

  constructor (id: string | number, options: Partial<IOptions> = {}) {
    super(id, Object.assign({}, _options, options));
  }

  public rerender() {
    // @ts-ignore
    const renderer = this.getRenderer();
    if (renderer) {
      renderer.setToRedraw();
    }
  }

  public getMap(): MTK {
    return super.getMap();
  }

  public getTileSize() {
    return super.getTileSize();
  }
}

interface IRenderer {
  getMap: () => MTK | null;
}

const v2 = [0, 0];
const v3: Float32Array = new Float32Array([0, 0, 0]);
const arr16 = new Float32Array(16);

export class Renderer extends renderer.TileLayerCanvasRenderer implements IRenderer {
  private canvas: HTMLCanvasElement;
  private canvas2: HTMLCanvasElement;
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private layer: TerrainLayer;
  private regl: REGL.Regl;
  private command: REGL.DrawCommand<REGL.DefaultContext, DrawCommon.Props>;
  private _tileZoom: number;
  private _childTiles: any[];
  private _parentTiles: any[];
  private tilesLoading: {};
  private tilesInView: {};

  private isDrawable() {
    return true;
  }

  private _drawTiles(tiles: any[], parentTiles: any[], childTiles: any[], placeholders: any[]) {
    super._drawTiles(tiles, parentTiles, childTiles, placeholders);
    // do update
    this.regl && this.regl._refresh();
  }

  private loadTile(tile: any) {
    const { terrainTiles, elevationDecoder, meshMaxError, workerUrl } = this.layer.options;
    if (!terrainTiles) {
      console.warn('必须指定真实渲染图层: options.terrainTiles');
      return {};
    } else {
      const urls = getUrl(terrainTiles, {
        x: tile.x,
        y: tile.y,
        z: tile.z,
      });

      Promise.all([
        this.loadTerrain({
          elevationData: urls,
          bounds: [0, 0, 1, 1],
          elevationDecoder,
          meshMaxError,
          workerUrl,
        }),
        // @ts-ignore
        load(tile['url'], [ImageLoader])
      ]).then(([terrain, image]) => {
        tile.terrainData = terrain;
        this.onTileLoad(image, tile);
      }).catch(error => {
        console.error(error)
        // @ts-ignore
        this.onTileError('', tile)
      });
      return {};
    }
  }

  public onTileLoad(tileImage: any, tileInfo: any) {
    return super.onTileLoad(tileImage, tileInfo);
  }

  private loadTerrain({
    elevationData,
    bounds,
    elevationDecoder,
    meshMaxError,
    workerUrl,
  }: any) {
    if (!elevationData) {
      return null;
    }
    const options: any = {
      terrain: {
        bounds,
        meshMaxError,
        elevationDecoder,
      },
    };
    if (workerUrl !== null) {
      options.terrain.workerUrl = workerUrl;
    }
    // @ts-ignore
    return load(elevationData, TerrainLoader, options);
  }

  public drawTile(tileInfo: any, tileImage: HTMLImageElement) {
    const map = this.getMap();
    if (!tileInfo || !map || !tileImage || !this.regl || !this.command) {
      return;
    }

    const scale = tileInfo._glScale = tileInfo._glScale || map.getGLScale(tileInfo.z);
    const w = tileInfo.size[0];
    const h = tileInfo.size[1];
    if (tileInfo.cache !== false) {
      // this._bindGLBuffer(tileImage, w, h);
    }

    // if (tileInfo.z <= this._tileZoom) {
    //   console.log('show', tileInfo);
    // } else {
    //   console.log('hide', tileInfo);
    // }

    if (!tileInfo.u_tile) {
      tileInfo.u_tile = this.regl.texture({
        data: tileImage,
        wrapS: 'clamp',
        wrapT: 'clamp',
        min: 'linear',
        mag: 'linear',
        mipmap: true,
      });
    }

    const point = tileInfo.point;
    const x = point.x * scale;
    const y = point.y * scale;
    v3[0] = x || 0;
    v3[1] = y || 0;
    const { extrudeScale, opacity } = this.layer.options;
    // @ts-ignore
    const lyOpacity = this.getTileOpacity(tileImage);

    const matrix = this.getMap().projViewMatrix;

    if (!tileInfo.planeBuffer) {
      const { attributes, indices } = tileInfo.terrainData;
      tileInfo.planeBuffer = {
        elements: this.regl.elements({
          data: indices.value,
          primitive: 'triangles',
          // primitive: 'line strip',
          type: 'uint32',
        }),
        position: {
          buffer: this.regl.buffer({
            data: attributes.POSITION.value,
            type: 'float',
          }),
          size: attributes.POSITION.size,
        },
        uvs: {
          buffer: this.regl.buffer(attributes.TEXCOORD_0.value),
          size: attributes.TEXCOORD_0.size,
        }
      }
    }

    const uMatrix = mat4.identity(arr16);
    mat4.translate(uMatrix, uMatrix, v3);
    mat4.scale(uMatrix, uMatrix, [scale, scale, 1]);
    mat4.multiply(uMatrix, matrix as any, uMatrix);
    this.command({
      // @ts-ignore
      u_matrix: uMatrix as REGL.Mat4,
      u_tile: tileInfo.u_tile,
      u_tile_size: w,
      zoom: tileInfo.z,
      elements: tileInfo.planeBuffer.elements,
      a_pos: tileInfo.planeBuffer.position,
      a_texCoord: tileInfo.planeBuffer.uvs,
      u_opacity: opacity !== undefined ? opacity : 1,
      u_extrude_scale: extrudeScale !== undefined ? extrudeScale : 1,
      canvasSize: [this.gl.canvas.width, this.gl.canvas.height]
    });

    if (lyOpacity < 1) {
      this.setToRedraw();
    } else {
      this.setCanvasUpdated();
    }
  }

  private getCanvasImage() {
    if (!this.regl || !this.canvas2) {
      return super.getCanvasImage();
    }
    const img = super.getCanvasImage();
    if (img) {
      img.image = this.canvas2;
    }
    return img;
  }

  // prepare gl, create program, create buffers and fill unchanged data: image samplers, texture coordinates
  public onCanvasCreate() {
    // not in a GroupGLLayer
    // @ts-ignore
    if (!this.canvas?.gl || !this.canvas?.gl.wrap) {
      this.canvas2 = Canvas.createCanvas(this.canvas.width, this.canvas.height);
    }
  }

  public createContext() {
    super.createContext();
    // @ts-ignore
    if (this.canvas?.gl && this.canvas?.gl.wrap) {
      // @ts-ignore
      this.gl = this.canvas?.gl.wrap();
    } else {
      const layer = this.layer;
      const attributes = layer.options?.glOptions || {
        alpha: true,
        depth: true,
        antialias: true,
        stencil : true
      };
      attributes.preserveDrawingBuffer = true;
      // fixed: jsdom env
      if (layer.options?.customCreateGLContext) {
        this.gl = this.gl || layer.options?.customCreateGLContext(this.canvas2, attributes);
      } else {
        this.gl = this.gl || createContext(this.canvas2, attributes);
      }

      if (!this.regl) {
        this.regl = REGL({
          gl: this.gl,
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
            a_texCoord: (_, { a_texCoord }) => a_texCoord,
          },

          uniforms: {
            u_matrix: (_, { u_matrix }) => u_matrix,
            u_tile: (_, { u_tile }) => u_tile,
            u_tile_size: (_, { u_tile_size }) => u_tile_size,
            u_opacity: (_, { u_opacity }) => u_opacity,
            u_extrude_scale: (_, { u_extrude_scale }) => u_extrude_scale,
          },

          viewport: (_, { canvasSize: [width, height] }) => ({ width, height }),

          depth: {
            enable: true,
            mask: true,
            func: 'less',
            range: [0, 1]
          },

          // @link https://github.com/regl-project/regl/blob/master/API.md#stencil
          stencil: {
            enable: true,
            func: {
              cmp: '<=',
              // @ts-ignore
              ref: (_: REGL.DefaultContext, { zoom }) => zoom,
              mask: 0xff
            },
            // opFront: {
            //   fail: 'keep',
            //   zfail: 'keep',
            //   zpass: 'replace'
            // },
            // opBack: {
            //   fail: 'keep',
            //   zfail: 'keep',
            //   zpass: 'replace'
            // }
          },

          blend: {
            enable: true,
            func: {
              src: 'src alpha',
              dst: 'one minus src alpha',
            },
            color: [0, 0, 0, 0]
          },

          elements: (_, { elements }) => elements,
        });
      }
    }
  }

  /**
   * when map changed, call canvas change
   * @param canvasSize
   */
  public resizeCanvas (canvasSize: ICanvasSize) {
    // eslint-disable-next-line no-useless-return
    if (!this.canvas) return;
    const map = this.getMap();
    const retina = (map.getDevicePixelRatio ? map.getDevicePixelRatio() : getDevicePixelRatio()) || 1;
    const size = canvasSize || map.getSize();
    if (this.canvas.width !== size.width * retina || this.canvas.height !== size.height * retina) {
      this.canvas.height = retina * size.height;
      this.canvas.width = retina * size.width;
    }

    if (this.canvas2.width !== this.canvas.width || this.canvas2.height !== this.canvas.height) {
      this.canvas2.height = this.canvas.height;
      this.canvas2.width = this.canvas.width;
    }
  }

  /**
   * clear canvas
   */
  public clearCanvas () {
    if (!this.canvas || !this.gl) return;
    super.clearCanvas();
    // eslint-disable-next-line no-bitwise
    if (this.regl) {
      this.regl.clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: this._tileZoom
      })
    }
  }

  public clear() {
    // @ts-ignore
    this._retireTiles(true);
    // @ts-ignore
    const keys = this.tileCache.keys();
    let i = 0;
    let len = keys.length;
    for (; i < len; i++) {
      // @ts-ignore
      const item = this.tileCache.get(keys[i]);
      if (item.info) {
        if (item.info.u_tile) {
          item.info.u_tile.destroy();
        }

        if (item.info.planeBuffer) {
          item.info.planeBuffer.elements.destroy();
          item.info.planeBuffer.position.buffer.destroy();
          item.info.planeBuffer.uvs.buffer.destroy();
        }
      }
    }
    // @ts-ignore
    this.tileCache.reset();
    this.tilesInView = {};
    this.tilesLoading = {};
    this._parentTiles = [];
    this._childTiles = [];
    super.clear();
  }

  public getMap(): MTK {
    return super.getMap();
  }

  public onRemove() {
    super.onRemove();
    // this.removeGLCanvas();
  }

  public completeRender() {
    return super.completeRender();
  }

  public setCanvasUpdated() {
    return super.setCanvasUpdated();
  }

  public setToRedraw() {
    return super.setToRedraw();
  }

  private prepareCanvas() {
    return super.prepareCanvas();
  }

  private getTileOpacity(tileImage: any) {
    return super.getTileOpacity(tileImage);
  }
}

// @ts-ignore
TerrainLayer.registerRenderer('gl', Renderer);

export default TerrainLayer;
