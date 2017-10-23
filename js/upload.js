var policyBase64, accessid, signature, host, cdnUrl, dir, fileName, type;
var hasToken = false;
var maxFileSize = 10 * 1024 * 1024; //10m大小

$(function() {
	hasToken = false;
	getOsstoken();
})

function getOsstoken() {

	$.ajax({
		url: domain + '/api/oss/token?time=' + new Date().getMilliseconds().toString(),
		type: "GET",
		data: {},
		processData: false,
		async: false,
		contentType: false,
		success: function(data) {
			if (data.code == 0) {
				policyBase64 = data.result.policy;
				accessid = data.result.accessid;
				signature = data.result.signature;
				host = data.result.host;
				cdnUrl = data.result.cdnUrl;
				dir = data.result.dir;
				hasToken = true;
			} else {
				alert("获取token错误");
				return;
			}
			//              debugger
			//              console.log("over..");
		},
		error: function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			alert("获取token错误");
			return;
		}
	});
}

function UploadProcess(obj) {
	var options = {
		url: host,
		autoUpload: false,
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png|xls|ppt|txt|xlsx|docx|pdf|doc)$/i,
		maxFileSize: 5242880,
		// Enable image resizing, except for Android and Opera,
		// which actually support image resizing, but fail to
		// send Blob objects via XHR requests:
		disableImageResize: /Android(?!.*Chrome)|Opera/
			.test(window.navigator.userAgent),
		previewMaxWidth: 100,
		previewMaxHeight: 100,
		previewCrop: true
	};
	var uploadButton = $('<button/>')
		.addClass('btn btn-primary')
		.prop('disabled', true)
		.text('Processing...')
		.on('click', function() {
			var $this = $(this),
				data = $this.data();
			$this
				.off('click')
				.text('取消')
				.on('click', function() {
					$this.remove();
					data.abort();
				});
			data.submit(function() {

				})
				.done(function() {

				})
				.always(function() {
					$this.remove();
				});
		});
	var deleteButton = $('<a/>')
		.addClass('btn btn-primary')
		.text('删除')
		.on('click', function() {
			var $this = $(this),
				data = $this.data();
			$this.parent().remove();
			data.context = "";
		});
	$('#' + obj).fileupload(options)
		.on('fileuploadadd', function(e, data) {
			data.context = $('<div/>').appendTo('#files_' + obj);
			$.each(data.files, function(index, file) {
				var node = $('<p/>')
					.append($('<span/>').text(file.name));
				if (!index) {
					node
						.append('<br>')
						.append(uploadButton.clone(true).data(data))
						.append("&nbsp;&nbsp;")
						.append(deleteButton.clone(true).data(data));
				}
				node.appendTo(data.context);
			});
		}).on('fileuploadsubmit', function(e, data) {
			/*
			此处可添加额外参数
			*/
			var filename;

			$.each(data.files, function(index, file) {
				filename = dir + "/" + file.type + "/" + new Date().getTime() + file.name;
				file.Filename = filename;
				data.formData = {
					"key": filename,
					"Filename": filename,
					"file": file,
					"policy": policyBase64,
					"signature": signature,
					"OSSAccessKeyId": accessid,
					"success_action_status": "200"
				};
			});
			data.context.find("a").remove();

		}).on('fileuploadprocessalways', function(e, data) {
			var index = data.index,
				file = data.files[index],
				node = $(data.context.children()[index]);
			if (file.preview) {
				node
					.prepend('<br>')
					.prepend(file.preview);
			}
			if (file.error) {
				node
					.append('<br>')
					.append($('<span class="text-danger"/>').text(file.error));
			}
			if (index + 1 === data.files.length) {
				data.context.find('button')
					.text('上传')
					.prop('disabled', !!data.files.error);
					
			}
		}).on('fileuploadprogressall', function(e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .progress-bar').css(
				'width',
				progress + '%'
			);
		}).on('fileuploaddone', function(e, data) {
			$.each(data.files, function(index, file) {
					var fileurl = $("#fileurl_" + obj).val();
					fileurl += "http://" + cdnUrl + "/" + file.Filename + ";";
					$("#fileurl_" + obj).val(fileurl);
				})
				/*
				$.each(data.result.files, function(index, file) {
					if (file.url) {
						var link = $('<a>')
							.attr('target', '_blank')
							.prop('href', file.url);
						$(data.context.children()[index])
							.wrap(link);
					} else if (file.error) {
						var error = $('<span class="text-danger"/>').text(file.error);
						$(data.context.children()[index])
							.append('<br>')
							.append(error);
					}
				});
				*/
		}).on('fileuploadfail', function(e, data) {
			$.each(data.files, function(index) {
				var error = $('<span class="text-danger"/>').text('上传失败.');
				$(data.context.children()[index])
					.append('<br>')
					.append(error);
			});
		}).prop('disabled', !$.support.fileInput)
		.parent().addClass($.support.fileInput ? undefined : 'disabled');
}