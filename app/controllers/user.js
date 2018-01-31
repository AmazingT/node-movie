const User = require('../models/user')

// 登录注册页面
exports.showSignup = (req, res) => {
    res.render('signup', {
        title: '注册'
    })
}

exports.showSignin = (req, res) => {
    res.render('signin', {
        title: '登录'
    })
}

// sign
exports.signin = (req, res) => {
    var _user = req.body.user
    var name = _user.name
    var pwd = _user.password

    //findOne()返回的是一个对象 find()返回的是一个数组(没有comparePassword方法)
    User.findOne({ name: name }, function(err, user) {
        if (err) {
            console.log(err)
        }

        //如果用户不存在
        if (!user) {
            return res.json({status: 0})
        }

        //用户提交的是明文密码，数据库密码是加密后的密码
        user.comparePassword(pwd, function(err, isMatch) {
            if (err) {
                console.log(err)
            }

            //密码正确
            if (isMatch) {
                //存放在内存 刷新后消失
                req.session.user = user

                return res.json({status: 1})
            } else {
                // 密码错误
                return res.json({status: 0})
            }
        })
    })
}

// logout
exports.logout = (req, res) => {
    delete req.session.user
    // delete app.locals.user

    res.redirect('/')
}

// register
exports.signup = (req, res) => {
    //bodyParser中间件会将post提交的数据格式化为一个对象
    //req.body.x / req.params.x / req.query.x
    var _user = req.body.user //获取提交数据的对象

    //注册时先检查数据库中是否已经有该用户名
    //User.find()返回的是一个数组
    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err)
        }

        //如果已经注册过则跳转至首页
        if (user) {
            return res.json({status: 0})
        } else {
            user = new User(_user)
            user.save(function(err, user) {
                if (err) {
                    console.log(err)
                }

                res.json({status: 1})
            })
        }
    })
}

// admin userlist page
exports.list = (req, res) => {
    // 数据库取出所有数据
    User.fetch(function(err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        })
    })
}


// midware for user login
exports.signinRequired = (req, res, next) => {
    var user = req.session.user

    // 未登录时
    if (!user) {
        return res.redirect('/signin')
    }

    next()
}

// midware for admin 
exports.adminRequired = (req, res, next) => {
    var user = req.session.user

    // 判断用户权限
    if (user.role ==="" || user.role == void(0) || user.role <= 10) {
        return res.redirect('/signin')
    }
    
    next()
}