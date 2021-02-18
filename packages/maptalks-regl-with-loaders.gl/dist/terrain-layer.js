/*!
 * author: sakitam-fdd <smilefdd@gmail.com>
 * maptalks-regl-with-loaders.gl v1.0.0
 * build-time: 2021-2-18 15:18
 * LICENSE: MIT
 * (c) 2020-2021 https://github.com/sakitam-gis/simple-terrain-viz
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('regl'), require('maptalks'), require('module'), require('path'), require('child_process'), require('fs'), require('util')) :
    typeof define === 'function' && define.amd ? define(['exports', 'regl', 'maptalks', 'module', 'path', 'child_process', 'fs', 'util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TerrainLayer = {}, global.createREGL, global.maptalks, global.Module, global.path$1, global.ChildProcess, global.fs$1, global.util));
}(this, (function (exports, REGL, maptalks, Module, path$1, ChildProcess, fs$1, util) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var REGL__default = /*#__PURE__*/_interopDefaultLegacy(REGL);
    var Module__default = /*#__PURE__*/_interopDefaultLegacy(Module);
    var path__default = /*#__PURE__*/_interopDefaultLegacy(path$1);
    var ChildProcess__default = /*#__PURE__*/_interopDefaultLegacy(ChildProcess);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs$1);
    var util__default = /*#__PURE__*/_interopDefaultLegacy(util);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * Common utilities
     * @module glMatrix
     */
    // Configuration Constants
    var EPSILON = 0.000001;
    var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
    if (!Math.hypot) Math.hypot = function () {
      var y = 0,
          i = arguments.length;

      while (i--) {
        y += arguments[i] * arguments[i];
      }

      return Math.sqrt(y);
    };

    /**
     * 3x3 Matrix
     * @module mat3
     */

    /**
     * Creates a new identity mat3
     *
     * @returns {mat3} a new 3x3 matrix
     */

    function create() {
      var out = new ARRAY_TYPE(9);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
      }

      out[0] = 1;
      out[4] = 1;
      out[8] = 1;
      return out;
    }

    /**
     * Set a mat4 to the identity matrix
     *
     * @param {mat4} out the receiving matrix
     * @returns {mat4} out
     */

    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Multiplies two mat4s
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {mat4} out
     */

    function multiply(out, a, b) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15]; // Cache only the current line of the second matrix

      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[4];
      b1 = b[5];
      b2 = b[6];
      b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[8];
      b1 = b[9];
      b2 = b[10];
      b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[12];
      b1 = b[13];
      b2 = b[14];
      b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      return out;
    }
    /**
     * Translate a mat4 by the given vector
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to translate
     * @param {ReadonlyVec3} v vector to translate by
     * @returns {mat4} out
     */

    function translate(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
      var a00, a01, a02, a03;
      var a10, a11, a12, a13;
      var a20, a21, a22, a23;

      if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
      } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
      }

      return out;
    }
    /**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to scale
     * @param {ReadonlyVec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/

    function scale(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
      out[0] = a[0] * x;
      out[1] = a[1] * x;
      out[2] = a[2] * x;
      out[3] = a[3] * x;
      out[4] = a[4] * y;
      out[5] = a[5] * y;
      out[6] = a[6] * y;
      out[7] = a[7] * y;
      out[8] = a[8] * z;
      out[9] = a[9] * z;
      out[10] = a[10] * z;
      out[11] = a[11] * z;
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }

    /**
     * 3 Dimensional Vector
     * @module vec3
     */

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */

    function create$1() {
      var out = new ARRAY_TYPE(3);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      return out;
    }
    /**
     * Calculates the length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate length of
     * @returns {Number} length of a
     */

    function length(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      return Math.hypot(x, y, z);
    }
    /**
     * Creates a new vec3 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {vec3} a new 3D vector
     */

    function fromValues(x, y, z) {
      var out = new ARRAY_TYPE(3);
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
    }
    /**
     * Normalize a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to normalize
     * @returns {vec3} out
     */

    function normalize(out, a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var len = x * x + y * y + z * z;

      if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
      }

      out[0] = a[0] * len;
      out[1] = a[1] * len;
      out[2] = a[2] * len;
      return out;
    }
    /**
     * Calculates the dot product of two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} dot product of a and b
     */

    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    /**
     * Computes the cross product of two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function cross(out, a, b) {
      var ax = a[0],
          ay = a[1],
          az = a[2];
      var bx = b[0],
          by = b[1],
          bz = b[2];
      out[0] = ay * bz - az * by;
      out[1] = az * bx - ax * bz;
      out[2] = ax * by - ay * bx;
      return out;
    }
    /**
     * Alias for {@link vec3.length}
     * @function
     */

    var len = length;
    /**
     * Perform some operation over an array of vec3s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    (function () {
      var vec = create$1();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 3;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
        }

        return a;
      };
    })();

    /**
     * 4 Dimensional Vector
     * @module vec4
     */

    /**
     * Creates a new, empty vec4
     *
     * @returns {vec4} a new 4D vector
     */

    function create$2() {
      var out = new ARRAY_TYPE(4);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
      }

      return out;
    }
    /**
     * Normalize a vec4
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to normalize
     * @returns {vec4} out
     */

    function normalize$1(out, a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var w = a[3];
      var len = x * x + y * y + z * z + w * w;

      if (len > 0) {
        len = 1 / Math.sqrt(len);
      }

      out[0] = x * len;
      out[1] = y * len;
      out[2] = z * len;
      out[3] = w * len;
      return out;
    }
    /**
     * Perform some operation over an array of vec4s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    (function () {
      var vec = create$2();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 4;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          vec[3] = a[i + 3];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
          a[i + 3] = vec[3];
        }

        return a;
      };
    })();

    /**
     * Quaternion
     * @module quat
     */

    /**
     * Creates a new identity quat
     *
     * @returns {quat} a new quaternion
     */

    function create$3() {
      var out = new ARRAY_TYPE(4);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      out[3] = 1;
      return out;
    }
    /**
     * Sets a quat from the given angle and rotation axis,
     * then returns it.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyVec3} axis the axis around which to rotate
     * @param {Number} rad the angle in radians
     * @returns {quat} out
     **/

    function setAxisAngle(out, axis, rad) {
      rad = rad * 0.5;
      var s = Math.sin(rad);
      out[0] = s * axis[0];
      out[1] = s * axis[1];
      out[2] = s * axis[2];
      out[3] = Math.cos(rad);
      return out;
    }
    /**
     * Performs a spherical linear interpolation between two quat
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {quat} out
     */

    function slerp(out, a, b, t) {
      // benchmarks:
      //    http://jsperf.com/quaternion-slerp-implementations
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];
      var bx = b[0],
          by = b[1],
          bz = b[2],
          bw = b[3];
      var omega, cosom, sinom, scale0, scale1; // calc cosine

      cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

      if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
      } // calculate coefficients


      if (1.0 - cosom > EPSILON) {
        // standard case (slerp)
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
      } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
      } // calculate final values


      out[0] = scale0 * ax + scale1 * bx;
      out[1] = scale0 * ay + scale1 * by;
      out[2] = scale0 * az + scale1 * bz;
      out[3] = scale0 * aw + scale1 * bw;
      return out;
    }
    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to renormalize the quaternion yourself where necessary.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyMat3} m rotation matrix
     * @returns {quat} out
     * @function
     */

    function fromMat3(out, m) {
      // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
      // article "Quaternion Calculus and Fast Animation".
      var fTrace = m[0] + m[4] + m[8];
      var fRoot;

      if (fTrace > 0.0) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0); // 2w

        out[3] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot; // 1/(4w)

        out[0] = (m[5] - m[7]) * fRoot;
        out[1] = (m[6] - m[2]) * fRoot;
        out[2] = (m[1] - m[3]) * fRoot;
      } else {
        // |w| <= 1/2
        var i = 0;
        if (m[4] > m[0]) i = 1;
        if (m[8] > m[i * 3 + i]) i = 2;
        var j = (i + 1) % 3;
        var k = (i + 2) % 3;
        fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
        out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
        out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
      }

      return out;
    }
    /**
     * Normalize a quat
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quaternion to normalize
     * @returns {quat} out
     * @function
     */

    var normalize$2 = normalize$1;
    /**
     * Sets a quaternion to represent the shortest rotation from one
     * vector to another.
     *
     * Both vectors are assumed to be unit length.
     *
     * @param {quat} out the receiving quaternion.
     * @param {ReadonlyVec3} a the initial vector
     * @param {ReadonlyVec3} b the destination vector
     * @returns {quat} out
     */

    (function () {
      var tmpvec3 = create$1();
      var xUnitVec3 = fromValues(1, 0, 0);
      var yUnitVec3 = fromValues(0, 1, 0);
      return function (out, a, b) {
        var dot$1 = dot(a, b);

        if (dot$1 < -0.999999) {
          cross(tmpvec3, xUnitVec3, a);
          if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
          normalize(tmpvec3, tmpvec3);
          setAxisAngle(out, tmpvec3, Math.PI);
          return out;
        } else if (dot$1 > 0.999999) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
          out[3] = 1;
          return out;
        } else {
          cross(tmpvec3, a, b);
          out[0] = tmpvec3[0];
          out[1] = tmpvec3[1];
          out[2] = tmpvec3[2];
          out[3] = 1 + dot$1;
          return normalize$2(out, out);
        }
      };
    })();
    /**
     * Performs a spherical linear interpolation with two control points
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @param {ReadonlyQuat} c the third operand
     * @param {ReadonlyQuat} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {quat} out
     */

    (function () {
      var temp1 = create$3();
      var temp2 = create$3();
      return function (out, a, b, c, d, t) {
        slerp(temp1, a, d, t);
        slerp(temp2, b, c, t);
        slerp(out, temp1, temp2, 2 * t * (1 - t));
        return out;
      };
    })();
    /**
     * Sets the specified quaternion with values corresponding to the given
     * axes. Each axis is a vec3 and is expected to be unit length and
     * perpendicular to all other specified axes.
     *
     * @param {ReadonlyVec3} view  the vector representing the viewing direction
     * @param {ReadonlyVec3} right the vector representing the local "right" direction
     * @param {ReadonlyVec3} up    the vector representing the local "up" direction
     * @returns {quat} out
     */

    (function () {
      var matr = create();
      return function (out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];
        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];
        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];
        return normalize$2(out, fromMat3(out, matr));
      };
    })();

    /**
     * 2 Dimensional Vector
     * @module vec2
     */

    /**
     * Creates a new, empty vec2
     *
     * @returns {vec2} a new 2D vector
     */

    function create$4() {
      var out = new ARRAY_TYPE(2);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
      }

      return out;
    }
    /**
     * Perform some operation over an array of vec2s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    (function () {
      var vec = create$4();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 2;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
        }

        return a;
      };
    })();

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var interopRequireDefault = createCommonjsModule(function (module) {
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }

    module.exports = _interopRequireDefault;
    });

    function assert(condition, message) {
      if (!condition) {
        throw new Error(message || 'loader assertion failed.');
      }
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    var globals = {
      self: typeof self !== 'undefined' && self,
      window: typeof window !== 'undefined' && window,
      global: typeof global !== 'undefined' && global,
      document: typeof document !== 'undefined' && document
    };
    var self_ = globals.self || globals.window || globals.global;
    var window_ = globals.window || globals.self || globals.global;
    var global_ = globals.global || globals.self || globals.window;
    var document_ = globals.document || {};
    var isBrowser = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== 'object' || String(process) !== '[object process]' || process.browser;
    var isWorker = typeof importScripts === 'function';
    var matches = typeof process !== 'undefined' && process.version && process.version.match(/v([0-9]*)/);
    var nodeVersion = matches && parseFloat(matches[1]) || 0;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var runtime_1 = createCommonjsModule(function (module) {
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var runtime = (function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }
      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);

        // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.
        generator._invoke = makeInvokeMethod(innerFn, self, context);

        return generator;
      }
      exports.wrap = wrap;

      // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";

      // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.
      var ContinueSentinel = {};

      // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.
      function Generator() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}

      // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.
      var IteratorPrototype = {};
      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
      if (NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype =
        Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunction.displayName = define(
        GeneratorFunctionPrototype,
        toStringTagSymbol,
        "GeneratorFunction"
      );

      // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          define(prototype, method, function(arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor
          ? ctor === GeneratorFunction ||
            // For the native GeneratorFunction constructor, the best we can
            // do is to check its .name property.
            (ctor.displayName || ctor.name) === "GeneratorFunction"
          : false;
      };

      exports.mark = function(genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };

      // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.
      exports.awrap = function(arg) {
        return { __await: arg };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value &&
                typeof value === "object" &&
                hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function(value) {
                invoke("next", value, resolve, reject);
              }, function(err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function(unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function(error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise =
            // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(
              callInvokeWithMethodAndArg,
              // Avoid propagating failures to Promises returned by later
              // invocations of the iterator.
              callInvokeWithMethodAndArg
            ) : callInvokeWithMethodAndArg();
        }

        // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).
        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);
      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };
      exports.AsyncIterator = AsyncIterator;

      // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.
      exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;

        var iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
          PromiseImpl
        );

        return exports.isGeneratorFunction(outerFn)
          ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(function(result) {
              return result.done ? result.value : iter.next();
            });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;

        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            }

            // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;
            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);
              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;

            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);

            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;

            var record = tryCatch(innerFn, self, context);
            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done
                ? GenStateCompleted
                : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };

            } else if (record.type === "throw") {
              state = GenStateCompleted;
              // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.
              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      }

      // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.
      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];
        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (! info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value;

          // Resume execution at the desired location (see delegateYield).
          context.next = delegate.nextLoc;

          // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.
          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }

        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        }

        // The delegate iterator is finished, so forget it and continue with
        // the outer generator.
        context.delegate = null;
        return ContinueSentinel;
      }

      // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.
      defineIteratorMethods(Gp);

      define(Gp, toStringTagSymbol, "Generator");

      // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.
      Gp[iteratorSymbol] = function() {
        return this;
      };

      Gp.toString = function() {
        return "[object Generator]";
      };

      function pushTryEntry(locs) {
        var entry = { tryLoc: locs[0] };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function(object) {
        var keys = [];
        for (var key in object) {
          keys.push(key);
        }
        keys.reverse();

        // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.
        return function next() {
          while (keys.length) {
            var key = keys.pop();
            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          }

          // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.
          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1, next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;

              return next;
            };

            return next.next = next;
          }
        }

        // Return an iterator with no values.
        return { next: doneResult };
      }
      exports.values = values;

      function doneResult() {
        return { value: undefined$1, done: true };
      }

      Context.prototype = {
        constructor: Context,

        reset: function(skipTempReset) {
          this.prev = 0;
          this.next = 0;
          // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.
          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;

          this.method = "next";
          this.arg = undefined$1;

          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" &&
                  hasOwn.call(this, name) &&
                  !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },

        stop: function() {
          this.done = true;

          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },

        dispatchException: function(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !! caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }

              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },

        abrupt: function(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev &&
                hasOwn.call(entry, "finallyLoc") &&
                this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry &&
              (type === "break" ||
               type === "continue") &&
              finallyEntry.tryLoc <= arg &&
              arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },

        complete: function(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" ||
              record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },

        finish: function(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },

        "catch": function(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;
              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }
              return thrown;
            }
          }

          // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.
          throw new Error("illegal catch attempt");
        },

        delegateYield: function(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      };

      // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.
      return exports;

    }(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
      module.exports 
    ));

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function("r", "regeneratorRuntime = r")(runtime);
    }
    });

    var regenerator = runtime_1;

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function getTransferList(object) {
      var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var transfers = arguments.length > 2 ? arguments[2] : undefined;
      var transfersSet = transfers || new Set();

      if (!object) ; else if (isTransferable(object)) {
        transfersSet.add(object);
      } else if (isTransferable(object.buffer)) {
        transfersSet.add(object.buffer);
      } else if (ArrayBuffer.isView(object)) ; else if (recursive && _typeof(object) === 'object') {
        for (var key in object) {
          getTransferList(object[key], recursive, transfersSet);
        }
      }

      return transfers === undefined ? Array.from(transfersSet) : [];
    }

    function isTransferable(object) {
      if (!object) {
        return false;
      }

      if (object instanceof ArrayBuffer) {
        return true;
      }

      if (typeof MessagePort !== 'undefined' && object instanceof MessagePort) {
        return true;
      }

      if (typeof ImageBitmap !== 'undefined' && object instanceof ImageBitmap) {
        return true;
      }

      if (typeof OffscreenCanvas !== 'undefined' && object instanceof OffscreenCanvas) {
        return true;
      }

      return false;
    }

    var VERSION = "2.3.12" ;
    function validateLoaderVersion(loader) {
      var coreVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : VERSION;
      assert(loader, 'no loader provided');
      var loaderVersion = loader.version;

      if (!coreVersion || !loaderVersion) {
        return;
      }

      coreVersion = parseVersion(coreVersion);
      loaderVersion = parseVersion(loaderVersion);
    }

    function parseVersion(version) {
      var parts = version.split('.').map(Number);
      return {
        major: parts[0],
        minor: parts[1]
      };
    }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    function createWorker(loader) {
      if (typeof self === 'undefined') {
        return;
      }

      var requestId = 0;

      var parse = function parse(arraybuffer) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var url = arguments.length > 2 ? arguments[2] : undefined;
        return new Promise(function (resolve, reject) {
          var id = requestId++;

          var onMessage = function onMessage(_ref) {
            var data = _ref.data;

            if (!data || data.id !== id) {
              return;
            }

            switch (data.type) {
              case 'parse-done':
                self.removeEventListener('message', onMessage);
                resolve(data.result);
                break;

              case 'parse-error':
                self.removeEventListener('message', onMessage);
                reject(data.message);
                break;
            }
          };

          self.addEventListener('message', onMessage);
          self.postMessage({
            type: 'parse',
            id: id,
            arraybuffer: arraybuffer,
            options: options,
            url: url
          }, [arraybuffer]);
        });
      };

      self.onmessage = function () {
        var _ref2 = _asyncToGenerator(regenerator.mark(function _callee(evt) {
          var data, arraybuffer, _data$byteOffset, byteOffset, _data$byteLength, byteLength, _data$options, options, result, transferList;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  data = evt.data;
                  _context.prev = 1;

                  if (isKnownMessage(data, loader.name)) {
                    _context.next = 4;
                    break;
                  }

                  return _context.abrupt("return");

                case 4:
                  validateLoaderVersion(loader, data.source.split('@')[1]);
                  arraybuffer = data.arraybuffer, _data$byteOffset = data.byteOffset, byteOffset = _data$byteOffset === void 0 ? 0 : _data$byteOffset, _data$byteLength = data.byteLength, byteLength = _data$byteLength === void 0 ? 0 : _data$byteLength, _data$options = data.options, options = _data$options === void 0 ? {} : _data$options;
                  _context.next = 8;
                  return parseData({
                    loader: loader,
                    arraybuffer: arraybuffer,
                    byteOffset: byteOffset,
                    byteLength: byteLength,
                    options: options,
                    context: {
                      parse: parse
                    }
                  });

                case 8:
                  result = _context.sent;
                  transferList = getTransferList(result);
                  self.postMessage({
                    type: 'done',
                    result: result
                  }, transferList);
                  _context.next = 16;
                  break;

                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](1);
                  self.postMessage({
                    type: 'error',
                    message: _context.t0.message
                  });

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[1, 13]]);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }();
    }

    function parseData(_x2) {
      return _parseData.apply(this, arguments);
    }

    function _parseData() {
      _parseData = _asyncToGenerator(regenerator.mark(function _callee2(_ref3) {
        var loader, arraybuffer, options, context, data, parser, textDecoder;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                loader = _ref3.loader, arraybuffer = _ref3.arraybuffer, _ref3.byteOffset, _ref3.byteLength, options = _ref3.options, context = _ref3.context;

                if (!(loader.parseSync || loader.parse)) {
                  _context2.next = 6;
                  break;
                }

                data = arraybuffer;
                parser = loader.parseSync || loader.parse;
                _context2.next = 13;
                break;

              case 6:
                if (!loader.parseTextSync) {
                  _context2.next = 12;
                  break;
                }

                textDecoder = new TextDecoder();
                data = textDecoder.decode(arraybuffer);
                parser = loader.parseTextSync;
                _context2.next = 13;
                break;

              case 12:
                throw new Error("Could not load data with ".concat(loader.name, " loader"));

              case 13:
                options = _objectSpread(_objectSpread({}, options), {}, {
                  modules: loader && loader.options && loader.options.modules || {},
                  worker: false
                });
                _context2.next = 16;
                return parser(data, _objectSpread({}, options), context, loader);

              case 16:
                return _context2.abrupt("return", _context2.sent);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _parseData.apply(this, arguments);
    }

    function isKnownMessage(data, name) {
      return data && data.type === 'parse' && data.source && data.source.startsWith('loaders.gl');
    }

    function _AwaitValue(value) {
      this.wrapped = value;
    }

    function _awaitAsyncGenerator(value) {
      return new _AwaitValue(value);
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;
          var wrappedAwait = value instanceof _AwaitValue;
          Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
            if (wrappedAwait) {
              resume(key === "return" ? "return" : "next", arg);
              return;
            }

            settle(result.done ? "return" : "normal", arg);
          }, function (err) {
            resume("throw", err);
          });
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen["return"] !== "function") {
        this["return"] = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype["throw"] = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype["return"] = function (arg) {
      return this._invoke("return", arg);
    };

    function _wrapAsyncGenerator(fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    }

    function _asyncIterator(iterable) {
      var method;

      if (typeof Symbol !== "undefined") {
        if (Symbol.asyncIterator) {
          method = iterable[Symbol.asyncIterator];
          if (method != null) return method.call(iterable);
        }

        if (Symbol.iterator) {
          method = iterable[Symbol.iterator];
          if (method != null) return method.call(iterable);
        }
      }

      throw new TypeError("Object is not async iterable");
    }

    function makeTransformIterator(_x, _x2, _x3) {
      return _makeTransformIterator.apply(this, arguments);
    }

    function _makeTransformIterator() {
      _makeTransformIterator = _wrapAsyncGenerator(regenerator.mark(function _callee(asyncIterator, IncrementalTransform, options) {
        var transform, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk, _output, output;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                transform = new IncrementalTransform(options);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 3;
                _iterator = _asyncIterator(asyncIterator);

              case 5:
                _context.next = 7;
                return _awaitAsyncGenerator(_iterator.next());

              case 7:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 11;
                return _awaitAsyncGenerator(_step.value);

              case 11:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 23;
                  break;
                }

                chunk = _value;
                _context.next = 16;
                return _awaitAsyncGenerator(transform.write(chunk));

              case 16:
                _output = _context.sent;

                if (!_output) {
                  _context.next = 20;
                  break;
                }

                _context.next = 20;
                return _output;

              case 20:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 23:
                _context.next = 29;
                break;

              case 25:
                _context.prev = 25;
                _context.t0 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 29:
                _context.prev = 29;
                _context.prev = 30;

                if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                  _context.next = 34;
                  break;
                }

                _context.next = 34;
                return _awaitAsyncGenerator(_iterator["return"]());

              case 34:
                _context.prev = 34;

                if (!_didIteratorError) {
                  _context.next = 37;
                  break;
                }

                throw _iteratorError;

              case 37:
                return _context.finish(34);

              case 38:
                return _context.finish(29);

              case 39:
                _context.next = 41;
                return _awaitAsyncGenerator(transform.end());

              case 41:
                output = _context.sent;

                if (!output) {
                  _context.next = 45;
                  break;
                }

                _context.next = 45;
                return output;

              case 45:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 25, 29, 39], [30,, 34, 38]]);
      }));
      return _makeTransformIterator.apply(this, arguments);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    var workerURLCache = new Map();
    function getWorkerURL(workerSource) {
      assert(typeof workerSource === 'string', 'worker source');

      if (workerSource.startsWith('url(') && workerSource.endsWith(')')) {
        var workerUrl = workerSource.match(/^url\((.*)\)$/)[1];

        if (workerUrl && !workerUrl.startsWith('http')) {
          return workerUrl;
        }

        workerSource = buildScript(workerUrl);
      }

      var workerURL = workerURLCache.get(workerSource);

      if (!workerURL) {
        var blob = new Blob([workerSource], {
          type: 'application/javascript'
        });
        workerURL = URL.createObjectURL(blob);
        workerURLCache.set(workerSource, workerURL);
      }

      return workerURL;
    }

    function buildScript(workerUrl) {
      return "try {\n  importScripts('".concat(workerUrl, "');\n} catch (error) {\n  console.error(error);\n}");
    }

    var count = 0;

    function defaultOnMessage(_ref) {
      var data = _ref.data,
          resolve = _ref.resolve;
      resolve(data);
    }

    var WorkerThread = function () {
      function WorkerThread(_ref2) {
        var source = _ref2.source,
            _ref2$name = _ref2.name,
            name = _ref2$name === void 0 ? "web-worker-".concat(count++) : _ref2$name,
            onMessage = _ref2.onMessage;

        _classCallCheck(this, WorkerThread);

        var url = getWorkerURL(source);
        this.worker = new Worker(url, {
          name: name
        });
        this.name = name;
        this.onMessage = onMessage || defaultOnMessage;
      }

      _createClass(WorkerThread, [{
        key: "process",
        value: function () {
          var _process = _asyncToGenerator(regenerator.mark(function _callee(data) {
            var _this = this;

            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", new Promise(function (resolve, reject) {
                      _this.worker.onmessage = function (event) {
                        _this.onMessage({
                          worker: _this.worker,
                          data: event.data,
                          resolve: resolve,
                          reject: reject
                        });
                      };

                      _this.worker.onerror = function (error) {
                        var message = "".concat(_this.name, ": WorkerThread.process() failed");

                        if (error.message) {
                          message += " ".concat(error.message, " ").concat(error.filename, ":").concat(error.lineno, ":").concat(error.colno);
                        }

                        var betterError = new Error(message);
                        console.error(error);
                        reject(betterError);
                      };

                      var transferList = getTransferList(data);

                      _this.worker.postMessage(data, transferList);
                    }));

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function process(_x) {
            return _process.apply(this, arguments);
          }

          return process;
        }()
      }, {
        key: "destroy",
        value: function destroy() {
          this.worker.terminate();
          this.worker = null;
        }
      }]);

      return WorkerThread;
    }();

    var WorkerPool = function () {
      function WorkerPool(_ref) {
        var source = _ref.source,
            _ref$name = _ref.name,
            name = _ref$name === void 0 ? 'unnamed' : _ref$name,
            _ref$maxConcurrency = _ref.maxConcurrency,
            maxConcurrency = _ref$maxConcurrency === void 0 ? 1 : _ref$maxConcurrency,
            onMessage = _ref.onMessage,
            _ref$onDebug = _ref.onDebug,
            onDebug = _ref$onDebug === void 0 ? function () {} : _ref$onDebug,
            _ref$reuseWorkers = _ref.reuseWorkers,
            reuseWorkers = _ref$reuseWorkers === void 0 ? true : _ref$reuseWorkers;

        _classCallCheck(this, WorkerPool);

        this.source = source;
        this.name = name;
        this.maxConcurrency = maxConcurrency;
        this.onMessage = onMessage;
        this.onDebug = onDebug;
        this.jobQueue = [];
        this.idleQueue = [];
        this.count = 0;
        this.isDestroyed = false;
        this.reuseWorkers = reuseWorkers;
      }

      _createClass(WorkerPool, [{
        key: "destroy",
        value: function destroy() {
          this.idleQueue.forEach(function (worker) {
            return worker.destroy();
          });
          this.isDestroyed = true;
        }
      }, {
        key: "process",
        value: function process(data, jobName) {
          var _this = this;

          return new Promise(function (resolve, reject) {
            _this.jobQueue.push({
              data: data,
              jobName: jobName,
              resolve: resolve,
              reject: reject
            });

            _this._startQueuedJob();
          });
        }
      }, {
        key: "_startQueuedJob",
        value: function () {
          var _startQueuedJob2 = _asyncToGenerator(regenerator.mark(function _callee() {
            var worker, job;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (this.jobQueue.length) {
                      _context.next = 2;
                      break;
                    }

                    return _context.abrupt("return");

                  case 2:
                    worker = this._getAvailableWorker();

                    if (worker) {
                      _context.next = 5;
                      break;
                    }

                    return _context.abrupt("return");

                  case 5:
                    job = this.jobQueue.shift();
                    this.onDebug({
                      message: 'processing',
                      worker: worker.name,
                      job: job.jobName,
                      backlog: this.jobQueue.length
                    });
                    _context.prev = 7;
                    _context.t0 = job;
                    _context.next = 11;
                    return worker.process(job.data);

                  case 11:
                    _context.t1 = _context.sent;

                    _context.t0.resolve.call(_context.t0, _context.t1);

                    _context.next = 18;
                    break;

                  case 15:
                    _context.prev = 15;
                    _context.t2 = _context["catch"](7);
                    job.reject(_context.t2);

                  case 18:
                    _context.prev = 18;

                    this._onWorkerDone(worker);

                    return _context.finish(18);

                  case 21:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[7, 15, 18, 21]]);
          }));

          function _startQueuedJob() {
            return _startQueuedJob2.apply(this, arguments);
          }

          return _startQueuedJob;
        }()
      }, {
        key: "_onWorkerDone",
        value: function _onWorkerDone(worker) {
          if (this.isDestroyed) {
            worker.destroy();
            return;
          }

          if (this.reuseWorkers) {
            this.idleQueue.push(worker);
          } else {
            worker.destroy();
            this.count--;
          }

          this._startQueuedJob();
        }
      }, {
        key: "_getAvailableWorker",
        value: function _getAvailableWorker() {
          if (this.idleQueue.length > 0) {
            return this.idleQueue.shift();
          }

          if (this.count < this.maxConcurrency) {
            this.count++;
            var name = "".concat(this.name.toLowerCase(), " (#").concat(this.count, " of ").concat(this.maxConcurrency, ")");
            return new WorkerThread({
              source: this.source,
              onMessage: this.onMessage,
              name: name
            });
          }

          return null;
        }
      }]);

      return WorkerPool;
    }();

    var DEFAULT_MAX_CONCURRENCY = 5;

    var WorkerFarm = function () {
      _createClass(WorkerFarm, null, [{
        key: "isSupported",
        value: function isSupported() {
          return typeof Worker !== 'undefined';
        }
      }]);

      function WorkerFarm(_ref) {
        var _ref$maxConcurrency = _ref.maxConcurrency,
            maxConcurrency = _ref$maxConcurrency === void 0 ? DEFAULT_MAX_CONCURRENCY : _ref$maxConcurrency,
            _ref$onMessage = _ref.onMessage,
            onMessage = _ref$onMessage === void 0 ? null : _ref$onMessage,
            _ref$onDebug = _ref.onDebug,
            onDebug = _ref$onDebug === void 0 ? function () {} : _ref$onDebug,
            _ref$reuseWorkers = _ref.reuseWorkers,
            reuseWorkers = _ref$reuseWorkers === void 0 ? true : _ref$reuseWorkers;

        _classCallCheck(this, WorkerFarm);

        this.maxConcurrency = maxConcurrency;
        this.onMessage = onMessage;
        this.onDebug = onDebug;
        this.workerPools = new Map();
        this.reuseWorkers = reuseWorkers;
      }

      _createClass(WorkerFarm, [{
        key: "setProps",
        value: function setProps(props) {
          if ('maxConcurrency' in props) {
            this.maxConcurrency = props.maxConcurrency;
          }

          if ('onDebug' in props) {
            this.onDebug = props.onDebug;
          }

          if ('reuseWorkers' in props) {
            this.reuseWorkers = props.reuseWorkers;
          }
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this.workerPools.forEach(function (workerPool) {
            return workerPool.destroy();
          });
        }
      }, {
        key: "process",
        value: function () {
          var _process = _asyncToGenerator(regenerator.mark(function _callee(workerSource, workerName, data) {
            var workerPool;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    workerPool = this._getWorkerPool(workerSource, workerName);
                    return _context.abrupt("return", workerPool.process(data));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function process(_x, _x2, _x3) {
            return _process.apply(this, arguments);
          }

          return process;
        }()
      }, {
        key: "_getWorkerPool",
        value: function _getWorkerPool(workerSource, workerName) {
          var workerPool = this.workerPools.get(workerName);

          if (!workerPool) {
            workerPool = new WorkerPool({
              source: workerSource,
              name: workerName,
              onMessage: onWorkerMessage.bind(null, this.onMessage),
              maxConcurrency: this.maxConcurrency,
              onDebug: this.onDebug,
              reuseWorkers: this.reuseWorkers
            });
            this.workerPools.set(workerName, workerPool);
          }

          return workerPool;
        }
      }]);

      return WorkerFarm;
    }();

    function onWorkerMessage(onMessage, _ref2) {
      var worker = _ref2.worker,
          data = _ref2.data,
          resolve = _ref2.resolve,
          reject = _ref2.reject;

      if (onMessage) {
        onMessage({
          worker: worker,
          data: data,
          resolve: resolve,
          reject: reject
        });
        return;
      }

      switch (data.type) {
        case 'done':
          resolve(data.result);
          break;

        case 'error':
          reject(data.message);
          break;
      }
    }

    function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    function requireFromFile(filename) {
      if (filename.startsWith('http')) {
        throw new Error("require from remote script not supported in Node.js: ".concat(filename));
      }

      if (!filename.startsWith('/')) {
        filename = "".concat(process.cwd(), "/").concat(filename);
      }

      return require(filename);
    }
    function requireFromString(code) {
      var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (_typeof(filename) === 'object') {
        options = filename;
        filename = '';
      }

      options = _objectSpread$1({
        appendPaths: [],
        prependPaths: []
      }, options);

      if (typeof code !== 'string') {
        throw new Error("code must be a string, not ".concat(_typeof(code)));
      }

      var paths = Module__default['default']._nodeModulePaths(path__default['default'].dirname(filename));

      var parent = module.parent;
      var newModule = new Module__default['default'](filename, parent);
      newModule.filename = filename;
      newModule.paths = [].concat(options.prependPaths).concat(paths).concat(options.appendPaths);

      newModule._compile(code, filename);

      if (parent && parent.children) {
        parent.children.splice(parent.children.indexOf(newModule), 1);
      }

      return newModule.exports;
    }

    var VERSION$1 = "2.3.12" ;
    var loadLibraryPromises = {};
    function loadLibrary(_x) {
      return _loadLibrary.apply(this, arguments);
    }

    function _loadLibrary() {
      _loadLibrary = _asyncToGenerator(regenerator.mark(function _callee(libraryUrl) {
        var moduleName,
            options,
            _args = arguments;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                moduleName = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
                options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};

                if (moduleName) {
                  libraryUrl = getLibraryUrl(libraryUrl, moduleName, options);
                }

                loadLibraryPromises[libraryUrl] = loadLibraryPromises[libraryUrl] || loadLibraryFromFile(libraryUrl);
                _context.next = 6;
                return loadLibraryPromises[libraryUrl];

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _loadLibrary.apply(this, arguments);
    }

    function getLibraryUrl(library, moduleName, options) {
      var modules = options.modules || {};

      if (modules[library]) {
        return modules[library];
      }

      if (!isBrowser) {
        return "modules/".concat(moduleName, "/dist/libs/").concat(library);
      }

      if (options.CDN) {
        assert(options.CDN.startsWith('http'));
        return "".concat(options.CDN, "/").concat(moduleName, "@").concat(VERSION$1, "/dist/libs/").concat(library);
      }

      if (isWorker) {
        return "../src/libs/".concat(library);
      }

      return "modules/".concat(moduleName, "/src/libs/").concat(library);
    }

    function loadLibraryFromFile(_x2) {
      return _loadLibraryFromFile.apply(this, arguments);
    }

    function _loadLibraryFromFile() {
      _loadLibraryFromFile = _asyncToGenerator(regenerator.mark(function _callee2(libraryUrl) {
        var _response, response, scriptSource;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!libraryUrl.endsWith('wasm')) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 3;
                return fetch(libraryUrl);

              case 3:
                _response = _context2.sent;
                _context2.next = 6;
                return _response.arrayBuffer();

              case 6:
                return _context2.abrupt("return", _context2.sent);

              case 7:
                if (isBrowser) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", requireFromFile && requireFromFile(libraryUrl));

              case 9:
                if (!isWorker) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return", importScripts(libraryUrl));

              case 11:
                _context2.next = 13;
                return fetch(libraryUrl);

              case 13:
                response = _context2.sent;
                _context2.next = 16;
                return response.text();

              case 16:
                scriptSource = _context2.sent;
                return _context2.abrupt("return", loadLibraryFromString(scriptSource, libraryUrl));

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _loadLibraryFromFile.apply(this, arguments);
    }

    function loadLibraryFromString(scriptSource, id) {
      if (!isBrowser) {
        return requireFromString && requireFromString(scriptSource, id);
      }

      if (isWorker) {
        eval.call(global_, scriptSource);
        return null;
      }

      var script = document.createElement('script');
      script.id = id;

      try {
        script.appendChild(document.createTextNode(scriptSource));
      } catch (e) {
        script.text = scriptSource;
      }

      document.body.appendChild(script);
      return null;
    }

    function getFirstCharacters(data) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

      if (typeof data === 'string') {
        return data.slice(0, length);
      } else if (ArrayBuffer.isView(data)) {
        return getMagicString(data.buffer, data.byteOffset, length);
      } else if (data instanceof ArrayBuffer) {
        var byteOffset = 0;
        return getMagicString(data, byteOffset, length);
      }

      return '';
    }
    function getMagicString(arrayBuffer, byteOffset, length) {
      if (arrayBuffer.byteLength <= byteOffset + length) {
        return '';
      }

      var dataView = new DataView(arrayBuffer);
      var magic = '';

      for (var i = 0; i < length; i++) {
        magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
      }

      return magic;
    }

    function parseJSON(string) {
      try {
        return JSON.parse(string);
      } catch (_) {
        throw new Error("Failed to parse JSON from data starting with \"".concat(getFirstCharacters(string), "\""));
      }
    }

    function toArrayBuffer(buffer) {
      if (Buffer.isBuffer(buffer)) {
        var typedArray = new Uint8Array(buffer);
        return typedArray.buffer;
      }

      return buffer;
    }
    function toBuffer(binaryData) {
      if (ArrayBuffer.isView(binaryData)) {
        binaryData = binaryData.buffer;
      }

      if (typeof Buffer !== 'undefined' && binaryData instanceof ArrayBuffer) {
        var buffer = new Buffer(binaryData.byteLength);
        var view = new Uint8Array(binaryData);

        for (var i = 0; i < buffer.length; ++i) {
          buffer[i] = view[i];
        }

        return buffer;
      }

      return assert(false);
    }

    function isBuffer(x) {
      return x && _typeof(x) === 'object' && x.isBuffer;
    }
    function toBuffer$1(data) {
      return toBuffer ? toBuffer(data) : data;
    }
    function bufferToArrayBuffer(data) {
      if (toArrayBuffer) {
        return toArrayBuffer(data);
      }

      return data;
    }

    function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    function toArrayBuffer$1(data) {
      if (toArrayBuffer) {
        data = toArrayBuffer(data);
      }

      if (data instanceof ArrayBuffer) {
        return data;
      }

      if (ArrayBuffer.isView(data)) {
        return data.buffer;
      }

      if (typeof data === 'string') {
        var text = data;
        var uint8Array = new TextEncoder().encode(text);
        return uint8Array.buffer;
      }

      if (data && _typeof(data) === 'object' && data._toArrayBuffer) {
        return data._toArrayBuffer();
      }

      return assert(false);
    }
    function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
      byteLength = byteLength || arrayBuffer1.byteLength;

      if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
        return false;
      }

      var array1 = new Uint8Array(arrayBuffer1);
      var array2 = new Uint8Array(arrayBuffer2);

      for (var i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) {
          return false;
        }
      }

      return true;
    }
    function concatenateArrayBuffers() {
      for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
      }

      var sourceArrays = sources.map(function (source2) {
        return source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2;
      });
      var byteLength = sourceArrays.reduce(function (length, typedArray) {
        return length + typedArray.byteLength;
      }, 0);
      var result = new Uint8Array(byteLength);
      var offset = 0;

      var _iterator = _createForOfIteratorHelper(sourceArrays),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var sourceArray = _step.value;
          result.set(sourceArray, offset);
          offset += sourceArray.byteLength;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return result.buffer;
    }
    function sliceArrayBuffer(arrayBuffer, byteOffset, byteLength) {
      var subArray = byteLength !== undefined ? new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + byteLength) : new Uint8Array(arrayBuffer).subarray(byteOffset);
      var arrayCopy = new Uint8Array(subArray);
      return arrayCopy.buffer;
    }

    function padTo4Bytes(byteLength) {
      return byteLength + 3 & ~3;
    }
    function getZeroOffsetArrayBuffer(arrayBuffer, byteOffset, byteLength) {
      return sliceArrayBuffer(arrayBuffer, byteOffset, byteLength);
    }
    function copyArrayBuffer(targetBuffer, sourceBuffer, byteOffset) {
      var byteLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : sourceBuffer.byteLength;
      var targetArray = new Uint8Array(targetBuffer, byteOffset, byteLength);
      var sourceArray = new Uint8Array(sourceBuffer);
      targetArray.set(sourceArray);
      return targetBuffer;
    }
    function copyToArray(source, target, targetOffset) {
      var sourceArray;

      if (source instanceof ArrayBuffer) {
        sourceArray = new Uint8Array(source);
      } else {
        var srcByteOffset = source.byteOffset;
        var srcByteLength = source.byteLength;
        sourceArray = new Uint8Array(source.buffer, srcByteOffset, srcByteLength);
      }

      target.set(sourceArray, targetOffset);
      return targetOffset + padTo4Bytes(sourceArray.byteLength);
    }

    function copyPaddedArrayBufferToDataView(dataView, byteOffset, sourceBuffer) {
      var paddedLength = padTo4Bytes(sourceBuffer.byteLength);
      var padLength = paddedLength - sourceBuffer.byteLength;

      if (dataView) {
        var targetArray = new Uint8Array(dataView.buffer, dataView.byteOffset + byteOffset, sourceBuffer.byteLength);
        var sourceArray = new Uint8Array(sourceBuffer);
        targetArray.set(sourceArray);

        for (var i = 0; i < padLength; ++i) {
          dataView.setUint8(byteOffset + sourceBuffer.byteLength + i, 0x20);
        }
      }

      byteOffset += paddedLength;
      return byteOffset;
    }
    function copyPaddedStringToDataView(dataView, byteOffset, string) {
      var textEncoder = new TextEncoder();
      var stringBuffer = textEncoder.encode(string);
      byteOffset = copyPaddedArrayBufferToDataView(dataView, byteOffset, stringBuffer);
      return byteOffset;
    }

    function padStringToByteAlignment(string, byteAlignment) {
      var length = string.length;
      var paddedLength = Math.ceil(length / byteAlignment) * byteAlignment;
      var padding = paddedLength - length;
      var whitespace = '';

      for (var i = 0; i < padding; ++i) {
        whitespace += ' ';
      }

      return string + whitespace;
    }
    function copyStringToDataView(dataView, byteOffset, string, byteLength) {
      if (dataView) {
        for (var i = 0; i < byteLength; i++) {
          dataView.setUint8(byteOffset + i, string.charCodeAt(i));
        }
      }

      return byteOffset + byteLength;
    }
    function copyBinaryToDataView(dataView, byteOffset, binary, byteLength) {
      if (dataView) {
        for (var i = 0; i < byteLength; i++) {
          dataView.setUint8(byteOffset + i, binary[i]);
          byteOffset++;
        }
      }

      return byteOffset + byteLength;
    }

    function dirname(url) {
      var slashIndex = url && url.lastIndexOf('/');
      return slashIndex >= 0 ? url.substr(0, slashIndex) : '';
    }

    var path = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dirname: dirname
    });

    var pathPrefix = '';
    var fileAliases = {};
    function setPathPrefix(prefix) {
      pathPrefix = prefix;
    }
    function getPathPrefix() {
      return pathPrefix;
    }
    function addAliases(aliases) {
      Object.assign(fileAliases, aliases);
    }
    function resolvePath(filename) {
      for (var alias in fileAliases) {
        if (filename.startsWith(alias)) {
          var replacement = fileAliases[alias];
          filename = filename.replace(alias, replacement);
        }
      }

      if (!filename.startsWith('http://') && !filename.startsWith('https://')) {
        filename = "".concat(pathPrefix).concat(filename);
      }

      return filename;
    }

    function makeTextDecoderIterator(_x, _x2) {
      return _makeTextDecoderIterator.apply(this, arguments);
    }

    function _makeTextDecoderIterator() {
      _makeTextDecoderIterator = _wrapAsyncGenerator(regenerator.mark(function _callee(arrayBufferIterator, options) {
        var textDecoder, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, arrayBuffer;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                textDecoder = new TextDecoder(options);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 3;
                _iterator = _asyncIterator(arrayBufferIterator);

              case 5:
                _context.next = 7;
                return _awaitAsyncGenerator(_iterator.next());

              case 7:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 11;
                return _awaitAsyncGenerator(_step.value);

              case 11:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 19;
                  break;
                }

                arrayBuffer = _value;
                _context.next = 16;
                return typeof arrayBuffer === 'string' ? arrayBuffer : textDecoder.decode(arrayBuffer, {
                  stream: true
                });

              case 16:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 25:
                _context.prev = 25;
                _context.prev = 26;

                if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                  _context.next = 30;
                  break;
                }

                _context.next = 30;
                return _awaitAsyncGenerator(_iterator["return"]());

              case 30:
                _context.prev = 30;

                if (!_didIteratorError) {
                  _context.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context.finish(30);

              case 34:
                return _context.finish(25);

              case 35:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 21, 25, 35], [26,, 30, 34]]);
      }));
      return _makeTextDecoderIterator.apply(this, arguments);
    }

    function makeTextEncoderIterator(_x3, _x4) {
      return _makeTextEncoderIterator.apply(this, arguments);
    }

    function _makeTextEncoderIterator() {
      _makeTextEncoderIterator = _wrapAsyncGenerator(regenerator.mark(function _callee2(textIterator, options) {
        var textEncoder, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, text;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                textEncoder = new TextEncoder();
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _context2.prev = 3;
                _iterator2 = _asyncIterator(textIterator);

              case 5:
                _context2.next = 7;
                return _awaitAsyncGenerator(_iterator2.next());

              case 7:
                _step2 = _context2.sent;
                _iteratorNormalCompletion2 = _step2.done;
                _context2.next = 11;
                return _awaitAsyncGenerator(_step2.value);

              case 11:
                _value2 = _context2.sent;

                if (_iteratorNormalCompletion2) {
                  _context2.next = 19;
                  break;
                }

                text = _value2;
                _context2.next = 16;
                return typeof text === 'string' ? textEncoder.encode(text) : text;

              case 16:
                _iteratorNormalCompletion2 = true;
                _context2.next = 5;
                break;

              case 19:
                _context2.next = 25;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](3);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 25:
                _context2.prev = 25;
                _context2.prev = 26;

                if (!(!_iteratorNormalCompletion2 && _iterator2["return"] != null)) {
                  _context2.next = 30;
                  break;
                }

                _context2.next = 30;
                return _awaitAsyncGenerator(_iterator2["return"]());

              case 30:
                _context2.prev = 30;

                if (!_didIteratorError2) {
                  _context2.next = 33;
                  break;
                }

                throw _iteratorError2;

              case 33:
                return _context2.finish(30);

              case 34:
                return _context2.finish(25);

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[3, 21, 25, 35], [26,, 30, 34]]);
      }));
      return _makeTextEncoderIterator.apply(this, arguments);
    }

    function makeLineIterator(_x5) {
      return _makeLineIterator.apply(this, arguments);
    }

    function _makeLineIterator() {
      _makeLineIterator = _wrapAsyncGenerator(regenerator.mark(function _callee3(textIterator) {
        var previous, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, textChunk, eolIndex, line;

        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                previous = '';
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _context3.prev = 3;
                _iterator3 = _asyncIterator(textIterator);

              case 5:
                _context3.next = 7;
                return _awaitAsyncGenerator(_iterator3.next());

              case 7:
                _step3 = _context3.sent;
                _iteratorNormalCompletion3 = _step3.done;
                _context3.next = 11;
                return _awaitAsyncGenerator(_step3.value);

              case 11:
                _value3 = _context3.sent;

                if (_iteratorNormalCompletion3) {
                  _context3.next = 26;
                  break;
                }

                textChunk = _value3;
                previous += textChunk;
                eolIndex = void 0;

              case 16:
                if (!((eolIndex = previous.indexOf('\n')) >= 0)) {
                  _context3.next = 23;
                  break;
                }

                line = previous.slice(0, eolIndex + 1);
                previous = previous.slice(eolIndex + 1);
                _context3.next = 21;
                return line;

              case 21:
                _context3.next = 16;
                break;

              case 23:
                _iteratorNormalCompletion3 = true;
                _context3.next = 5;
                break;

              case 26:
                _context3.next = 32;
                break;

              case 28:
                _context3.prev = 28;
                _context3.t0 = _context3["catch"](3);
                _didIteratorError3 = true;
                _iteratorError3 = _context3.t0;

              case 32:
                _context3.prev = 32;
                _context3.prev = 33;

                if (!(!_iteratorNormalCompletion3 && _iterator3["return"] != null)) {
                  _context3.next = 37;
                  break;
                }

                _context3.next = 37;
                return _awaitAsyncGenerator(_iterator3["return"]());

              case 37:
                _context3.prev = 37;

                if (!_didIteratorError3) {
                  _context3.next = 40;
                  break;
                }

                throw _iteratorError3;

              case 40:
                return _context3.finish(37);

              case 41:
                return _context3.finish(32);

              case 42:
                if (!(previous.length > 0)) {
                  _context3.next = 45;
                  break;
                }

                _context3.next = 45;
                return previous;

              case 45:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[3, 28, 32, 42], [33,, 37, 41]]);
      }));
      return _makeLineIterator.apply(this, arguments);
    }

    function makeNumberedLineIterator(_x6) {
      return _makeNumberedLineIterator.apply(this, arguments);
    }

    function _makeNumberedLineIterator() {
      _makeNumberedLineIterator = _wrapAsyncGenerator(regenerator.mark(function _callee4(lineIterator) {
        var counter, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, line;

        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                counter = 1;
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _context4.prev = 3;
                _iterator4 = _asyncIterator(lineIterator);

              case 5:
                _context4.next = 7;
                return _awaitAsyncGenerator(_iterator4.next());

              case 7:
                _step4 = _context4.sent;
                _iteratorNormalCompletion4 = _step4.done;
                _context4.next = 11;
                return _awaitAsyncGenerator(_step4.value);

              case 11:
                _value4 = _context4.sent;

                if (_iteratorNormalCompletion4) {
                  _context4.next = 20;
                  break;
                }

                line = _value4;
                _context4.next = 16;
                return {
                  counter: counter,
                  line: line
                };

              case 16:
                counter++;

              case 17:
                _iteratorNormalCompletion4 = true;
                _context4.next = 5;
                break;

              case 20:
                _context4.next = 26;
                break;

              case 22:
                _context4.prev = 22;
                _context4.t0 = _context4["catch"](3);
                _didIteratorError4 = true;
                _iteratorError4 = _context4.t0;

              case 26:
                _context4.prev = 26;
                _context4.prev = 27;

                if (!(!_iteratorNormalCompletion4 && _iterator4["return"] != null)) {
                  _context4.next = 31;
                  break;
                }

                _context4.next = 31;
                return _awaitAsyncGenerator(_iterator4["return"]());

              case 31:
                _context4.prev = 31;

                if (!_didIteratorError4) {
                  _context4.next = 34;
                  break;
                }

                throw _iteratorError4;

              case 34:
                return _context4.finish(31);

              case 35:
                return _context4.finish(26);

              case 36:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[3, 22, 26, 36], [27,, 31, 35]]);
      }));
      return _makeNumberedLineIterator.apply(this, arguments);
    }

    function forEach(_x, _x2) {
      return _forEach.apply(this, arguments);
    }

    function _forEach() {
      _forEach = _asyncToGenerator(regenerator.mark(function _callee(iterator, visitor) {
        var _yield$iterator$next, done, value, cancel;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                _context.next = 3;
                return iterator.next();

              case 3:
                _yield$iterator$next = _context.sent;
                done = _yield$iterator$next.done;
                value = _yield$iterator$next.value;

                if (!done) {
                  _context.next = 9;
                  break;
                }

                iterator["return"]();
                return _context.abrupt("return");

              case 9:
                cancel = visitor(value);

                if (!cancel) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return");

              case 12:
                _context.next = 0;
                break;

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _forEach.apply(this, arguments);
    }

    function concatenateChunksAsync(_x3) {
      return _concatenateChunksAsync.apply(this, arguments);
    }

    function _concatenateChunksAsync() {
      _concatenateChunksAsync = _asyncToGenerator(regenerator.mark(function _callee2(asyncIterator) {
        var arrayBuffers, strings, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                arrayBuffers = [];
                strings = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context2.prev = 4;
                _iterator = _asyncIterator(asyncIterator);

              case 6:
                _context2.next = 8;
                return _iterator.next();

              case 8:
                _step = _context2.sent;
                _iteratorNormalCompletion = _step.done;
                _context2.next = 12;
                return _step.value;

              case 12:
                _value = _context2.sent;

                if (_iteratorNormalCompletion) {
                  _context2.next = 19;
                  break;
                }

                chunk = _value;

                if (typeof chunk === 'string') {
                  strings.push(chunk);
                } else {
                  arrayBuffers.push(chunk);
                }

              case 16:
                _iteratorNormalCompletion = true;
                _context2.next = 6;
                break;

              case 19:
                _context2.next = 25;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 25:
                _context2.prev = 25;
                _context2.prev = 26;

                if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                  _context2.next = 30;
                  break;
                }

                _context2.next = 30;
                return _iterator["return"]();

              case 30:
                _context2.prev = 30;

                if (!_didIteratorError) {
                  _context2.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context2.finish(30);

              case 34:
                return _context2.finish(25);

              case 35:
                if (!(strings.length > 0)) {
                  _context2.next = 38;
                  break;
                }

                assert(arrayBuffers.length === 0);
                return _context2.abrupt("return", strings.join(''));

              case 38:
                return _context2.abrupt("return", concatenateArrayBuffers.apply(void 0, arrayBuffers));

              case 39:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[4, 21, 25, 35], [26,, 30, 34]]);
      }));
      return _concatenateChunksAsync.apply(this, arguments);
    }

    function getHiResTimestamp() {
      var timestamp;

      if (typeof window !== 'undefined' && window.performance) {
        timestamp = window.performance.now();
      } else if (typeof process !== 'undefined' && process.hrtime) {
        var timeParts = process.hrtime();
        timestamp = timeParts[0] * 1000 + timeParts[1] / 1e6;
      } else {
        timestamp = Date.now();
      }

      return timestamp;
    }

    var Stat = function () {
      function Stat(name, type) {
        _classCallCheck(this, Stat);

        this.name = name;
        this.type = type;
        this.sampleSize = 1;
        this.reset();
      }

      _createClass(Stat, [{
        key: "setSampleSize",
        value: function setSampleSize(samples) {
          this.sampleSize = samples;
          return this;
        }
      }, {
        key: "incrementCount",
        value: function incrementCount() {
          this.addCount(1);
          return this;
        }
      }, {
        key: "decrementCount",
        value: function decrementCount() {
          this.subtractCount(1);
          return this;
        }
      }, {
        key: "addCount",
        value: function addCount(value) {
          this._count += value;
          this._samples++;

          this._checkSampling();

          return this;
        }
      }, {
        key: "subtractCount",
        value: function subtractCount(value) {
          this._count -= value;
          this._samples++;

          this._checkSampling();

          return this;
        }
      }, {
        key: "addTime",
        value: function addTime(time) {
          this._time += time;
          this.lastTiming = time;
          this._samples++;

          this._checkSampling();

          return this;
        }
      }, {
        key: "timeStart",
        value: function timeStart() {
          this._startTime = getHiResTimestamp();
          this._timerPending = true;
          return this;
        }
      }, {
        key: "timeEnd",
        value: function timeEnd() {
          if (!this._timerPending) {
            return this;
          }

          this.addTime(getHiResTimestamp() - this._startTime);
          this._timerPending = false;

          this._checkSampling();

          return this;
        }
      }, {
        key: "getSampleAverageCount",
        value: function getSampleAverageCount() {
          return this.sampleSize > 0 ? this.lastSampleCount / this.sampleSize : 0;
        }
      }, {
        key: "getSampleAverageTime",
        value: function getSampleAverageTime() {
          return this.sampleSize > 0 ? this.lastSampleTime / this.sampleSize : 0;
        }
      }, {
        key: "getSampleHz",
        value: function getSampleHz() {
          return this.lastSampleTime > 0 ? this.sampleSize / (this.lastSampleTime / 1000) : 0;
        }
      }, {
        key: "getAverageCount",
        value: function getAverageCount() {
          return this.samples > 0 ? this.count / this.samples : 0;
        }
      }, {
        key: "getAverageTime",
        value: function getAverageTime() {
          return this.samples > 0 ? this.time / this.samples : 0;
        }
      }, {
        key: "getHz",
        value: function getHz() {
          return this.time > 0 ? this.samples / (this.time / 1000) : 0;
        }
      }, {
        key: "reset",
        value: function reset() {
          this.time = 0;
          this.count = 0;
          this.samples = 0;
          this.lastTiming = 0;
          this.lastSampleTime = 0;
          this.lastSampleCount = 0;
          this._count = 0;
          this._time = 0;
          this._samples = 0;
          this._startTime = 0;
          this._timerPending = false;
          return this;
        }
      }, {
        key: "_checkSampling",
        value: function _checkSampling() {
          if (this._samples === this.sampleSize) {
            this.lastSampleTime = this._time;
            this.lastSampleCount = this._count;
            this.count += this._count;
            this.time += this._time;
            this.samples += this._samples;
            this._time = 0;
            this._count = 0;
            this._samples = 0;
          }
        }
      }]);

      return Stat;
    }();

    var Stats = function () {
      function Stats(_ref) {
        var id = _ref.id,
            stats = _ref.stats;

        _classCallCheck(this, Stats);

        this.id = id;
        this.stats = {};

        this._initializeStats(stats);

        Object.seal(this);
      }

      _createClass(Stats, [{
        key: "get",
        value: function get(name) {
          var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'count';
          return this._getOrCreate({
            name: name,
            type: type
          });
        }
      }, {
        key: "reset",
        value: function reset() {
          for (var key in this.stats) {
            this.stats[key].reset();
          }

          return this;
        }
      }, {
        key: "forEach",
        value: function forEach(fn) {
          for (var key in this.stats) {
            fn(this.stats[key]);
          }
        }
      }, {
        key: "getTable",
        value: function getTable() {
          var table = {};
          this.forEach(function (stat) {
            table[stat.name] = {
              time: stat.time || 0,
              count: stat.count || 0,
              average: stat.getAverageTime() || 0,
              hz: stat.getHz() || 0
            };
          });
          return table;
        }
      }, {
        key: "_initializeStats",
        value: function _initializeStats() {
          var _this = this;

          var stats = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          stats.forEach(function (stat) {
            return _this._getOrCreate(stat);
          });
        }
      }, {
        key: "_getOrCreate",
        value: function _getOrCreate(stat) {
          if (!stat || !stat.name) {
            return null;
          }

          var name = stat.name,
              type = stat.type;

          if (!this.stats[name]) {
            if (stat instanceof Stat) {
              this.stats[name] = stat;
            } else {
              this.stats[name] = new Stat(name, type);
            }
          }

          return this.stats[name];
        }
      }, {
        key: "size",
        get: function get() {
          return Object.keys(this.stats).length;
        }
      }]);

      return Stats;
    }();

    function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    var STAT_QUEUED_REQUESTS = 'Queued Requests';
    var STAT_ACTIVE_REQUESTS = 'Active Requests';
    var STAT_CANCELLED_REQUESTS = 'Cancelled Requests';
    var STAT_QUEUED_REQUESTS_EVER = 'Queued Requests Ever';
    var STAT_ACTIVE_REQUESTS_EVER = 'Active Requests Ever';
    var DEFAULT_PROPS = {
      id: 'request-scheduler',
      throttleRequests: true,
      maxRequests: 6
    };

    var RequestScheduler = function () {
      function RequestScheduler() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, RequestScheduler);

        this.props = _objectSpread$2(_objectSpread$2({}, DEFAULT_PROPS), props);
        this.requestQueue = [];
        this.activeRequestCount = 0;
        this.requestMap = new Map();
        this.stats = new Stats({
          id: props.id
        });
        this.stats.get(STAT_QUEUED_REQUESTS);
        this.stats.get(STAT_ACTIVE_REQUESTS);
        this.stats.get(STAT_CANCELLED_REQUESTS);
        this.stats.get(STAT_QUEUED_REQUESTS_EVER);
        this.stats.get(STAT_ACTIVE_REQUESTS_EVER);
        this._deferredUpdate = null;
      }

      _createClass(RequestScheduler, [{
        key: "scheduleRequest",
        value: function scheduleRequest(handle) {
          var getPriority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
            return 0;
          };

          if (!this.props.throttleRequests) {
            return Promise.resolve({
              done: function done() {}
            });
          }

          if (this.requestMap.has(handle)) {
            return this.requestMap.get(handle);
          }

          var request = {
            handle: handle,
            getPriority: getPriority
          };
          var promise = new Promise(function (resolve) {
            request.resolve = resolve;
            return request;
          });
          this.requestQueue.push(request);
          this.requestMap.set(handle, promise);

          this._issueNewRequests();

          return promise;
        }
      }, {
        key: "_issueRequest",
        value: function _issueRequest(request) {
          var _this = this;

          var handle = request.handle,
              resolve = request.resolve;
          var isDone = false;

          var done = function done() {
            if (!isDone) {
              isDone = true;

              _this.requestMap["delete"](handle);

              _this.activeRequestCount--;

              _this._issueNewRequests();
            }
          };

          this.activeRequestCount++;
          return resolve ? resolve({
            done: done
          }) : Promise.resolve({
            done: done
          });
        }
      }, {
        key: "_issueNewRequests",
        value: function _issueNewRequests() {
          var _this2 = this;

          if (!this._deferredUpdate) {
            this._deferredUpdate = setTimeout(function () {
              return _this2._issueNewRequestsAsync();
            }, 0);
          }
        }
      }, {
        key: "_issueNewRequestsAsync",
        value: function _issueNewRequestsAsync() {
          this._deferredUpdate = null;
          var freeSlots = Math.max(this.props.maxRequests - this.activeRequestCount, 0);

          if (freeSlots === 0) {
            return;
          }

          this._updateAllRequests();

          for (var i = 0; i < freeSlots; ++i) {
            if (this.requestQueue.length > 0) {
              var request = this.requestQueue.shift();

              this._issueRequest(request);
            }
          }
        }
      }, {
        key: "_updateAllRequests",
        value: function _updateAllRequests() {
          var requestQueue = this.requestQueue;

          for (var i = 0; i < requestQueue.length; ++i) {
            var request = requestQueue[i];

            if (!this._updateRequest(request)) {
              requestQueue.splice(i, 1);
              this.requestMap["delete"](request.handle);
              i--;
            }
          }

          requestQueue.sort(function (a, b) {
            return a.priority - b.priority;
          });
        }
      }, {
        key: "_updateRequest",
        value: function _updateRequest(request) {
          request.priority = request.getPriority(request.handle);

          if (request.priority < 0) {
            request.resolve(null);
            return false;
          }

          return true;
        }
      }]);

      return RequestScheduler;
    }();

    function _arrayLikeToArray$1(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }

    function _unsupportedIterableToArray$1(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
    }

    function getAvailablePort() {
      var defaultPort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3000;
      return new Promise(function (resolve, reject) {
        ChildProcess__default['default'].exec('lsof -i -P -n | grep LISTEN', function (error, stdout, stderr) {
          if (error) {
            resolve(defaultPort);
            return;
          }

          var portsInUse = [];
          var regex = /:(\d+) \(LISTEN\)/;
          stdout.split('\n').forEach(function (line) {
            var match = line.match(regex);

            if (match) {
              portsInUse.push(Number(match[1]));
            }
          });
          var port = defaultPort;

          while (portsInUse.includes(port)) {
            port++;
          }

          resolve(port);
        });
      });
    }

    function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    var DEFAULT_PROCESS_OPTIONS = {
      command: null,
      arguments: [],
      portArg: null,
      port: 'auto',
      basePort: 5000,
      wait: 2000,
      nodeSpawnOptions: {
        maxBuffer: 5000 * 1024
      },
      onSuccess: function onSuccess(processProxy) {
        console.log("Started ".concat(processProxy.options.command));
      }
    };

    var ChildProcessProxy = function () {
      function ChildProcessProxy() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$id = _ref.id,
            id = _ref$id === void 0 ? 'browser-driver' : _ref$id;

        _classCallCheck(this, ChildProcessProxy);

        this.id = id;
        this.childProcess = null;
        this.port = null;
      }

      _createClass(ChildProcessProxy, [{
        key: "start",
        value: function () {
          var _start = _asyncToGenerator(regenerator.mark(function _callee() {
            var _this = this;

            var options,
                args,
                _args = arguments;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                    options = _objectSpread$3(_objectSpread$3({}, DEFAULT_PROCESS_OPTIONS), options);
                    assert(options.command && typeof options.command === 'string');
                    this.options = options;
                    args = _toConsumableArray(options.arguments);
                    this.port = options.port;

                    if (!options.portArg) {
                      _context.next = 12;
                      break;
                    }

                    if (!(this.port === 'auto')) {
                      _context.next = 11;
                      break;
                    }

                    _context.next = 10;
                    return getAvailablePort(options.basePort);

                  case 10:
                    this.port = _context.sent;

                  case 11:
                    args.push(options.portArg, this.port);

                  case 12:
                    _context.next = 14;
                    return new Promise(function (resolve, reject) {
                      try {
                        var successTimer = setTimeout(function () {
                          if (options.onSuccess) {
                            options.onSuccess(_this);
                          }

                          resolve({});
                        }, options.wait);
                        console.log("Spawning ".concat(options.command, " ").concat(options.arguments.join(' ')));
                        _this.childProcess = ChildProcess__default['default'].spawn(options.command, args, options.spawn);

                        _this.childProcess.stderr.on('data', function (data) {
                          console.log("Child process wrote to stderr: \"".concat(data, "\"."));
                          clearTimeout(successTimer);
                          reject(new Error(data));
                        });

                        _this.childProcess.on('error', function (error) {
                          console.log("Child process errored with ".concat(error));
                          clearTimeout(successTimer);
                          reject(error);
                        });

                        _this.childProcess.on('close', function (code) {
                          console.log("Child process exited with ".concat(code));
                          _this.childProcess = null;
                        });
                      } catch (error) {
                        reject(error);
                      }
                    });

                  case 14:
                    return _context.abrupt("return", _context.sent);

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function start() {
            return _start.apply(this, arguments);
          }

          return start;
        }()
      }, {
        key: "stop",
        value: function () {
          var _stop = _asyncToGenerator(regenerator.mark(function _callee2() {
            return regenerator.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (this.childProcess) {
                      this.childProcess.kill();
                      this.childProcess = null;
                    }

                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function stop() {
            return _stop.apply(this, arguments);
          }

          return stop;
        }()
      }, {
        key: "exit",
        value: function () {
          var _exit = _asyncToGenerator(regenerator.mark(function _callee3() {
            var statusCode,
                _args3 = arguments;
            return regenerator.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    statusCode = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : 0;
                    _context3.prev = 1;
                    _context3.next = 4;
                    return this.stop();

                  case 4:
                    process.exit(statusCode);
                    _context3.next = 11;
                    break;

                  case 7:
                    _context3.prev = 7;
                    _context3.t0 = _context3["catch"](1);
                    console.error(_context3.t0.message || _context3.t0);
                    process.exit(1);

                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this, [[1, 7]]);
          }));

          function exit() {
            return _exit.apply(this, arguments);
          }

          return exit;
        }()
      }]);

      return ChildProcessProxy;
    }();

    function getMeshSize(attributes) {
      var size = 0;

      for (var attributeName in attributes) {
        var attribute = attributes[attributeName];

        if (ArrayBuffer.isView(attribute)) {
          size += attribute.byteLength * attribute.BYTES_PER_ELEMENT;
        }
      }

      return size;
    }
    function getMeshBoundingBox(attributes) {
      if (!attributes || !attributes.POSITION) {
        return null;
      }

      var minX = Infinity;
      var minY = Infinity;
      var minZ = Infinity;
      var maxX = -Infinity;
      var maxY = -Infinity;
      var maxZ = -Infinity;
      var positions = attributes.POSITION.value;
      var len = positions && positions.length;

      if (!len) {
        return null;
      }

      for (var i = 0; i < len; i += 3) {
        var x = positions[i];
        var y = positions[i + 1];
        var z = positions[i + 2];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        minZ = z < minZ ? z : minZ;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        maxZ = z > maxZ ? z : maxZ;
      }

      return [[minX, minY, minZ], [maxX, maxY, maxZ]];
    }

    var esm = /*#__PURE__*/Object.freeze({
        __proto__: null,
        path: path,
        assert: assert,
        isBrowser: isBrowser,
        isWorker: isWorker,
        nodeVersion: nodeVersion,
        self: self_,
        window: window_,
        global: global_,
        document: document_,
        createWorker: createWorker,
        validateLoaderVersion: validateLoaderVersion,
        makeTransformIterator: makeTransformIterator,
        getTransferList: getTransferList,
        _WorkerFarm: WorkerFarm,
        _WorkerPool: WorkerPool,
        _WorkerThread: WorkerThread,
        getLibraryUrl: getLibraryUrl,
        loadLibrary: loadLibrary,
        parseJSON: parseJSON,
        isBuffer: isBuffer,
        toBuffer: toBuffer$1,
        bufferToArrayBuffer: bufferToArrayBuffer,
        toArrayBuffer: toArrayBuffer$1,
        sliceArrayBuffer: sliceArrayBuffer,
        concatenateArrayBuffers: concatenateArrayBuffers,
        compareArrayBuffers: compareArrayBuffers,
        padTo4Bytes: padTo4Bytes,
        copyToArray: copyToArray,
        copyArrayBuffer: copyArrayBuffer,
        copyPaddedArrayBufferToDataView: copyPaddedArrayBufferToDataView,
        copyPaddedStringToDataView: copyPaddedStringToDataView,
        padStringToByteAlignment: padStringToByteAlignment,
        copyStringToDataView: copyStringToDataView,
        copyBinaryToDataView: copyBinaryToDataView,
        getFirstCharacters: getFirstCharacters,
        getMagicString: getMagicString,
        setPathPrefix: setPathPrefix,
        getPathPrefix: getPathPrefix,
        resolvePath: resolvePath,
        _addAliases: addAliases,
        makeTextEncoderIterator: makeTextEncoderIterator,
        makeTextDecoderIterator: makeTextDecoderIterator,
        makeLineIterator: makeLineIterator,
        makeNumberedLineIterator: makeNumberedLineIterator,
        forEach: forEach,
        concatenateChunksAsync: concatenateChunksAsync,
        RequestScheduler: RequestScheduler,
        ChildProcessProxy: ChildProcessProxy,
        _getMeshSize: getMeshSize,
        getMeshBoundingBox: getMeshBoundingBox,
        getZeroOffsetArrayBuffer: getZeroOffsetArrayBuffer
    });

    createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;



    var version = "2.3.12" ;
    esm.global.loaders = Object.assign(esm.global.loaders || {}, {
      VERSION: version
    });
    var _default = esm.global.loaders;
    exports["default"] = _default;

    });

    function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator$1(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    var asyncToGenerator = _asyncToGenerator$1;

    var _typeof_1 = createCommonjsModule(function (module) {
    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        module.exports = _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    module.exports = _typeof;
    });

    var isType = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isWritableStream = exports.isReadableStream = exports.isReadableNodeStream = exports.isWritableNodeStream = exports.isBuffer = exports.isReadableDOMStream = exports.isWritableDOMStream = exports.isBlob = exports.isFile = exports.isResponse = exports.isIterator = exports.isAsyncIterable = exports.isIterable = exports.isPromise = exports.isPureObject = exports.isObject = void 0;

    var _typeof2 = interopRequireDefault(_typeof_1);

    var isBoolean = function isBoolean(x) {
      return typeof x === 'boolean';
    };

    var isFunction = function isFunction(x) {
      return typeof x === 'function';
    };

    var isObject = function isObject(x) {
      return x !== null && (0, _typeof2["default"])(x) === 'object';
    };

    exports.isObject = isObject;

    var isPureObject = function isPureObject(x) {
      return isObject(x) && x.constructor === {}.constructor;
    };

    exports.isPureObject = isPureObject;

    var isPromise = function isPromise(x) {
      return isObject(x) && isFunction(x.then);
    };

    exports.isPromise = isPromise;

    var isIterable = function isIterable(x) {
      return x && typeof x[Symbol.iterator] === 'function';
    };

    exports.isIterable = isIterable;

    var isAsyncIterable = function isAsyncIterable(x) {
      return x && typeof x[Symbol.asyncIterator] === 'function';
    };

    exports.isAsyncIterable = isAsyncIterable;

    var isIterator = function isIterator(x) {
      return x && isFunction(x.next);
    };

    exports.isIterator = isIterator;

    var isResponse = function isResponse(x) {
      return typeof Response !== 'undefined' && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
    };

    exports.isResponse = isResponse;

    var isFile = function isFile(x) {
      return typeof File !== 'undefined' && x instanceof File;
    };

    exports.isFile = isFile;

    var isBlob = function isBlob(x) {
      return typeof Blob !== 'undefined' && x instanceof Blob;
    };

    exports.isBlob = isBlob;

    var isWritableDOMStream = function isWritableDOMStream(x) {
      return isObject(x) && isFunction(x.abort) && isFunction(x.getWriter);
    };

    exports.isWritableDOMStream = isWritableDOMStream;

    var isReadableDOMStream = function isReadableDOMStream(x) {
      return typeof ReadableStream !== 'undefined' && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
    };

    exports.isReadableDOMStream = isReadableDOMStream;

    var isBuffer = function isBuffer(x) {
      return x && (0, _typeof2["default"])(x) === 'object' && x.isBuffer;
    };

    exports.isBuffer = isBuffer;

    var isWritableNodeStream = function isWritableNodeStream(x) {
      return isObject(x) && isFunction(x.end) && isFunction(x.write) && isBoolean(x.writable);
    };

    exports.isWritableNodeStream = isWritableNodeStream;

    var isReadableNodeStream = function isReadableNodeStream(x) {
      return isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
    };

    exports.isReadableNodeStream = isReadableNodeStream;

    var isReadableStream = function isReadableStream(x) {
      return isReadableDOMStream(x) || isReadableNodeStream(x);
    };

    exports.isReadableStream = isReadableStream;

    var isWritableStream = function isWritableStream(x) {
      return isWritableDOMStream(x) || isWritableNodeStream(x);
    };

    exports.isWritableStream = isWritableStream;

    });

    var mimeTypeUtils = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parseMIMEType = parseMIMEType;
    exports.parseMIMETypeFromURL = parseMIMETypeFromURL;
    var DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
    var MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;

    function parseMIMEType(mimeString) {
      if (typeof mimeString !== 'string') {
        return '';
      }

      var matches = mimeString.match(MIME_TYPE_PATTERN);

      if (matches) {
        return matches[1];
      }

      return mimeString;
    }

    function parseMIMETypeFromURL(dataUrl) {
      if (typeof dataUrl !== 'string') {
        return '';
      }

      var matches = dataUrl.match(DATA_URL_PATTERN);

      if (matches) {
        return matches[1];
      }

      return '';
    }

    });

    var resourceUtils = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getResourceUrlAndType = getResourceUrlAndType;
    exports.getResourceContentLength = getResourceContentLength;





    var QUERY_STRING_PATTERN = /\?.*/;

    function getResourceUrlAndType(resource) {
      if ((0, isType.isResponse)(resource)) {
        var contentType = (0, mimeTypeUtils.parseMIMEType)(resource.headers.get('content-type'));
        var urlType = (0, mimeTypeUtils.parseMIMETypeFromURL)(resource.url);
        return {
          url: stripQueryString(resource.url || ''),
          type: contentType || urlType || null
        };
      }

      if ((0, isType.isBlob)(resource)) {
        return {
          url: stripQueryString(resource.name || ''),
          type: resource.type || ''
        };
      }

      if (typeof resource === 'string') {
        return {
          url: stripQueryString(resource),
          type: (0, mimeTypeUtils.parseMIMETypeFromURL)(resource)
        };
      }

      return {
        url: '',
        type: ''
      };
    }

    function getResourceContentLength(resource) {
      if ((0, isType.isResponse)(resource)) {
        return resource.headers['content-length'] || -1;
      }

      if ((0, isType.isBlob)(resource)) {
        return resource.size;
      }

      if (typeof resource === 'string') {
        return resource.length;
      }

      if (resource instanceof ArrayBuffer) {
        return resource.byteLength;
      }

      if (ArrayBuffer.isView(resource)) {
        return resource.byteLength;
      }

      return -1;
    }

    function stripQueryString(url) {
      return url.replace(QUERY_STRING_PATTERN, '');
    }

    });

    var responseUtils = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.makeResponse = makeResponse;
    exports.checkResponse = checkResponse;
    exports.checkResponseSync = checkResponseSync;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);





    function makeResponse(_x) {
      return _makeResponse.apply(this, arguments);
    }

    function _makeResponse() {
      _makeResponse = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(resource) {
        var headers, contentLength, _getResourceUrlAndTyp, url, type, initialDataUrl, response;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(0, isType.isResponse)(resource)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", resource);

              case 2:
                headers = {};
                contentLength = (0, resourceUtils.getResourceContentLength)(resource);

                if (contentLength >= 0) {
                  headers['content-length'] = String(contentLength);
                }

                _getResourceUrlAndTyp = (0, resourceUtils.getResourceUrlAndType)(resource), url = _getResourceUrlAndTyp.url, type = _getResourceUrlAndTyp.type;

                if (type) {
                  headers['content-type'] = type;
                }

                _context.next = 9;
                return getInitialDataUrl(resource);

              case 9:
                initialDataUrl = _context.sent;

                if (initialDataUrl) {
                  headers['x-first-bytes'] = initialDataUrl;
                }

                if (typeof resource === 'string') {
                  resource = new TextEncoder().encode(resource);
                }

                response = new Response(resource, {
                  headers: headers
                });
                Object.defineProperty(response, 'url', {
                  value: url
                });
                return _context.abrupt("return", response);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _makeResponse.apply(this, arguments);
    }

    function checkResponse(_x2) {
      return _checkResponse.apply(this, arguments);
    }

    function _checkResponse() {
      _checkResponse = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(response) {
        var message;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (response.ok) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 3;
                return getResponseError(response);

              case 3:
                message = _context2.sent;
                throw new Error(message);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _checkResponse.apply(this, arguments);
    }

    function checkResponseSync(response) {
      if (!response.ok) {
        var message = "".concat(response.status, " ").concat(response.statusText);
        message = message.length > 60 ? "".concat(message.slice(60), "...") : message;
        throw new Error(message);
      }
    }

    function getResponseError(_x3) {
      return _getResponseError.apply(this, arguments);
    }

    function _getResponseError() {
      _getResponseError = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(response) {
        var message, contentType, text;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                message = "Failed to fetch resource ".concat(response.url, " (").concat(response.status, "): ");
                _context3.prev = 1;
                contentType = response.headers.get('Content-Type');
                text = response.statusText;

                if (!contentType.includes('application/json')) {
                  _context3.next = 11;
                  break;
                }

                _context3.t0 = text;
                _context3.t1 = " ";
                _context3.next = 9;
                return response.text();

              case 9:
                _context3.t2 = _context3.sent;
                text = _context3.t0 += _context3.t1.concat.call(_context3.t1, _context3.t2);

              case 11:
                message += text;
                message = message.length > 60 ? "".concat(message.slice(60), "...") : message;
                _context3.next = 17;
                break;

              case 15:
                _context3.prev = 15;
                _context3.t3 = _context3["catch"](1);

              case 17:
                return _context3.abrupt("return", message);

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 15]]);
      }));
      return _getResponseError.apply(this, arguments);
    }

    function getInitialDataUrl(_x4) {
      return _getInitialDataUrl.apply(this, arguments);
    }

    function _getInitialDataUrl() {
      _getInitialDataUrl = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee4(resource) {
        var INITIAL_DATA_LENGTH, blobSlice, slice, base64;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                INITIAL_DATA_LENGTH = 5;

                if (!(typeof resource === 'string')) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt("return", "data:,".concat(resource.slice(0, INITIAL_DATA_LENGTH)));

              case 3:
                if (!(resource instanceof Blob)) {
                  _context4.next = 8;
                  break;
                }

                blobSlice = resource.slice(0, 5);
                _context4.next = 7;
                return new Promise(function (resolve) {
                  var reader = new FileReader();

                  reader.onload = function (event) {
                    return resolve(event.target && event.target.result);
                  };

                  reader.readAsDataURL(blobSlice);
                });

              case 7:
                return _context4.abrupt("return", _context4.sent);

              case 8:
                if (!(resource instanceof ArrayBuffer)) {
                  _context4.next = 12;
                  break;
                }

                slice = resource.slice(0, INITIAL_DATA_LENGTH);
                base64 = arrayBufferToBase64(slice);
                return _context4.abrupt("return", "data:base64,".concat(base64));

              case 12:
                return _context4.abrupt("return", null);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
      return _getInitialDataUrl.apply(this, arguments);
    }

    function arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);

      for (var i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      return btoa(binary);
    }

    });

    var fetchErrorMessage = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getErrorMessageFromResponseSync = getErrorMessageFromResponseSync;
    exports.getErrorMessageFromResponse = getErrorMessageFromResponse;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    function getErrorMessageFromResponseSync(response) {
      return "Failed to fetch resource ".concat(response.url, "(").concat(response.status, "): ").concat(response.statusText, " ");
    }

    function getErrorMessageFromResponse(_x) {
      return _getErrorMessageFromResponse.apply(this, arguments);
    }

    function _getErrorMessageFromResponse() {
      _getErrorMessageFromResponse = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(response) {
        var message, contentType;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                message = "Failed to fetch resource ".concat(response.url, " (").concat(response.status, "): ");
                _context.prev = 1;
                contentType = response.headers.get('Content-Type');

                if (!contentType.includes('application/json')) {
                  _context.next = 10;
                  break;
                }

                _context.t0 = message;
                _context.next = 7;
                return response.text();

              case 7:
                message = _context.t0 += _context.sent;
                _context.next = 11;
                break;

              case 10:
                message += response.statusText;

              case 11:
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t1 = _context["catch"](1);
                return _context.abrupt("return", message);

              case 16:
                return _context.abrupt("return", message);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 13]]);
      }));
      return _getErrorMessageFromResponse.apply(this, arguments);
    }

    });

    var fetchFile_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.fetchFile = fetchFile;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);







    function fetchFile(_x) {
      return _fetchFile.apply(this, arguments);
    }

    function _fetchFile() {
      _fetchFile = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(url) {
        var options,
            response,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

                if (!(typeof url !== 'string')) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return (0, responseUtils.makeResponse)(url);

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
                url = (0, esm.resolvePath)(url);
                _context.next = 8;
                return fetch(url, options);

              case 8:
                response = _context.sent;

                if (!(!response.ok && options["throws"])) {
                  _context.next = 15;
                  break;
                }

                _context.t0 = Error;
                _context.next = 13;
                return (0, fetchErrorMessage.getErrorMessageFromResponse)(response);

              case 13:
                _context.t1 = _context.sent;
                throw new _context.t0(_context.t1);

              case 15:
                return _context.abrupt("return", response);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _fetchFile.apply(this, arguments);
    }

    });

    var interopRequireWildcard = createCommonjsModule(function (module) {
    function _getRequireWildcardCache() {
      if (typeof WeakMap !== "function") return null;
      var cache = new WeakMap();

      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };

      return cache;
    }

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      }

      if (obj === null || _typeof_1(obj) !== "object" && typeof obj !== "function") {
        return {
          "default": obj
        };
      }

      var cache = _getRequireWildcardCache();

      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }

      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }

      newObj["default"] = obj;

      if (cache) {
        cache.set(obj, newObj);
      }

      return newObj;
    }

    module.exports = _interopRequireWildcard;
    });

    function _defineProperty$1(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var defineProperty = _defineProperty$1;

    var readFileSync_node = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.readFileSync = readFileSync;

    var _defineProperty2 = interopRequireDefault(defineProperty);

    var _fs = interopRequireDefault(fs__default['default']);



    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var DEFAULT_OPTIONS = {
      dataType: 'arraybuffer',
      nothrow: true
    };

    function readFileSync(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options = getReadFileOptions(options);

      if (!_fs["default"] || !_fs["default"].readFileSync) {
        return null;
      }

      var buffer = _fs["default"].readFileSync(url, options);

      return buffer instanceof Buffer ? (0, esm.toArrayBuffer)(buffer) : buffer;
    }

    function getReadFileOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      options = _objectSpread(_objectSpread({}, DEFAULT_OPTIONS), options);

      if (options.responseType === 'text' || options.dataType === 'text') {
        options.encoding = options.encoding || 'utf8';
      }

      return options;
    }

    });

    var readFile_browser = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.readFileSyncBrowser = readFileSyncBrowser;



    var DEFAULT_OPTIONS = {
      dataType: 'arraybuffer',
      nothrow: true
    };

    var isDataURL = function isDataURL(url) {
      return url.startsWith('data:');
    };

    function readFileSyncBrowser(uri, options) {
      options = getReadFileOptions(options);

      if (isDataURL(uri)) ;

      if (!options.nothrow) {
        (0, esm.assert)(false);
      }

      return null;
    }

    function getReadFileOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      options = Object.assign({}, DEFAULT_OPTIONS, options);
      options.responseType = options.responseType || options.dataType;
      return options;
    }

    });

    var readFile = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.readFileSync = readFileSync;



    var node = interopRequireWildcard(readFileSync_node);



    function readFileSync(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      url = (0, esm.resolvePath)(url);

      if (!esm.isBrowser && node.readFileSync) {
        return node.readFileSync(url, options);
      }

      return (0, readFile_browser.readFileSyncBrowser)(url, options);
    }

    });

    var writeFile_node = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.writeFile = writeFile;
    exports.writeFileSync = writeFileSync;

    var _fs = interopRequireDefault(fs__default['default']);





    function writeFile(filePath, arrayBufferOrString, options) {
      return (0, util__default['default'].promisify)(_fs["default"].writeFile)("".concat(filePath), (0, esm.toBuffer)(arrayBufferOrString), {
        flag: 'w'
      });
    }

    function writeFileSync(filePath, arrayBufferOrString, options) {
      return _fs["default"].writeFileSync("".concat(filePath), (0, esm.toBuffer)(arrayBufferOrString), {
        flag: 'w'
      });
    }

    });

    var writeFile_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.writeFile = writeFile;
    exports.writeFileSync = writeFileSync;



    var node = interopRequireWildcard(writeFile_node);

    function writeFile(filePath, arrayBufferOrString, options) {
      filePath = (0, esm.resolvePath)(filePath);

      if (!esm.isBrowser && node.writeFile) {
        return node.writeFile(filePath, arrayBufferOrString, options);
      }

      return (0, esm.assert)(false);
    }

    function writeFileSync(filePath, arrayBufferOrString, options) {
      filePath = (0, esm.resolvePath)(filePath);

      if (!esm.isBrowser && node.writeFileSync) {
        return node.writeFileSync(filePath, arrayBufferOrString, options);
      }

      return (0, esm.assert)(false);
    }

    });

    function _classCallCheck$1(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var classCallCheck = _classCallCheck$1;

    function _defineProperties$1(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass$1(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$1(Constructor, staticProps);
      return Constructor;
    }

    var createClass = _createClass$1;

    var loggers = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ConsoleLog = exports.NullLog = void 0;

    var _classCallCheck2 = interopRequireDefault(classCallCheck);

    var _createClass2 = interopRequireDefault(createClass);

    var NullLog = function () {
      function NullLog() {
        (0, _classCallCheck2["default"])(this, NullLog);
      }

      (0, _createClass2["default"])(NullLog, [{
        key: "log",
        value: function log() {
          return function (_) {};
        }
      }, {
        key: "info",
        value: function info() {
          return function (_) {};
        }
      }, {
        key: "warn",
        value: function warn() {
          return function (_) {};
        }
      }, {
        key: "error",
        value: function error() {
          return function (_) {};
        }
      }]);
      return NullLog;
    }();

    exports.NullLog = NullLog;

    var ConsoleLog = function () {
      function ConsoleLog() {
        (0, _classCallCheck2["default"])(this, ConsoleLog);
        this.console = console;
      }

      (0, _createClass2["default"])(ConsoleLog, [{
        key: "log",
        value: function log() {
          var _this$console$log;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return (_this$console$log = this.console.log).bind.apply(_this$console$log, [this.console].concat(args));
        }
      }, {
        key: "info",
        value: function info() {
          var _this$console$info;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return (_this$console$info = this.console.info).bind.apply(_this$console$info, [this.console].concat(args));
        }
      }, {
        key: "warn",
        value: function warn() {
          var _this$console$warn;

          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return (_this$console$warn = this.console.warn).bind.apply(_this$console$warn, [this.console].concat(args));
        }
      }, {
        key: "error",
        value: function error() {
          var _this$console$error;

          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return (_this$console$error = this.console.error).bind.apply(_this$console$error, [this.console].concat(args));
        }
      }]);
      return ConsoleLog;
    }();

    exports.ConsoleLog = ConsoleLog;

    });

    var optionUtils = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.setGlobalOptions = setGlobalOptions;
    exports.normalizeOptions = normalizeOptions;
    exports.getFetchFunction = getFetchFunction;
    exports.getGlobalLoaderState = void 0;

    var _defineProperty2 = interopRequireDefault(defineProperty);









    function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var DEFAULT_LOADER_OPTIONS = {
      baseUri: '',
      fetch: null,
      CDN: 'https://unpkg.com/@loaders.gl',
      worker: true,
      log: new loggers.ConsoleLog(),
      metadata: false,
      transforms: [],
      reuseWorkers: true
    };
    var DEPRECATED_LOADER_OPTIONS = {
      dataType: '(no longer used)',
      method: 'fetch.method',
      headers: 'fetch.headers',
      body: 'fetch.body',
      mode: 'fetch.mode',
      credentials: 'fetch.credentials',
      cache: 'fetch.cache',
      redirect: 'fetch.redirect',
      referrer: 'fetch.referrer',
      referrerPolicy: 'fetch.referrerPolicy',
      integrity: 'fetch.integrity',
      keepalive: 'fetch.keepalive',
      signal: 'fetch.signal'
    };

    var getGlobalLoaderState = function getGlobalLoaderState() {
      esm.global.loaders = esm.global.loaders || {};
      var loaders = esm.global.loaders;
      loaders._state = loaders._state || {};
      return loaders._state;
    };

    exports.getGlobalLoaderState = getGlobalLoaderState;

    var getGlobalLoaderOptions = function getGlobalLoaderOptions() {
      var state = getGlobalLoaderState();
      state.globalOptions = state.globalOptions || _objectSpread({}, DEFAULT_LOADER_OPTIONS);
      return state.globalOptions;
    };

    function setGlobalOptions(options) {
      var state = getGlobalLoaderState();
      var globalOptions = getGlobalLoaderOptions();
      state.globalOptions = normalizeOptionsInternal(globalOptions, options);
    }

    function normalizeOptions(options, loader, loaders, url) {
      loaders = loaders || [];
      loaders = Array.isArray(loaders) ? loaders : [loaders];
      validateOptions(options, loaders);
      return normalizeOptionsInternal(loader, options, url);
    }

    function getFetchFunction(options, context) {
      var globalOptions = getGlobalLoaderOptions();
      var fetch = options.fetch || globalOptions.fetch;

      if (typeof fetch === 'function') {
        return fetch;
      }

      if ((0, isType.isObject)(fetch)) {
        return function (url) {
          return (0, fetchFile_1.fetchFile)(url, fetch);
        };
      }

      if (context && context.fetch) {
        return context.fetch;
      }

      return function (url) {
        return (0, fetchFile_1.fetchFile)(url, options);
      };
    }

    function validateOptions(options, loaders) {
      var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : console;
      validateOptionsObject(options, null, log, DEFAULT_LOADER_OPTIONS, DEPRECATED_LOADER_OPTIONS, loaders);

      var _iterator = _createForOfIteratorHelper(loaders),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var loader = _step.value;
          var idOptions = options && options[loader.id] || {};
          var loaderOptions = loader.options && loader.options[loader.id] || {};
          var deprecatedOptions = loader.defaultOptions && loader.defaultOptions[loader.id] || {};
          validateOptionsObject(idOptions, loader.id, log, loaderOptions, deprecatedOptions, loaders);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    function validateOptionsObject(options, id, log, defaultOptions, deprecatedOptions, loaders) {
      var loaderName = id || 'Top level';
      var prefix = id ? "".concat(id, ".") : '';

      for (var key in options) {
        var isSubOptions = !id && (0, isType.isObject)(options[key]);

        if (!(key in defaultOptions)) {
          if (key in deprecatedOptions) {
            log.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' deprecated, use '").concat(deprecatedOptions[key], "'"));
          } else if (!isSubOptions) {
            var suggestion = findSimilarOption(key, loaders);
            log.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' not recognized. ").concat(suggestion));
          }
        }
      }
    }

    function findSimilarOption(optionKey, loaders) {
      var lowerCaseOptionKey = optionKey.toLowerCase();
      var bestSuggestion = '';

      var _iterator2 = _createForOfIteratorHelper(loaders),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var loader = _step2.value;

          for (var key in loader.options) {
            if (optionKey === key) {
              return "Did you mean '".concat(loader.id, ".").concat(key, "'?");
            }

            var lowerCaseKey = key.toLowerCase();
            var isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);

            if (isPartialMatch) {
              bestSuggestion = bestSuggestion || "Did you mean '".concat(loader.id, ".").concat(key, "'?");
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return bestSuggestion;
    }

    function normalizeOptionsInternal(loader, options, url) {
      var loaderDefaultOptions = loader.options || {};

      var mergedOptions = _objectSpread({}, loaderDefaultOptions);

      if (mergedOptions.log === null) {
        mergedOptions.log = new loggers.NullLog();
      }

      mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
      mergeNestedFields(mergedOptions, options);
      addUrlOptions(mergedOptions, url);
      return mergedOptions;
    }

    function mergeNestedFields(mergedOptions, options) {
      for (var key in options) {
        if (key in options) {
          var value = options[key];

          if ((0, isType.isPureObject)(value) && (0, isType.isPureObject)(mergedOptions[key])) {
            mergedOptions[key] = _objectSpread(_objectSpread({}, mergedOptions[key]), options[key]);
          } else {
            mergedOptions[key] = options[key];
          }
        }
      }
    }

    function addUrlOptions(options, url) {
      if (url && !options.baseUri) {
        options.baseUri = url;
      }
    }

    });

    var setLoaderOptions_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.setLoaderOptions = setLoaderOptions;



    function setLoaderOptions(options) {
      (0, optionUtils.setGlobalOptions)(options);
    }

    });

    var normalizeLoader_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isLoaderObject = isLoaderObject;
    exports.normalizeLoader = normalizeLoader;

    var _defineProperty2 = interopRequireDefault(defineProperty);



    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function isLoaderObject(loader) {
      if (!loader) {
        return false;
      }

      if (Array.isArray(loader)) {
        loader = loader[0];
      }

      var hasParser = loader.parseTextSync || loader.parseSync || loader.parse || loader.parseStream || loader.parseInBatches;
      var loaderOptions = loader.options && loader.options[loader.id];
      hasParser = hasParser || loaderOptions && loaderOptions.workerUrl;
      return hasParser;
    }

    function normalizeLoader(loader) {
      (0, esm.assert)(loader, 'null loader');
      (0, esm.assert)(isLoaderObject(loader), 'invalid loader');
      var options;

      if (Array.isArray(loader)) {
        options = loader[1];
        loader = loader[0];
        loader = _objectSpread(_objectSpread({}, loader), {}, {
          options: _objectSpread(_objectSpread({}, loader.options), options)
        });
      }

      if (loader.extension) {
        loader.extensions = loader.extensions || loader.extension;
        delete loader.extension;
      }

      if (!Array.isArray(loader.extensions)) {
        loader.extensions = [loader.extensions];
      }

      (0, esm.assert)(loader.extensions && loader.extensions.length > 0 && loader.extensions[0]);

      if (loader.parseTextSync || loader.parseText) {
        loader.text = true;
      }

      if (!loader.text) {
        loader.binary = true;
      }

      return loader;
    }

    });

    var registerLoaders_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.registerLoaders = registerLoaders;
    exports.getRegisteredLoaders = getRegisteredLoaders;
    exports._unregisterLoaders = _unregisterLoaders;





    function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    var getGlobalLoaderRegistry = function getGlobalLoaderRegistry() {
      var state = (0, optionUtils.getGlobalLoaderState)();
      state.loaderRegistry = state.loaderRegistry || [];
      return state.loaderRegistry;
    };

    function registerLoaders(loaders) {
      var loaderRegistry = getGlobalLoaderRegistry();
      loaders = Array.isArray(loaders) ? loaders : [loaders];

      var _iterator = _createForOfIteratorHelper(loaders),
          _step;

      try {
        var _loop = function _loop() {
          var loader = _step.value;
          var normalizedLoader = (0, normalizeLoader_1.normalizeLoader)(loader);

          if (!loaderRegistry.find(function (registeredLoader) {
            return normalizedLoader === registeredLoader;
          })) {
            loaderRegistry.unshift(normalizedLoader);
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    function getRegisteredLoaders() {
      return getGlobalLoaderRegistry();
    }

    function _unregisterLoaders() {
      var state = (0, optionUtils.getGlobalLoaderState)();
      state.loaderRegistry = [];
    }

    });

    var stringIterator = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.makeStringIterator = makeStringIterator;

    var _regenerator = interopRequireDefault(regenerator);

    var _marked = _regenerator["default"].mark(makeStringIterator);

    function makeStringIterator(string) {
      var options,
          _options$chunkSize,
          chunkSize,
          offset,
          textEncoder,
          chunkLength,
          chunk,
          _args = arguments;

      return _regenerator["default"].wrap(function makeStringIterator$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _options$chunkSize = options.chunkSize, chunkSize = _options$chunkSize === void 0 ? 256 * 1024 : _options$chunkSize;
              offset = 0;
              textEncoder = new TextEncoder();

            case 4:
              if (!(offset < string.length)) {
                _context.next = 12;
                break;
              }

              chunkLength = Math.min(string.length - offset, chunkSize);
              chunk = string.slice(offset, offset + chunkLength);
              offset += chunkLength;
              _context.next = 10;
              return textEncoder.encode(chunk);

            case 10:
              _context.next = 4;
              break;

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _marked);
    }

    });

    var arrayBufferIterator = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.makeArrayBufferIterator = makeArrayBufferIterator;

    var _regenerator = interopRequireDefault(regenerator);

    var _marked = _regenerator["default"].mark(makeArrayBufferIterator);

    function makeArrayBufferIterator(arrayBuffer) {
      var options,
          _options$chunkSize,
          chunkSize,
          byteOffset,
          chunkByteLength,
          chunk,
          sourceArray,
          chunkArray,
          _args = arguments;

      return _regenerator["default"].wrap(function makeArrayBufferIterator$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _options$chunkSize = options.chunkSize, chunkSize = _options$chunkSize === void 0 ? 256 * 1024 : _options$chunkSize;
              byteOffset = 0;

            case 3:
              if (!(byteOffset < arrayBuffer.byteLength)) {
                _context.next = 14;
                break;
              }

              chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
              chunk = new ArrayBuffer(chunkByteLength);
              sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
              chunkArray = new Uint8Array(chunk);
              chunkArray.set(sourceArray);
              byteOffset += chunkByteLength;
              _context.next = 12;
              return chunk;

            case 12:
              _context.next = 3;
              break;

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _marked);
    }

    });

    function _AwaitValue$1(value) {
      this.wrapped = value;
    }

    var AwaitValue = _AwaitValue$1;

    function _awaitAsyncGenerator$1(value) {
      return new AwaitValue(value);
    }

    var awaitAsyncGenerator = _awaitAsyncGenerator$1;

    function AsyncGenerator$1(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;
          var wrappedAwait = value instanceof AwaitValue;
          Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
            if (wrappedAwait) {
              resume(key === "return" ? "return" : "next", arg);
              return;
            }

            settle(result.done ? "return" : "normal", arg);
          }, function (err) {
            resume("throw", err);
          });
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen["return"] !== "function") {
        this["return"] = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator$1.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator$1.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator$1.prototype["throw"] = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator$1.prototype["return"] = function (arg) {
      return this._invoke("return", arg);
    };

    var AsyncGenerator_1 = AsyncGenerator$1;

    function _wrapAsyncGenerator$1(fn) {
      return function () {
        return new AsyncGenerator_1(fn.apply(this, arguments));
      };
    }

    var wrapAsyncGenerator = _wrapAsyncGenerator$1;

    var blobIterator = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.makeBlobIterator = makeBlobIterator;
    exports.readFileSlice = readFileSlice;

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _regenerator = interopRequireDefault(regenerator);

    var _awaitAsyncGenerator2 = interopRequireDefault(awaitAsyncGenerator);

    var _wrapAsyncGenerator2 = interopRequireDefault(wrapAsyncGenerator);

    var DEFAULT_CHUNK_SIZE = 1024 * 1024;

    function makeBlobIterator(_x) {
      return _makeBlobIterator.apply(this, arguments);
    }

    function _makeBlobIterator() {
      _makeBlobIterator = (0, _wrapAsyncGenerator2["default"])(_regenerator["default"].mark(function _callee(file) {
        var options,
            chunkSize,
            offset,
            end,
            chunk,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
                offset = 0;

              case 3:
                if (!(offset < file.size)) {
                  _context.next = 13;
                  break;
                }

                end = offset + chunkSize;
                _context.next = 7;
                return (0, _awaitAsyncGenerator2["default"])(readFileSlice(file, offset, end));

              case 7:
                chunk = _context.sent;
                offset = end;
                _context.next = 11;
                return chunk;

              case 11:
                _context.next = 3;
                break;

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _makeBlobIterator.apply(this, arguments);
    }

    function readFileSlice(_x2, _x3, _x4) {
      return _readFileSlice.apply(this, arguments);
    }

    function _readFileSlice() {
      _readFileSlice = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(file, offset, end) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return new Promise(function (resolve, reject) {
                  var slice = file.slice(offset, end);
                  var fileReader = new FileReader();

                  fileReader.onload = function (event) {
                    return resolve(event.target && event.target.result);
                  };

                  fileReader.onerror = function (error) {
                    return reject(error);
                  };

                  fileReader.readAsArrayBuffer(slice);
                });

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _readFileSlice.apply(this, arguments);
    }

    });

    function _asyncIterator$1(iterable) {
      var method;

      if (typeof Symbol !== "undefined") {
        if (Symbol.asyncIterator) {
          method = iterable[Symbol.asyncIterator];
          if (method != null) return method.call(iterable);
        }

        if (Symbol.iterator) {
          method = iterable[Symbol.iterator];
          if (method != null) return method.call(iterable);
        }
      }

      throw new TypeError("Object is not async iterable");
    }

    var asyncIterator = _asyncIterator$1;

    var streamIterator = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.makeStreamIterator = makeStreamIterator;

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _regenerator = interopRequireDefault(regenerator);

    var _awaitAsyncGenerator2 = interopRequireDefault(awaitAsyncGenerator);

    var _wrapAsyncGenerator2 = interopRequireDefault(wrapAsyncGenerator);

    var _asyncIterator2 = interopRequireDefault(asyncIterator);



    function makeStreamIterator(stream) {
      if (esm.isBrowser || esm.nodeVersion >= 10) {
        if (typeof stream[Symbol.asyncIterator] === 'function') {
          return makeToArrayBufferIterator(stream);
        }

        if (typeof stream.getIterator === 'function') {
          return stream.getIterator();
        }
      }

      return esm.isBrowser ? makeBrowserStreamIterator(stream) : makeNodeStreamIterator(stream);
    }

    function makeToArrayBufferIterator(_x) {
      return _makeToArrayBufferIterator.apply(this, arguments);
    }

    function _makeToArrayBufferIterator() {
      _makeToArrayBufferIterator = (0, _wrapAsyncGenerator2["default"])(_regenerator["default"].mark(function _callee(asyncIterator) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 2;
                _iterator = (0, _asyncIterator2["default"])(asyncIterator);

              case 4:
                _context.next = 6;
                return (0, _awaitAsyncGenerator2["default"])(_iterator.next());

              case 6:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 10;
                return (0, _awaitAsyncGenerator2["default"])(_step.value);

              case 10:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 18;
                  break;
                }

                chunk = _value;
                _context.next = 15;
                return (0, esm.toArrayBuffer)(chunk);

              case 15:
                _iteratorNormalCompletion = true;
                _context.next = 4;
                break;

              case 18:
                _context.next = 24;
                break;

              case 20:
                _context.prev = 20;
                _context.t0 = _context["catch"](2);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 24:
                _context.prev = 24;
                _context.prev = 25;

                if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                  _context.next = 29;
                  break;
                }

                _context.next = 29;
                return (0, _awaitAsyncGenerator2["default"])(_iterator["return"]());

              case 29:
                _context.prev = 29;

                if (!_didIteratorError) {
                  _context.next = 32;
                  break;
                }

                throw _iteratorError;

              case 32:
                return _context.finish(29);

              case 33:
                return _context.finish(24);

              case 34:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 20, 24, 34], [25,, 29, 33]]);
      }));
      return _makeToArrayBufferIterator.apply(this, arguments);
    }

    function makeBrowserStreamIterator(_x2) {
      return _makeBrowserStreamIterator.apply(this, arguments);
    }

    function _makeBrowserStreamIterator() {
      _makeBrowserStreamIterator = (0, _wrapAsyncGenerator2["default"])(_regenerator["default"].mark(function _callee2(stream) {
        var reader, _yield$_awaitAsyncGen, done, value;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                reader = stream.getReader();
                _context2.prev = 1;

              case 2:

                _context2.next = 5;
                return (0, _awaitAsyncGenerator2["default"])(reader.read());

              case 5:
                _yield$_awaitAsyncGen = _context2.sent;
                done = _yield$_awaitAsyncGen.done;
                value = _yield$_awaitAsyncGen.value;

                if (!done) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return");

              case 10:
                _context2.next = 12;
                return (0, esm.toArrayBuffer)(value);

              case 12:
                _context2.next = 2;
                break;

              case 14:
                _context2.next = 19;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](1);
                reader.releaseLock();

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 16]]);
      }));
      return _makeBrowserStreamIterator.apply(this, arguments);
    }

    function makeNodeStreamIterator(_x3) {
      return _makeNodeStreamIterator.apply(this, arguments);
    }

    function _makeNodeStreamIterator() {
      _makeNodeStreamIterator = (0, _wrapAsyncGenerator2["default"])(_regenerator["default"].mark(function _callee3(stream) {
        var data;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _awaitAsyncGenerator2["default"])(stream);

              case 2:
                stream = _context3.sent;

              case 3:

                data = stream.read();

                if (!(data !== null)) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 8;
                return (0, esm.toArrayBuffer)(data);

              case 8:
                return _context3.abrupt("continue", 3);

              case 9:
                if (!stream._readableState.ended) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt("return");

              case 11:
                _context3.next = 13;
                return (0, _awaitAsyncGenerator2["default"])(onceReadable(stream));

              case 13:
                _context3.next = 3;
                break;

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _makeNodeStreamIterator.apply(this, arguments);
    }

    function onceReadable(_x4) {
      return _onceReadable.apply(this, arguments);
    }

    function _onceReadable() {
      _onceReadable = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee4(stream) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", new Promise(function (resolve) {
                  stream.once('readable', resolve);
                }));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
      return _onceReadable.apply(this, arguments);
    }

    });

    var makeIterator_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.makeIterator = makeIterator;













    function makeIterator(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof data === 'string') {
        return (0, stringIterator.makeStringIterator)(data, options);
      }

      if (data instanceof ArrayBuffer) {
        return (0, arrayBufferIterator.makeArrayBufferIterator)(data, options);
      }

      if ((0, isType.isBlob)(data)) {
        return (0, blobIterator.makeBlobIterator)(data, options);
      }

      if ((0, isType.isReadableStream)(data)) {
        return (0, streamIterator.makeStreamIterator)(data);
      }

      if ((0, isType.isResponse)(data)) {
        return (0, streamIterator.makeStreamIterator)(data.body);
      }

      return (0, esm.assert)(false);
    }

    });

    var getData = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getArrayBufferOrStringFromDataSync = getArrayBufferOrStringFromDataSync;
    exports.getArrayBufferOrStringFromData = getArrayBufferOrStringFromData;
    exports.getAsyncIteratorFromData = getAsyncIteratorFromData;
    exports.getReadableStream = getReadableStream;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);









    var ERR_DATA = 'Cannot convert supplied data type';

    function getArrayBufferOrStringFromDataSync(data, loader) {
      if (loader.text && typeof data === 'string') {
        return data;
      }

      if (data instanceof ArrayBuffer) {
        var arrayBuffer = data;

        if (loader.text && !loader.binary) {
          var textDecoder = new TextDecoder('utf8');
          return textDecoder.decode(arrayBuffer);
        }

        return arrayBuffer;
      }

      if (ArrayBuffer.isView(data) || (0, isType.isBuffer)(data)) {
        if (loader.text && !loader.binary) {
          var _textDecoder = new TextDecoder('utf8');

          return _textDecoder.decode(data);
        }

        var _arrayBuffer = data.buffer;
        var byteLength = data.byteLength || data.length;

        if (data.byteOffset !== 0 || byteLength !== _arrayBuffer.byteLength) {
          _arrayBuffer = _arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
        }

        return _arrayBuffer;
      }

      throw new Error(ERR_DATA);
    }

    function getArrayBufferOrStringFromData(_x, _x2) {
      return _getArrayBufferOrStringFromData.apply(this, arguments);
    }

    function _getArrayBufferOrStringFromData() {
      _getArrayBufferOrStringFromData = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(data, loader) {
        var isArrayBuffer, response;
        return _regenerator["default"].wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);

                if (!(typeof data === 'string' || isArrayBuffer)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", getArrayBufferOrStringFromDataSync(data, loader));

              case 3:
                if (!(0, isType.isBlob)(data)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 6;
                return (0, responseUtils.makeResponse)(data);

              case 6:
                data = _context3.sent;

              case 7:
                if (!(0, isType.isResponse)(data)) {
                  _context3.next = 21;
                  break;
                }

                response = data;
                _context3.next = 11;
                return (0, responseUtils.checkResponse)(response);

              case 11:
                if (!loader.binary) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 14;
                return response.arrayBuffer();

              case 14:
                _context3.t0 = _context3.sent;
                _context3.next = 20;
                break;

              case 17:
                _context3.next = 19;
                return response.text();

              case 19:
                _context3.t0 = _context3.sent;

              case 20:
                return _context3.abrupt("return", _context3.t0);

              case 21:
                if ((0, isType.isReadableStream)(data)) {
                  data = (0, makeIterator_1.makeIterator)(data);
                }

                if (!((0, isType.isIterable)(data) || (0, isType.isAsyncIterable)(data))) {
                  _context3.next = 24;
                  break;
                }

                return _context3.abrupt("return", (0, esm.concatenateChunksAsync)(data));

              case 24:
                throw new Error(ERR_DATA);

              case 25:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee);
      }));
      return _getArrayBufferOrStringFromData.apply(this, arguments);
    }

    function getAsyncIteratorFromData(_x3) {
      return _getAsyncIteratorFromData.apply(this, arguments);
    }

    function _getAsyncIteratorFromData() {
      _getAsyncIteratorFromData = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(data) {
        return _regenerator["default"].wrap(function _callee2$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(0, isType.isIterator)(data)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", data);

              case 2:
                if (!(0, isType.isResponse)(data)) {
                  _context4.next = 6;
                  break;
                }

                _context4.next = 5;
                return (0, responseUtils.checkResponse)(data);

              case 5:
                return _context4.abrupt("return", (0, makeIterator_1.makeIterator)(data.body));

              case 6:
                if (!((0, isType.isBlob)(data) || (0, isType.isReadableStream)(data))) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt("return", (0, makeIterator_1.makeIterator)(data));

              case 8:
                if (!(0, isType.isAsyncIterable)(data)) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt("return", data[Symbol.asyncIterator]());

              case 10:
                return _context4.abrupt("return", getIteratorFromData(data));

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee2);
      }));
      return _getAsyncIteratorFromData.apply(this, arguments);
    }

    function getIteratorFromData(data) {
      if (ArrayBuffer.isView(data)) {
        return _regenerator["default"].mark(function oneChunk() {
          return _regenerator["default"].wrap(function oneChunk$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return data.buffer;

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, oneChunk);
        })();
      }

      if (data instanceof ArrayBuffer) {
        return _regenerator["default"].mark(function oneChunk() {
          return _regenerator["default"].wrap(function oneChunk$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return data;

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, oneChunk);
        })();
      }

      if ((0, isType.isIterator)(data)) {
        return data;
      }

      if ((0, isType.isIterable)(data)) {
        return data[Symbol.iterator]();
      }

      throw new Error(ERR_DATA);
    }

    function getReadableStream(_x4) {
      return _getReadableStream.apply(this, arguments);
    }

    function _getReadableStream() {
      _getReadableStream = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(data) {
        var response;
        return _regenerator["default"].wrap(function _callee3$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(0, isType.isReadableStream)(data)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return", data);

              case 2:
                if (!(0, isType.isResponse)(data)) {
                  _context5.next = 4;
                  break;
                }

                return _context5.abrupt("return", data.body);

              case 4:
                _context5.next = 6;
                return (0, responseUtils.makeResponse)(data);

              case 6:
                response = _context5.sent;
                return _context5.abrupt("return", response.body);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee3);
      }));
      return _getReadableStream.apply(this, arguments);
    }

    });

    function _arrayLikeToArray$2(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    var arrayLikeToArray = _arrayLikeToArray$2;

    function _arrayWithoutHoles$1(arr) {
      if (Array.isArray(arr)) return arrayLikeToArray(arr);
    }

    var arrayWithoutHoles = _arrayWithoutHoles$1;

    function _iterableToArray$1(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }

    var iterableToArray = _iterableToArray$1;

    function _unsupportedIterableToArray$2(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
    }

    var unsupportedIterableToArray = _unsupportedIterableToArray$2;

    function _nonIterableSpread$1() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var nonIterableSpread = _nonIterableSpread$1;

    function _toConsumableArray$1(arr) {
      return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
    }

    var toConsumableArray = _toConsumableArray$1;

    var contextUtils = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getLoaderContext = getLoaderContext;
    exports.getLoaders = getLoaders;

    var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

    var _defineProperty2 = interopRequireDefault(defineProperty);



    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function getLoaderContext(context, options) {
      var previousContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (previousContext) {
        return previousContext;
      }

      context = _objectSpread({
        fetch: (0, optionUtils.getFetchFunction)(options || {}, context)
      }, context);

      if (!Array.isArray(context.loaders)) {
        context.loaders = null;
      }

      return context;
    }

    function getLoaders(loaders, context) {
      if (!context && loaders && !Array.isArray(loaders)) {
        return loaders;
      }

      var candidateLoaders;

      if (loaders) {
        candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
      }

      if (context && context.loaders) {
        var contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
        candidateLoaders = candidateLoaders ? [].concat((0, _toConsumableArray2["default"])(candidateLoaders), (0, _toConsumableArray2["default"])(contextLoaders)) : contextLoaders;
      }

      return candidateLoaders && candidateLoaders.length ? candidateLoaders : null;
    }

    });

    var parseWithWorker_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.canParseWithWorker = canParseWithWorker;
    exports["default"] = parseWithWorker;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);





    var VERSION = "2.3.12" ;

    function canParseWithWorker(loader, data, options, context) {
      if (!esm._WorkerFarm.isSupported()) {
        return false;
      }

      var loaderOptions = options && options[loader.id];

      if (options.worker === 'local' && loaderOptions && loaderOptions.localWorkerUrl || options.worker && loaderOptions && loaderOptions.workerUrl) {
        return loader.useWorker ? loader.useWorker(options) : true;
      }

      return false;
    }

    function parseWithWorker(loader, data, options, context) {
      var _ref = options || {},
          worker = _ref.worker;

      var loaderOptions = options && options[loader.id] || {};
      var workerUrl = worker === 'local' ? loaderOptions.localWorkerUrl : loaderOptions.workerUrl;
      var workerSource = "url(".concat(workerUrl, ")");
      var workerName = loader.name;
      var workerFarm = getWorkerFarm(options);
      options = JSON.parse(JSON.stringify(options));
      var warning = loader.version !== VERSION ? "(core version ".concat(VERSION, ")") : '';
      return workerFarm.process(workerSource, "".concat(workerName, "-worker@").concat(loader.version).concat(warning), {
        arraybuffer: (0, esm.toArrayBuffer)(data),
        options: options,
        source: "loaders.gl@".concat(VERSION),
        type: 'parse'
      });
    }

    var _workerFarm = null;

    function getWorkerFarm() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var props = {};

      if (options.maxConcurrency) {
        props.maxConcurrency = options.maxConcurrency;
      }

      if (options.onDebug) {
        props.onDebug = options.onDebug;
      }

      if ('reuseWorkers' in options) {
        props.reuseWorkers = options.reuseWorkers;
      }

      if (!_workerFarm) {
        _workerFarm = new esm._WorkerFarm({
          onMessage: onWorkerMessage
        });
      }

      _workerFarm.setProps(props);

      return _workerFarm;
    }

    function onWorkerMessage(_x) {
      return _onWorkerMessage.apply(this, arguments);
    }

    function _onWorkerMessage() {
      _onWorkerMessage = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(_ref2) {
        var worker, data, resolve, reject, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                worker = _ref2.worker, data = _ref2.data, resolve = _ref2.resolve, reject = _ref2.reject;
                _context.t0 = data.type;
                _context.next = _context.t0 === 'done' ? 4 : _context.t0 === 'parse' ? 6 : _context.t0 === 'error' ? 17 : 19;
                break;

              case 4:
                resolve(data.result);
                return _context.abrupt("break", 19);

              case 6:
                _context.prev = 6;
                _context.next = 9;
                return (0, parse_1.parse)(data.arraybuffer, data.options, data.url);

              case 9:
                result = _context.sent;
                worker.postMessage({
                  type: 'parse-done',
                  id: data.id,
                  result: result
                }, (0, esm.getTransferList)(result));
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t1 = _context["catch"](6);
                worker.postMessage({
                  type: 'parse-error',
                  id: data.id,
                  message: _context.t1.message
                });

              case 16:
                return _context.abrupt("break", 19);

              case 17:
                reject(data.message);
                return _context.abrupt("break", 19);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[6, 13]]);
      }));
      return _onWorkerMessage.apply(this, arguments);
    }

    });

    var selectLoader_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.selectLoader = selectLoader;
    exports.selectLoaderSync = selectLoaderSync;

    var _regenerator = interopRequireDefault(regenerator);

    var _defineProperty2 = interopRequireDefault(defineProperty);

    var _typeof2 = interopRequireDefault(_typeof_1);

    var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);













    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    var EXT_PATTERN = /\.([^.]+)$/;

    function selectLoader(_x) {
      return _selectLoader.apply(this, arguments);
    }

    function _selectLoader() {
      _selectLoader = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(data) {
        var loaders,
            options,
            context,
            loader,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                loaders = _args.length > 1 && _args[1] !== undefined ? _args[1] : [];
                options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                context = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
                loader = selectLoaderSync(data, loaders, _objectSpread(_objectSpread({}, options), {}, {
                  nothrow: true
                }), context);

                if (!loader) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", loader);

              case 6:
                if (!(0, isType.isBlob)(data)) {
                  _context.next = 11;
                  break;
                }

                _context.next = 9;
                return (0, blobIterator.readFileSlice)(data, 0, 10);

              case 9:
                data = _context.sent;
                loader = selectLoaderSync(data, loaders, options, context);

              case 11:
                if (!(!loader && !options.nothrow)) {
                  _context.next = 13;
                  break;
                }

                throw new Error(getNoValidLoaderMessage(data));

              case 13:
                return _context.abrupt("return", loader);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _selectLoader.apply(this, arguments);
    }

    function selectLoaderSync(data) {
      var loaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (loaders && !Array.isArray(loaders)) {
        return (0, normalizeLoader_1.normalizeLoader)(loaders);
      }

      loaders = [].concat((0, _toConsumableArray2["default"])(loaders || []), (0, _toConsumableArray2["default"])((0, registerLoaders_1.getRegisteredLoaders)()));
      normalizeLoaders(loaders);

      var _getResourceUrlAndTyp = (0, resourceUtils.getResourceUrlAndType)(data),
          url = _getResourceUrlAndTyp.url,
          type = _getResourceUrlAndTyp.type;

      var loader = findLoaderByUrl(loaders, url || context.url);
      loader = loader || findLoaderByContentType(loaders, type);
      loader = loader || findLoaderByExamingInitialData(loaders, data);

      if (!loader && !options.nothrow) {
        throw new Error(getNoValidLoaderMessage(data));
      }

      return loader;
    }

    function getNoValidLoaderMessage(data) {
      var _getResourceUrlAndTyp2 = (0, resourceUtils.getResourceUrlAndType)(data),
          url = _getResourceUrlAndTyp2.url,
          type = _getResourceUrlAndTyp2.type;

      var message = 'No valid loader found';

      if (data) {
        message += " data: \"".concat(getFirstCharacters(data), "\", contentType: \"").concat(type, "\"");
      }

      if (url) {
        message += " url: ".concat(url);
      }

      return message;
    }

    function normalizeLoaders(loaders) {
      var _iterator = _createForOfIteratorHelper(loaders),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var loader = _step.value;
          (0, normalizeLoader_1.normalizeLoader)(loader);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    function findLoaderByUrl(loaders, url) {
      var match = url && url.match(EXT_PATTERN);
      var extension = match && match[1];
      return extension && findLoaderByExtension(loaders, extension);
    }

    function findLoaderByExtension(loaders, extension) {
      extension = extension.toLowerCase();

      var _iterator2 = _createForOfIteratorHelper(loaders),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var loader = _step2.value;

          var _iterator3 = _createForOfIteratorHelper(loader.extensions),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var loaderExtension = _step3.value;

              if (loaderExtension.toLowerCase() === extension) {
                return loader;
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return null;
    }

    function findLoaderByContentType(loaders, mimeType) {
      var _iterator4 = _createForOfIteratorHelper(loaders),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var loader = _step4.value;

          if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
            return loader;
          }

          if (mimeType === "application/x.".concat(loader.id)) {
            return loader;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return null;
    }

    function findLoaderByExamingInitialData(loaders, data) {
      if (!data) {
        return null;
      }

      var _iterator5 = _createForOfIteratorHelper(loaders),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var loader = _step5.value;

          if (typeof data === 'string') {
            if (testDataAgainstText(data, loader)) {
              return loader;
            }
          } else if (ArrayBuffer.isView(data)) {
            if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
              return loader;
            }
          } else if (data instanceof ArrayBuffer) {
            var byteOffset = 0;

            if (testDataAgainstBinary(data, byteOffset, loader)) {
              return loader;
            }
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return null;
    }

    function testDataAgainstText(data, loader) {
      return loader.testText && loader.testText(data);
    }

    function testDataAgainstBinary(data, byteOffset, loader) {
      var tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
      return tests.some(function (test) {
        return testBinary(data, byteOffset, loader, test);
      });
    }

    function testBinary(data, byteOffset, loader, test) {
      if (test instanceof ArrayBuffer) {
        return (0, esm.compareArrayBuffers)(test, data, test.byteLength);
      }

      switch ((0, _typeof2["default"])(test)) {
        case 'function':
          return test(data, loader);

        case 'string':
          var magic = getMagicString(data, byteOffset, test.length);
          return test === magic;

        default:
          return false;
      }
    }

    function getFirstCharacters(data) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

      if (typeof data === 'string') {
        return data.slice(0, length);
      } else if (ArrayBuffer.isView(data)) {
        return getMagicString(data.buffer, data.byteOffset, length);
      } else if (data instanceof ArrayBuffer) {
        var byteOffset = 0;
        return getMagicString(data, byteOffset, length);
      }

      return '';
    }

    function getMagicString(arrayBuffer, byteOffset, length) {
      if (arrayBuffer.byteLength < byteOffset + length) {
        return '';
      }

      var dataView = new DataView(arrayBuffer);
      var magic = '';

      for (var i = 0; i < length; i++) {
        magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
      }

      return magic;
    }

    });

    var parse_1 = createCommonjsModule(function (module, exports) {





    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parse = parse;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);











    var _parseWithWorker = interopRequireWildcard(parseWithWorker_1);





    function parse(_x, _x2, _x3, _x4) {
      return _parse.apply(this, arguments);
    }

    function _parse() {
      _parse = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(data, loaders, options, context) {
        var _getResourceUrlAndTyp, url, candidateLoaders, loader;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, esm.assert)(!context || typeof context !== 'string', 'parse no longer accepts final url');

                if (loaders && !Array.isArray(loaders) && !(0, normalizeLoader_1.isLoaderObject)(loaders)) {
                  context = options;
                  options = loaders;
                  loaders = null;
                }

                _context.next = 4;
                return data;

              case 4:
                data = _context.sent;
                options = options || {};
                _getResourceUrlAndTyp = (0, resourceUtils.getResourceUrlAndType)(data), url = _getResourceUrlAndTyp.url;
                candidateLoaders = (0, contextUtils.getLoaders)(loaders, context);
                _context.next = 10;
                return (0, selectLoader_1.selectLoader)(data, candidateLoaders, options);

              case 10:
                loader = _context.sent;

                if (loader) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt("return", null);

              case 13:
                options = (0, optionUtils.normalizeOptions)(options, loader, candidateLoaders, url);
                context = (0, contextUtils.getLoaderContext)({
                  url: url,
                  parse: parse,
                  loaders: candidateLoaders
                }, options, context);
                _context.next = 17;
                return parseWithLoader(loader, data, options, context);

              case 17:
                return _context.abrupt("return", _context.sent);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _parse.apply(this, arguments);
    }

    function parseWithLoader(_x5, _x6, _x7, _x8) {
      return _parseWithLoader.apply(this, arguments);
    }

    function _parseWithLoader() {
      _parseWithLoader = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(loader, data, options, context) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                (0, esm.validateLoaderVersion)(loader);
                _context2.next = 3;
                return (0, getData.getArrayBufferOrStringFromData)(data, loader);

              case 3:
                data = _context2.sent;

                if (!(loader.parseTextSync && typeof data === 'string')) {
                  _context2.next = 7;
                  break;
                }

                options.dataType = 'text';
                return _context2.abrupt("return", loader.parseTextSync(data, options, context, loader));

              case 7:
                if (!(0, _parseWithWorker.canParseWithWorker)(loader, data, options, context)) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 10;
                return (0, _parseWithWorker["default"])(loader, data, options, context);

              case 10:
                return _context2.abrupt("return", _context2.sent);

              case 11:
                if (!(loader.parseText && typeof data === 'string')) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 14;
                return loader.parseText(data, options, context, loader);

              case 14:
                return _context2.abrupt("return", _context2.sent);

              case 15:
                if (!loader.parse) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 18;
                return loader.parse(data, options, context, loader);

              case 18:
                return _context2.abrupt("return", _context2.sent);

              case 19:
                (0, esm.assert)(!loader.parseSync);
                return _context2.abrupt("return", (0, esm.assert)(false));

              case 21:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _parseWithLoader.apply(this, arguments);
    }

    });

    var parseSync_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parseSync = parseSync;















    function parseSync(data, loaders, options, context) {
      (0, esm.assert)(!context || typeof context !== 'string', 'parseSync no longer accepts final url');

      if (!Array.isArray(loaders) && !(0, normalizeLoader_1.isLoaderObject)(loaders)) {
        context = options;
        options = loaders;
        loaders = null;
      }

      options = options || {};
      var candidateLoaders = (0, contextUtils.getLoaders)(loaders, context);
      var loader = (0, selectLoader_1.selectLoaderSync)(data, candidateLoaders, options);

      if (!loader) {
        return null;
      }

      options = (0, optionUtils.normalizeOptions)(options, loader, candidateLoaders);

      var _getResourceUrlAndTyp = (0, resourceUtils.getResourceUrlAndType)(data),
          url = _getResourceUrlAndTyp.url;

      context = (0, contextUtils.getLoaderContext)({
        url: url,
        parseSync: parseSync,
        loaders: loaders
      }, options);
      return parseWithLoaderSync(loader, data, options, context);
    }

    function parseWithLoaderSync(loader, data, options, context) {
      data = (0, getData.getArrayBufferOrStringFromDataSync)(data, loader);

      if (loader.parseTextSync && typeof data === 'string') {
        return loader.parseTextSync(data, options, context, loader);
      }

      if (loader.parseSync) {
        return loader.parseSync(data, options, context, loader);
      }

      throw new Error("".concat(loader.name, " loader: 'parseSync' not supported by this loader, use 'parse' instead. ").concat(context.url || ''));
    }

    });

    function _asyncGeneratorDelegate(inner, awaitWrap) {
      var iter = {},
          waiting = false;

      function pump(key, value) {
        waiting = true;
        value = new Promise(function (resolve) {
          resolve(inner[key](value));
        });
        return {
          done: false,
          value: awaitWrap(value)
        };
      }

      if (typeof Symbol === "function" && Symbol.iterator) {
        iter[Symbol.iterator] = function () {
          return this;
        };
      }

      iter.next = function (value) {
        if (waiting) {
          waiting = false;
          return value;
        }

        return pump("next", value);
      };

      if (typeof inner["throw"] === "function") {
        iter["throw"] = function (value) {
          if (waiting) {
            waiting = false;
            throw value;
          }

          return pump("throw", value);
        };
      }

      if (typeof inner["return"] === "function") {
        iter["return"] = function (value) {
          if (waiting) {
            waiting = false;
            return value;
          }

          return pump("return", value);
        };
      }

      return iter;
    }

    var asyncGeneratorDelegate = _asyncGeneratorDelegate;

    var parseInBatches_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parseInBatches = parseInBatches;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _wrapAsyncGenerator2 = interopRequireDefault(wrapAsyncGenerator);

    var _awaitAsyncGenerator2 = interopRequireDefault(awaitAsyncGenerator);

    var _asyncIterator2 = interopRequireDefault(asyncIterator);

    var _asyncGeneratorDelegate2 = interopRequireDefault(asyncGeneratorDelegate);

















    function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function parseInBatches(_x2, _x3, _x4, _x5) {
      return _parseInBatches.apply(this, arguments);
    }

    function _parseInBatches() {
      _parseInBatches = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(data, loaders, options, context) {
        var _getResourceUrlAndTyp, url, loader;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, esm.assert)(!context || typeof context !== 'string', 'parseInBatches no longer accepts final url');

                if (!Array.isArray(loaders) && !(0, normalizeLoader_1.isLoaderObject)(loaders)) {
                  context = options;
                  options = loaders;
                  loaders = null;
                }

                _context.next = 4;
                return data;

              case 4:
                data = _context.sent;
                options = options || {};
                _getResourceUrlAndTyp = (0, resourceUtils.getResourceUrlAndType)(data), url = _getResourceUrlAndTyp.url;
                _context.next = 9;
                return (0, selectLoader_1.selectLoader)(data, loaders, options);

              case 9:
                loader = _context.sent;

                if (loader) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", null);

              case 12:
                options = (0, optionUtils.normalizeOptions)(options, loader, loaders, url);
                context = (0, contextUtils.getLoaderContext)({
                  url: url,
                  parseInBatches: parseInBatches,
                  parse: parse_1.parse,
                  loaders: loaders
                }, options, context);
                _context.next = 16;
                return parseWithLoaderInBatches(loader, data, options, context);

              case 16:
                return _context.abrupt("return", _context.sent);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _parseInBatches.apply(this, arguments);
    }

    function parseWithLoaderInBatches(_x6, _x7, _x8, _x9) {
      return _parseWithLoaderInBatches.apply(this, arguments);
    }

    function _parseWithLoaderInBatches() {
      _parseWithLoaderInBatches = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(loader, data, options, context) {
        var outputIterator, metadataBatch, makeMetadataBatchIterator, _makeMetadataBatchIterator;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _makeMetadataBatchIterator = function _makeMetadataBatchIte2() {
                  _makeMetadataBatchIterator = (0, _wrapAsyncGenerator2["default"])(_regenerator["default"].mark(function _callee2(iterator) {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return metadataBatch;

                          case 2:
                            return _context2.delegateYield((0, _asyncGeneratorDelegate2["default"])((0, _asyncIterator2["default"])(iterator), _awaitAsyncGenerator2["default"]), "t0", 3);

                          case 3:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));
                  return _makeMetadataBatchIterator.apply(this, arguments);
                };

                makeMetadataBatchIterator = function _makeMetadataBatchIte(_x) {
                  return _makeMetadataBatchIterator.apply(this, arguments);
                };

                _context3.next = 4;
                return parseToOutputIterator(loader, data, options, context);

              case 4:
                outputIterator = _context3.sent;

                if (options.metadata) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return", outputIterator);

              case 7:
                metadataBatch = {
                  batchType: 'metadata',
                  metadata: {
                    _loader: loader,
                    _context: context
                  },
                  data: [],
                  bytesUsed: 0
                };
                return _context3.abrupt("return", makeMetadataBatchIterator(outputIterator));

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _parseWithLoaderInBatches.apply(this, arguments);
    }

    function parseToOutputIterator(_x10, _x11, _x12, _x13) {
      return _parseToOutputIterator.apply(this, arguments);
    }

    function _parseToOutputIterator() {
      _parseToOutputIterator = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee5(loader, data, options, context) {
        var inputIterator, iteratorChain, stream, parseChunkInBatches, _parseChunkInBatches;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _parseChunkInBatches = function _parseChunkInBatches3() {
                  _parseChunkInBatches = (0, _wrapAsyncGenerator2["default"])(_regenerator["default"].mark(function _callee4() {
                    var inputIterator, arrayBuffer;
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return (0, _awaitAsyncGenerator2["default"])((0, getData.getAsyncIteratorFromData)(data));

                          case 2:
                            inputIterator = _context4.sent;
                            _context4.next = 5;
                            return (0, _awaitAsyncGenerator2["default"])((0, esm.concatenateChunksAsync)(inputIterator));

                          case 5:
                            arrayBuffer = _context4.sent;
                            _context4.next = 8;
                            return loader.parse(arrayBuffer, options, context, loader);

                          case 8:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));
                  return _parseChunkInBatches.apply(this, arguments);
                };

                parseChunkInBatches = function _parseChunkInBatches2() {
                  return _parseChunkInBatches.apply(this, arguments);
                };

                if (!loader.parseInBatches) {
                  _context5.next = 10;
                  break;
                }

                _context5.next = 5;
                return (0, getData.getAsyncIteratorFromData)(data);

              case 5:
                inputIterator = _context5.sent;
                iteratorChain = applyInputTransforms(inputIterator, options);
                _context5.next = 9;
                return loader.parseInBatches(iteratorChain, options, context, loader);

              case 9:
                return _context5.abrupt("return", _context5.sent);

              case 10:
                if (!loader.parseStreamInBatches) {
                  _context5.next = 17;
                  break;
                }

                _context5.next = 13;
                return (0, getData.getReadableStream)(data);

              case 13:
                stream = _context5.sent;

                if (!stream) {
                  _context5.next = 17;
                  break;
                }

                if (options.transforms) {
                  console.warn('options.transforms not implemented for loaders that use `parseStreamInBatches`');
                }

                return _context5.abrupt("return", loader.parseStreamInBatches(stream, options, context));

              case 17:
                _context5.next = 19;
                return parseChunkInBatches();

              case 19:
                return _context5.abrupt("return", _context5.sent);

              case 20:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));
      return _parseToOutputIterator.apply(this, arguments);
    }

    function applyInputTransforms(inputIterator, options) {
      var iteratorChain = inputIterator;

      var _iterator = _createForOfIteratorHelper(options.transforms || []),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var Transform = _step.value;
          iteratorChain = (0, esm.makeTransformIterator)(iteratorChain, Transform, options);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return iteratorChain;
    }

    });

    var load_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.load = load;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);









    function load(_x, _x2, _x3) {
      return _load.apply(this, arguments);
    }

    function _load() {
      _load = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(url, loaders, options) {
        var fetch, data;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!Array.isArray(loaders) && !(0, normalizeLoader_1.isLoaderObject)(loaders)) {
                  options = loaders;
                  loaders = null;
                }

                fetch = (0, optionUtils.getFetchFunction)(options || {});
                data = url;

                if (!(typeof url === 'string')) {
                  _context.next = 9;
                  break;
                }

                _context.next = 6;
                return fetch(url);

              case 6:
                data = _context.sent;
                _context.next = 10;
                break;

              case 9:
                url = null;

              case 10:
                if (!(0, isType.isBlob)(url)) {
                  _context.next = 15;
                  break;
                }

                _context.next = 13;
                return fetch(url);

              case 13:
                data = _context.sent;
                url = null;

              case 15:
                _context.next = 17;
                return (0, parse_1.parse)(data, loaders, options);

              case 17:
                return _context.abrupt("return", _context.sent);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _load.apply(this, arguments);
    }

    });

    var loadInBatches_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.loadInBatches = loadInBatches;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);







    function loadInBatches(files, loaders, options) {
      if (!Array.isArray(loaders) && !(0, normalizeLoader_1.isLoaderObject)(loaders)) {
        options = loaders;
        loaders = null;
      }

      var fetch = (0, optionUtils.getFetchFunction)(options || {});

      if (!Array.isArray(files)) {
        return loadOneFileInBatches(files, loaders, options, fetch);
      }

      var promises = files.map(function (file) {
        return loadOneFileInBatches(file, loaders, options, fetch);
      });
      return promises;
    }

    function loadOneFileInBatches(_x, _x2, _x3, _x4) {
      return _loadOneFileInBatches.apply(this, arguments);
    }

    function _loadOneFileInBatches() {
      _loadOneFileInBatches = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(file, loaders, options, fetch) {
        var url, response;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(typeof file === 'string')) {
                  _context.next = 8;
                  break;
                }

                url = file;
                _context.next = 4;
                return fetch(url);

              case 4:
                response = _context.sent;
                _context.next = 7;
                return (0, parseInBatches_1.parseInBatches)(response, loaders, options);

              case 7:
                return _context.abrupt("return", _context.sent);

              case 8:
                _context.next = 10;
                return (0, parseInBatches_1.parseInBatches)(file, loaders, options);

              case 10:
                return _context.abrupt("return", _context.sent);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _loadOneFileInBatches.apply(this, arguments);
    }

    });

    var encode_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.encode = encode;
    exports.encodeSync = encodeSync;
    exports.encodeText = encodeText;
    exports.encodeInBatches = encodeInBatches;
    exports.encodeURLtoURL = encodeURLtoURL;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _asyncIterator2 = interopRequireDefault(asyncIterator);







    function getTemporaryFilename(filename) {
      return "/tmp/".concat(filename);
    }

    function encode(_x, _x2, _x3, _x4) {
      return _encode.apply(this, arguments);
    }

    function _encode() {
      _encode = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(data, writer, options, url) {
        var batches, chunks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, batch, tmpInputFilename, tmpOutputFilename, outputFilename, response;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!writer.encode) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return writer.encode(data, options);

              case 3:
                return _context.abrupt("return", _context.sent);

              case 4:
                if (!writer.encodeSync) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", writer.encodeSync(data, options));

              case 6:
                if (!writer.encodeText) {
                  _context.next = 12;
                  break;
                }

                _context.t0 = new TextEncoder();
                _context.next = 10;
                return writer.encodeText(data, options);

              case 10:
                _context.t1 = _context.sent;
                return _context.abrupt("return", _context.t0.encode.call(_context.t0, _context.t1));

              case 12:
                if (!writer.encodeInBatches) {
                  _context.next = 51;
                  break;
                }

                batches = encodeInBatches(data, writer, options);
                chunks = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 17;
                _iterator = (0, _asyncIterator2["default"])(batches);

              case 19:
                _context.next = 21;
                return _iterator.next();

              case 21:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 25;
                return _step.value;

              case 25:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 32;
                  break;
                }

                batch = _value;
                chunks.push(batch);

              case 29:
                _iteratorNormalCompletion = true;
                _context.next = 19;
                break;

              case 32:
                _context.next = 38;
                break;

              case 34:
                _context.prev = 34;
                _context.t2 = _context["catch"](17);
                _didIteratorError = true;
                _iteratorError = _context.t2;

              case 38:
                _context.prev = 38;
                _context.prev = 39;

                if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                  _context.next = 43;
                  break;
                }

                _context.next = 43;
                return _iterator["return"]();

              case 43:
                _context.prev = 43;

                if (!_didIteratorError) {
                  _context.next = 46;
                  break;
                }

                throw _iteratorError;

              case 46:
                return _context.finish(43);

              case 47:
                return _context.finish(38);

              case 48:
                _context.next = 50;
                return esm.concatenateArrayBuffers.apply(void 0, chunks);

              case 50:
                return _context.abrupt("return", _context.sent);

              case 51:
                if (!(!esm.isBrowser && writer.encodeURLtoURL)) {
                  _context.next = 63;
                  break;
                }

                tmpInputFilename = getTemporaryFilename('input');
                _context.next = 55;
                return (0, writeFile_1.writeFile)(tmpInputFilename, data);

              case 55:
                tmpOutputFilename = getTemporaryFilename('output');
                _context.next = 58;
                return encodeURLtoURL(tmpInputFilename, tmpOutputFilename, writer, options);

              case 58:
                outputFilename = _context.sent;
                _context.next = 61;
                return (0, fetchFile_1.fetchFile)(outputFilename);

              case 61:
                response = _context.sent;
                return _context.abrupt("return", response.arrayBuffer());

              case 63:
                throw new Error('Writer could not encode data');

              case 64:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[17, 34, 38, 48], [39,, 43, 47]]);
      }));
      return _encode.apply(this, arguments);
    }

    function encodeSync(data, writer, options, url) {
      if (writer.encodeSync) {
        return writer.encodeSync(data, options);
      }

      throw new Error('Writer could not synchronously encode data');
    }

    function encodeText(_x5, _x6, _x7, _x8) {
      return _encodeText.apply(this, arguments);
    }

    function _encodeText() {
      _encodeText = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(data, writer, options, url) {
        var arrayBuffer;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(writer.text && writer.encodeText)) {
                  _context2.next = 4;
                  break;
                }

                _context2.next = 3;
                return writer.encodeText(data, options);

              case 3:
                return _context2.abrupt("return", _context2.sent);

              case 4:
                if (!(writer.text && (writer.encode || writer.encodeInBatches))) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 7;
                return encode(data, writer, options);

              case 7:
                arrayBuffer = _context2.sent;
                return _context2.abrupt("return", new TextDecoder().decode(arrayBuffer));

              case 9:
                throw new Error('Writer could not encode data as text');

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _encodeText.apply(this, arguments);
    }

    function encodeInBatches(data, writer, options, url) {
      if (writer.encodeInBatches) {
        var dataIterator = getIterator(data);
        return writer.encodeInBatches(dataIterator, options);
      }

      throw new Error('Writer could not encode data in batches');
    }

    function getIterator(data) {
      var dataIterator = [{
        table: data,
        start: 0,
        end: data.length
      }];
      return dataIterator;
    }

    function encodeURLtoURL(_x9, _x10, _x11, _x12) {
      return _encodeURLtoURL.apply(this, arguments);
    }

    function _encodeURLtoURL() {
      _encodeURLtoURL = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(inputUrl, outputUrl, writer, options) {
        var outputFilename;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                inputUrl = (0, esm.resolvePath)(inputUrl);
                outputUrl = (0, esm.resolvePath)(outputUrl);

                if (!(esm.isBrowser || !writer.encodeURLtoURL)) {
                  _context3.next = 4;
                  break;
                }

                throw new Error();

              case 4:
                _context3.next = 6;
                return writer.encodeURLtoURL(inputUrl, outputUrl, options);

              case 6:
                outputFilename = _context3.sent;
                return _context3.abrupt("return", outputFilename);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _encodeURLtoURL.apply(this, arguments);
    }

    });

    var save_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.save = save;
    exports.saveSync = saveSync;





    function save(data, url, writer, options) {
      var encodedData = (0, encode_1.encode)(data, writer, options, url);
      return (0, writeFile_1.writeFile)(url, encodedData);
    }

    function saveSync(data, url, writer, options) {
      var encodedData = (0, encode_1.encodeSync)(data, writer, options, url);
      return (0, writeFile_1.writeFileSync)(url, encodedData);
    }

    });

    var nullLoader = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.NullLoader = void 0;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _wrapAsyncGenerator2 = interopRequireDefault(wrapAsyncGenerator);

    var _awaitAsyncGenerator2 = interopRequireDefault(awaitAsyncGenerator);

    var _asyncIterator2 = interopRequireDefault(asyncIterator);

    var _asyncGeneratorDelegate2 = interopRequireDefault(asyncGeneratorDelegate);

    var VERSION = "2.3.12" ;
    var NullLoader = {
      id: 'image',
      name: 'Images',
      version: VERSION,
      mimeTypes: ['application/x.empty'],
      extensions: ['null'],
      parse: function () {
        var _parse = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(arrayBuffer, options) {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", arrayBuffer);

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function parse(_x, _x2) {
          return _parse.apply(this, arguments);
        }

        return parse;
      }(),
      parseSync: function parseSync(arrayBuffer, options) {
        return arrayBuffer;
      },
      parseInBatches: function () {
        var _parseInBatches2 = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(asyncIterator, options) {
          return _regenerator["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt("return", function () {
                    var _parseInBatches = (0, _wrapAsyncGenerator2["default"])(_regenerator["default"].mark(function _callee2() {
                      return _regenerator["default"].wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              return _context2.delegateYield((0, _asyncGeneratorDelegate2["default"])((0, _asyncIterator2["default"])(asyncIterator), _awaitAsyncGenerator2["default"]), "t0", 1);

                            case 1:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    function parseInBatches() {
                      return _parseInBatches.apply(this, arguments);
                    }

                    return parseInBatches;
                  }()());

                case 1:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function parseInBatches(_x3, _x4) {
          return _parseInBatches2.apply(this, arguments);
        }

        return parseInBatches;
      }(),
      tests: [function () {
        return false;
      }],
      options: {}
    };
    exports.NullLoader = NullLoader;

    });

    var fetchProgress_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = fetchProgress;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    function fetchProgress(_x, _x2) {
      return _fetchProgress.apply(this, arguments);
    }

    function _fetchProgress() {
      _fetchProgress = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(response, onProgress) {
        var onDone,
            onError,
            body,
            contentLength,
            totalBytes,
            progressStream,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                onDone = _args.length > 2 && _args[2] !== undefined ? _args[2] : function () {};
                onError = _args.length > 3 && _args[3] !== undefined ? _args[3] : function () {};
                _context.next = 4;
                return response;

              case 4:
                response = _context.sent;

                if (response.ok) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", response);

              case 7:
                body = response.body;

                if (body) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("return", response);

              case 10:
                contentLength = response.headers.get('content-length');
                totalBytes = contentLength && parseInt(contentLength, 10);

                if (contentLength > 0) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt("return", response);

              case 14:
                if (!(typeof ReadableStream === 'undefined' || !body.getReader)) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt("return", response);

              case 16:
                progressStream = new ReadableStream({
                  start: function start(controller) {
                    var reader = body.getReader();
                    read(controller, reader, 0, totalBytes, onProgress, onDone, onError);
                  }
                });
                return _context.abrupt("return", new Response(progressStream));

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _fetchProgress.apply(this, arguments);
    }

    function read(_x3, _x4, _x5, _x6, _x7, _x8, _x9) {
      return _read.apply(this, arguments);
    }

    function _read() {
      _read = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(controller, reader, loadedBytes, totalBytes, onProgress, onDone, onError) {
        var _yield$reader$read, done, value, percent;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return reader.read();

              case 3:
                _yield$reader$read = _context2.sent;
                done = _yield$reader$read.done;
                value = _yield$reader$read.value;

                if (!done) {
                  _context2.next = 10;
                  break;
                }

                onDone();
                controller.close();
                return _context2.abrupt("return");

              case 10:
                loadedBytes += value.byteLength;
                percent = Math.round(loadedBytes / totalBytes * 100);
                onProgress(percent, {
                  loadedBytes: loadedBytes,
                  totalBytes: totalBytes
                });
                controller.enqueue(value);
                _context2.next = 16;
                return read(controller, reader, loadedBytes, totalBytes, onProgress, onDone, onError);

              case 16:
                _context2.next = 22;
                break;

              case 18:
                _context2.prev = 18;
                _context2.t0 = _context2["catch"](0);
                controller.error(_context2.t0);
                onError(_context2.t0);

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 18]]);
      }));
      return _read.apply(this, arguments);
    }

    });

    var browserFilesystem = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _classCallCheck2 = interopRequireDefault(classCallCheck);

    var _createClass2 = interopRequireDefault(createClass);

    var BrowserFileSystem = function () {
      function BrowserFileSystem(files) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        (0, _classCallCheck2["default"])(this, BrowserFileSystem);
        this._fetch = options.fetch || fetch;
        this.files = {};

        for (var i = 0; i < files.length; ++i) {
          var file = files[i];
          this.files[file.name] = file;
        }

        this.fetch = this.fetch.bind(this);
      }

      (0, _createClass2["default"])(BrowserFileSystem, [{
        key: "fetch",
        value: function () {
          var _fetch = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(path) {
            var options,
                fallbackFetch,
                file,
                response,
                _args = arguments;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

                    if (!path.includes('://')) {
                      _context.next = 4;
                      break;
                    }

                    fallbackFetch = options.fetch || this._fetch;
                    return _context.abrupt("return", fallbackFetch(path, options));

                  case 4:
                    file = this.files[path];

                    if (!file) {
                      _context.next = 9;
                      break;
                    }

                    response = new Response(this.files[path]);
                    Object.defineProperty(response, 'url', {
                      value: path
                    });
                    return _context.abrupt("return", response);

                  case 9:
                    return _context.abrupt("return", new Response(path, {
                      status: 400,
                      statusText: 'NOT FOUND'
                    }));

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function fetch(_x) {
            return _fetch.apply(this, arguments);
          }

          return fetch;
        }()
      }, {
        key: "readdir",
        value: function () {
          var _readdir = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2() {
            var files, path;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    files = [];

                    for (path in this.files) {
                      files.push(path);
                    }

                    return _context2.abrupt("return", files);

                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function readdir() {
            return _readdir.apply(this, arguments);
          }

          return readdir;
        }()
      }, {
        key: "stat",
        value: function () {
          var _stat = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(path, options) {
            var file;
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    file = this.files[path];

                    if (file) {
                      _context3.next = 3;
                      break;
                    }

                    throw new Error("No such file: ".concat(path));

                  case 3:
                    return _context3.abrupt("return", {
                      size: file.size
                    });

                  case 4:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          function stat(_x2, _x3) {
            return _stat.apply(this, arguments);
          }

          return stat;
        }()
      }, {
        key: "unlink",
        value: function () {
          var _unlink = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee4(pathname) {
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    delete this.files[pathname];

                  case 1:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));

          function unlink(_x4) {
            return _unlink.apply(this, arguments);
          }

          return unlink;
        }()
      }, {
        key: "open",
        value: function () {
          var _open = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee5(pathname) {
            return _regenerator["default"].wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    return _context5.abrupt("return", this.files[pathname]);

                  case 1:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));

          function open(_x5) {
            return _open.apply(this, arguments);
          }

          return open;
        }()
      }, {
        key: "read",
        value: function () {
          var _read = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee6(fd, _ref) {
            var _ref$buffer, buffer, _ref$length, length, _ref$position, position, file, arrayBuffer;

            return _regenerator["default"].wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _ref$buffer = _ref.buffer, buffer = _ref$buffer === void 0 ? null : _ref$buffer, _ref.offset, _ref$length = _ref.length, length = _ref$length === void 0 ? buffer.byteLength : _ref$length, _ref$position = _ref.position, position = _ref$position === void 0 ? null : _ref$position;
                    file = fd;
                    _context6.next = 4;
                    return readFileSlice(file, position, position + length);

                  case 4:
                    arrayBuffer = _context6.sent;
                    return _context6.abrupt("return", arrayBuffer);

                  case 6:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6);
          }));

          function read(_x6, _x7) {
            return _read.apply(this, arguments);
          }

          return read;
        }()
      }, {
        key: "close",
        value: function () {
          var _close = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee7(fd) {
            return _regenerator["default"].wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7);
          }));

          function close(_x8) {
            return _close.apply(this, arguments);
          }

          return close;
        }()
      }]);
      return BrowserFileSystem;
    }();

    exports["default"] = BrowserFileSystem;

    function readFileSlice(_x9, _x10, _x11) {
      return _readFileSlice.apply(this, arguments);
    }

    function _readFileSlice() {
      _readFileSlice = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee8(file, start, end) {
        var slice;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                slice = file.slice(start, end);
                _context8.next = 3;
                return new Promise(function (resolve, reject) {
                  var fileReader = new FileReader();

                  fileReader.onload = function (event) {
                    return resolve(event.target && event.target.result);
                  };

                  fileReader.onerror = function (error) {
                    return reject(error);
                  };

                  fileReader.readAsArrayBuffer(slice);
                });

              case 3:
                return _context8.abrupt("return", _context8.sent);

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));
      return _readFileSlice.apply(this, arguments);
    }

    });

    var es5 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "fetchFile", {
      enumerable: true,
      get: function get() {
        return fetchFile_1.fetchFile;
      }
    });
    Object.defineProperty(exports, "readFileSync", {
      enumerable: true,
      get: function get() {
        return readFile.readFileSync;
      }
    });
    Object.defineProperty(exports, "writeFile", {
      enumerable: true,
      get: function get() {
        return writeFile_1.writeFile;
      }
    });
    Object.defineProperty(exports, "writeFileSync", {
      enumerable: true,
      get: function get() {
        return writeFile_1.writeFileSync;
      }
    });
    Object.defineProperty(exports, "setLoaderOptions", {
      enumerable: true,
      get: function get() {
        return setLoaderOptions_1.setLoaderOptions;
      }
    });
    Object.defineProperty(exports, "registerLoaders", {
      enumerable: true,
      get: function get() {
        return registerLoaders_1.registerLoaders;
      }
    });
    Object.defineProperty(exports, "_unregisterLoaders", {
      enumerable: true,
      get: function get() {
        return registerLoaders_1._unregisterLoaders;
      }
    });
    Object.defineProperty(exports, "parse", {
      enumerable: true,
      get: function get() {
        return parse_1.parse;
      }
    });
    Object.defineProperty(exports, "parseSync", {
      enumerable: true,
      get: function get() {
        return parseSync_1.parseSync;
      }
    });
    Object.defineProperty(exports, "parseInBatches", {
      enumerable: true,
      get: function get() {
        return parseInBatches_1.parseInBatches;
      }
    });
    Object.defineProperty(exports, "selectLoader", {
      enumerable: true,
      get: function get() {
        return selectLoader_1.selectLoader;
      }
    });
    Object.defineProperty(exports, "selectLoaderSync", {
      enumerable: true,
      get: function get() {
        return selectLoader_1.selectLoaderSync;
      }
    });
    Object.defineProperty(exports, "load", {
      enumerable: true,
      get: function get() {
        return load_1.load;
      }
    });
    Object.defineProperty(exports, "loadInBatches", {
      enumerable: true,
      get: function get() {
        return loadInBatches_1.loadInBatches;
      }
    });
    Object.defineProperty(exports, "encode", {
      enumerable: true,
      get: function get() {
        return encode_1.encode;
      }
    });
    Object.defineProperty(exports, "encodeSync", {
      enumerable: true,
      get: function get() {
        return encode_1.encodeSync;
      }
    });
    Object.defineProperty(exports, "encodeInBatches", {
      enumerable: true,
      get: function get() {
        return encode_1.encodeInBatches;
      }
    });
    Object.defineProperty(exports, "encodeText", {
      enumerable: true,
      get: function get() {
        return encode_1.encodeText;
      }
    });
    Object.defineProperty(exports, "encodeURLtoURL", {
      enumerable: true,
      get: function get() {
        return encode_1.encodeURLtoURL;
      }
    });
    Object.defineProperty(exports, "save", {
      enumerable: true,
      get: function get() {
        return save_1.save;
      }
    });
    Object.defineProperty(exports, "saveSync", {
      enumerable: true,
      get: function get() {
        return save_1.saveSync;
      }
    });
    Object.defineProperty(exports, "makeIterator", {
      enumerable: true,
      get: function get() {
        return makeIterator_1.makeIterator;
      }
    });
    Object.defineProperty(exports, "NullLoader", {
      enumerable: true,
      get: function get() {
        return nullLoader.NullLoader;
      }
    });
    Object.defineProperty(exports, "setPathPrefix", {
      enumerable: true,
      get: function get() {
        return esm.setPathPrefix;
      }
    });
    Object.defineProperty(exports, "getPathPrefix", {
      enumerable: true,
      get: function get() {
        return esm.getPathPrefix;
      }
    });
    Object.defineProperty(exports, "resolvePath", {
      enumerable: true,
      get: function get() {
        return esm.resolvePath;
      }
    });
    Object.defineProperty(exports, "RequestScheduler", {
      enumerable: true,
      get: function get() {
        return esm.RequestScheduler;
      }
    });
    Object.defineProperty(exports, "isBrowser", {
      enumerable: true,
      get: function get() {
        return esm.isBrowser;
      }
    });
    Object.defineProperty(exports, "isWorker", {
      enumerable: true,
      get: function get() {
        return esm.isWorker;
      }
    });
    Object.defineProperty(exports, "self", {
      enumerable: true,
      get: function get() {
        return esm.self;
      }
    });
    Object.defineProperty(exports, "window", {
      enumerable: true,
      get: function get() {
        return esm.window;
      }
    });
    Object.defineProperty(exports, "global", {
      enumerable: true,
      get: function get() {
        return esm.global;
      }
    });
    Object.defineProperty(exports, "document", {
      enumerable: true,
      get: function get() {
        return esm.document;
      }
    });
    Object.defineProperty(exports, "assert", {
      enumerable: true,
      get: function get() {
        return esm.assert;
      }
    });
    Object.defineProperty(exports, "forEach", {
      enumerable: true,
      get: function get() {
        return esm.forEach;
      }
    });
    Object.defineProperty(exports, "concatenateChunksAsync", {
      enumerable: true,
      get: function get() {
        return esm.concatenateChunksAsync;
      }
    });
    Object.defineProperty(exports, "makeTextDecoderIterator", {
      enumerable: true,
      get: function get() {
        return esm.makeTextDecoderIterator;
      }
    });
    Object.defineProperty(exports, "makeTextEncoderIterator", {
      enumerable: true,
      get: function get() {
        return esm.makeTextEncoderIterator;
      }
    });
    Object.defineProperty(exports, "makeLineIterator", {
      enumerable: true,
      get: function get() {
        return esm.makeLineIterator;
      }
    });
    Object.defineProperty(exports, "makeNumberedLineIterator", {
      enumerable: true,
      get: function get() {
        return esm.makeNumberedLineIterator;
      }
    });
    Object.defineProperty(exports, "_fetchProgress", {
      enumerable: true,
      get: function get() {
        return _fetchProgress["default"];
      }
    });
    Object.defineProperty(exports, "_BrowserFileSystem", {
      enumerable: true,
      get: function get() {
        return _browserFilesystem["default"];
      }
    });
    Object.defineProperty(exports, "isPromise", {
      enumerable: true,
      get: function get() {
        return isType.isPromise;
      }
    });
    Object.defineProperty(exports, "isIterable", {
      enumerable: true,
      get: function get() {
        return isType.isIterable;
      }
    });
    Object.defineProperty(exports, "isAsyncIterable", {
      enumerable: true,
      get: function get() {
        return isType.isAsyncIterable;
      }
    });
    Object.defineProperty(exports, "isIterator", {
      enumerable: true,
      get: function get() {
        return isType.isIterator;
      }
    });
    Object.defineProperty(exports, "isResponse", {
      enumerable: true,
      get: function get() {
        return isType.isResponse;
      }
    });
    Object.defineProperty(exports, "isReadableStream", {
      enumerable: true,
      get: function get() {
        return isType.isReadableStream;
      }
    });
    Object.defineProperty(exports, "isWritableStream", {
      enumerable: true,
      get: function get() {
        return isType.isWritableStream;
      }
    });



































    var _fetchProgress = interopRequireDefault(fetchProgress_1);

    var _browserFilesystem = interopRequireDefault(browserFilesystem);



    });

    var index = /*@__PURE__*/unwrapExports(es5);

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    var arrayWithHoles = _arrayWithHoles;

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    var iterableToArrayLimit = _iterableToArrayLimit;

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var nonIterableRest = _nonIterableRest;

    function _slicedToArray(arr, i) {
      return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
    }

    var slicedToArray = _slicedToArray;

    class Martini {
        constructor(gridSize = 257) {
            this.gridSize = gridSize;
            const tileSize = gridSize - 1;
            if (tileSize & (tileSize - 1)) throw new Error(
                `Expected grid size to be 2^n+1, got ${gridSize}.`);

            this.numTriangles = tileSize * tileSize * 2 - 2;
            this.numParentTriangles = this.numTriangles - tileSize * tileSize;

            this.indices = new Uint32Array(this.gridSize * this.gridSize);

            // coordinates for all possible triangles in an RTIN tile
            this.coords = new Uint16Array(this.numTriangles * 4);

            // get triangle coordinates from its index in an implicit binary tree
            for (let i = 0; i < this.numTriangles; i++) {
                let id = i + 2;
                let ax = 0, ay = 0, bx = 0, by = 0, cx = 0, cy = 0;
                if (id & 1) {
                    bx = by = cx = tileSize; // bottom-left triangle
                } else {
                    ax = ay = cy = tileSize; // top-right triangle
                }
                while ((id >>= 1) > 1) {
                    const mx = (ax + bx) >> 1;
                    const my = (ay + by) >> 1;

                    if (id & 1) { // left half
                        bx = ax; by = ay;
                        ax = cx; ay = cy;
                    } else { // right half
                        ax = bx; ay = by;
                        bx = cx; by = cy;
                    }
                    cx = mx; cy = my;
                }
                const k = i * 4;
                this.coords[k + 0] = ax;
                this.coords[k + 1] = ay;
                this.coords[k + 2] = bx;
                this.coords[k + 3] = by;
            }
        }

        createTile(terrain) {
            return new Tile(terrain, this);
        }
    }

    class Tile {
        constructor(terrain, martini) {
            const size = martini.gridSize;
            if (terrain.length !== size * size) throw new Error(
                `Expected terrain data of length ${size * size} (${size} x ${size}), got ${terrain.length}.`);

            this.terrain = terrain;
            this.martini = martini;
            this.errors = new Float32Array(terrain.length);
            this.update();
        }

        update() {
            const {numTriangles, numParentTriangles, coords, gridSize: size} = this.martini;
            const {terrain, errors} = this;

            // iterate over all possible triangles, starting from the smallest level
            for (let i = numTriangles - 1; i >= 0; i--) {
                const k = i * 4;
                const ax = coords[k + 0];
                const ay = coords[k + 1];
                const bx = coords[k + 2];
                const by = coords[k + 3];
                const mx = (ax + bx) >> 1;
                const my = (ay + by) >> 1;
                const cx = mx + my - ay;
                const cy = my + ax - mx;

                // calculate error in the middle of the long edge of the triangle
                const interpolatedHeight = (terrain[ay * size + ax] + terrain[by * size + bx]) / 2;
                const middleIndex = my * size + mx;
                const middleError = Math.abs(interpolatedHeight - terrain[middleIndex]);

                errors[middleIndex] = Math.max(errors[middleIndex], middleError);

                if (i < numParentTriangles) { // bigger triangles; accumulate error with children
                    const leftChildIndex = ((ay + cy) >> 1) * size + ((ax + cx) >> 1);
                    const rightChildIndex = ((by + cy) >> 1) * size + ((bx + cx) >> 1);
                    errors[middleIndex] = Math.max(errors[middleIndex], errors[leftChildIndex], errors[rightChildIndex]);
                }
            }
        }

        getMesh(maxError = 0) {
            const {gridSize: size, indices} = this.martini;
            const {errors} = this;
            let numVertices = 0;
            let numTriangles = 0;
            const max = size - 1;

            // use an index grid to keep track of vertices that were already used to avoid duplication
            indices.fill(0);

            // retrieve mesh in two stages that both traverse the error map:
            // - countElements: find used vertices (and assign each an index), and count triangles (for minimum allocation)
            // - processTriangle: fill the allocated vertices & triangles typed arrays

            function countElements(ax, ay, bx, by, cx, cy) {
                const mx = (ax + bx) >> 1;
                const my = (ay + by) >> 1;

                if (Math.abs(ax - cx) + Math.abs(ay - cy) > 1 && errors[my * size + mx] > maxError) {
                    countElements(cx, cy, ax, ay, mx, my);
                    countElements(bx, by, cx, cy, mx, my);
                } else {
                    indices[ay * size + ax] = indices[ay * size + ax] || ++numVertices;
                    indices[by * size + bx] = indices[by * size + bx] || ++numVertices;
                    indices[cy * size + cx] = indices[cy * size + cx] || ++numVertices;
                    numTriangles++;
                }
            }
            countElements(0, 0, max, max, max, 0);
            countElements(max, max, 0, 0, 0, max);

            const vertices = new Uint16Array(numVertices * 2);
            const triangles = new Uint32Array(numTriangles * 3);
            let triIndex = 0;

            function processTriangle(ax, ay, bx, by, cx, cy) {
                const mx = (ax + bx) >> 1;
                const my = (ay + by) >> 1;

                if (Math.abs(ax - cx) + Math.abs(ay - cy) > 1 && errors[my * size + mx] > maxError) {
                    // triangle doesn't approximate the surface well enough; drill down further
                    processTriangle(cx, cy, ax, ay, mx, my);
                    processTriangle(bx, by, cx, cy, mx, my);

                } else {
                    // add a triangle
                    const a = indices[ay * size + ax] - 1;
                    const b = indices[by * size + bx] - 1;
                    const c = indices[cy * size + cx] - 1;

                    vertices[2 * a] = ax;
                    vertices[2 * a + 1] = ay;

                    vertices[2 * b] = bx;
                    vertices[2 * b + 1] = by;

                    vertices[2 * c] = cx;
                    vertices[2 * c + 1] = cy;

                    triangles[triIndex++] = a;
                    triangles[triIndex++] = b;
                    triangles[triIndex++] = c;
                }
            }
            processTriangle(0, 0, max, max, max, 0);
            processTriangle(max, max, 0, 0, 0, max);

            return {vertices, triangles};
        }
    }

    var parseTerrain = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = loadTerrain;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _slicedToArray2 = interopRequireDefault(slicedToArray);

    var _martini = interopRequireDefault(Martini);



    function getTerrain(imageData, tileSize, elevationDecoder) {
      var rScaler = elevationDecoder.rScaler,
          bScaler = elevationDecoder.bScaler,
          gScaler = elevationDecoder.gScaler,
          offset = elevationDecoder.offset;
      var gridSize = tileSize + 1;
      var terrain = new Float32Array(gridSize * gridSize);

      for (var i = 0, y = 0; y < tileSize; y++) {
        for (var x = 0; x < tileSize; x++, i++) {
          var k = i * 4;
          var r = imageData[k + 0];
          var g = imageData[k + 1];
          var b = imageData[k + 2];
          terrain[i + y] = r * rScaler + g * gScaler + b * bScaler + offset;
        }
      }

      for (var _i = gridSize * (gridSize - 1), _x = 0; _x < gridSize - 1; _x++, _i++) {
        terrain[_i] = terrain[_i - gridSize];
      }

      for (var _i2 = gridSize - 1, _y = 0; _y < gridSize; _y++, _i2 += gridSize) {
        terrain[_i2] = terrain[_i2 - 1];
      }

      return terrain;
    }

    function getMeshAttributes(vertices, terrain, tileSize, bounds) {
      var gridSize = tileSize + 1;
      var numOfVerticies = vertices.length / 2;
      var positions = new Float32Array(numOfVerticies * 3);
      var texCoords = new Float32Array(numOfVerticies * 2);

      var _ref = bounds || [0, 0, tileSize, tileSize],
          _ref2 = (0, _slicedToArray2["default"])(_ref, 4),
          minX = _ref2[0],
          minY = _ref2[1],
          maxX = _ref2[2],
          maxY = _ref2[3];

      var xScale = (maxX - minX) / tileSize;
      var yScale = (maxY - minY) / tileSize;

      for (var i = 0; i < numOfVerticies; i++) {
        var x = vertices[i * 2];
        var y = vertices[i * 2 + 1];
        var pixelIdx = y * gridSize + x;
        positions[3 * i + 0] = x * xScale + minX;
        positions[3 * i + 1] = -y * yScale + maxY;
        positions[3 * i + 2] = terrain[pixelIdx];
        texCoords[2 * i + 0] = x / tileSize;
        texCoords[2 * i + 1] = y / tileSize;
      }

      return {
        POSITION: {
          value: positions,
          size: 3
        },
        TEXCOORD_0: {
          value: texCoords,
          size: 2
        }
      };
    }

    function getMartiniTileMesh(terrainImage, terrainOptions) {
      if (terrainImage === null) {
        return null;
      }

      var meshMaxError = terrainOptions.meshMaxError,
          bounds = terrainOptions.bounds,
          elevationDecoder = terrainOptions.elevationDecoder;
      var data = terrainImage.data;
      var tileSize = terrainImage.width;
      var gridSize = tileSize + 1;
      var terrain = getTerrain(data, tileSize, elevationDecoder);
      var martini = new _martini["default"](gridSize);
      var tile = martini.createTile(terrain);

      var _tile$getMesh = tile.getMesh(meshMaxError),
          vertices = _tile$getMesh.vertices,
          triangles = _tile$getMesh.triangles;

      var attributes = getMeshAttributes(vertices, terrain, tileSize, bounds);
      return {
        loaderData: {
          header: {}
        },
        header: {
          vertexCount: triangles.length,
          boundingBox: (0, esm.getMeshBoundingBox)(attributes)
        },
        mode: 4,
        indices: {
          value: triangles,
          size: 1
        },
        attributes: attributes
      };
    }

    function loadTerrain(_x2, _x3, _x4) {
      return _loadTerrain.apply(this, arguments);
    }

    function _loadTerrain() {
      _loadTerrain = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(arrayBuffer, options, context) {
        var image;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options.image = options.image || {};
                options.image.type = 'data';
                _context.next = 4;
                return context.parse(arrayBuffer, options, options.baseUri);

              case 4:
                image = _context.sent;
                return _context.abrupt("return", getMartiniTileMesh(image, options.terrain));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _loadTerrain.apply(this, arguments);
    }

    });

    var terrainLoader = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TerrainLoader = exports.TerrainWorkerLoader = void 0;

    var _defineProperty2 = interopRequireDefault(defineProperty);

    var _parseTerrain = interopRequireDefault(parseTerrain);

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var VERSION = "2.3.12" ;
    var TerrainWorkerLoader = {
      id: 'terrain',
      name: 'Terrain',
      version: VERSION,
      extensions: ['png', 'pngraw'],
      mimeTypes: ['image/png'],
      options: {
        terrain: {
          bounds: null,
          workerUrl: "https://unpkg.com/@loaders.gl/terrain@".concat(VERSION, "/dist/terrain-loader.worker.js"),
          meshMaxError: 10,
          elevationDecoder: {
            rScaler: 1,
            gScaler: 0,
            bScaler: 0,
            offset: 0
          }
        }
      }
    };
    exports.TerrainWorkerLoader = TerrainWorkerLoader;

    var TerrainLoader = _objectSpread(_objectSpread({}, TerrainWorkerLoader), {}, {
      parse: _parseTerrain["default"]
    });

    exports.TerrainLoader = TerrainLoader;

    });

    var decodeQuantizedMesh = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = decode;
    exports.DECODING_STEPS = void 0;

    var _slicedToArray2 = interopRequireDefault(slicedToArray);

    function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    var QUANTIZED_MESH_HEADER = new Map([['centerX', Float64Array.BYTES_PER_ELEMENT], ['centerY', Float64Array.BYTES_PER_ELEMENT], ['centerZ', Float64Array.BYTES_PER_ELEMENT], ['minHeight', Float32Array.BYTES_PER_ELEMENT], ['maxHeight', Float32Array.BYTES_PER_ELEMENT], ['boundingSphereCenterX', Float64Array.BYTES_PER_ELEMENT], ['boundingSphereCenterY', Float64Array.BYTES_PER_ELEMENT], ['boundingSphereCenterZ', Float64Array.BYTES_PER_ELEMENT], ['boundingSphereRadius', Float64Array.BYTES_PER_ELEMENT], ['horizonOcclusionPointX', Float64Array.BYTES_PER_ELEMENT], ['horizonOcclusionPointY', Float64Array.BYTES_PER_ELEMENT], ['horizonOcclusionPointZ', Float64Array.BYTES_PER_ELEMENT]]);

    function decodeZigZag(value) {
      return value >> 1 ^ -(value & 1);
    }

    function decodeHeader(dataView) {
      var position = 0;
      var header = {};

      var _iterator = _createForOfIteratorHelper(QUANTIZED_MESH_HEADER),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
              key = _step$value[0],
              bytesCount = _step$value[1];

          var getter = bytesCount === 8 ? dataView.getFloat64 : dataView.getFloat32;
          header[key] = getter.call(dataView, position, true);
          position += bytesCount;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return {
        header: header,
        headerEndPosition: position
      };
    }

    function decodeVertexData(dataView, headerEndPosition) {
      var position = headerEndPosition;
      var elementsPerVertex = 3;
      var vertexCount = dataView.getUint32(position, true);
      var vertexData = new Uint16Array(vertexCount * elementsPerVertex);
      position += Uint32Array.BYTES_PER_ELEMENT;
      var bytesPerArrayElement = Uint16Array.BYTES_PER_ELEMENT;
      var elementArrayLength = vertexCount * bytesPerArrayElement;
      var uArrayStartPosition = position;
      var vArrayStartPosition = uArrayStartPosition + elementArrayLength;
      var heightArrayStartPosition = vArrayStartPosition + elementArrayLength;
      var u = 0;
      var v = 0;
      var height = 0;

      for (var i = 0; i < vertexCount; i++) {
        u += decodeZigZag(dataView.getUint16(uArrayStartPosition + bytesPerArrayElement * i, true));
        v += decodeZigZag(dataView.getUint16(vArrayStartPosition + bytesPerArrayElement * i, true));
        height += decodeZigZag(dataView.getUint16(heightArrayStartPosition + bytesPerArrayElement * i, true));
        vertexData[i] = u;
        vertexData[i + vertexCount] = v;
        vertexData[i + vertexCount * 2] = height;
      }

      position += elementArrayLength * 3;
      return {
        vertexData: vertexData,
        vertexDataEndPosition: position
      };
    }

    function decodeIndex(buffer, position, indicesCount, bytesPerIndex) {
      var encoded = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var indices;

      if (bytesPerIndex === 2) {
        indices = new Uint16Array(buffer, position, indicesCount);
      } else {
        indices = new Uint32Array(buffer, position, indicesCount);
      }

      if (!encoded) {
        return indices;
      }

      var highest = 0;

      for (var i = 0; i < indices.length; ++i) {
        var code = indices[i];
        indices[i] = highest - code;

        if (code === 0) {
          ++highest;
        }
      }

      return indices;
    }

    function decodeTriangleIndices(dataView, vertexData, vertexDataEndPosition) {
      var position = vertexDataEndPosition;
      var elementsPerVertex = 3;
      var vertexCount = vertexData.length / elementsPerVertex;
      var bytesPerIndex = vertexCount > 65536 ? Uint32Array.BYTES_PER_ELEMENT : Uint16Array.BYTES_PER_ELEMENT;

      if (position % bytesPerIndex !== 0) {
        position += bytesPerIndex - position % bytesPerIndex;
      }

      var triangleCount = dataView.getUint32(position, true);
      position += Uint32Array.BYTES_PER_ELEMENT;
      var triangleIndicesCount = triangleCount * 3;
      var triangleIndices = decodeIndex(dataView.buffer, position, triangleIndicesCount, bytesPerIndex);
      position += triangleIndicesCount * bytesPerIndex;
      return {
        triangleIndicesEndPosition: position,
        triangleIndices: triangleIndices
      };
    }

    function decodeEdgeIndices(dataView, vertexData, triangleIndicesEndPosition) {
      var position = triangleIndicesEndPosition;
      var elementsPerVertex = 3;
      var vertexCount = vertexData.length / elementsPerVertex;
      var bytesPerIndex = vertexCount > 65536 ? Uint32Array.BYTES_PER_ELEMENT : Uint16Array.BYTES_PER_ELEMENT;
      var westVertexCount = dataView.getUint32(position, true);
      position += Uint32Array.BYTES_PER_ELEMENT;
      var westIndices = decodeIndex(dataView.buffer, position, westVertexCount, bytesPerIndex, false);
      position += westVertexCount * bytesPerIndex;
      var southVertexCount = dataView.getUint32(position, true);
      position += Uint32Array.BYTES_PER_ELEMENT;
      var southIndices = decodeIndex(dataView.buffer, position, southVertexCount, bytesPerIndex, false);
      position += southVertexCount * bytesPerIndex;
      var eastVertexCount = dataView.getUint32(position, true);
      position += Uint32Array.BYTES_PER_ELEMENT;
      var eastIndices = decodeIndex(dataView.buffer, position, eastVertexCount, bytesPerIndex, false);
      position += eastVertexCount * bytesPerIndex;
      var northVertexCount = dataView.getUint32(position, true);
      position += Uint32Array.BYTES_PER_ELEMENT;
      var northIndices = decodeIndex(dataView.buffer, position, northVertexCount, bytesPerIndex, false);
      position += northVertexCount * bytesPerIndex;
      return {
        edgeIndicesEndPosition: position,
        westIndices: westIndices,
        southIndices: southIndices,
        eastIndices: eastIndices,
        northIndices: northIndices
      };
    }

    function decodeVertexNormalsExtension(extensionDataView) {
      return new Uint8Array(extensionDataView.buffer, extensionDataView.byteOffset, extensionDataView.byteLength);
    }

    function decodeWaterMaskExtension(extensionDataView) {
      return extensionDataView.buffer.slice(extensionDataView.byteOffset, extensionDataView.byteOffset + extensionDataView.byteLength);
    }

    function decodeExtensions(dataView, indicesEndPosition) {
      var extensions = {};

      if (dataView.byteLength <= indicesEndPosition) {
        return {
          extensions: extensions,
          extensionsEndPosition: indicesEndPosition
        };
      }

      var position = indicesEndPosition;

      while (position < dataView.byteLength) {
        var extensionId = dataView.getUint8(position, true);
        position += Uint8Array.BYTES_PER_ELEMENT;
        var extensionLength = dataView.getUint32(position, true);
        position += Uint32Array.BYTES_PER_ELEMENT;
        var extensionView = new DataView(dataView.buffer, position, extensionLength);

        switch (extensionId) {
          case 1:
            {
              extensions.vertexNormals = decodeVertexNormalsExtension(extensionView);
              break;
            }

          case 2:
            {
              extensions.waterMask = decodeWaterMaskExtension(extensionView);
              break;
            }
        }

        position += extensionLength;
      }

      return {
        extensions: extensions,
        extensionsEndPosition: position
      };
    }

    var DECODING_STEPS = {
      header: 0,
      vertices: 1,
      triangleIndices: 2,
      edgeIndices: 3,
      extensions: 4
    };
    exports.DECODING_STEPS = DECODING_STEPS;
    var DEFAULT_OPTIONS = {
      maxDecodingStep: DECODING_STEPS.extensions
    };

    function decode(data, userOptions) {
      var options = Object.assign({}, DEFAULT_OPTIONS, userOptions);
      var view = new DataView(data);

      var _decodeHeader = decodeHeader(view),
          header = _decodeHeader.header,
          headerEndPosition = _decodeHeader.headerEndPosition;

      if (options.maxDecodingStep < DECODING_STEPS.vertices) {
        return {
          header: header
        };
      }

      var _decodeVertexData = decodeVertexData(view, headerEndPosition),
          vertexData = _decodeVertexData.vertexData,
          vertexDataEndPosition = _decodeVertexData.vertexDataEndPosition;

      if (options.maxDecodingStep < DECODING_STEPS.triangleIndices) {
        return {
          header: header,
          vertexData: vertexData
        };
      }

      var _decodeTriangleIndice = decodeTriangleIndices(view, vertexData, vertexDataEndPosition),
          triangleIndices = _decodeTriangleIndice.triangleIndices,
          triangleIndicesEndPosition = _decodeTriangleIndice.triangleIndicesEndPosition;

      if (options.maxDecodingStep < DECODING_STEPS.edgeIndices) {
        return {
          header: header,
          vertexData: vertexData,
          triangleIndices: triangleIndices
        };
      }

      var _decodeEdgeIndices = decodeEdgeIndices(view, vertexData, triangleIndicesEndPosition),
          westIndices = _decodeEdgeIndices.westIndices,
          southIndices = _decodeEdgeIndices.southIndices,
          eastIndices = _decodeEdgeIndices.eastIndices,
          northIndices = _decodeEdgeIndices.northIndices,
          edgeIndicesEndPosition = _decodeEdgeIndices.edgeIndicesEndPosition;

      if (options.maxDecodingStep < DECODING_STEPS.extensions) {
        return {
          header: header,
          vertexData: vertexData,
          triangleIndices: triangleIndices,
          westIndices: westIndices,
          northIndices: northIndices,
          eastIndices: eastIndices,
          southIndices: southIndices
        };
      }

      var _decodeExtensions = decodeExtensions(view, edgeIndicesEndPosition),
          extensions = _decodeExtensions.extensions;

      return {
        header: header,
        vertexData: vertexData,
        triangleIndices: triangleIndices,
        westIndices: westIndices,
        northIndices: northIndices,
        eastIndices: eastIndices,
        southIndices: southIndices,
        extensions: extensions
      };
    }

    });

    var parseQuantizedMesh = createCommonjsModule(function (module, exports) {





    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = loadQuantizedMesh;

    var _slicedToArray2 = interopRequireDefault(slicedToArray);



    var _decodeQuantizedMesh = interopRequireWildcard(decodeQuantizedMesh);

    function getMeshAttributes(vertexData, header, bounds) {
      var minHeight = header.minHeight,
          maxHeight = header.maxHeight;

      var _ref = bounds || [0, 0, 1, 1],
          _ref2 = (0, _slicedToArray2["default"])(_ref, 4),
          minX = _ref2[0],
          minY = _ref2[1],
          maxX = _ref2[2],
          maxY = _ref2[3];

      var xScale = maxX - minX;
      var yScale = maxY - minY;
      var zScale = maxHeight - minHeight;
      var nCoords = vertexData.length / 3;
      var positions = new Float32Array(nCoords * 3);
      var texCoords = new Float32Array(nCoords * 2);

      for (var i = 0; i < nCoords; i++) {
        var x = vertexData[i] / 32767;
        var y = vertexData[i + nCoords] / 32767;
        var z = vertexData[i + nCoords * 2] / 32767;
        positions[3 * i + 0] = x * xScale + minX;
        positions[3 * i + 1] = y * yScale + minY;
        positions[3 * i + 2] = z * zScale + minHeight;
        texCoords[2 * i + 0] = x;
        texCoords[2 * i + 1] = y;
      }

      return {
        POSITION: {
          value: positions,
          size: 3
        },
        TEXCOORD_0: {
          value: texCoords,
          size: 2
        }
      };
    }

    function getTileMesh(arrayBuffer, options) {
      if (!arrayBuffer) {
        return null;
      }

      var bounds = options.bounds;

      var _decode = (0, _decodeQuantizedMesh["default"])(arrayBuffer, _decodeQuantizedMesh.DECODING_STEPS.triangleIndices),
          header = _decode.header,
          vertexData = _decode.vertexData,
          triangleIndices = _decode.triangleIndices;

      var attributes = getMeshAttributes(vertexData, header, bounds);
      return {
        loaderData: {
          header: {}
        },
        header: {
          vertexCount: triangleIndices.length,
          boundingBox: (0, esm.getMeshBoundingBox)(attributes)
        },
        mode: 4,
        indices: {
          value: triangleIndices,
          size: 1
        },
        attributes: attributes
      };
    }

    function loadQuantizedMesh(arrayBuffer, options) {
      return getTileMesh(arrayBuffer, options['quantized-mesh']);
    }

    });

    var quantizedMeshLoader = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.QuantizedMeshLoader = exports.QuantizedMeshWorkerLoader = void 0;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _defineProperty2 = interopRequireDefault(defineProperty);

    var _parseQuantizedMesh = interopRequireDefault(parseQuantizedMesh);

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var VERSION = "2.3.12" ;
    var QuantizedMeshWorkerLoader = {
      id: 'quantized-mesh',
      name: 'Quantized Mesh',
      version: VERSION,
      extensions: ['terrain'],
      mimeTypes: ['application/vnd.quantized-mesh'],
      options: {
        'quantized-mesh': {
          workerUrl: "https://unpkg.com/@loaders.gl/terrain@".concat(VERSION, "/dist/quantized-mesh-loader.worker.js"),
          bounds: [0, 0, 1, 1]
        }
      }
    };
    exports.QuantizedMeshWorkerLoader = QuantizedMeshWorkerLoader;

    var QuantizedMeshLoader = _objectSpread(_objectSpread({}, QuantizedMeshWorkerLoader), {}, {
      parseSync: _parseQuantizedMesh["default"],
      parse: function () {
        var _parse = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(arrayBuffer, options) {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", (0, _parseQuantizedMesh["default"])(arrayBuffer, options));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function parse(_x, _x2) {
          return _parse.apply(this, arguments);
        }

        return parse;
      }()
    });

    exports.QuantizedMeshLoader = QuantizedMeshLoader;

    });

    var parseNpy = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parseNPY = parseNPY;

    function systemIsLittleEndian() {
      var a = new Uint32Array([0x12345678]);
      var b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
      return !(b[0] === 0x12);
    }

    var LITTLE_ENDIAN_OS = systemIsLittleEndian();
    var DTYPES = {
      u1: Uint8Array,
      i1: Int8Array,
      u2: Uint16Array,
      i2: Int16Array,
      u4: Uint32Array,
      i4: Int32Array,
      f4: Float32Array,
      f8: Float64Array
    };

    function parseNPY(arrayBuffer, options) {
      if (!arrayBuffer) {
        return null;
      }

      var view = new DataView(arrayBuffer);

      var _parseHeader = parseHeader(view),
          header = _parseHeader.header,
          headerEndOffset = _parseHeader.headerEndOffset;

      var numpyType = header.descr;
      var ArrayType = DTYPES[numpyType.slice(1, 3)];

      if (!ArrayType) {
        console.warn("Decoding of npy dtype not implemented: ".concat(numpyType));
        return null;
      }

      var nArrayElements = header.shape.reduce(function (a, b) {
        return a * b;
      });
      var arrayByteLength = nArrayElements * ArrayType.BYTES_PER_ELEMENT;
      var data = new ArrayType(arrayBuffer.slice(headerEndOffset, headerEndOffset + arrayByteLength));

      if (numpyType[0] === '>' && LITTLE_ENDIAN_OS || numpyType[0] === '<' && !LITTLE_ENDIAN_OS) {
        console.warn('Data is wrong endianness, byte swapping not yet implemented.');
      }

      return {
        data: data,
        header: header
      };
    }

    function parseHeader(view) {
      var majorVersion = view.getUint8(6);
      var offset = 8;
      var headerLength;

      if (majorVersion >= 2) {
        headerLength = view.getUint32(8, true);
        offset += 4;
      } else {
        headerLength = view.getUint16(8, true);
        offset += 2;
      }

      var encoding = majorVersion <= 2 ? 'latin1' : 'utf-8';
      var decoder = new TextDecoder(encoding);
      var headerArray = new Uint8Array(view.buffer, offset, headerLength);
      var headerText = decoder.decode(headerArray);
      offset += headerLength;
      var header = JSON.parse(headerText.replace(/'/g, '"').replace('False', 'false').replace('(', '[').replace(/,*\),*/g, ']'));
      return {
        header: header,
        headerEndOffset: offset
      };
    }

    });

    var npyLoader = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.NPYLoader = exports.NPYWorkerLoader = void 0;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _defineProperty2 = interopRequireDefault(defineProperty);



    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var VERSION = "2.3.12" ;
    var NPY_MAGIC_NUMBER = new Uint8Array([147, 78, 85, 77, 80, 89]);
    var NPYWorkerLoader = {
      id: 'npy',
      name: 'NPY',
      version: VERSION,
      extensions: ['npy'],
      mimeTypes: [],
      tests: [NPY_MAGIC_NUMBER.buffer],
      options: {
        npy: {
          workerUrl: "https://unpkg.com/@loaders.gl/terrain@".concat(VERSION, "/dist/npy-loader.worker.js")
        }
      }
    };
    exports.NPYWorkerLoader = NPYWorkerLoader;

    var NPYLoader = _objectSpread(_objectSpread({}, NPYWorkerLoader), {}, {
      parseSync: parseNpy.parseNPY,
      parse: function () {
        var _parse = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(arrayBuffer, options) {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", (0, parseNpy.parseNPY)(arrayBuffer, options));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function parse(_x, _x2) {
          return _parse.apply(this, arguments);
        }

        return parse;
      }()
    });

    exports.NPYLoader = NPYLoader;

    });

    var es5$1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "TerrainLoader", {
      enumerable: true,
      get: function get() {
        return terrainLoader.TerrainLoader;
      }
    });
    Object.defineProperty(exports, "TerrainWorkerLoader", {
      enumerable: true,
      get: function get() {
        return terrainLoader.TerrainWorkerLoader;
      }
    });
    Object.defineProperty(exports, "QuantizedMeshLoader", {
      enumerable: true,
      get: function get() {
        return quantizedMeshLoader.QuantizedMeshLoader;
      }
    });
    Object.defineProperty(exports, "QuantizedMeshWorkerLoader", {
      enumerable: true,
      get: function get() {
        return quantizedMeshLoader.QuantizedMeshWorkerLoader;
      }
    });
    Object.defineProperty(exports, "_NPYLoader", {
      enumerable: true,
      get: function get() {
        return npyLoader.NPYLoader;
      }
    });
    Object.defineProperty(exports, "_NPYWorkerLoader", {
      enumerable: true,
      get: function get() {
        return npyLoader.NPYWorkerLoader;
      }
    });







    });

    var index$1 = /*@__PURE__*/unwrapExports(es5$1);

    var assert_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = assert;

    function assert(condition, message) {
      if (!condition) {
        throw new Error(message);
      }
    }

    });

    var globals_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.nodeVersion = exports.isWorker = exports.isBrowser = exports.document = exports.global = exports.window = exports.self = void 0;

    var _typeof2 = interopRequireDefault(_typeof_1);

    var globals = {
      self: typeof self !== 'undefined' && self,
      window: typeof window !== 'undefined' && window,
      global: typeof commonjsGlobal !== 'undefined' && commonjsGlobal,
      document: typeof document !== 'undefined' && document
    };
    var self_ = globals.self || globals.window || globals.global;
    exports.self = self_;
    var window_ = globals.window || globals.self || globals.global;
    exports.window = window_;
    var global_ = globals.global || globals.self || globals.window;
    exports.global = global_;
    var document_ = globals.document || {};
    exports.document = document_;
    var isBrowser = (typeof process === "undefined" ? "undefined" : (0, _typeof2["default"])(process)) !== 'object' || String(process) !== '[object process]' || process.browser;
    exports.isBrowser = isBrowser;
    var isWorker = typeof importScripts === 'function';
    exports.isWorker = isWorker;
    var matches = typeof process !== 'undefined' && process.version && process.version.match(/v([0-9]*)/);
    var nodeVersion = matches && parseFloat(matches[1]) || 0;
    exports.nodeVersion = nodeVersion;

    });

    var imageType = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isImageTypeSupported = isImageTypeSupported;
    exports.getDefaultImageType = getDefaultImageType;



    var _parseImageNode = globals_1.global._parseImageNode;
    var IMAGE_SUPPORTED = typeof Image !== 'undefined';
    var IMAGE_BITMAP_SUPPORTED = typeof ImageBitmap !== 'undefined';
    var NODE_IMAGE_SUPPORTED = Boolean(_parseImageNode);
    var DATA_SUPPORTED = globals_1.isBrowser ? true : NODE_IMAGE_SUPPORTED;

    function isImageTypeSupported(type) {
      switch (type) {
        case 'auto':
          return IMAGE_BITMAP_SUPPORTED || IMAGE_SUPPORTED || DATA_SUPPORTED;

        case 'imagebitmap':
          return IMAGE_BITMAP_SUPPORTED;

        case 'image':
          return IMAGE_SUPPORTED;

        case 'data':
          return DATA_SUPPORTED;

        case 'html':
          return IMAGE_SUPPORTED;

        case 'ndarray':
          return DATA_SUPPORTED;

        default:
          throw new Error("@loaders.gl/images: image ".concat(type, " not supported in this environment"));
      }
    }

    function getDefaultImageType() {
      if (IMAGE_BITMAP_SUPPORTED) {
        return 'imagebitmap';
      }

      if (IMAGE_SUPPORTED) {
        return 'image';
      }

      if (DATA_SUPPORTED) {
        return 'data';
      }

      throw new Error("Install '@loaders.gl/polyfills' to parse images under Node.js");
    }

    });

    var parsedImageApi = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isImage = isImage;
    exports.deleteImage = deleteImage;
    exports.getImageType = getImageType;
    exports.getImageSize = exports.getImageData = getImageData;

    var _typeof2 = interopRequireDefault(_typeof_1);

    var _assert = interopRequireDefault(assert_1);

    function isImage(image) {
      return Boolean(getImageTypeOrNull(image));
    }

    function deleteImage(image) {
      switch (getImageType(image)) {
        case 'imagebitmap':
          image.close();
          break;
      }
    }

    function getImageType(image) {
      var format = getImageTypeOrNull(image);

      if (!format) {
        throw new Error('Not an image');
      }

      return format;
    }

    function getImageData(image) {
      switch (getImageType(image)) {
        case 'data':
          return image;

        case 'image':
        case 'imagebitmap':
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');

          if (context) {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            return context.getImageData(0, 0, image.width, image.height);
          }

        default:
          return (0, _assert["default"])(false);
      }
    }

    function getImageTypeOrNull(image) {
      if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
        return 'imagebitmap';
      }

      if (typeof Image !== 'undefined' && image instanceof Image) {
        return 'image';
      }

      if (image && (0, _typeof2["default"])(image) === 'object' && image.data && image.width && image.height) {
        return 'data';
      }

      return null;
    }

    });

    var svgUtils = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isSVG = isSVG;
    exports.getBlobOrSVGDataUrl = getBlobOrSVGDataUrl;
    exports.getBlob = getBlob;
    var SVG_DATA_URL_PATTERN = /^data:image\/svg\+xml/;
    var SVG_URL_PATTERN = /\.svg((\?|#).*)?$/;

    function isSVG(url) {
      return url && (SVG_DATA_URL_PATTERN.test(url) || SVG_URL_PATTERN.test(url));
    }

    function getBlobOrSVGDataUrl(arrayBuffer, url) {
      if (isSVG(url)) {
        var textDecoder = new TextDecoder();
        var xmlText = textDecoder.decode(arrayBuffer);
        var src = "data:image/svg+xml;base64,".concat(btoa(xmlText));
        return src;
      }

      return getBlob(arrayBuffer, url);
    }

    function getBlob(arrayBuffer, url) {
      if (isSVG(url)) {
        throw new Error('SVG cannot be parsed directly to imagebitmap');
      }

      return new Blob([new Uint8Array(arrayBuffer)]);
    }

    });

    var parseToImage_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = parseToImage;
    exports.loadToImage = loadToImage;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);



    function parseToImage(_x, _x2, _x3) {
      return _parseToImage.apply(this, arguments);
    }

    function _parseToImage() {
      _parseToImage = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(arrayBuffer, options, url) {
        var blobOrDataUrl, URL, objectUrl;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                blobOrDataUrl = (0, svgUtils.getBlobOrSVGDataUrl)(arrayBuffer, url);
                URL = self.URL || self.webkitURL;
                objectUrl = typeof blobOrDataUrl !== 'string' && URL.createObjectURL(blobOrDataUrl);
                _context.prev = 3;
                _context.next = 6;
                return loadToImage(objectUrl || blobOrDataUrl, options);

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
                _context.prev = 7;

                if (objectUrl) {
                  URL.revokeObjectURL(objectUrl);
                }

                return _context.finish(7);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3,, 7, 10]]);
      }));
      return _parseToImage.apply(this, arguments);
    }

    function loadToImage(_x4, _x5) {
      return _loadToImage.apply(this, arguments);
    }

    function _loadToImage() {
      _loadToImage = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(url, options) {
        var image;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                image = new Image();
                image.src = url;

                if (!(options.image && options.image.decode && image.decode)) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 5;
                return image.decode();

              case 5:
                return _context2.abrupt("return", image);

              case 6:
                _context2.next = 8;
                return new Promise(function (resolve, reject) {
                  try {
                    image.onload = function () {
                      return resolve(image);
                    };

                    image.onerror = function (err) {
                      return reject(new Error("Could not load image ".concat(url, ": ").concat(err)));
                    };
                  } catch (error) {
                    reject(error);
                  }
                });

              case 8:
                return _context2.abrupt("return", _context2.sent);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _loadToImage.apply(this, arguments);
    }

    });

    var parseToImageBitmap_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = parseToImageBitmap;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);



    var _parseToImage = interopRequireDefault(parseToImage_1);

    var EMPTY_OBJECT = {};
    var imagebitmapOptionsSupported = true;

    function parseToImageBitmap(_x, _x2, _x3) {
      return _parseToImageBitmap.apply(this, arguments);
    }

    function _parseToImageBitmap() {
      _parseToImageBitmap = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(arrayBuffer, options, url) {
        var blob, image, imagebitmapOptions;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(0, svgUtils.isSVG)(url)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 3;
                return (0, _parseToImage["default"])(arrayBuffer, options, url);

              case 3:
                image = _context.sent;
                blob = image;
                _context.next = 8;
                break;

              case 7:
                blob = (0, svgUtils.getBlob)(arrayBuffer, url);

              case 8:
                imagebitmapOptions = options && options.imagebitmap;
                _context.next = 11;
                return safeCreateImageBitmap(blob, imagebitmapOptions);

              case 11:
                return _context.abrupt("return", _context.sent);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _parseToImageBitmap.apply(this, arguments);
    }

    function safeCreateImageBitmap(_x4) {
      return _safeCreateImageBitmap.apply(this, arguments);
    }

    function _safeCreateImageBitmap() {
      _safeCreateImageBitmap = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(blob) {
        var imagebitmapOptions,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                imagebitmapOptions = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;

                if (isEmptyObject(imagebitmapOptions) || !imagebitmapOptionsSupported) {
                  imagebitmapOptions = null;
                }

                if (!imagebitmapOptions) {
                  _context2.next = 13;
                  break;
                }

                _context2.prev = 3;
                _context2.next = 6;
                return createImageBitmap(blob, imagebitmapOptions);

              case 6:
                return _context2.abrupt("return", _context2.sent);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](3);
                console.warn(_context2.t0);
                imagebitmapOptionsSupported = false;

              case 13:
                _context2.next = 15;
                return createImageBitmap(blob);

              case 15:
                return _context2.abrupt("return", _context2.sent);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[3, 9]]);
      }));
      return _safeCreateImageBitmap.apply(this, arguments);
    }

    function isEmptyObject(object) {
      for (var key in object || EMPTY_OBJECT) {
        return false;
      }

      return true;
    }

    });

    var binaryImageApi = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getBinaryImageMetadata = getBinaryImageMetadata;
    exports.getBmpMetadata = getBmpMetadata;
    var BIG_ENDIAN = false;
    var LITTLE_ENDIAN = true;

    function getBinaryImageMetadata(binaryData) {
      var dataView = toDataView(binaryData);
      return getPngMetadata(dataView) || getJpegMetadata(dataView) || getGifMetadata(dataView) || getBmpMetadata(dataView);
    }

    function getPngMetadata(binaryData) {
      var dataView = toDataView(binaryData);
      var isPng = dataView.byteLength >= 24 && dataView.getUint32(0, BIG_ENDIAN) === 0x89504e47;

      if (!isPng) {
        return null;
      }

      return {
        mimeType: 'image/png',
        width: dataView.getUint32(16, BIG_ENDIAN),
        height: dataView.getUint32(20, BIG_ENDIAN)
      };
    }

    function getGifMetadata(binaryData) {
      var dataView = toDataView(binaryData);
      var isGif = dataView.byteLength >= 10 && dataView.getUint32(0, BIG_ENDIAN) === 0x47494638;

      if (!isGif) {
        return null;
      }

      return {
        mimeType: 'image/gif',
        width: dataView.getUint16(6, LITTLE_ENDIAN),
        height: dataView.getUint16(8, LITTLE_ENDIAN)
      };
    }

    function getBmpMetadata(binaryData) {
      var dataView = toDataView(binaryData);
      var isBmp = dataView.byteLength >= 14 && dataView.getUint16(0, BIG_ENDIAN) === 0x424d && dataView.getUint32(2, LITTLE_ENDIAN) === dataView.byteLength;

      if (!isBmp) {
        return null;
      }

      return {
        mimeType: 'image/bmp',
        width: dataView.getUint32(18, LITTLE_ENDIAN),
        height: dataView.getUint32(22, LITTLE_ENDIAN)
      };
    }

    function getJpegMetadata(binaryData) {
      var dataView = toDataView(binaryData);
      var isJpeg = dataView.byteLength >= 3 && dataView.getUint16(0, BIG_ENDIAN) === 0xffd8 && dataView.getUint8(2) === 0xff;

      if (!isJpeg) {
        return null;
      }

      var _getJpegMarkers = getJpegMarkers(),
          tableMarkers = _getJpegMarkers.tableMarkers,
          sofMarkers = _getJpegMarkers.sofMarkers;

      var i = 2;

      while (i + 9 < dataView.byteLength) {
        var marker = dataView.getUint16(i, BIG_ENDIAN);

        if (sofMarkers.has(marker)) {
          return {
            mimeType: 'image/jpeg',
            height: dataView.getUint16(i + 5, BIG_ENDIAN),
            width: dataView.getUint16(i + 7, BIG_ENDIAN)
          };
        }

        if (!tableMarkers.has(marker)) {
          return null;
        }

        i += 2;
        i += dataView.getUint16(i, BIG_ENDIAN);
      }

      return null;
    }

    function getJpegMarkers() {
      var tableMarkers = new Set([0xffdb, 0xffc4, 0xffcc, 0xffdd, 0xfffe]);

      for (var i = 0xffe0; i < 0xfff0; ++i) {
        tableMarkers.add(i);
      }

      var sofMarkers = new Set([0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc9, 0xffca, 0xffcb, 0xffcd, 0xffce, 0xffcf, 0xffde]);
      return {
        tableMarkers: tableMarkers,
        sofMarkers: sofMarkers
      };
    }

    function toDataView(data) {
      if (data instanceof DataView) {
        return data;
      }

      if (ArrayBuffer.isView(data)) {
        return new DataView(data.buffer);
      }

      if (data instanceof ArrayBuffer) {
        return new DataView(data);
      }

      throw new Error('toDataView');
    }

    });

    var parseToNodeImage_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = parseToNodeImage;



    var _assert = interopRequireDefault(assert_1);



    function parseToNodeImage(arrayBuffer, options) {
      var _ref = (0, binaryImageApi.getBinaryImageMetadata)(arrayBuffer) || {},
          mimeType = _ref.mimeType;

      var _parseImageNode = globals_1.global._parseImageNode;
      (0, _assert["default"])(_parseImageNode);
      return _parseImageNode(arrayBuffer, mimeType, options);
    }

    });

    var parseImage_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = parseImage;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _assert = interopRequireDefault(assert_1);





    var _parseToImage = interopRequireDefault(parseToImage_1);

    var _parseToImageBitmap = interopRequireDefault(parseToImageBitmap_1);

    var _parseToNodeImage = interopRequireDefault(parseToNodeImage_1);

    function parseImage(_x, _x2, _x3) {
      return _parseImage.apply(this, arguments);
    }

    function _parseImage() {
      _parseImage = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(arrayBuffer, options, context) {
        var imageOptions, imageType, _ref, url, loadType, image;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = options || {};
                imageOptions = options.image || {};
                imageType = imageOptions.type || 'auto';
                _ref = context || {}, url = _ref.url;
                loadType = getLoadableImageType(imageType);
                _context.t0 = loadType;
                _context.next = _context.t0 === 'imagebitmap' ? 8 : _context.t0 === 'image' ? 12 : _context.t0 === 'data' ? 16 : 20;
                break;

              case 8:
                _context.next = 10;
                return (0, _parseToImageBitmap["default"])(arrayBuffer, options, url);

              case 10:
                image = _context.sent;
                return _context.abrupt("break", 21);

              case 12:
                _context.next = 14;
                return (0, _parseToImage["default"])(arrayBuffer, options, url);

              case 14:
                image = _context.sent;
                return _context.abrupt("break", 21);

              case 16:
                _context.next = 18;
                return (0, _parseToNodeImage["default"])(arrayBuffer, options);

              case 18:
                image = _context.sent;
                return _context.abrupt("break", 21);

              case 20:
                (0, _assert["default"])(false);

              case 21:
                if (imageType === 'data') {
                  image = (0, parsedImageApi.getImageData)(image);
                }

                return _context.abrupt("return", image);

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _parseImage.apply(this, arguments);
    }

    function getLoadableImageType(type) {
      switch (type) {
        case 'auto':
        case 'data':
          return (0, imageType.getDefaultImageType)();

        default:
          (0, imageType.isImageTypeSupported)(type);
          return type;
      }
    }

    });

    var imageLoader = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;

    var _parseImage = interopRequireDefault(parseImage_1);



    var VERSION = "2.3.12" ;
    var EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg'];
    var MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp', 'image/vnd.microsoft.icon', 'image/svg+xml'];
    var ImageLoader = {
      id: 'image',
      name: 'Images',
      version: VERSION,
      mimeTypes: MIME_TYPES,
      extensions: EXTENSIONS,
      parse: _parseImage["default"],
      tests: [function (arrayBuffer) {
        return Boolean((0, binaryImageApi.getBinaryImageMetadata)(new DataView(arrayBuffer)));
      }],
      options: {
        image: {
          type: 'auto',
          decode: true
        }
      }
    };
    var _default = ImageLoader;
    exports["default"] = _default;

    });

    var encodeImage_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.encodeImage = encodeImage;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);





    var _encodeImageNode = globals_1.global._encodeImageNode;

    function encodeImage(_x, _x2) {
      return _encodeImage.apply(this, arguments);
    }

    function _encodeImage() {
      _encodeImage = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(image, options) {
        return _regenerator["default"].wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = options || {};
                options.image = options.image || {};
                return _context2.abrupt("return", _encodeImageNode ? _encodeImageNode(image, {
                  type: options.image.mimeType
                }) : encodeImageInBrowser(image, options));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee);
      }));
      return _encodeImage.apply(this, arguments);
    }

    var qualityParamSupported = true;

    function encodeImageInBrowser(_x3, _x4) {
      return _encodeImageInBrowser.apply(this, arguments);
    }

    function _encodeImageInBrowser() {
      _encodeImageInBrowser = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(image, options) {
        var _options$image, mimeType, jpegQuality, _getImageSize, width, height, canvas, blob;

        return _regenerator["default"].wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _options$image = options.image, mimeType = _options$image.mimeType, jpegQuality = _options$image.jpegQuality;
                _getImageSize = (0, parsedImageApi.getImageSize)(image), width = _getImageSize.width, height = _getImageSize.height;
                canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                drawImageToCanvas(image, canvas);
                _context3.next = 8;
                return new Promise(function (resolve, reject) {
                  if (jpegQuality && qualityParamSupported) {
                    try {
                      canvas.toBlob(resolve, mimeType, jpegQuality);
                      return;
                    } catch (error) {
                      qualityParamSupported = false;
                    }
                  }

                  canvas.toBlob(resolve, mimeType);
                });

              case 8:
                blob = _context3.sent;
                _context3.next = 11;
                return blob.arrayBuffer();

              case 11:
                return _context3.abrupt("return", _context3.sent);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2);
      }));
      return _encodeImageInBrowser.apply(this, arguments);
    }

    function drawImageToCanvas(image, canvas) {
      var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (x === 0 && y === 0 && typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
        var _context = canvas.getContext('bitmaprenderer');

        if (_context) {
          _context.transferFromImageBitmap(image);

          return canvas;
        }
      }

      var context = canvas.getContext('2d');

      if (image.data) {
        var clampedArray = new Uint8ClampedArray(image.data);
        var imageData = new ImageData(clampedArray, image.width, image.height);
        context.putImageData(imageData, 0, 0);
        return canvas;
      }

      context.drawImage(image, 0, 0);
      return canvas;
    }

    });

    var imageWriter = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;



    var _default = {
      name: 'Images',
      extensions: ['jpeg'],
      options: {
        image: {
          mimeType: 'image/png',
          jpegQuality: null
        }
      },
      encode: encodeImage_1.encodeImage
    };
    exports["default"] = _default;

    });

    var generateUrl_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.generateUrl = generateUrl;

    var _defineProperty2 = interopRequireDefault(defineProperty);



    var _assert = interopRequireDefault(assert_1);

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function generateUrl(getUrl, options, urlOptions) {
      var url = getUrl;

      if (typeof getUrl === 'function') {
        url = getUrl(_objectSpread(_objectSpread({}, options), urlOptions));
      }

      (0, _assert["default"])(typeof url === 'string');
      var baseUrl = options.baseUrl;

      if (baseUrl) {
        url = baseUrl[baseUrl.length - 1] === '/' ? "".concat(baseUrl).concat(url) : "".concat(baseUrl, "/").concat(url);
      }

      return (0, esm.resolvePath)(url);
    }

    });

    var asyncDeepMap_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.asyncDeepMap = asyncDeepMap;
    exports.mapSubtree = mapSubtree;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _typeof2 = interopRequireDefault(_typeof_1);

    var isObject = function isObject(value) {
      return value && (0, _typeof2["default"])(value) === 'object';
    };

    function asyncDeepMap(_x, _x2) {
      return _asyncDeepMap.apply(this, arguments);
    }

    function _asyncDeepMap() {
      _asyncDeepMap = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(tree, func) {
        var options,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                _context.next = 3;
                return mapSubtree(tree, func, options);

              case 3:
                return _context.abrupt("return", _context.sent);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _asyncDeepMap.apply(this, arguments);
    }

    function mapSubtree(_x3, _x4, _x5) {
      return _mapSubtree.apply(this, arguments);
    }

    function _mapSubtree() {
      _mapSubtree = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(object, func, options) {
        var url;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!Array.isArray(object)) {
                  _context2.next = 4;
                  break;
                }

                _context2.next = 3;
                return mapArray(object, func, options);

              case 3:
                return _context2.abrupt("return", _context2.sent);

              case 4:
                if (!isObject(object)) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 7;
                return mapObject(object, func, options);

              case 7:
                return _context2.abrupt("return", _context2.sent);

              case 8:
                url = object;
                _context2.next = 11;
                return func(url, options);

              case 11:
                return _context2.abrupt("return", _context2.sent);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _mapSubtree.apply(this, arguments);
    }

    function mapObject(_x6, _x7, _x8) {
      return _mapObject.apply(this, arguments);
    }

    function _mapObject() {
      _mapObject = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(object, func, options) {
        var promises, values, _loop, key;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                promises = [];
                values = {};

                _loop = function _loop(key) {
                  var url = object[key];
                  var promise = mapSubtree(url, func, options).then(function (value) {
                    values[key] = value;
                  });
                  promises.push(promise);
                };

                for (key in object) {
                  _loop(key);
                }

                _context3.next = 6;
                return Promise.all(promises);

              case 6:
                return _context3.abrupt("return", values);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _mapObject.apply(this, arguments);
    }

    function mapArray(_x9, _x10) {
      return _mapArray.apply(this, arguments);
    }

    function _mapArray() {
      _mapArray = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee4(urlArray, func) {
        var options,
            promises,
            _args4 = arguments;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
                promises = urlArray.map(function (url) {
                  return mapSubtree(url, func, options);
                });
                _context4.next = 4;
                return Promise.all(promises);

              case 4:
                return _context4.abrupt("return", _context4.sent);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
      return _mapArray.apply(this, arguments);
    }

    });

    var deepLoad_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.deepLoad = deepLoad;
    exports.shallowLoad = shallowLoad;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);



    function deepLoad(_x, _x2, _x3) {
      return _deepLoad.apply(this, arguments);
    }

    function _deepLoad() {
      _deepLoad = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(urlTree, load, options) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, asyncDeepMap_1.asyncDeepMap)(urlTree, function (url) {
                  return shallowLoad(url, load, options);
                });

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _deepLoad.apply(this, arguments);
    }

    function shallowLoad(_x4, _x5, _x6) {
      return _shallowLoad.apply(this, arguments);
    }

    function _shallowLoad() {
      _shallowLoad = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(url, load, options) {
        var response, arrayBuffer;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fetch(url, options.fetch);

              case 2:
                response = _context2.sent;
                _context2.next = 5;
                return response.arrayBuffer();

              case 5:
                arrayBuffer = _context2.sent;
                _context2.next = 8;
                return load(arrayBuffer, options);

              case 8:
                return _context2.abrupt("return", _context2.sent);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _shallowLoad.apply(this, arguments);
    }

    });

    var loadImage_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.loadImage = loadImage;
    exports.getImageUrls = getImageUrls;
    exports.getMipLevels = getMipLevels;

    var _defineProperty2 = interopRequireDefault(defineProperty);

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _assert = interopRequireDefault(assert_1);

    var _parseImage = interopRequireDefault(parseImage_1);







    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function loadImage(_x) {
      return _loadImage.apply(this, arguments);
    }

    function _loadImage() {
      _loadImage = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(getUrl) {
        var options,
            imageUrls,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                _context.next = 3;
                return getImageUrls(getUrl, options);

              case 3:
                imageUrls = _context.sent;
                _context.next = 6;
                return (0, deepLoad_1.deepLoad)(imageUrls, _parseImage["default"], options);

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _loadImage.apply(this, arguments);
    }

    function getImageUrls(_x2, _x3) {
      return _getImageUrls.apply(this, arguments);
    }

    function _getImageUrls() {
      _getImageUrls = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(getUrl, options) {
        var urlOptions,
            mipLevels,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                urlOptions = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
                mipLevels = options && options.image && options.image.mipLevels || 0;

                if (!(mipLevels !== 0)) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 5;
                return getMipmappedImageUrls(getUrl, mipLevels, options, urlOptions);

              case 5:
                _context2.t0 = _context2.sent;
                _context2.next = 9;
                break;

              case 8:
                _context2.t0 = (0, generateUrl_1.generateUrl)(getUrl, options, urlOptions);

              case 9:
                return _context2.abrupt("return", _context2.t0);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _getImageUrls.apply(this, arguments);
    }

    function getMipmappedImageUrls(_x4, _x5, _x6, _x7) {
      return _getMipmappedImageUrls.apply(this, arguments);
    }

    function _getMipmappedImageUrls() {
      _getMipmappedImageUrls = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(getUrl, mipLevels, options, urlOptions) {
        var urls, url, image, _getImageSize, width, height, mipLevel, _url;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                urls = [];

                if (!(mipLevels === 'auto')) {
                  _context3.next = 9;
                  break;
                }

                url = (0, generateUrl_1.generateUrl)(getUrl, options, _objectSpread(_objectSpread({}, urlOptions), {}, {
                  lod: 0
                }));
                _context3.next = 5;
                return (0, deepLoad_1.shallowLoad)(url, _parseImage["default"], options);

              case 5:
                image = _context3.sent;
                _getImageSize = (0, parsedImageApi.getImageSize)(image), width = _getImageSize.width, height = _getImageSize.height;
                mipLevels = getMipLevels({
                  width: width,
                  height: height
                });
                urls.push(url);

              case 9:
                (0, _assert["default"])(mipLevels > 0);

                for (mipLevel = urls.length; mipLevel < mipLevels; ++mipLevel) {
                  _url = (0, generateUrl_1.generateUrl)(getUrl, options, _objectSpread(_objectSpread({}, urlOptions), {}, {
                    lod: mipLevel
                  }));
                  urls.push(_url);
                }

                return _context3.abrupt("return", urls);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _getMipmappedImageUrls.apply(this, arguments);
    }

    function getMipLevels(_ref) {
      var width = _ref.width,
          height = _ref.height;
      return 1 + Math.floor(Math.log2(Math.max(width, height)));
    }

    });

    var loadImageArray_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.loadImageArray = loadImageArray;
    exports.getImageArrayUrls = getImageArrayUrls;

    var _regenerator = interopRequireDefault(regenerator);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _parseImage = interopRequireDefault(parseImage_1);





    function loadImageArray(_x, _x2) {
      return _loadImageArray.apply(this, arguments);
    }

    function _loadImageArray() {
      _loadImageArray = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(count, getUrl) {
        var options,
            imageUrls,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                _context.next = 3;
                return getImageArrayUrls(count, getUrl, options);

              case 3:
                imageUrls = _context.sent;
                _context.next = 6;
                return (0, deepLoad_1.deepLoad)(imageUrls, _parseImage["default"], options);

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _loadImageArray.apply(this, arguments);
    }

    function getImageArrayUrls(_x3, _x4) {
      return _getImageArrayUrls.apply(this, arguments);
    }

    function _getImageArrayUrls() {
      _getImageArrayUrls = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(count, getUrl) {
        var options,
            promises,
            index,
            promise,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
                promises = [];

                for (index = 0; index < count; index++) {
                  promise = (0, loadImage_1.getImageUrls)(getUrl, options, {
                    index: index
                  });
                  promises.push(promise);
                }

                _context2.next = 5;
                return Promise.all(promises);

              case 5:
                return _context2.abrupt("return", _context2.sent);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _getImageArrayUrls.apply(this, arguments);
    }

    });

    var loadImageCube_1 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getImageCubeUrls = getImageCubeUrls;
    exports.loadImageCube = loadImageCube;

    var _regenerator = interopRequireDefault(regenerator);

    var _defineProperty2 = interopRequireDefault(defineProperty);

    var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

    var _parseImage = interopRequireDefault(parseImage_1);





    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a;
    var CUBE_FACES = [{
      face: GL_TEXTURE_CUBE_MAP_POSITIVE_X,
      direction: 'right',
      axis: 'x',
      sign: 'positive'
    }, {
      face: GL_TEXTURE_CUBE_MAP_NEGATIVE_X,
      direction: 'left',
      axis: 'x',
      sign: 'negative'
    }, {
      face: GL_TEXTURE_CUBE_MAP_POSITIVE_Y,
      direction: 'top',
      axis: 'y',
      sign: 'positive'
    }, {
      face: GL_TEXTURE_CUBE_MAP_NEGATIVE_Y,
      direction: 'bottom',
      axis: 'y',
      sign: 'negative'
    }, {
      face: GL_TEXTURE_CUBE_MAP_POSITIVE_Z,
      direction: 'front',
      axis: 'z',
      sign: 'positive'
    }, {
      face: GL_TEXTURE_CUBE_MAP_NEGATIVE_Z,
      direction: 'back',
      axis: 'z',
      sign: 'negative'
    }];

    function getImageCubeUrls(_x, _x2) {
      return _getImageCubeUrls.apply(this, arguments);
    }

    function _getImageCubeUrls() {
      _getImageCubeUrls = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(getUrl, options) {
        var urls, promises, index, _loop, face;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                urls = {};
                promises = [];
                index = 0;

                _loop = function _loop(face) {
                  var faceValues = CUBE_FACES[index];
                  var promise = (0, loadImage_1.getImageUrls)(getUrl, options, _objectSpread(_objectSpread({}, faceValues), {}, {
                    index: index++
                  })).then(function (url) {
                    urls[face] = url;
                  });
                  promises.push(promise);
                };

                for (face in CUBE_FACES) {
                  _loop(face);
                }

                _context.next = 7;
                return Promise.all(promises);

              case 7:
                return _context.abrupt("return", urls);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _getImageCubeUrls.apply(this, arguments);
    }

    function loadImageCube(_x3) {
      return _loadImageCube.apply(this, arguments);
    }

    function _loadImageCube() {
      _loadImageCube = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(getUrl) {
        var options,
            urls,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
                _context2.next = 3;
                return getImageCubeUrls(getUrl, options);

              case 3:
                urls = _context2.sent;
                _context2.next = 6;
                return (0, deepLoad_1.deepLoad)(urls, _parseImage["default"], options);

              case 6:
                return _context2.abrupt("return", _context2.sent);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _loadImageCube.apply(this, arguments);
    }

    });

    var binaryImageApiDeprecated = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isBinaryImage = isBinaryImage;
    exports.getBinaryImageMIMEType = getBinaryImageMIMEType;
    exports.getBinaryImageSize = getBinaryImageSize;



    function isBinaryImage(arrayBuffer, mimeType) {
      var metadata = (0, binaryImageApi.getBinaryImageMetadata)(arrayBuffer);

      if (mimeType) {
        return Boolean(metadata && metadata.mimeType === mimeType);
      }

      return Boolean(metadata);
    }

    function getBinaryImageMIMEType(arrayBuffer) {
      var metadata = (0, binaryImageApi.getBinaryImageMetadata)(arrayBuffer);
      return metadata ? metadata.mimeType : null;
    }

    function getBinaryImageSize(arrayBuffer) {
      var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var metadata = (0, binaryImageApi.getBinaryImageMetadata)(arrayBuffer);

      if (metadata) {
        return {
          width: metadata.width,
          height: metadata.height
        };
      }

      mimeType = mimeType || 'unknown';
      throw new Error("invalid image data for type: ".concat(mimeType));
    }

    });

    var es5$2 = createCommonjsModule(function (module, exports) {



    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getSupportedImageType = getSupportedImageType;
    Object.defineProperty(exports, "ImageLoader", {
      enumerable: true,
      get: function get() {
        return _imageLoader["default"];
      }
    });
    Object.defineProperty(exports, "HTMLImageLoader", {
      enumerable: true,
      get: function get() {
        return _imageLoader["default"];
      }
    });
    Object.defineProperty(exports, "ImageWriter", {
      enumerable: true,
      get: function get() {
        return _imageWriter["default"];
      }
    });
    Object.defineProperty(exports, "getBinaryImageMetadata", {
      enumerable: true,
      get: function get() {
        return binaryImageApi.getBinaryImageMetadata;
      }
    });
    Object.defineProperty(exports, "isImageTypeSupported", {
      enumerable: true,
      get: function get() {
        return imageType.isImageTypeSupported;
      }
    });
    Object.defineProperty(exports, "getDefaultImageType", {
      enumerable: true,
      get: function get() {
        return imageType.getDefaultImageType;
      }
    });
    Object.defineProperty(exports, "isImage", {
      enumerable: true,
      get: function get() {
        return parsedImageApi.isImage;
      }
    });
    Object.defineProperty(exports, "getImageType", {
      enumerable: true,
      get: function get() {
        return parsedImageApi.getImageType;
      }
    });
    Object.defineProperty(exports, "getImageSize", {
      enumerable: true,
      get: function get() {
        return parsedImageApi.getImageSize;
      }
    });
    Object.defineProperty(exports, "getImageData", {
      enumerable: true,
      get: function get() {
        return parsedImageApi.getImageData;
      }
    });
    Object.defineProperty(exports, "loadImage", {
      enumerable: true,
      get: function get() {
        return loadImage_1.loadImage;
      }
    });
    Object.defineProperty(exports, "loadImageArray", {
      enumerable: true,
      get: function get() {
        return loadImageArray_1.loadImageArray;
      }
    });
    Object.defineProperty(exports, "loadImageCube", {
      enumerable: true,
      get: function get() {
        return loadImageCube_1.loadImageCube;
      }
    });
    Object.defineProperty(exports, "isBinaryImage", {
      enumerable: true,
      get: function get() {
        return binaryImageApiDeprecated.isBinaryImage;
      }
    });
    Object.defineProperty(exports, "getBinaryImageMIMEType", {
      enumerable: true,
      get: function get() {
        return binaryImageApiDeprecated.getBinaryImageMIMEType;
      }
    });
    Object.defineProperty(exports, "getBinaryImageSize", {
      enumerable: true,
      get: function get() {
        return binaryImageApiDeprecated.getBinaryImageSize;
      }
    });

    var _imageLoader = interopRequireDefault(imageLoader);

    var _imageWriter = interopRequireDefault(imageWriter);















    function getSupportedImageType() {
      return (0, imageType.getDefaultImageType)();
    }

    });

    var index$2 = /*@__PURE__*/unwrapExports(es5$2);

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

    index.registerLoaders([
        // jsonLoader,
        [
            // @ts-ignore
            index$2.ImageLoader,
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
    }(maptalks.TileLayer));
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
                    index.load(tile['url'], [index$2.ImageLoader])
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
            return index.load(elevationData, index$1.TerrainLoader, options);
        };
        Renderer.prototype.drawTile = function (tileInfo, tileImage) {
            var map = this.getMap();
            if (!tileInfo || !map || !tileImage || !this.regl || !this.command) {
                return;
            }
            var scale$1 = tileInfo._glScale = tileInfo._glScale || map.getGLScale(tileInfo.z);
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
            var x = point.x * scale$1;
            var y = point.y * scale$1;
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
            var uMatrix = identity(arr16);
            translate(uMatrix, uMatrix, v3);
            scale(uMatrix, uMatrix, [scale$1, scale$1, 1]);
            multiply(uMatrix, matrix, uMatrix);
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
                this.canvas2 = maptalks.Canvas.createCanvas(this.canvas.width, this.canvas.height);
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
                    this.regl = REGL__default['default']({
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
    }(maptalks.renderer.TileLayerCanvasRenderer));
    // @ts-ignore
    TerrainLayer.registerRenderer('gl', Renderer);

    exports.Renderer = Renderer;
    exports.default = TerrainLayer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
if(typeof window !== "undefined" && window.TerrainLayer) {
  window.TerrainLayer = window.TerrainLayer.default;
}
