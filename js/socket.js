var socket;
var longconnectUrl = "ws://test.ncxct.com:8083";
var tokenUrl = "http://test.ncxct.com";

function startSocket(url) {
	socket = io.connect(url);
	socket.on('connect', function() {

	});

	socket.on('active_push', function(data) {
		var currentCount = $('.indexXx i').text()
		var count = parseInt(currentCount) + 1
		$('.indexXx i').text(count)
	});

	socket.on('disconnect', function() {
		console.info("连接已断开,无法接收最新推送消息~")
	});
}

function getToken() {
	getUnreadMessage();
	post(tokenUrl + "/api/websocket/token?_" + new Date().getTime(),

		{}, "json",
		function(data) {
			if(data.code === '0') {
				startSocket(longconnectUrl + "?token=" + data.result.token

					+
					"&paramId=" + data.result.userId);
			}
		})
}

/**未读消息*/
function getUnreadMessage() {
	var param = {
		"pageSize": 500,
		"currentPage": 1,
		"read": false
	}
	post(tokenUrl + "/api/message/list",

		JSON.stringify(param), "json",
		function(data) {
			if(data.code === '0') {
				$('.xxIndexList').html('');
				var list = data.result.list;
				var count = data.result.totalCount;
				//$('.indexXx i').text(count)
				if(count != 0)
					$('.indexXx')[0].innerHTML = "<i>" + count + "</i>";
				if(typeof list == 'undefined' || list.size == 0) {
					$('.xxIndexList').append("<li><a href='javascript:void(0)'>无消息</a></li>")
				}
				//加载列表
				var html = ''
				for(index in list) {
					html += '<li><a href="020201.html?moduleId=4&id=' + list[index].id + '">' +
						list[index].title +
						'</a></li>'
				}
				$('.xxIndexList').append(html)

			}
		})
}

function getUnreadMessageNum() {
	var param = {
		"pageSize": 500,
		"currentPage": 1,
		"read": false
	}
	post(tokenUrl + "/api/message/list",
		JSON.stringify(param), "json",
		function(data) {
			if(data.code === '0') {
				$('.xxIndexList').append('')
				var list = data.result.list;
				var count = data.result.totalCount;
				if(count != 0)
					$('.indexXx')[0].innerHTML = "<i>" + count + "</i>";
			}
		})
}

getToken();

function post(url, param, datat, callback) {
	$.ajax({
		type: "post",
		url: url,
		data: param,
		dataType: datat,
		contentType: "application/json",
		success: function(data) {
			if(data.code != 0) {
				alert(data.description)
				return;
			}
			callback(data);
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if(XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});
}