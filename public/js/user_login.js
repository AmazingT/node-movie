$(function() {
	let loginForm = $('#login_form')
	let result = $('.login-result')
	let btn = $('button[type="button"]')

	btn.click(function() {
		$.ajax({
			type: 'POST',
			url: '/user/signin',
			data: loginForm.serialize(),
			beforeSend: function() {
				btn.text('登录中...').attr('disabled', true)
			}
		})
		.done(function(data) {
			if (data.status) {
				location.href = '/'
			} else {
				result.addClass('text-danger').text('用户名或密码错误')
			}
			loginForm[0].reset()
		})
		.fail(function(err) {
			console.log(err)
		})
		.always(function() {
			btn.text('登录').attr('disabled', false)
		})
	})
})