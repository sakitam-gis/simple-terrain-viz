import REGL from 'regl';
import { TileLayer, renderer } from 'maptalks';
export declare namespace DrawCommon {
    interface Props {
        a_pos: REGL.Vec2[];
        a_texCoord: REGL.Vec2[];
        elements: REGL.Elements;
        u_matrix: REGL.Mat4;
        u_image: REGL.Texture2D;
        u_tile: REGL.Texture2D;
        u_tile_size: number;
        u_hasTerrain: number;
        u_opacity: number;
        u_extrude_scale: number;
        zoom: number;
        canvasSize: [number, number];
    }
    interface Uniforms {
        u_matrix: REGL.Mat4;
        u_image: REGL.Texture2D;
        u_tile: REGL.Texture2D;
        u_tile_size: number;
        u_hasTerrain: number;
        u_opacity: number;
        u_extrude_scale: number;
    }
    interface Attributes {
        a_pos: REGL.Vec2[];
        a_texCoord: REGL.Vec2[];
    }
}
interface Point {
    x: number;
    y: number;
}
declare type handleFunc = (...args: any[]) => void;
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
    };
    getGLScale(z: number): number;
}
interface ICanvasSize {
    width: number;
    height: number;
}
export interface IOptions {
    [key: string]: any;
    urlTemplate: string;
    subdomains: (string | number)[];
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
declare class TerrainLayer extends TileLayer {
    id: string | number;
    options: Partial<IOptions>;
    constructor(id: string | number, options?: Partial<IOptions>);
    rerender(): void;
    getMap(): MTK;
    getTileSize(): any;
}
interface IRenderer {
    getMap: () => MTK | null;
}
export declare class Renderer extends renderer.TileLayerCanvasRenderer implements IRenderer {
    private canvas;
    private canvas2;
    private gl;
    private layer;
    private regl;
    private command;
    private _tileZoom;
    private isDrawable;
    private _drawTiles;
    private getPlaneBuffer;
    private loadTile;
    onTileLoad(tileImage: HTMLImageElement, tileInfo: any): any;
    drawTile(tileInfo: any, tileImage: HTMLImageElement): void;
    private loadTileImage;
    private getCanvasImage;
    onCanvasCreate(): void;
    createContext(): void;
    /**
     * when map changed, call canvas change
     * @param canvasSize
     */
    resizeCanvas(canvasSize: ICanvasSize): void;
    /**
     * clear canvas
     */
    clearCanvas(): void;
    getMap(): MTK;
    onRemove(): void;
    completeRender(): any;
    setCanvasUpdated(): any;
    setToRedraw(): any;
    private prepareCanvas;
    private getTileOpacity;
}
export default TerrainLayer;
