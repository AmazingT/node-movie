const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
// 该中间件的作用是把session存在了MongoDB中(默认express-session是把session存在内存中)
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const logger = require('morgan') // 日志处理
// multipart/form-part表单数据处理
const multipart = require('connect-multiparty')

// 命令行中可设置端口(PORT=8080 node app.js)
const PORT = process.env.PORT || 3001 //默认3000 也可从命令行中设置端口启动
var app = express()

var env = process.env.NODE_ENV || 'development'
// 默认连接服务器MongoDB数据
var dburl = 'mongodb://imooc_user:zb@127.0.0.1:19999/imooc'

// 开发环境下连接本地数据库
if (env === 'development') {
	dburl = 'mongodb://127.0.0.1:27017/imooc'
}
const db = mongoose.connection

// MongoDB数据库连接
mongoose.Promise = global.Promise
mongoose.connect(dburl, {
	useMongoClient: true
})

db.on('connected', function() {
	console.log('数据库连接成功')
})
  
db.on('error', function(err) {
	console.log('数据库连接失败:' + err)
})

db.on('disconnected', function() {
	console.log('数据库断开连接')
})

// 告诉Express如果有静态资源请求就去public目录下查找
app.use(express.static(path.join(__dirname, 'public')))
app.use(multipart()) // 文件处理
// session存储用户名和密码
app.use(session({
	secret: 'imooc',//通过设置secret来计算hash值并放在cookie中，使产生signedCookie防篡改
	// resave: false,//true(每次请求都会重新设置session的cookie)
	// saveUnitialized: true,//无论有没有session的cookie,每次请求都设置一个session cookie
	store: new MongoStore({
		url: dburl,
		collection: 'sessions' //表名
	})
}))
// parse application/x-www-form-urlencoded(表单数据格式化)
// extended: false => 值为'String'或'Array'形式
// extended: true => 值可为任何数据类型 一开始并没有_id这个字段，所以他会为undefined
app.use(bodyParser.urlencoded({ extended: true }))//设置express中间件，对数据格式文本化
// parse application/json
// app.use(bodyParser.json())

// app.locals对象是一个js对象，其属性就是程序本地的变量
// 一旦设定，app.locals的各属性值将贯穿程序的整个生命周期
app.locals.moment = require('moment')

// 设置HTML页面模板引擎
app.set('views', './app/views/pages')
app.set('view engine', 'jade')

// 启动服务
app.listen(PORT, () => {
    console.log(`imooc started on port ${PORT}`)
})

// 开发环境配置
if ('development' === env) {
	// 开发环境下
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true // 页面源码格式化(不需要压缩)
	mongoose.set('debug', true)
}

// 引入路由
require('./config/routes')(app)