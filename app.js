var express = require('express');
var path = require('path');
// view engine setup
const requestIp = require("request-ip");
const proxy = require('http-proxy-middleware');
const config = require("./service.config.js");
var app = express();
app.use((req,res,next)=>{
    console.log("ip2:"+requestIp.getClientIp(req))
   let fun =  proxy('/myapi', {
        target: config.serviceIP,
        changeOrigin:true,
        pathRewrite: {
            "^/myapi": "/" // 把/api 变成空
        }
    });
    req.headers['X-Real-IP'] =requestIp.getClientIp(req);
   fun(req,res,next);

});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api', require("./src/setupProxy")(app));

// catch 404 and forward to error handler
// 监听端口
app.listen(config.port, (e) => {

    console.log(e);
    console.log(`启动服务器=> http://localhost:${config.port}`);
})
module.exports = app;
