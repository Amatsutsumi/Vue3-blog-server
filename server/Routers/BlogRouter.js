const express = require('express')
//创建路由
const router = express.Router()
const { db, genid } = require('../db/DbUtils')

//异步函数:列表删除更新插入

//查询接口list
router.get('/search', async (req, res) => {
    //获取数据
    let { keyword, categoryid, pages, pagesize } = req.query
    //没有填数据时的处理
    keyword = keyword == null ? "" : keyword
    categoryid = categoryid == null ? 0 : categoryid
    pages = pages == null ? 1 : pages
    pagesize = pagesize == null ? 10 : pagesize

    //查询语句填写
    let wheresql = []
    let params = []
    //处理关键词搜索
    if (keyword != null) {
        wheresql.push("(`title` LIKE ? OR `content` LIKE ?)")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }
    //处理categoryid搜索
    if (categoryid != 0) {
        wheresql.push("`category_id` = ?")
        params.push(categoryid)
    }
    let whereSqlStr = ""
    if (wheresql.length > 0) {
        //合并sql语句
        whereSqlStr = "WHERE" + wheresql.join("AND")
    }

    //查询语句
    let searchSql = "SELECT * FROM `blog`" + whereSqlStr + "ORDER BY `create_time` DESC LIMIT ?,?"
    let searchSqlParams = params.concat([pages - 1] * pagesize, pagesize)

    //查询数据语句
    let searchCountSql = "SELECT count(*) AS `count` FROM `blog`" + whereSqlStr
    let searchCountParams = params

    //执行查询
    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let searchCountResult = await db.async.all(searchCountSql, searchCountParams)

    //查询情况
    if (searchResult.err == null && searchCountResult.err == null) {
        res.send({
            code: 200,
            msg: '查询成功！',
            data: {
                keyword,
                categoryid,
                pages,
                pagesize,
                rows: searchResult.rows,
                count: searchCountResult.rows[0].count
            }
        })
    } else (res.send({
        code: 404,
        msg: '查询失败！'
    }))

})

//update接口

router.put('/_token/update', async (req, res) => {
    let { id, title, categoryid, content } = req.body
    let creat_time = new Date().getTime()
    const update_sql = "UPDATE `blog` SET `title` = ?,`category_id`=?,`content`=? WHERE `id` = ?"
    let { err, rows } = await db.async.run(update_sql, [title, categoryid, content, id])
    if (err == null) {
        res.send({
            code: 200,
            msg: '修改成功！'
        })
    } else {
        res.send({
            code: 404,
            msg: '修改失败！'
        })
    }

})

//删除的接口
router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id
    const delete_sql = "DELETE FROM `blog` WHERE `id` = ?"
    let { err, rows } = await db.async.run(delete_sql, [id])
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

//增添接口
router.post('/_token/add', async (req, res) => {
    let { title, categoryid, content } = req.body
    let id = genid.NextId()
    let create_time = new Date().getTime()
    const add_sql = "INSERT INTO `blog`(`id`,`category_id`,`title`,`content`,`create_time`) VALUES(?,?,?,?,?)"
    let { err, rows } = await db.async.run(add_sql, [id, categoryid, title, content, create_time])
    if (err == null) {
        res.send({
            code: 200,
            msg: '发布成功！'
        })
    } else {
        res.send({
            code: 404,
            msg: '发布失败'
        })
    }

})
//暴露出去
module.exports = router