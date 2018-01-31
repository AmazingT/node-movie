const Comment = require('../models/comment')

// comment
exports.save = (req, res) => {
    /*
        req.body: body-parser中间件提供，解析POST请求中的数据(对象)
        req.query: node提供，多用于解析GET请求中的参数
        req.params: node提供，POST和GET方式均可获取(URL路径部分)
    */
    var _comment = req.body.comment
    var movieId = _comment.movie

    if (!!_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }

            // comment.reply.push(reply)
            // $addToSet: 不允许重复; $push: 可以重复
            comment.update({$addToSet: {reply: reply}}, function(err, comment) {
                if (err) {
                    console.log(err)
                }
                console.log('@@@@' + comment)
                res.redirect('/movie/' + movieId)
            })
        })
    } else {
        var comment = new Comment(_comment)

        comment.save(function(err, comment) {
            if (err) {
                console.log(err)
            }

            res.redirect('/movie/' + movieId)
        })
    }
}