attribute vec2 a_pos;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
uniform sampler2D u_image;
uniform float u_extrude_scale;

varying vec2 v_texCoord;
varying float v_height;
void main() {
  v_texCoord = a_texCoord;

  vec3 rgb = texture2D(u_image, v_texCoord).rgb;
  float height = -10000.0 + ((rgb.r * 255.0 * 256.0 * 256.0 + rgb.g * 255.0 * 256.0 + rgb.b * 255.0) * 0.1);

  v_height = height;

  gl_Position = u_matrix * vec4(a_pos.xy, height * u_extrude_scale, 1.0);
}
