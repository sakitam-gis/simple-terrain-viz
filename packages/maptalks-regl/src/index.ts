import REGL from 'regl';
// @ts-ignore
import { TileLayer, renderer, Canvas } from 'maptalks';

import { mat4 } from 'gl-matrix';

import vs from './shaders/draw.vert.glsl';
import fs from './shaders/draw.frag.glsl';

import { createContext, getDevicePixelRatio, getUrl } from './utils';

const _options = {
  registerEvents: true, // register map events default
  renderer: 'gl',
  glOptions: {
    alpha: true,
    depth: true,
    antialias: true,
    stencil: true
  },
  forceRenderOnMoving: true,
  forceRenderOnZooming: true
};

export namespace DrawCommon {
  export interface Props {
    a_pos: REGL.Vec2[];
    a_texCoord: REGL.Vec2[];
    elements: REGL.Elements;
    u_matrix: REGL.Mat4;
    u_image: REGL.Texture2D;
    u_tile: REGL.Texture2D;
    u_opacity: number;
    u_extrude_scale: number;
    canvasSize: [number, number];
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
  urlTemplate: string;
  subdomains: (string|number)[]
  realTiles: string | string[];
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

  private isDrawable() {
    return true;
  }

  private _drawTiles(tiles: any[], parentTiles: any[], childTiles: any[], placeholders: any[]) {
    super._drawTiles(tiles, parentTiles, childTiles, placeholders);
    // do update
    this.regl && this.regl._refresh();
  }

  private getPlaneBuffer(tile: any, startX: number, startY: number, width: number, height: number, widthSegments: number, heightSegments: number) {
    if (tile.planeBuffer && tile.widthSegments === widthSegments && tile.heightSegments === heightSegments) {
      return tile.planeBuffer;
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
        vertices.push(startX + (x / width_half / 2) * width, startY - (y / height_half / 2) * height);
        uvs.push(x / width_half / 2, y / height_half / 2);
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

    tile.planeBuffer = {
      uvs,
      vertices,
      indices,
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
    }

    return tile.planeBuffer;
  }

  private loadTile(tile: any) {
    const tileSize = this.layer.getTileSize();
    const { realTiles, crossOrigin } = this.layer.options;

    const terrainImage = new Image();
    if (!realTiles) {
      console.warn('必须指定真实渲染图层: options.realTiles');
    } else {
      const urls = getUrl(realTiles, {
        x: tile.x,
        y: tile.y,
        z: tile.z,
      });

      const displayImage = new Image();

      terrainImage.width = tileSize['width'];
      terrainImage.height = tileSize['height'];
      terrainImage.onload = () => {
        // @ts-ignore
        displayImage.onload = this.onTileLoad.bind(this, terrainImage, tile, displayImage);
        if (urls) {
          displayImage.src = urls;
        }
        displayImage.crossOrigin = crossOrigin !== null ? crossOrigin : '*';
      };
    }

    // @ts-ignore
    terrainImage.onerror = this.onTileError.bind(this, terrainImage, tile);

    this.loadTileImage(terrainImage, tile['url']);
    return terrainImage;
  }

  private onTileLoad(tileImage: HTMLImageElement, tileInfo: any, displayImage: HTMLImageElement) {
    if (!this.layer) {
      return;
    }
    const id = tileInfo['id'];
    // @ts-ignore
    if (!this.tilesInView) {
      // removed
      return;
    }

    tileInfo.displayImage = displayImage;

    const e = { tile : tileInfo, tileImage: tileImage };
    /**
     * tileload event, fired when tile is loaded.
     *
     * @event TileLayer#tileload
     * @type {Object}
     * @property {String} type - tileload
     * @property {TileLayer} target - tile layer
     * @property {Object} tileInfo - tile info
     * @property {Image} tileImage - tile image
     */
    // @ts-ignore
    this.layer.fire('tileload', e);
    // let user update tileImage in listener if needed
    tileImage = e.tileImage;
    // @ts-ignore
    tileImage.loadTime = Date.now();
    // @ts-ignore
    delete this.tilesLoading[id];
    // @ts-ignore
    this._addTileToCache(tileInfo, tileImage);
    this.setToRedraw();
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

    if (!tileInfo.u_image) {
      tileInfo.u_image = this.regl.texture({
        data: tileImage,
        wrapS: 'clamp',
        wrapT: 'clamp',
        min: 'linear',
        mag: 'linear',
        mipmap: false,
      });
    }

    if (!tileInfo.u_tile) {
      tileInfo.u_tile = this.regl.texture({
        data: tileInfo.displayImage,
        wrapS: 'clamp',
        wrapT: 'clamp',
        min: 'linear',
        mag: 'linear',
        mipmap: false,
      });
    }

    const point = tileInfo.point;
    const x = point.x * scale;
    const y = point.y * scale;
    v3[0] = x || 0;
    v3[1] = y || 0;
    const { extrudeScale, widthSegments, heightSegments, opacity } = this.layer.options;
    // @ts-ignore
    const lyOpacity = this.getTileOpacity(tileImage);

    const matrix = this.getMap().projViewMatrix;

    if (!tileInfo.planeBuffer) {

    }
    const data = this.getPlaneBuffer(
      tileInfo,
      0, 0, w, h,
      widthSegments !== undefined ? widthSegments : w / 2,
      heightSegments !== undefined ? heightSegments : h / 2,
    );

    const uMatrix = mat4.identity(arr16);
    mat4.translate(uMatrix, uMatrix, v3);
    mat4.scale(uMatrix, uMatrix, [scale, scale, 1]);
    mat4.multiply(uMatrix, matrix as any, uMatrix);

    this.command({
      // @ts-ignore
      u_matrix: uMatrix as REGL.Mat4,
      u_image: tileInfo.u_image,
      u_tile: tileInfo.u_tile,
      elements: data.elements,
      a_pos: data.position,
      a_texCoord: data.uvs,
      // a_pos: [
      //   0, 0,
      //   0, -256,
      //   256, 0,
      //   256, -256
      // ],
      // a_texCoord: [
      //   0.0, 0.0,
      //   0.0, 1.0,
      //   1.0, 0.0,
      //   1.0, 1.0
      // ],
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

  private loadTileImage(tileImage: any, url: string) {
    //image must set cors in webgl
    const crossOrigin = this.layer.options['crossOrigin'];
    tileImage.crossOrigin = crossOrigin !== null ? crossOrigin : '';
    tileImage.src = url;
    return;
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
            u_image: (_, { u_image }) => u_image,
            u_tile: (_, { u_tile }) => u_tile,
            u_opacity: (_, { u_opacity }) => u_opacity,
            u_extrude_scale: (_, { u_extrude_scale }) => u_extrude_scale,
          },

          viewport: (_, { canvasSize: [width, height] }) => ({ width, height }),

          depth: { enable: false },

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
        depth: 1
      })
    }
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
