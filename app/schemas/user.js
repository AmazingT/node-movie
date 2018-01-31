var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

const SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	//0:normal user 1:verified user 2:professional user
	//>10: admin >50: super admin
	role: {
		type: Number,
		default: 0 //普通用户
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

// 添加实例方法
UserSchema.methods = {
	comparePassword: function(_pwd, cb) {
		bcrypt.compare(_pwd, this.password, function(err, isMatch) {
			if (err) return cb(err)

			cb(null, isMatch)
		})
		// bcrypt.compare(submitPwd, hashPwd).then((res) => {})
	}
}

// 模式添加一个方法(每次存储数据之前都要调用pre这个方法)
UserSchema.pre('save', function(next) {
    var user = this

    if (this.isNew) { // 判断数据是否是新增的
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    // 使用bcyptjs进行密码的加密
    // 生成随机的salt(随机的盐和密码进行hash)
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            // Store hash in your password DB.
            user.password = hash
            next()
        })
    })
})

// 静态方法(不会直接与数据库交互,只有模型编译实例化后才会有该方法)
UserSchema.statics = {
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
module.exports = UserSchema

// 下面代码直接将模式导出为模型(不用再创建model文件)
// module.exports = mongoose.model('Movie', MovieSchema)


















