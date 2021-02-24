console.log(__dirname);
const tsPlugin = require('rollup-plugin-ts');

module.exports = {
    input: 'index.ts',
    format: 'cjs',
    plugins: [
        tsPlugin({
            tsconfig: "tsconfig.json"
        }),
    ],
    output: [
        { dir: 'dist/great-cli.cjs.js',  format: 'cjs' },
        { dir: 'dist/great-cli.js',  format: 'es' }
    ]
}