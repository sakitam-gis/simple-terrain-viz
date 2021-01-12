/**
 * create gl context
 * @param canvas
 * @param glOptions
 * @returns {null|*}
 */
const createContext = function (canvas: HTMLCanvasElement, glOptions = {}) {
  if (!canvas) return null;
  function onContextCreationError (error: any) {
    console.log(error.statusMessage);
  }
  if (canvas && canvas.addEventListener) {
    canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
  }
  let gl = canvas.getContext('webgl', glOptions);
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

let devicePixelRatio = 1;
// fixed: ssr render @link https://github.com/gatsbyjs/gatsby/issues/25507
if (typeof window !== 'undefined') {
  // @ts-ignore
  devicePixelRatio = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
}

function getDevicePixelRatio () {
  return devicePixelRatio;
}

export function getUrl(template: string | string[], properties: {
  x: number;
  y: number;
  z: number;
}) {
  if (!template || !template.length) {
    return null;
  }
  if (Array.isArray(template)) {
    const index = Math.abs(properties.x + properties.y) % template.length;
    template = template[index];
  }

  const { x, y, z } = properties;
  return template
    .replace('{x}', String(x))
    .replace('{y}', String(y))
    .replace('{z}', String(z))
    .replace('{-y}', String(Math.pow(2, z) - y - 1));
}

export {
  createContext,
  getDevicePixelRatio
};
