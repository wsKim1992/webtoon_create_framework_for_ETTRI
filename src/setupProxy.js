const proxy = require("http-proxy-middleware");

module.exports = function(app){
    app.use('/colorLayer',{
        target:'http://1.201.8.82:9992',
        changeOrigin:true
    }),
    app.use(
        proxy('/request_image',{
            target:'http://1.201.8.82:9993',
            changeOrigin:true
        }),
    ),
    app.use(
        proxy('/static/log',{
            target:'http://1.201.8.82:9993',
            changeOrigin:true
        })
    ),
    app.use(
        '/user',
        proxy({
            target:'http://localhost:9993',
            changeOrigin:true
        })
    ),
    app.use(
        '/assets',
        proxy({
            target:'http://localhost:9992',
            changeOrigin:true
        })
    )
}