//引用数据库
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const Genid = require('../utils/SnowFlake')

//创建数据库和雪花id
let db = new sqlite3.Database(path.join(__dirname, 'blog.sqlite3'))
const genid = new Genid({ WorkerId: 1 })

//写异步方法和Promise
db.async = {}

db.async.all = (sql, params) => {
    //返回一个promise
    return new Promise((resolve, err) => {
        db.all(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}

db.async.run = (sql, params) => {
    return new Promise((resolve, err) => {
        db.run(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}

//暴露出去
module.exports = { db, genid }