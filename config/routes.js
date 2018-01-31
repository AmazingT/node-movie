const Index = require('../app/controllers/index')
const User = require('../app/controllers/user')
const Movie = require('../app/controllers/movie')
const Comment = require('../app/controllers/comment')
const Category = require('../app/controllers/category')

module.exports = function(app) {
    // 获取用户登录session的中间件
    app.use((req, res, next) => {
        let _user = req.session.user
        app.locals.user = _user
        // 类似于Promise.resolve(),next(err) 类似Promise.reject()
        next()
    })

    // Index
    app.get('/', Index.index)

    // Movie
    app.get('/movie/:id', Movie.detail)
    app.get('/admin/movie/add', User.signinRequired, User.adminRequired, Movie.add)
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save)
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

    // User
    app.post('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.post('/user/signup', User.signup)
    // 使用中间件实现登录和管理员权限验证
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

    //Comment
    app.post('/user/comment', User.signinRequired, Comment.save)

    //Category
    app.get('/admin/category/add', User.signinRequired, User.adminRequired, Category.add)
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

    //Categories Paging
    app.get('/category/results', Index.categorylist)
    app.get('/search/results', Index.searchlist)
}