var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
	name: String,// 分类名
	movies: [{
		type: ObjectId, 
		ref: 'Movie'
	}],// 该分类下的电影ID
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
CategorySchema.pre('save', function(next) {
	if (this.isNew) {// 判断数据是否是新增的
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next()
})

// 静态方法(不会直接与数据库交互,只有模型编译实例化后才会有该方法)
CategorySchema.statics = {
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
module.exports = CategorySchema

// 下面代码直接将模式导出为模型(不用再创建model文件)
// module.exports = mongoose.model('Movie', MovieSchema)


















