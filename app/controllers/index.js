const Movie = require('../models/movie') // 引入当前路径下的模型
const Category = require('../models/category')
// const PageQuery = require('../controllers/page')

// index page
exports.index = (req, res, next) => {
    Category
        .find({}) // 从数据库中查出所有数据
        .populate({
            path: 'movies', 
            options: {limit: 10}
        })
        .exec(function(err, categories) {
            if (err) {
                console.log(err)
            }
            // 返回渲染后的页面
            res.render('index', {
                title: '我爱看电影',
                categories: categories // 数据库查询返回的数据赋给movies
            })
        })
}

// 电影类别分页
exports.categorylist = (req, res) => {
    var catId = req.query.cat // 获取用户点击的类别
    var page = +req.query.page || 1 // 获取页码
    var count = 5 // 每次查找2条数据
    var index = (page - 1 ) * count // 每一页从何处开始查

    // 用户点击类别
    Category
        .findOne({_id: catId})
        .populate({
            path: 'movies',
            select: 'title poster'
            // options: {limit: count, skip: index} // 从index开始查找,查找2条数据
        })
        .exec(function(err, category) {
            if (err) {
                console.log(err)
            }

            var category_title = category.name || ''
            var movies = category.movies || [] // 某个分类下的所有电影
            var records = movies.slice(index, index + count)
            var pageCount = Math.ceil(movies.length / count)

            // 返回渲染后的页面
            res.render('category_result', {
                title: '电影分类结果列表',
                keyword: category_title,
                currentPage: page,
                query: 'cat=' + catId,
                totalPage: pageCount,
                movies: records // 数据库查询返回的数据赋给movies
            })
        })
}

// 电影搜索结果
exports.searchlist = (req, res) => {
    var key = req.query.key // 获取搜索关键字

    // 搜索电影
    Movie
        .find({title: {$regex: key + '.*', $options: 'i'}})
        .exec(function(err, movies) {
            if (err) {
                console.log(err)
            }

            // 返回渲染后的页面
            res.render('search_result', {
                title: '电影搜索结果列表',
                keyword: key,
                movies: movies // 数据库查询返回的数据赋给movies
            })
        })
}