$(function() {
	$('.del').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id=' + id
		})
		.done(function(result) { // 取代jqXHR.success()
			if (result.success === 1) {
				if (tr.length > 0) {
					tr.remove()
				}
			}
		})
		.fail(function(err) { // 取代jqXHR.error()
			console.log(err)
		})
		.always(function() { // 取代jqXHR.complete()
			console.log('complete')
		})
	})

	$('#douban').blur(function() {
		var douban = $(this)
		var id = douban.val() //1794171

		$.ajax({
			url: 'https://api.douban.com/v2/movie/subject/' + id,
			cache: true,
			type: 'get',
			dataType: 'jsonp',
			jsonp: 'callback'
		})
		.done(function(data) {
			$('#inputTitle').val(data.title)
			$('#inputCountry').val(data.countries[0])
			$('#inputDoctor').val(data.directors[0].name)
			$('#inputPoster').val(data.images.large)
			$('#inputYear').val(data.year)
			$('#inputSummary').val(data.summary)
		})
	})
})