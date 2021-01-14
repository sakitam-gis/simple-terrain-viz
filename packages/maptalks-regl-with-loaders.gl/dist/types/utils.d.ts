/**
 * create gl context
 * @param canvas
 * @param glOptions
 * @returns {null|*}
 */
declare const createContext: (canvas: HTMLCanvasElement, glOptions?: {}) => CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext | null;
declare function getDevicePixelRatio(): number;
export declare function getUrl(template: string | string[], properties: {
    x: number;
    y: number;
    z: number;
}): string | null;
export { createContext, getDevicePixelRatio };
