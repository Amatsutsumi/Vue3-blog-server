const express = require('express')
//创建路由
const router = express.Router()
const { db, genid } = require('../db/DbUtils')

//配置路由里的路由,异步函数
router.get('/test', async (req, res) => {
    // db.all('select * from `admin`', [], (err, rows) => {
    //     //查询数据
    //     console.log(rows)
    // })

    //等到查询完成
    let out = await db.async.all("select * from `admin`", [])
    res.send({
        id: genid.NextId(),
        out
    })
})

//暴露出去
module.exports = router