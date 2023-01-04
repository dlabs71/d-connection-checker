import {babel} from "@rollup/plugin-babel";
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import del from "rollup-plugin-delete";

export default [{
    input: 'src/index.js',
    output: [
        {
            file: 'dist/d-connection-checker.umd.min.js',
            format: 'umd',
            name: 'd-connection-checker'
        },
        {
            file: 'dist/d-connection-checker.cjs.min.js',
            format: 'cjs',
            name: 'd-connection-checker'
        },
        {
            file: 'dist/d-connection-checker.esm.min.js',
            format: 'esm',
            name: 'd-connection-checker'
        }
    ],
    plugins: [
        del({targets: "dist/*"}),
        nodeResolve(),
        babel({
            babelrc: false,
            exclude: "**/node_modules/**",
            presets: [
                "@babel/preset-env"
            ],
            plugins: [
                "@babel/plugin-transform-runtime",
            ],
            babelHelpers: "runtime"
        }),
        commonjs(),
        terser()
    ],
}];