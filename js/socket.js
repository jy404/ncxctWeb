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
					$('.indexXx')[0].innerHTML = "<i id='XxNum'>" + count + "</i>";
				if(typeof list == 'undefined' || list.size == 0) {
					$('.xxIndexList').append("<li><a href='javascript:void(0)'>无消息</a></li>")
				}
				//加载列表
				var html = ''
				for(index in list) {
					if(list[index].type == "NOTIFY") //消息
					{
						var XXtitle = list[index]["title"];
						XXtitle = subString(XXtitle, 26);
						html += '<li id="Xxli' + index + '"><a target="bodyRight" href="020201.html?msgtype=msg&read=777&moduleId=3&id=' + list[index].id +
							"&Index=" + index + +'">' +
							XXtitle +
							'</a></li>';
					} else if(list[index].type == "PROJECT_PLAN_ORDER") //计划
					{
						var content = JSON.parse(list[index].content);
						var projectId = content.projectId;
						var projectType = content.projectType;
						var projectName = content.projectName;
						var XXtitle = list[index]["title"];
						XXtitle = subString(XXtitle, 26);
						//html += '<li><a target="bodyRight" href="020201.html?moduleId=4&id=' + list[index].id + '">' +
						//list[index].title +
						//'</a></li>';
						html += "<li id=\"Xxli" + index + "\"><a target=\"bodyRight\" href=\"030502.html?action=sp&read=777&id=" +
							projectId +
							"&Index=" + index +
							'&noticeId=' + list[index].id +
							"&projectType=" + projectType +
							"&projectName=" + escape(projectName) +
							"\">" + XXtitle + "</a></li>";
					} else if(list[index].type == "NOTICE") //通告
					{
						var content = JSON.parse(list[index].content);
						var noticeId = content.noticeId;
						var XXtitle = list[index]["title"];
						XXtitle = subString(XXtitle, 26);
						html += '<li id="Xxli' + index + '"><a target="bodyRight" href="020201.html?moduleId=4&read=777&id=' +
							noticeId +
							"&Index=" + index +
							'&noticeId=' + list[index].id + '">' +
							XXtitle +
							'</a></li>';
					} else if(list[index].type == "VISA_CHANGE_ORDER") //签证
					{
						var content = JSON.parse(list[index].content);
						var QZId = content.id;
						var projectId = content.projectId;
						var projectType = content.projectType;
						var XXtitle = list[index]["title"];
						XXtitle = subString(XXtitle, 26);
						html += "<li id=\"Xxli" + index + "\"><a target=\"bodyRight\" href=\"03020004.html?action=sp&read=777&id=" +
							QZId +
							"&Index=" + index +
							'&noticeId=' + list[index].id +
							"&projectId=" + projectId +
							"&projectType=" + projectType +
							"\" target='bodyRight'>" +
							XXtitle + "</a></li>";
					}
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
					$('.indexXx')[0].innerHTML = "<i id='XxNum'>" + count + "</i>";
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