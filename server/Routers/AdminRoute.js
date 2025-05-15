const express = require('express')
//创建路由
const router = express.Router()
const { db, genid } = require('../db/DbUtils')
const { v4: uuid4 } = require('uuid')

//写登录接口
// router.post('/login', async (req, res) => {
//     const { account, password } = req.body;
//     try {
//         let result = await db.async.all("SELECT * FROM `admin` WHERE `name` = ? AND `password` = ?", [account, password]);
//         if (result.err) {
//             console.error('Database query error:', result.err);
//             return res.status(500).send({ code: 500, msg: '登录失败' });
//         }
//         let rows = result.rows;
//         if (!rows || rows.length === 0) {
//             return res.status(401).send({ code: 401, msg: '账号或密码错误' });
//         }

//         const login_token = uuid4();
//         const update_token_sql = "UPDATE `admin` SET `token` = ? WHERE `id` = ?";
//         await db.async.run(update_token_sql, [login_token, rows[0].id]);

//         const admin_info = rows[0];
//         admin_info.token = login_token;
//         admin_info.password = '';

//         res.send({
//             code: 200,
//             msg: '登录成功',
//             data: admin_info
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send({ code: 500, msg: '登录失败' });
//     }
// });

router.post('/login', async (req, res) => {
    //获得前端给的账号密码
    const { account, password } = req.body
    let { err, rows } = await db.async.all("SELECT * FROM `admin` WHERE `name` = ? AND `password` = ?", [account, password]);
    //进行更新sql

    if (err == null && rows.length > 0) {
        let login_token = uuid4()
        const update_tkoen_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"
        //更新token
        await db.async.run(update_tkoen_sql, [login_token, rows[0].id])
        //获取用户信息
        let admin_info = rows[0]
        //因为异步执行、防止其还没执行到token没更新
        admin_info.token = login_token
        //保护安全我们清空密码
        admin_info.password = ''
        res.send({
            code: 200,
            msg: '登陆成功',
            data: admin_info
        })
    } else {
        res.send({
            code: 500,
            msg: '登录失败'
        })
    }

})


//暴露出去
module.exports = router