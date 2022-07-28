const proxy = require("http-proxy-middleware");

module.exports = function(app){
    app.use(
        proxy('/colorize',{
            target:'http://1.201.8.82:9991',
            changeOrigin:true,
            secure: false,
        })
    ),
    app.use(
        proxy('/request_image',{
            target:'http://1.201.8.82:9991',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        }),
    ),
    app.use(
        proxy('/colorLayer',{
            target:'http://1.201.8.82:9991',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        })
    )
    app.use(
        proxy('/static/log',{
            target:'http://1.201.8.82:9991',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        })
    ),
    app.use(
        '/user',
        proxy({
            target:'https://localhost:9997',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        })
    ),
    app.use(
        '/assets',
        proxy({
            target:'https://localhost:9997',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        })
    )
}