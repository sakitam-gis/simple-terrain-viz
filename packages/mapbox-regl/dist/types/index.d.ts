import REGL from 'regl';
export declare type ID = string | number;
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
declare type IMap = any;
declare type ITile = any;
export declare namespace DrawCommon {
    interface Props {
        a_pos: REGL.Vec2[];
        elements: REGL.Elements;
        u_matrix: REGL.Mat4;
        u_image: REGL.Texture2D;
        u_tile: REGL.Texture2D;
        u_opacity: number;
        u_extrude_scale: number;
    }
    interface Uniforms {
        u_matrix: REGL.Mat4;
        u_image: REGL.Texture2D;
        u_tile: REGL.Texture2D;
        u_opacity: number;
        u_extrude_scale: number;
    }
    interface Attributes {
        a_pos: REGL.Vec2[];
    }
}
export default class TerrainLayer {
    id: ID;
    map: IMap;
    private gl;
    private tileJson;
    private type;
    private readonly source;
    private readonly terrainSource;
    private tileSource;
    private terrainTileSource;
    private terrainSourceCache;
    private sourceCache;
    private regl;
    private command;
    private options;
    private renderingMode;
    constructor(id: ID, tileJson: TileJSON, options?: IOptions);
    createTerrain(): void;
    createTile(): void;
    onAdd(map: IMap, gl: WebGLRenderingContext | WebGL2RenderingContext): void;
    move(): void;
    onData(e: any): void;
    onTerrainData(e: any): void;
    updateTiles(key: string): void;
    getPlaneBuffer(tile: ITile, width: number, height: number, widthSegments: number, heightSegments: number): any;
    render(): void;
    setOptions(options: IOptions): void;
    onRemove(): void;
}
export {};
