const {override, fixBabelImports, addLessLoader, addBundleVisualizer} = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        // modifyVars: { '@primary-color': '#a50e3c' }
    }),
    addBundleVisualizer({
        "analyzerMode": "server",
        "analyzerHost": "127.0.0.1",
        "openAnalyzer": true,
        "analyzerPort": 8888,
    })
);