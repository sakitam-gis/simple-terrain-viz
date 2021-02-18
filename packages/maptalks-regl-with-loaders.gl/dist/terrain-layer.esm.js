/*!
 * author: sakitam-fdd <smilefdd@gmail.com>
 * maptalks-regl-with-loaders.gl v1.0.0
 * build-time: 2021-2-18 15:18
 * LICENSE: MIT
 * (c) 2020-2021 https://github.com/sakitam-gis/simple-terrain-viz
 */
import { __extends } from 'tslib';
import REGL from 'regl';
import { TileLayer, Canvas, renderer } from 'maptalks';
import { mat4 } from 'gl-matrix';
import { registerLoaders, load } from '@loaders.gl/core/dist/es5';
import { TerrainLoader } from '@loaders.gl/terrain/dist/es5';
import { ImageLoader } from '@loaders.gl/images/dist/es5';

var vs = "#define GLSLIFY 1\nattribute vec3 a_pos;attribute vec2 a_texCoord;uniform mat4 u_matrix;uniform float u_tile_size;uniform float u_extrude_scale;varying vec2 v_texCoord;varying float v_height;void main(){v_texCoord=a_texCoord;v_height=a_pos.z;gl_Position=u_matrix*vec4(a_pos.x*u_tile_size,(a_pos.y-1.0)*u_tile_size,a_pos.z*u_extrude_scale,1.0);}"; // eslint-disable-line

var fs = "precision mediump float;\n#define GLSLIFY 1\nvarying vec2 v_texCoord;varying float v_height;uniform sampler2D u_tile;uniform float u_opacity;void main(){vec4 color=texture2D(u_tile,v_texCoord);gl_FragColor=vec4(floor(255.0*color*u_opacity)/255.0);}"; // eslint-disable-line

/**
 * create gl context
 * @param canvas
 * @param glOptions
 * @returns {null|*}
 */
var createContext = function (canvas, glOptions) {
    if (glOptions === void 0) { glOptions = {}; }
    if (!canvas)
        return null;
    function onContextCreationError(error) {
        console.log(error.statusMessage);
    }
    if (canvas && canvas.addEventListener) {
        canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
    }
    var gl = canvas.getContext('webgl', glOptions);
    gl = gl || canvas.getContext('experimental-webgl', glOptions);
    if (!gl) {
        gl = canvas.getContext('webgl', glOptions);
        gl = gl || canvas.getContext('experimental-webgl', glOptions);
    }
    if (canvas.removeEventListener) {
        canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
    }
    return gl;
};
var devicePixelRatio = 1;
// fixed: ssr render @link https://github.com/gatsbyjs/gatsby/issues/25507
if (typeof window !== 'undefined') {
    // @ts-ignore
    devicePixelRatio = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
}
function getDevicePixelRatio() {
    return devicePixelRatio;
}
function getUrl(template, properties) {
    if (!template || !template.length) {
        return null;
    }
    if (Array.isArray(template)) {
        var index = Math.abs(properties.x + properties.y) % template.length;
        template = template[index];
    }
    var x = properties.x, y = properties.y, z = properties.z;
    return template
        .replace('{x}', String(x))
        .replace('{y}', String(y))
        .replace('{z}', String(z))
        .replace('{-y}', String(Math.pow(2, z) - y - 1));
}

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
var _options = {
    registerEvents: true,
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
var TerrainLayer = /** @class */ (function (_super) {
    __extends(TerrainLayer, _super);
    function TerrainLayer(id, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, id, Object.assign({}, _options, options)) || this;
    }
    TerrainLayer.prototype.rerender = function () {
        // @ts-ignore
        var renderer = this.getRenderer();
        if (renderer) {
            renderer.setToRedraw();
        }
    };
    TerrainLayer.prototype.getMap = function () {
        return _super.prototype.getMap.call(this);
    };
    TerrainLayer.prototype.getTileSize = function () {
        return _super.prototype.getTileSize.call(this);
    };
    return TerrainLayer;
}(TileLayer));
var v3 = new Float32Array([0, 0, 0]);
var arr16 = new Float32Array(16);
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Renderer.prototype.isDrawable = function () {
        return true;
    };
    Renderer.prototype._drawTiles = function (tiles, parentTiles, childTiles, placeholders) {
        _super.prototype._drawTiles.call(this, tiles, parentTiles, childTiles, placeholders);
        // do update
        this.regl && this.regl._refresh();
    };
    Renderer.prototype.loadTile = function (tile) {
        var _this = this;
        var _a = this.layer.options, terrainTiles = _a.terrainTiles, elevationDecoder = _a.elevationDecoder, meshMaxError = _a.meshMaxError, workerUrl = _a.workerUrl;
        if (!terrainTiles) {
            console.warn('必须指定真实渲染图层: options.terrainTiles');
            return {};
        }
        else {
            var urls = getUrl(terrainTiles, {
                x: tile.x,
                y: tile.y,
                z: tile.z,
            });
            Promise.all([
                this.loadTerrain({
                    elevationData: urls,
                    bounds: [0, 0, 1, 1],
                    elevationDecoder: elevationDecoder,
                    meshMaxError: meshMaxError,
                    workerUrl: workerUrl,
                }),
                // @ts-ignore
                load(tile['url'], [ImageLoader])
            ]).then(function (_a) {
                var terrain = _a[0], image = _a[1];
                tile.terrainData = terrain;
                _this.onTileLoad(image, tile);
            }).catch(function (error) {
                console.error(error);
                // @ts-ignore
                _this.onTileError('', tile);
            });
            return {};
        }
    };
    Renderer.prototype.onTileLoad = function (tileImage, tileInfo) {
        return _super.prototype.onTileLoad.call(this, tileImage, tileInfo);
    };
    Renderer.prototype.loadTerrain = function (_a) {
        var elevationData = _a.elevationData, bounds = _a.bounds, elevationDecoder = _a.elevationDecoder, meshMaxError = _a.meshMaxError, workerUrl = _a.workerUrl;
        if (!elevationData) {
            return null;
        }
        var options = {
            terrain: {
                bounds: bounds,
                meshMaxError: meshMaxError,
                elevationDecoder: elevationDecoder,
            },
        };
        if (workerUrl !== null) {
            options.terrain.workerUrl = workerUrl;
        }
        // @ts-ignore
        return load(elevationData, TerrainLoader, options);
    };
    Renderer.prototype.drawTile = function (tileInfo, tileImage) {
        var map = this.getMap();
        if (!tileInfo || !map || !tileImage || !this.regl || !this.command) {
            return;
        }
        var scale = tileInfo._glScale = tileInfo._glScale || map.getGLScale(tileInfo.z);
        var w = tileInfo.size[0];
        tileInfo.size[1];
        if (tileInfo.cache !== false) ;
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
        var point = tileInfo.point;
        var x = point.x * scale;
        var y = point.y * scale;
        v3[0] = x || 0;
        v3[1] = y || 0;
        var _a = this.layer.options, extrudeScale = _a.extrudeScale, opacity = _a.opacity;
        // @ts-ignore
        var lyOpacity = this.getTileOpacity(tileImage);
        var matrix = this.getMap().projViewMatrix;
        if (!tileInfo.planeBuffer) {
            var _b = tileInfo.terrainData, attributes = _b.attributes, indices = _b.indices;
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
            };
        }
        var uMatrix = mat4.identity(arr16);
        mat4.translate(uMatrix, uMatrix, v3);
        mat4.scale(uMatrix, uMatrix, [scale, scale, 1]);
        mat4.multiply(uMatrix, matrix, uMatrix);
        this.command({
            // @ts-ignore
            u_matrix: uMatrix,
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
        }
        else {
            this.setCanvasUpdated();
        }
    };
    Renderer.prototype.getCanvasImage = function () {
        if (!this.regl || !this.canvas2) {
            return _super.prototype.getCanvasImage.call(this);
        }
        var img = _super.prototype.getCanvasImage.call(this);
        if (img) {
            img.image = this.canvas2;
        }
        return img;
    };
    // prepare gl, create program, create buffers and fill unchanged data: image samplers, texture coordinates
    Renderer.prototype.onCanvasCreate = function () {
        var _a, _b;
        // not in a GroupGLLayer
        // @ts-ignore
        if (!((_a = this.canvas) === null || _a === void 0 ? void 0 : _a.gl) || !((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.gl.wrap)) {
            this.canvas2 = Canvas.createCanvas(this.canvas.width, this.canvas.height);
        }
    };
    Renderer.prototype.createContext = function () {
        var _a, _b, _c, _d, _e, _f;
        _super.prototype.createContext.call(this);
        // @ts-ignore
        if (((_a = this.canvas) === null || _a === void 0 ? void 0 : _a.gl) && ((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.gl.wrap)) {
            // @ts-ignore
            this.gl = (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.gl.wrap();
        }
        else {
            var layer = this.layer;
            var attributes = ((_d = layer.options) === null || _d === void 0 ? void 0 : _d.glOptions) || {
                alpha: true,
                depth: true,
                antialias: true,
                stencil: true
            };
            attributes.preserveDrawingBuffer = true;
            // fixed: jsdom env
            if ((_e = layer.options) === null || _e === void 0 ? void 0 : _e.customCreateGLContext) {
                this.gl = this.gl || ((_f = layer.options) === null || _f === void 0 ? void 0 : _f.customCreateGLContext(this.canvas2, attributes));
            }
            else {
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
                var stencil_1 = false;
                this.command = this.regl({
                    frag: fs,
                    vert: vs,
                    attributes: {
                        a_pos: function (_, _a) {
                            var a_pos = _a.a_pos;
                            return a_pos;
                        },
                        a_texCoord: function (_, _a) {
                            var a_texCoord = _a.a_texCoord;
                            return a_texCoord;
                        },
                    },
                    uniforms: {
                        u_matrix: function (_, _a) {
                            var u_matrix = _a.u_matrix;
                            return u_matrix;
                        },
                        u_tile: function (_, _a) {
                            var u_tile = _a.u_tile;
                            return u_tile;
                        },
                        u_tile_size: function (_, _a) {
                            var u_tile_size = _a.u_tile_size;
                            return u_tile_size;
                        },
                        u_opacity: function (_, _a) {
                            var u_opacity = _a.u_opacity;
                            return u_opacity;
                        },
                        u_extrude_scale: function (_, _a) {
                            var u_extrude_scale = _a.u_extrude_scale;
                            return u_extrude_scale;
                        },
                    },
                    viewport: function (_, _a) {
                        var _b = _a.canvasSize, width = _b[0], height = _b[1];
                        return ({ width: width, height: height });
                    },
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
                            cmp: stencil_1 ? '=' : '<=',
                            // @ts-ignore
                            ref: function (_, _a) {
                                var zoom = _a.zoom, stencilRef = _a.stencilRef;
                                return stencil_1 ? stencilRef : zoom;
                            },
                            mask: 0xff
                        },
                        op: {
                            fail: 'keep',
                            zfail: 'keep',
                            zpass: 'replace'
                        }
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
                    elements: function (_, _a) {
                        var elements = _a.elements;
                        return elements;
                    },
                });
            }
        }
    };
    /**
     * when map changed, call canvas change
     * @param canvasSize
     */
    Renderer.prototype.resizeCanvas = function (canvasSize) {
        // eslint-disable-next-line no-useless-return
        if (!this.canvas)
            return;
        var map = this.getMap();
        var retina = (map.getDevicePixelRatio ? map.getDevicePixelRatio() : getDevicePixelRatio()) || 1;
        var size = canvasSize || map.getSize();
        if (this.canvas.width !== size.width * retina || this.canvas.height !== size.height * retina) {
            this.canvas.height = retina * size.height;
            this.canvas.width = retina * size.width;
        }
        if (this.canvas2.width !== this.canvas.width || this.canvas2.height !== this.canvas.height) {
            this.canvas2.height = this.canvas.height;
            this.canvas2.width = this.canvas.width;
        }
    };
    /**
     * clear canvas
     */
    Renderer.prototype.clearCanvas = function () {
        if (!this.canvas || !this.gl)
            return;
        _super.prototype.clearCanvas.call(this);
        // eslint-disable-next-line no-bitwise
        if (this.regl) {
            this.regl.clear({
                color: [0, 0, 0, 0],
                depth: 1,
                stencil: this._tileZoom
            });
        }
    };
    Renderer.prototype.clear = function () {
        // @ts-ignore
        this._retireTiles(true);
        // @ts-ignore
        var keys = this.tileCache.keys();
        var i = 0;
        var len = keys.length;
        for (; i < len; i++) {
            // @ts-ignore
            var item = this.tileCache.get(keys[i]);
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
        _super.prototype.clear.call(this);
    };
    Renderer.prototype.getMap = function () {
        return _super.prototype.getMap.call(this);
    };
    Renderer.prototype.onRemove = function () {
        _super.prototype.onRemove.call(this);
        // this.removeGLCanvas();
    };
    Renderer.prototype.completeRender = function () {
        return _super.prototype.completeRender.call(this);
    };
    Renderer.prototype.setCanvasUpdated = function () {
        return _super.prototype.setCanvasUpdated.call(this);
    };
    Renderer.prototype.setToRedraw = function () {
        return _super.prototype.setToRedraw.call(this);
    };
    Renderer.prototype.prepareCanvas = function () {
        return _super.prototype.prepareCanvas.call(this);
    };
    Renderer.prototype.getTileOpacity = function (tileImage) {
        return _super.prototype.getTileOpacity.call(this, tileImage);
    };
    return Renderer;
}(renderer.TileLayerCanvasRenderer));
// @ts-ignore
TerrainLayer.registerRenderer('gl', Renderer);

export default TerrainLayer;
export { Renderer };
