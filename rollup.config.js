import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import istanbul from 'rollup-plugin-istanbul';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';

// define common plugins
const plugins = [
    babel({
        exclude: 'node_modules/**',
        include: './src/**/*.js',
        plugins: ['external-helpers'],
    }),
    eslint(),
];

// instrument files for code coverage reporting
if (process.env.NODE_ENV === 'test') {
    plugins.push(istanbul({
        exclude: [
            'test/**/*',
            'node_modules/**/*',
        ],
    }));
}

export default [
    // Browser friendly UMD build.
    {
        input: 'src/index.js',
        output: {
            file: pkg.browser,
            format: 'umd',
        },
        name: 'VueAnalytics',
        plugins: [
            resolve(),
            commonjs(),
        ].concat(plugins),
    },

    // CommonJS (for Node) and ES module (for bundlers) build
    {
        input: 'src/index.js',
        external: [],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ],
        plugins: plugins,
    },
];
