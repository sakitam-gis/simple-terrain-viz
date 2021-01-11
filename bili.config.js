import fs from 'fs-extra';
import path from 'path';

// eslint-disable-next-line no-unused-vars
const json = fs.readJsonSync(path.resolve('./package.json'));

const namePath = 'moji-viz';

const config = {
  babel: undefined,
  input: 'src/index.js',
  output: {
    format: ['cjs', 'umd', 'umd-min', 'esm'],
    moduleName: 'moji',
  },
  extendConfig(config, { format }) {
    if (format.startsWith('umd')) {
      config.output.fileName = `${namePath}[min].js`;
      config.output.sourceMap = true;
    }
    if (format === 'esm') {
      config.output.fileName = `${namePath}.esm.js`;
    }
    if (format === 'cjs') {
      config.output.fileName = `${namePath}.cjs.js`;
    }
    config.externals = [];
    return config;
  },
  extendRollupConfig: (config) => {
    if (config.outputConfig.format === 'umd') {
      config.outputConfig.sourceMap = true;
      /** Disable warning for default imports */
      config.outputConfig.exports = 'named';
      // it seems the umd bundle can not satisfies our demand
      // config.outputConfig.footer = 'if(typeof window !== "undefined" && window.moji) { \n'
      //   + '  window.moji = window.moji.default;\n}';
    }
    config.externals = [];
    return config;
  },
  banner: '/* moji-viz */',
  plugins: {
    glslify: {}
    // 'node-polyfills': {}
  },
  // globals: {
  // },
  // externals: [
  // ],
};

export default config;
