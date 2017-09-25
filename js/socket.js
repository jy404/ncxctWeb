var socket;
var longconnectUrl = "http://test.ncxct.com:7878";
var tokenUrl = "http://test.ncxct.com:8082";

function startSocket(url) {
	socket = io.connect(url);
	socket.on('connect', function() {

	});

	socket.on('active_push', function(data) {

	});

	socket.on('disconnect', function() {
		Toast.Err('错误', '连接已断开,无法接收最新推送消息~', 'top-center', 'left');
	});
}

function getToken() {
	post(tokenUrl + "/api/websocket/token?_" + new Date().getTime(),

		{}, "json",
		function(data) {
			if (data.code === '0') {
				startSocket(longconnectUrl + "?token=" + data.result.token

					+ "&paramId=" + data.result.userId);
			}
		})
}

//getToken();

function post(url, param, datat, callback) {
	$.ajax({
		type: "post",
		url: url,
		data: param,
		dataType: datat,
		contentType: "application/json",
		success: function(data) {
			if (data.code != 0) {
				alert(data.description)
				return;
			}
			callback(data);
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if (XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});
}