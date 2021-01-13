/*!
 * author: sakitam-fdd <smilefdd@gmail.com>
 * mapbox-regl v1.0.0
 * build-time: 2021-1-13 17:42
 * LICENSE: MIT
 * (c) 2020-2021 https://github.com/sakitam-gis/simple-terrain-viz
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('regl')) :
    typeof define === 'function' && define.amd ? define(['regl'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TerrainLayer = factory(global.createREGL));
}(this, (function (REGL) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var REGL__default = /*#__PURE__*/_interopDefaultLegacy(REGL);

    var _assign = function __assign() {
      _assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

      return _assign.apply(this, arguments);
    };

    var vs = "#define GLSLIFY 1\nattribute vec2 a_pos;uniform mat4 u_matrix;uniform sampler2D u_image;uniform float u_extrude_scale;varying vec2 v_texCoord;varying float v_height;float extent=4096.0*2.0;void main(){v_texCoord=a_pos;vec3 rgb=texture2D(u_image,v_texCoord).rgb;float height=-10000.0+((rgb.r*255.0*256.0*256.0+rgb.g*255.0*256.0+rgb.b*255.0)*0.1);v_height=height;gl_Position=u_matrix*vec4(a_pos.xy*extent,height*u_extrude_scale,1.0);}"; // eslint-disable-line

    var fs = "precision mediump float;\n#define GLSLIFY 1\nvarying vec2 v_texCoord;varying float v_height;uniform sampler2D u_tile;uniform float u_opacity;void main(){vec4 color=texture2D(u_tile,v_texCoord);gl_FragColor=vec4(floor(255.0*color*u_opacity)/255.0);}"; // eslint-disable-line

    var TerrainLayer =
    /** @class */
    function () {
      function TerrainLayer(id, tileJson, options) {
        if (options === void 0) {
          options = {};
        }

        this.map = null;
        this.gl = null;
        this.id = id;
        this.tileSource = null;
        this.terrainTileSource = null;
        this.terrainSource = this.id + 'terrainSource';
        this.source = this.id + 'Source';
        this.type = 'custom';
        this.renderingMode = '3d';
        this.tileJson = tileJson;
        this.options = options;
        this.move = this.move.bind(this);
        this.onData = this.onData.bind(this);
        this.onTerrainData = this.onTerrainData.bind(this);
      }

      TerrainLayer.prototype.createTerrain = function () {
        this.map.addSource(this.terrainSource, _assign(_assign({}, this.tileJson), {
          tiles: this.tileJson.terrainTiles
        }));
        this.terrainTileSource = this.map.getSource(this.terrainSource);

        if (this.terrainTileSource) {
          this.terrainTileSource.on('data', this.onTerrainData);
          this.terrainSourceCache = this.map.style.sourceCaches[this.terrainSource];
        }

        this.map.style._layers[this.id].source = this.terrainSource;
      };

      TerrainLayer.prototype.createTile = function () {
        if (!this.map) return;
        this.map.addSource(this.source, _assign(_assign({}, this.tileJson), {
          tiles: this.tileJson.realTiles
        }));
        this.tileSource = this.map.getSource(this.source);

        if (this.tileSource) {
          this.tileSource.on('data', this.onData);
          this.sourceCache = this.map.style.sourceCaches[this.source];
        }

        var layer = {
          id: this.id + 'inner',
          type: 'custom',
          renderingMode: '3d',
          onAdd: function onAdd() {},
          render: function render() {},
          onRemove: function onRemove() {}
        };
        this.map.addLayer(layer);
        this.map.style._layers[this.id + 'inner'].source = this.source;
      };

      TerrainLayer.prototype.onAdd = function (map, gl) {
        this.map = map;
        this.gl = gl;
        map.on('move', this.move);
        this.createTerrain();
        this.createTile();
        this.regl = REGL__default['default']({
          gl: gl,
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
            u_opacity: function u_opacity(_, _a) {
              var u_opacity = _a.u_opacity;
              return u_opacity;
            },
            u_extrude_scale: function u_extrude_scale(_, _a) {
              var u_extrude_scale = _a.u_extrude_scale;
              return u_extrude_scale;
            }
          },
          depth: {
            enable: true,
            mask: true,
            func: 'less',
            range: [0, 1]
          },
          blend: {
            enable: false,
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
      };

      TerrainLayer.prototype.move = function () {
        this.updateTiles('terrainSourceCache');
        this.updateTiles('sourceCache');
      };

      TerrainLayer.prototype.onData = function (e) {
        if (e.sourceDataType === 'content') {
          this.updateTiles('sourceCache');
        }
      };

      TerrainLayer.prototype.onTerrainData = function (e) {
        if (e.sourceDataType === 'content') {
          this.updateTiles('terrainSourceCache');
        }
      };

      TerrainLayer.prototype.updateTiles = function (key) {
        // @ts-ignore
        this[key].update(this.map.painter.transform);
      };

      TerrainLayer.prototype.getPlaneBuffer = function (tile, width, height, widthSegments, heightSegments) {
        if (tile._planeBuffer && tile.widthSegments === widthSegments && tile.heightSegments === heightSegments) {
          return tile._planeBuffer;
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
            vertices.push(x / width_half / 2, y / height_half / 2); // vertices.push(ix / gridX, 1 - (iy / gridY));

            uvs.push(ix / gridX, 1 - iy / gridY);
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

        tile._planeBuffer = {
          vertices: vertices,
          indices: indices,
          uvs: uvs,
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
        return tile._planeBuffer;
      };

      TerrainLayer.prototype.render = function () {
        var _this = this;

        var tiles = this.terrainSourceCache.getVisibleCoordinates().map(function (tileid) {
          return _this.terrainSourceCache.getTile(tileid);
        });

        if (this.command) {
          tiles.forEach(function (tile) {
            if (!tile.texture) return;

            if (!tile._terrainTexture) {
              tile._terrainTexture = _this.regl.texture({
                data: tile.texture.image,
                wrapS: 'clamp',
                wrapT: 'clamp',
                min: 'linear',
                mag: 'linear',
                mipmap: true
              });
            }

            if (!tile._reglTexture) {
              // const { x, y, z } = tile.tileID.canonical;
              var realTile = _this.sourceCache.getTile(tile.tileID);

              if (realTile && realTile.texture) {
                tile._reglTexture = _this.regl.texture({
                  data: realTile.texture.image,
                  wrapS: 'clamp',
                  wrapT: 'clamp',
                  min: 'linear',
                  mag: 'linear',
                  mipmap: true
                });
              } // const image = new Image();
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
              var data = _this.getPlaneBuffer(tile, 256 + 0, 256 + 0, _this.options.widthSegments !== undefined ? _this.options.widthSegments : 256, _this.options.heightSegments !== undefined ? _this.options.heightSegments : 256); // [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]


              _this.command({
                u_matrix: tile.tileID.posMatrix,
                u_image: tile._terrainTexture,
                u_tile: tile._reglTexture,
                elements: data.elements,
                a_pos: data.position,
                u_opacity: _this.options.opacity !== undefined ? _this.options.opacity : 1,
                u_extrude_scale: _this.options.extrudeScale !== undefined ? _this.options.extrudeScale : 1
              });
            }
          });
        }
      };

      TerrainLayer.prototype.setOptions = function (options) {
        this.options = _assign(_assign({}, this.options), options);

        if (this.map) {
          this.map.triggerRepaint();
        }
      };

      TerrainLayer.prototype.onRemove = function () {
        this.regl.destroy();
        this.map.off('move', this.move);
      };

      return TerrainLayer;
    }();

    return TerrainLayer;

})));
//# sourceMappingURL=terrain-layer.js.map
