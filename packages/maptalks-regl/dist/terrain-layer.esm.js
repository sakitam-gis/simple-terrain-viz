/*!
 * author: sakitam-fdd <smilefdd@gmail.com>
 * maptalks-regl v1.0.0
 * build-time: 2021-1-13 14:3
 * LICENSE: MIT
 * (c) 2020-2021 https://github.com/sakitam-gis/simple-terrain-viz
 */
import { __extends } from 'tslib';
import REGL from 'regl';
import { TileLayer, Canvas, renderer } from 'maptalks';
import { mat4 } from 'gl-matrix';

var vs = "#define GLSLIFY 1\nattribute vec2 a_pos;attribute vec2 a_texCoord;uniform mat4 u_matrix;uniform float u_tile_size;uniform sampler2D u_image;uniform float u_extrude_scale;uniform float u_hasTerrain;varying vec2 v_texCoord;varying float v_height;void main(){v_texCoord=a_texCoord;if(u_hasTerrain>0.0){vec3 rgb=texture2D(u_image,v_texCoord).rgb;float height=-10000.0+((rgb.r*255.0*256.0*256.0+rgb.g*255.0*256.0+rgb.b*255.0)*0.1);v_height=height;gl_Position=u_matrix*vec4(a_pos.xy*u_tile_size,height*u_extrude_scale,1.0);}else{gl_Position=u_matrix*vec4(a_pos.xy*u_tile_size,0.0,1.0);}}"; // eslint-disable-line

var fs = "precision mediump float;\n#define GLSLIFY 1\nvarying vec2 v_texCoord;varying float v_height;uniform sampler2D u_tile;uniform float u_opacity;void main(){vec4 color=texture2D(u_tile,v_texCoord);gl_FragColor=vec4(floor(255.0*color*u_opacity)/255.0);}"; // eslint-disable-line

/**
 * create gl context
 * @param canvas
 * @param glOptions
 * @returns {null|*}
 */
var createContext = function createContext(canvas, glOptions) {
  if (glOptions === void 0) {
    glOptions = {};
  }

  if (!canvas) return null;

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

var devicePixelRatio = 1; // fixed: ssr render @link https://github.com/gatsbyjs/gatsby/issues/25507

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

  var x = properties.x,
      y = properties.y,
      z = properties.z;
  return template.replace('{x}', String(x)).replace('{y}', String(y)).replace('{z}', String(z)).replace('{-y}', String(Math.pow(2, z) - y - 1));
}

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
  forceRenderOnZooming: true
};

var TerrainLayer =
/** @class */
function (_super) {
  __extends(TerrainLayer, _super);

  function TerrainLayer(id, options) {
    if (options === void 0) {
      options = {};
    }

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
}(TileLayer);
var v3 = new Float32Array([0, 0, 0]);
var arr16 = new Float32Array(16);

var Renderer =
/** @class */
function (_super) {
  __extends(Renderer, _super);

  function Renderer() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Renderer.prototype.isDrawable = function () {
    return true;
  };

  Renderer.prototype._drawTiles = function (tiles, parentTiles, childTiles, placeholders) {
    _super.prototype._drawTiles.call(this, tiles, parentTiles, childTiles, placeholders); // do update


    this.regl && this.regl._refresh();
  };

  Renderer.prototype.getPlaneBuffer = function (tile, startX, startY, width, height, widthSegments, heightSegments) {
    if (tile.planeBuffer && tile.widthSegments === widthSegments && tile.heightSegments === heightSegments) {
      return tile.planeBuffer;
    }

    tile.widthSegments = widthSegments;
    tile.heightSegments = heightSegments;
    var width_half = width / 2;
    var height_half = height / 2;
    var gridX = Math.floor(widthSegments);
    var gridY = Math.floor(heightSegments);
    var gridX1 = gridX + 1;
    var gridY1 = gridY + 1;
    var segment_width = width / gridX;
    var segment_height = height / gridY;
    var indices = [];
    var vertices = [];
    var uvs = [];

    for (var iy = 0; iy < gridY1; iy++) {
      var y = iy * segment_height;

      for (var ix = 0; ix < gridX1; ix++) {
        var x = ix * segment_width;
        vertices.push(x / width_half / 2, -(y / height_half / 2));
        uvs.push(x / width_half / 2, y / height_half / 2);
      }
    }

    for (var iy = 0; iy < gridY; iy++) {
      for (var ix = 0; ix < gridX; ix++) {
        var a = ix + gridX1 * iy;
        var b = ix + gridX1 * (iy + 1);
        var c = ix + 1 + gridX1 * (iy + 1);
        var d = ix + 1 + gridX1 * iy;
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    tile.planeBuffer = {
      uvs: uvs,
      vertices: vertices,
      indices: indices,
      elements: this.regl.elements({
        data: indices,
        primitive: 'triangles',
        // primitive: 'line strip',
        type: 'uint32',
        count: indices.length
      }),
      position: {
        buffer: this.regl.buffer({
          data: vertices,
          type: 'float'
        }),
        size: 2
      }
    };
    return tile.planeBuffer;
  };

  Renderer.prototype.loadTile = function (tile) {
    var _this = this;

    var tileSize = this.layer.getTileSize();
    var _a = this.layer.options,
        terrainTiles = _a.terrainTiles,
        crossOrigin = _a.crossOrigin;

    if (!terrainTiles) {
      console.warn('必须指定真实渲染图层: options.terrainTiles');
      return;
    } else {
      var urls_1 = getUrl(terrainTiles, {
        x: tile.x,
        y: tile.y,
        z: tile.z
      });
      var terrainImage_1 = new Image();
      var displayImage_1 = new Image(); // perf: 先去加载地图瓦片数据，默认渲染，再去加载地形数据进行贴图

      displayImage_1.width = tileSize['width'];
      displayImage_1.height = tileSize['height'];

      displayImage_1.onload = function () {
        _this.onTileLoad(displayImage_1, tile); // @ts-ignore


        terrainImage_1.onload = function () {
          tile.terrainImage = terrainImage_1;

          _this.onTileLoad(displayImage_1, tile);
        }; // @ts-ignore


        terrainImage_1.onerror = _this.onTileError.bind(_this, displayImage_1, tile); // 当地形数据加载失败后重新加载

        terrainImage_1.crossOrigin = crossOrigin !== null ? crossOrigin : '*';

        if (urls_1) {
          terrainImage_1.src = urls_1;
        }
      }; // @ts-ignore


      displayImage_1.onerror = this.onTileError.bind(this, displayImage_1, tile);
      this.loadTileImage(displayImage_1, tile['url']);
      return displayImage_1;
    }
  };

  Renderer.prototype.onTileLoad = function (tileImage, tileInfo) {
    return _super.prototype.onTileLoad.call(this, tileImage, tileInfo);
  };

  Renderer.prototype.drawTile = function (tileInfo, tileImage) {
    var map = this.getMap();

    if (!tileInfo || !map || !tileImage || !this.regl || !this.command) {
      return;
    }

    var scale = tileInfo._glScale = tileInfo._glScale || map.getGLScale(tileInfo.z);
    var w = tileInfo.size[0];
    var h = tileInfo.size[1];

    if (tileInfo.cache !== false) ; // if (tileInfo.z <= this._tileZoom) {
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
        mipmap: true
      });
    }

    if (!tileInfo.hasTerrain && tileInfo.terrainImage) {
      if (tileInfo.u_image) {
        tileInfo.u_image.destroy();
      }

      tileInfo.u_image = this.regl.texture({
        data: tileInfo.terrainImage,
        wrapS: 'clamp',
        wrapT: 'clamp',
        min: 'linear',
        mag: 'linear',
        mipmap: true
      });
      tileInfo.hasTerrain = true;
    } else if (!tileInfo.hasTerrain && !tileInfo.terrainImage) {
      // temp terrain
      tileInfo.u_image = this.regl.texture({
        width: w,
        height: h,
        wrapS: 'clamp',
        wrapT: 'clamp',
        min: 'linear',
        mag: 'linear'
      });
      tileInfo.hasTerrain = false;
    }

    var point = tileInfo.point;
    var x = point.x * scale;
    var y = point.y * scale;
    v3[0] = x || 0;
    v3[1] = y || 0;
    var _a = this.layer.options,
        extrudeScale = _a.extrudeScale,
        widthSegments = _a.widthSegments,
        heightSegments = _a.heightSegments,
        opacity = _a.opacity; // @ts-ignore

    var lyOpacity = this.getTileOpacity(tileImage);
    var matrix = this.getMap().projViewMatrix;
    var data = this.getPlaneBuffer(tileInfo, 0, 0, w, h, widthSegments !== undefined ? widthSegments : w / 2, heightSegments !== undefined ? heightSegments : h / 2);
    var uMatrix = mat4.identity(arr16);
    mat4.translate(uMatrix, uMatrix, v3);
    mat4.scale(uMatrix, uMatrix, [scale, scale, 1]);
    mat4.multiply(uMatrix, matrix, uMatrix);
    this.command({
      // @ts-ignore
      u_matrix: uMatrix,
      u_image: tileInfo.u_image,
      u_tile: tileInfo.u_tile,
      u_tile_size: w,
      u_hasTerrain: tileInfo.hasTerrain ? 1.0 : 0.0,
      zoom: tileInfo.z,
      elements: data.elements,
      a_pos: data.position,
      a_texCoord: data.uvs,
      u_opacity: opacity !== undefined ? opacity : 1,
      u_extrude_scale: extrudeScale !== undefined ? extrudeScale : 1,
      canvasSize: [this.gl.canvas.width, this.gl.canvas.height]
    });

    if (lyOpacity < 1) {
      this.setToRedraw();
    } else {
      this.setCanvasUpdated();
    }
  };

  Renderer.prototype.loadTileImage = function (tileImage, url) {
    //image must set cors in webgl
    var crossOrigin = this.layer.options['crossOrigin'];
    tileImage.crossOrigin = crossOrigin !== null ? crossOrigin : '';
    tileImage.src = url;
    return;
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
  }; // prepare gl, create program, create buffers and fill unchanged data: image samplers, texture coordinates


  Renderer.prototype.onCanvasCreate = function () {
    var _a, _b; // not in a GroupGLLayer
    // @ts-ignore


    if (!((_a = this.canvas) === null || _a === void 0 ? void 0 : _a.gl) || !((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.gl.wrap)) {
      this.canvas2 = Canvas.createCanvas(this.canvas.width, this.canvas.height);
    }
  };

  Renderer.prototype.createContext = function () {
    var _a, _b, _c, _d, _e, _f;

    _super.prototype.createContext.call(this); // @ts-ignore


    if (((_a = this.canvas) === null || _a === void 0 ? void 0 : _a.gl) && ((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.gl.wrap)) {
      // @ts-ignore
      this.gl = (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.gl.wrap();
    } else {
      var layer = this.layer;
      var attributes = ((_d = layer.options) === null || _d === void 0 ? void 0 : _d.glOptions) || {
        alpha: true,
        depth: true,
        antialias: true,
        stencil: true
      };
      attributes.preserveDrawingBuffer = true; // fixed: jsdom env

      if ((_e = layer.options) === null || _e === void 0 ? void 0 : _e.customCreateGLContext) {
        this.gl = this.gl || ((_f = layer.options) === null || _f === void 0 ? void 0 : _f.customCreateGLContext(this.canvas2, attributes));
      } else {
        this.gl = this.gl || createContext(this.canvas2, attributes);
      }

      if (!this.regl) {
        this.regl = REGL({
          gl: this.gl,
          extensions: ['OES_texture_float', 'OES_element_index_uint', 'WEBGL_color_buffer_float'],
          attributes: {
            antialias: true,
            preserveDrawingBuffer: false
          }
        });
        this.command = this.regl({
          frag: fs,
          vert: vs,
          attributes: {
            a_pos: function a_pos(_, _a) {
              var a_pos = _a.a_pos;
              return a_pos;
            },
            a_texCoord: function a_texCoord(_, _a) {
              var a_texCoord = _a.a_texCoord;
              return a_texCoord;
            }
          },
          uniforms: {
            u_matrix: function u_matrix(_, _a) {
              var u_matrix = _a.u_matrix;
              return u_matrix;
            },
            u_image: function u_image(_, _a) {
              var u_image = _a.u_image;
              return u_image;
            },
            u_tile: function u_tile(_, _a) {
              var u_tile = _a.u_tile;
              return u_tile;
            },
            u_tile_size: function u_tile_size(_, _a) {
              var u_tile_size = _a.u_tile_size;
              return u_tile_size;
            },
            u_opacity: function u_opacity(_, _a) {
              var u_opacity = _a.u_opacity;
              return u_opacity;
            },
            u_extrude_scale: function u_extrude_scale(_, _a) {
              var u_extrude_scale = _a.u_extrude_scale;
              return u_extrude_scale;
            },
            u_hasTerrain: function u_hasTerrain(_, _a) {
              var u_hasTerrain = _a.u_hasTerrain;
              return u_hasTerrain;
            }
          },
          viewport: function viewport(_, _a) {
            var _b = _a.canvasSize,
                width = _b[0],
                height = _b[1];
            return {
              width: width,
              height: height
            };
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
              cmp: '<=',
              // @ts-ignore
              ref: function ref(_, _a) {
                var zoom = _a.zoom;
                return zoom;
              },
              mask: 0xff
            }
          },
          blend: {
            enable: true,
            func: {
              src: 'src alpha',
              dst: 'one minus src alpha'
            },
            color: [0, 0, 0, 0]
          },
          elements: function elements(_, _a) {
            var elements = _a.elements;
            return elements;
          }
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
    if (!this.canvas) return;
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
    if (!this.canvas || !this.gl) return;

    _super.prototype.clearCanvas.call(this); // eslint-disable-next-line no-bitwise


    if (this.regl) {
      this.regl.clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: this._tileZoom
      });
    }
  };

  Renderer.prototype.getMap = function () {
    return _super.prototype.getMap.call(this);
  };

  Renderer.prototype.onRemove = function () {
    _super.prototype.onRemove.call(this); // this.removeGLCanvas();

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
}(renderer.TileLayerCanvasRenderer);

TerrainLayer.registerRenderer('gl', Renderer);

export default TerrainLayer;
export { Renderer };
