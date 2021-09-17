const proxy = require("http-proxy-middleware");

module.exports = function(app){
    app.use(
        proxy('/request_image',{
            target:'http://localhost:8001',
            changeOrigin:true
        }),
    ),
    app.use(
        proxy('/static/log',{
            target:'http://localhost:8001',
            changeOrigin:true
        })
    )
}