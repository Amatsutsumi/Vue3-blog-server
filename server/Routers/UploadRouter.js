const express = require('express')
//创建路由
const router = express.Router()
const fs = require('fs')
const { db, genid } = require('../db/DbUtils')

//配置路由里的路由,异步函数
router.post('/rich_editor_upload', async (req, res) => {
    //判断文件类型
    if (!req.files) {
        res.send({
            "errno": 1,
            "message": "上传失败"
        })
        return
    }
    let files = req.files
    let ret_files = []

    //写循环
    for (let file of files) {
        //获取文件后缀,file.originalname有扩展名、file.filename没有
        let file_Suffix = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        let file_name = genid.NextId() + "." + file_Suffix
        fs.renameSync(
            //process.cwd()为app.js所在的根目录的路径
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name
        )
        ret_files.push("/upload/" + file_name)
    }
    res.send({
        "errno": 0,
        "data": {
            "url": ret_files[0]
        }

    })
})

//暴露出去
module.exports = router