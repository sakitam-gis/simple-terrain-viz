precision mediump float;
varying vec2 v_texCoord;
varying float v_height;
uniform sampler2D u_tile;
uniform float u_opacity;

void main() {
  vec4 color = texture2D(u_tile, v_texCoord);

  gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
}
