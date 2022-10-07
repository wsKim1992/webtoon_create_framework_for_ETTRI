const proxy = require("http-proxy-middleware");

module.exports = function(app){
<<<<<<< HEAD
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
=======
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
        proxy('/hint_colorize_v2',{
            target:'http://1.201.8.82:9991',
            changeOrigin:true,
            secure: false,
        })
    ),
    app.use(
        proxy('/hint_colorize_v3',{
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
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
        })
    )
}