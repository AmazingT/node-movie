var mongoose = require('mongoose')

// 定义好了schema，接下来就是生成model
// model是由schema生成的模型，可以对数据库的操作

// 引入模式
var MovieSchema = require('../schemas/movie')
// 编译生成movie模型(模型名字,模式)
var Movie = mongoose.model('Movie', MovieSchema)

// 导出构造函数
module.exports = Movie