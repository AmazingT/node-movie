$(function() {
	let registerForm = $('#register_form')
	let result = $('.register-result')
	let btn = $('button[type="button"]')

	btn.click(function() {
		$.ajax({
			type: 'POST',
			url: '/user/signup',
			data: registerForm.serialize(),
			beforeSend: function() {
				btn.text('提交中...').attr('disabled', true)
			}
		})
		.done(function(data) {
			if (!data.status) {
				result.addClass('text-danger').text('该用户名已经注册！')
				return
			}
			result.addClass('text-success').html('注册成功，前往<a style="color: blue"; href="/signin">登录</a>')
			registerForm[0].reset()
		})
		.fail(function(err) {
			console.log(err)
		})
		.always(function() {
			btn.text('提交').attr('disabled', false)
		})
	})
})