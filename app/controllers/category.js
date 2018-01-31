const Category = require('../models/category')

// admin new category page
exports.add = function(req, res) {
	res.render('category_admin', {
		title: 'imooc 后台分类录入页',
		category: {}
	})
}

// admin post category
exports.save = function(req, res) {
	var _category = req.body.category
	var category = new Category(_category)

	category.save(function(err, category) {
		if (err) {
			console.log(err)
		}

		res.redirect('/admin/category/list')
	})
}

// admin userlist page
exports.list = (req, res) => {
    // 数据库取出所有数据
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('categorylist', {
            title: 'imooc 用户列表页',
            categories: categories
        })
    })
}