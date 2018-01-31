var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
// schema是mongoose里用到的一种数据模式，可以理解为表结构的定义；
// 每个schema会映射到MongoDB中的一个collection，它不具备操作数据
// 库的能力
var MovieSchema = new Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	pv: {
		type: Number,
		default: 0
	},
	category: {
		type: ObjectId,
		ref: 'Category'
	},
	meta: { // 录入或更新数据时的时间记录
		createAt: { // 创建时间
			type: Date,
			default: Date.now()
		},
		updateAt: { // 更新时间
			type: Date,
			default: Date.now()
		}
	}
})

// 模式添加一个方法(每次存储数据之前都要调用pre这个方法)
MovieSchema.pre('save', function(next) {
	if (this.isNew) {// 判断数据是否是新增的
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next()
})

// 静态方法(不会直接与数据库交互,只有模型编译实例化后才会有该方法)
MovieSchema.statics = {
	// 取出数据库中所有的数据
	fetch: function(cb) {
	  return this
	    .find({})
	    .sort('meta.updateAt') //按照更新时间排序
	    .exec(cb) //执行回调方法
	},
	// 查询单条数据
	findById: function(id, cb) {
	  return this
	    .findOne({_id: id})
	    .exec(cb)
	}
}

// 模式导出
module.exports = MovieSchema

// 下面代码直接将模式导出为模型(不用再创建model文件)
// module.exports = mongoose.model('Movie', MovieSchema)


















