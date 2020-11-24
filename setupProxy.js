const proxy = require('http-proxy-middleware');
let serverConfig = (function () {
    let path = require("path");
    let serverFile = path.resolve(__dirname, "./service.config.js");
    return require(serverFile);
})();
module.exports = function(app) {
    // /api 表示代理路径 window["_CONCAT_API"] = '/api';
    // target 表示目标服务器的地址
    app.use(
        proxy('/api', {
            target: serverConfig.serviceIP,
            // 跨域时一般都设置该值 为 true
            changeOrigin: true,
            // 重写接口路由
            pathRewrite: {
                '^/api': ''
            }
        })
    )
}