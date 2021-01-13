/*!
 * author: sakitam-fdd <smilefdd@gmail.com>
 * maptalks-regl v1.0.0
 * build-time: 2021-1-13 14:3
 * LICENSE: MIT
 * (c) 2020-2021 https://github.com/sakitam-gis/simple-terrain-viz
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('regl'), require('maptalks')) :
    typeof define === 'function' && define.amd ? define(['exports', 'regl', 'maptalks'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TerrainLayer = {}, global.createREGL, global.maptalks));
}(this, (function (exports, REGL, maptalks) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var REGL__default = /*#__PURE__*/_interopDefaultLegacy(REGL);

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
    var _extendStatics = function extendStatics(d, b) {
      _extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) {
          if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        }
      };

      return _extendStatics(d, b);
    };

    function __extends(d, b) {
      if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

      _extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

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

    var forEach = function () {
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
    }();

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

    var forEach$1 = function () {
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
    }();

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

    var rotationTo = function () {
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
    }();
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

    var sqlerp = function () {
      var temp1 = create$3();
      var temp2 = create$3();
      return function (out, a, b, c, d, t) {
        slerp(temp1, a, d, t);
        slerp(temp2, b, c, t);
        slerp(out, temp1, temp2, 2 * t * (1 - t));
        return out;
      };
    }();
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

    var setAxes = function () {
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
    }();

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

    var forEach$2 = function () {
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
    }();

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
    }(maptalks.TileLayer);
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

        var scale$1 = tileInfo._glScale = tileInfo._glScale || map.getGLScale(tileInfo.z);
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
        var x = point.x * scale$1;
        var y = point.y * scale$1;
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
        var uMatrix = identity(arr16);
        translate(uMatrix, uMatrix, v3);
        scale(uMatrix, uMatrix, [scale$1, scale$1, 1]);
        multiply(uMatrix, matrix, uMatrix);
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
          this.canvas2 = maptalks.Canvas.createCanvas(this.canvas.width, this.canvas.height);
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
            this.regl = REGL__default['default']({
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
                enable: false
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
    }(maptalks.renderer.TileLayerCanvasRenderer);

    TerrainLayer.registerRenderer('gl', Renderer);

    exports.Renderer = Renderer;
    exports.default = TerrainLayer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
if(typeof window !== "undefined" && window.TerrainLayer) {
  window.TerrainLayer = window.TerrainLayer.default;
}
