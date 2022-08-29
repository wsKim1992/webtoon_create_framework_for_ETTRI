const proxy = require("http-proxy-middleware");

module.exports = function(app){
    app.use(proxy('/animation',{
        target:'http://1.201.8.82:9995',
        changeOrigin:true,
        secure: false,
    })),
    app.use(
        proxy('/static/log_exp',{
            target:'http://1.201.8.82:9995',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        })
    ),
    app.use(
        proxy('/colorize',{
            target:'http://1.201.8.82:9991',
            changeOrigin:true,
            secure: false,
        })
    ),
    app.use(
        proxy('/hint_colorize',{
            target:'http://1.201.8.82:9991',
            changeOrigin:true,
            secure: false,
        })
    ),
    app.use(
        proxy('/cartoonize',{
            target:'http://1.201.8.82:9999',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        }),
    ),
    app.use(
        proxy('/static/logs_cartoonize',{
            target:'http://1.201.8.82:9999',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
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
            target:'http://localhost:9993',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        })
    ),
    app.use(
        '/assets',
        proxy({
            target:'http://localhost:9993',
            changeOrigin:true,
            secure: false,
            rejectUnauthorized: false
        })
    )
}