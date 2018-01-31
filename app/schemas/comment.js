var mongoose = require('mongoose')

var Schema = mongoose.Schema
// ObjectId实现关联文档的查询(Populate)
var ObjectId = Schema.Types.ObjectId

// 评论表(评论人,评论的电影,回复人,评论内容)
var CommentSchema = new mongoose.Schema({
	movie: {// 当前评论的电影
		type: ObjectId,
		ref: 'Movie' // 指向Movie模型(关联文档)
	},
	from: {// 评论人
		type: ObjectId,
		ref: 'User'
	},
	reply: [{
		from: {type: ObjectId, ref: 'User'},
		to: {type: ObjectId, ref: 'User'},
		content: String
	}],
	content: String, // 评论内容
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
CommentSchema.pre('save', function(next) {
	if (this.isNew) {// 判断数据是否是新增的
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next()
})

// 静态方法(不会直接与数据库交互,只有模型编译实例化后才会有该方法)
CommentSchema.statics = {
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
module.exports = CommentSchema

// 下面代码直接将模式导出为模型(不用再创建model文件)
// module.exports = mongoose.model('Movie', MovieSchema)


















