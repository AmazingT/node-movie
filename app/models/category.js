const mongoose = require('mongoose')
const CategorySchema = require('../schemas/category')

var Category = mongoose.model('Category', CategorySchema)

module.exports = Category