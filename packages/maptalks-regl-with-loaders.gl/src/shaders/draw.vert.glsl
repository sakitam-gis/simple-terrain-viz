attribute vec3 a_pos;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
uniform float u_tile_size;
uniform float u_extrude_scale;

varying vec2 v_texCoord;
varying float v_height;
void main() {
  v_texCoord = a_texCoord;

  v_height = a_pos.z;

  gl_Position = u_matrix * vec4(a_pos.x * u_tile_size, (a_pos.y - 1.0) * u_tile_size, a_pos.z * u_extrude_scale, 1.0);
}
