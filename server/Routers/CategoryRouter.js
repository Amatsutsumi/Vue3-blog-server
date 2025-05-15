const express = require('express')
//创建路由
const router = express.Router()
const { db, genid } = require('../db/DbUtils')

//异步函数:列表删除更新插入

//列表接口
router.get('/list', async (req, res) => {
    const list_sql_senetnce = 'SELECT * FROM `category`'
    let { err, rows } = await db.async.all(list_sql_senetnce, [])
    if (err == null) {
        res.send({
            code: 200,
            msg: '全部列表',
            rows
        })
    } else {
        res.send({
            code: 404,
            msg: '失败！'
        })
    }
})

//删除接口
//delete方法的特殊性：调用：localhost:8080/category/delete?id=1
router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id
    const delete_sql_sentence = "DELETE FROM `category` WHERE `id` = ?"
    let { err, rows } = await db.async.run(delete_sql_sentence, [id])
    if (err == null) {
        res.send({
            code: 200,
            msg: '删除成功！'
        })
    } else {
        res.send({
            code: 404,
            msg: '删除失败！'
        })
    }
})

//更新接口，更新多用put
router.put("/_token/update", async (req, res) => {
    let { id, name } = req.body
    const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?"
    let { err, rows } = await db.async.run(update_sql, [name, id])

    if (err == null) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.send({
            code: 200,
            msg: "修改失败"
        })
    }
})

//插入接口
router.post('/_token/add', async (req, res) => {
    let { name } = req.body
    //写sql语句
    const add_sql_sentence = "INSERT INTO `category` (`id`,`name`) VALUES (?,?)"
    //执行
    let { err, rows } = await db.async.run(add_sql_sentence, [genid.NextId(), name])
    if (err == null) {
        res.send({
            code: 200,
            msg: '插入成功！'
        })
    } else {
        res.send({
            code: 404,
            msg: '插入失败！'
        })
    }
})


//暴露出去
module.exports = router