const Movie = require('../models/movie')
const Category = require('../models/category')
const Comment = require('../models/comment')
const _ = require('underscore')
// 文件上传
const fs = require('fs')
const path = require('path')

// movie detail page
exports.detail = (req, res) => {
    var id = req.params.id

    // 访问量(每次增加1)
    Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
        if (err) {
            console.log(err)
        }
    })
    // 根据路径中传入的ID来获取某一条新闻
    Movie.findById(id, function(err, movie) {
        // 根据电影的ID来找到该电影的评论
        // 关联查询用户的名字
        /* Query.populate(path, [select], [model], [match], [options])
           path: 指定填充的关联字段 多个字段空格分隔
           select: 指定填充document哪些字段
           model: 可选 指定关联字段的model 没有指定 使用Schema的ref
           match: 可选 指定附加查询条件
           options: 可选 指定附加的其他查询选项 如排序及条数限制
        */
        Comment
            .find({movie: id})
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                res.render('detail', {
                    title: 'imooc detail',
                    movie: movie,
                    comments: comments
                })
            })
    })
}

// admin movie add
exports.add = (req, res) => {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: 'imooc 后台录入页',
            categories: categories,
            movie: {}
        })
    })
}

// admin update movie
exports.update = (req, res) => {
    var id = req.params.id

    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                if (err) {
                    console.log(err)
                }
                res.render('admin', {
                    title: 'imooc 后台更新页',
                    movie: movie,
                    categories: categories
                })
            })
        })
    }
}

// admin poster upload midware
exports.savePoster = (req, res, next) => {
    var posterData = req.files.uploadPoster // 获取上传文件对象
    var filePath = posterData.path // 获取该文件在服务器上的缓存地址
    var originalFilename = posterData.originalFilename // 获取文件名
    /* 上传图片的req.files格式
     * {
     *   uploadPoster: {
           filedName: 'uploadPoster',
           originalFilename: '1.jpeg',
           path: '/var...缓存服务器地址/1.jpeg',
           headers:{
             'content-disposition': 'form-data; name="uploadPoster"; filename="1.jpeg"',
             'content-type': 'image/jpeg'
           },
           ws: {...},
           size: 8497,
           name: '1.jpeg',
           type: 'iamge/jpeg'
         }
     * }
     *
    */
    // 如果有文件上传
    if (!!originalFilename) {
        // 读取文件数据(优化：异步执行)
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now()
            var type = posterData.type.split('/')[1]
            var poster = timestamp + '.' + type
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster) // 生成一个地址
            
            // 写入数据到服务器下
            fs.writeFile(newPath, data, function(err) {
                req.poster = poster
                next()
            })
        })
    } else {
        next()
        // 进行Movie.save
    }
}

// admin post movie(后台提交的数据)
exports.save = (req, res) => {
    var id = req.body.movie._id
    var movieObj = req.body.movie //更新后的数据(后台录入的数据)
    var _movie

    // 如果海报地址是通过上传获取时
    if (!!req.poster) {
        movieObj.poster = req.poster
    }

    if (!!id) { // (数据库中已存在)对数据进行更新(void(0))
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err)
            }
            // 后台提交的电影数据替换掉数据库中该条电影的数据(更新)
            _movie = _.extend(movie, movieObj)
            // _movie = Object.assign({}, movie, movieObj)
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err)
                }

                Category.find({}, function(err, category) {
                    category.forEach(function(item) {
                        item.movies.forEach(function(movieId, index) {
                            if (movieId == id) {
                                item.movies.splice(index, 1)
                                item.save()
                            }
                        })
                    })
                })

                var categoryId = movie.category

                // 在类别中保存该电影ID
                Category.findById(categoryId, function(err, category) {
                    // category.movies.push(_movie._id)

                    category.update({$addToSet: {movies: _movie._id}}, function(err, category) {
                        if (err) {
                            console.log(err)
                        }

                        res.redirect('/')
                    })
                })
            })
        })
    } else { //后台提交的数据是数据库中没有的即新增数据
        _movie = new Movie(movieObj)
        // 获取新增电影的类别ID
        var categoryId = movieObj.category
        var categoryName = movieObj.categoryName

        _movie.save(function(err, movie) {
            if (err) {
                console.log(err)
            }

            if (!!categoryId) {
                // 在类别中保存该电影ID
                Category.findById(categoryId, function(err, category) {
                    // category.movies.push(_movie._id)

                    category.update({$addToSet: {movies: _movie._id}}, function(err, category) {
                        if (err) {
                            console.log(err)
                        }

                        res.redirect('/')
                    })
                })
                return
            }

            if (!!categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                })

                category.save(function(err, category) {
                    _movie.category = category._id
                    _movie.save(function(err, movie) {
                        res.redirect('/movie/' + movie._id)
                    })
                })
            }
        })
    }
}

// list page
exports.list = (req, res) => {
    // 数据库取出所有数据
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 列表页',
            movie: movies
        })
    })
}

// list delete movie
exports.del = (req, res) => {
    var id = req.query.id

    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({ success: 1 })
            }
        })
    }
}