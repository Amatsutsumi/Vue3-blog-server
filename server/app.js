const express = require('express')
const multer = require('multer')
const path = require('path')
const { db, genid } = require('./db/DbUtils')
//创建实例
const app = express()
const port = 8080

//设置跨域
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', '*')
    res.set('Access-Control-Allow-Methods', 'DELETE,PUT,GET,POST,OPTIONS')
    if (req.method == 'OPTIONS') res.sendStatus(200)
    else next()
})

//设置中间件
app.use(express.json())
//处理上传功能
const update = multer({
    //目标路径
    dest: './public/upload/temp'
})
app.use(update.any())

//静态文件目录
app.use(express.static(path.join(__dirname, "public")))

//配置路由
app.get('/', (req, res) => {
    res.send('hello world!')
})

//中间件处理token，全局中间件用next
const ADMIN_TOKEN_PATH = "/_token"
app.all('/*splat', async (req, res, next) => {
    //首先判断路由是否包含token路径,indexOf会返回字符串的位置的索引，不包含则是-1
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        let { token } = req.headers
        let token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(token_sql, [token])
        if (adminResult.err != null || adminResult.rows.length == 0) {
            res.send({
                code: 404,
                msg: "请先登录！"
            })
            return
        } else {
            next()
        }
    } else {
        next()
    }
})

//注册路由
app.use('/test', require('./Routers/TestRouter'))
app.use('/admin', require('./Routers/AdminRoute'))
app.use('/category', require('./Routers/CategoryRouter'))
app.use('/blog', require('./Routers/BlogRouter'))
app.use('/upload', require('./Routers/UploadRouter'))

//设置端口
app.listen(port, () => {
    console.log(`地址是：localhost:${port}`)
})
