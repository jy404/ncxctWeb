//===========================全局通用变量==========================//
//var domain = "http://139.196.72.104:8082";
var domain = "http://test.ncxct.com";

//===========================公共方法=============================//
(function($) {
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
})(jQuery);
//获取字典
function GetDirection(keyword, successcallback) {
	$.ajaxSettings.async = false;
	var data = {
		"keyWord": keyword
	};
	$.axse(
		domain + "/api/wordbook/list",
		JSON.stringify(data),
		function(res) {
			successcallback(res);
		},
		function() {}
	);
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function(fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/*
调用：
var time1 = new Date().Format("yyyy-MM-dd");
var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
*/

function subString(str, len) {
	if((str != "" && str != undefined)) {
		if(str.length > len) {
			str = str.replace(/<.*?>/ig, "").substring(0, len) + "...";
		}
	} else str = "无";
	return str;
}

//===========================公共方法结束=============================//

//===========================数据交互==============================//

//*****************用户登录******************//
function UserLogin(data) {
	$.ax(
		domain + '/api/login',
		data,
		null,
		'POST',
		'json',
		'application/json; charset=utf-8',
		function(res) {
			if(res["code"] == 0)
				window.location = "index.html";
			else
				Toast.Err('错误', res["description"], 'mid-center', 'left');
			$("#codeimg").attr("src", domain + "/api/validateCode?rnd=" + Math.random());
			$("#txtCode").val('');
		},
		function(xhr, text) {
			Toast.Err('错误', '请求数据失败~', 'mid-center', 'left');
			$("#codeimg").attr("src", domain + "/api/validateCode?rnd=" + Math.random());
			$("#txtCode").val('');
		}
	);
}

//****************消息查询*****************//
//注意：isInit是表示是否是第一次加载，首次加载，要把分页初始化
function GetMessage(currentpage, pagesize, read, obj, pageobj, isInit, url) {
	var data = {
		"currentPage": currentpage,
		"pageSize": pagesize,
	}
	if(typeof(read) == "number")
		data["status"] = read;
	else
		data["read"] = read;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>";

						if(rows[i]["type"] == "NOTIFY") //普通消息
						{
							if(data["status"] == 2)
								html += "<td><a href='020201.html?moduleId=" + moduleId + "&id=" + rows[i]["id"] + "&msgtype=sendmsg' target='bodyRight'>" + rows[i]["title"] + "</a></td>";
							else if(data["status"] != 1)
								html += "<td><a href='020201.html?moduleId=" + moduleId + "&id=" + rows[i]["id"] + "&msgtype=msg' target='bodyRight'>" + rows[i]["title"] + "</a></td>";
							else
								html += "<td><a onclick='SetMsgContent(" + rows[i]["id"] + ")'>" + rows[i]["title"] + "</a></td>";
						} else if(rows[i]["type"] == "NOTICE") //通知公告
						{
							html += "<td><a href='020201.html?moduleId=" + moduleId + "&id=" + JSON.parse(rows[i].content).noticeId + "' target='bodyRight'>" + rows[i]["title"] + "</a></td>";
						} else if(rows[i]["type"] == "PROJECT_PLAN_ORDER") //计划表
						{
							var content = JSON.parse(rows[i].content);
							var projectId = content.projectId;
							var projectType = content.projectType;
							var projectName = content.projectName;
							html += "<td><a href='030502.html?action=sp&id=" + projectId + "&projectType=" + projectType + "&projectName=" + escape(projectName) + "' target='bodyRight'>" + rows[i]["title"] + "</a></td>";
							//html += "<td><a href='020201.html?moduleId=" + moduleId + "&id=" + rows[i]["id"] + "&msgtype=sendmsg' target='bodyRight'>" + rows[i]["title"] + "</a></td>";
						} else if(rows[i]["type"] == "VISA_CHANGE_ORDER") //签证
						{
							var content = JSON.parse(rows[i].content);
							var QZId = content.id;
							var projectId = content.projectId;
							var projectType = content.projectType;
							html += "<td><a href=\"03020004.html?action=edit&id=" + QZId + "&projectId=" + projectId + "&projectType=" + projectType + "\" target='bodyRight'>" + rows[i]["title"] + "</a></td>";
							//html += "<td><a href='020201.html?moduleId=" + moduleId + "&id=" + rows[i]["id"] + "&msgtype=sendmsg' target='bodyRight'>" + rows[i]["title"] + "</a></td>";
						}
						if(data["status"] != 2 && data["status"] != 1) {
							html += "<td>" + (rows[i]["publishUserName"] == "" ? "未知" : rows[i]["publishUserName"]) + "</td>";
							html += "<td>" + new Date(rows[i]["publishTime"]).format("yyyy/MM/dd hh:mm:ss") + "</td>";
						} else {
							html += "<td>" + new Date(rows[i]["createTime"]).format("yyyy/MM/dd hh:mm:ss") + "</td>";
						}
						html += "</tr>";
					}
					$("#" + obj).append(html);
					if(isInit) {
						if(pageobj != null || pageobj != undefined)
							$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
								GetMessage(index, pagesize, read, obj, pageobj, false, url)
							});
					}
				} else {
					html += "<tr><td  colspan=\"4\">暂无消息</td></tr>";
					$("#" + obj).append(html);
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}
//*********************查询部门列表*****************************//
function GetDept() {
	$.getJSON(
		domain + '/api/system/org/tier/list',
		function(res) {
			if(res["code"] == 0) {
				var html = "";
				var rows = res["result"];
				for(i = 0; i < rows.length; i++) {
					html += " <span><a href=\"javascript:openCity('" + rows[i]["id"] + "','" + rows[i]["orgName"] + "');\">" + rows[i]["orgName"] + " </a></span>";
				}
				$("#province").append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function SelectDept(obj) {
	$.getJSON(
		domain + '/api/system/org/tier/list',
		function(res) {
			if(res["code"] == 0) {
				var html = "";
				var rows = res["result"];
				for(i = 0; i < rows.length; i++) {
					html += "<option value='" + rows[i]["id"] + "'>" + rows[i]["orgName"] + "</option>";
				}
				$("#" + obj).append(html);
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function SelectDeptMember(obj, DeptId) {
	var data = {
		"deptId": DeptId
	}
	$.axse(
		domain + '/api/user/list',
		JSON.stringify(data),
		function(res) {
			if(res["code"] == 0) {
				$("#" + obj + " option").not(':eq(0)').remove();
				var html = "";
				var rows = res["result"]["list"];
				for(i = 0; i < rows.length; i++) {
					html += "<option value='" + rows[i]["id"] + "'>" + rows[i]["name"] + "</option>";
				}
				$("#" + obj).append(html);
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetEmp(orgCode) {
	$.getJSON(
		domain + '/api/org/user/' + orgCode,
		function(res) {
			if(res["code"] == 0) {
				var html = "<dd><ul>";
				var rows = res["result"];
				for(i = 0; i < rows.length; i++) {
					html += "<li rel=\"" + rows[i]["id"] + "\">" + rows[i]["name"] + "</li>"
				}
				html += "</dd></ul>"
				$("#selectemp").append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetDept1(obj) {
	var data = {
		"activation": true
	}
	$.getJSON(
		domain + '/api/system/org/tier/list',
		JSON.stringify(data),
		function(res) {
			if(res["code"] == 0) {
				var html = "";
				var rows = res["result"];
				for(i = 0; i < rows.length; i++) {
					html += " <option value=\"" + rows[i]["id"] + "\">" + rows[i]["orgName"] + "</option>";
				}
				$("#" + obj).append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetRole1(obj) {
	var data = {};
	$.axse(
		domain + '/api/role/query',
		JSON.stringify(data),
		function(res) {
			if(res["code"] == 0) {
				var html = "";
				var rows = res["result"]["list"];
				for(i = 0; i < rows.length; i++) {
					html += " <option value=\"" + rows[i]["id"] + "\">" + rows[i]["roleName"] + "</option>";
				}
				$("#" + obj).append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}
//*********************组织架构菜单列表查询*****************************//
//注意：isInit是表示是否是第一次加载，首次加载，要把分页初始化
function GetOrgList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				var html = "";
				var rows = res["result"];
				for(i = 0; i < rows.length; i++) {
					html += SetOrgList("", rows[i], i, "", 0);
				}
				$("#" + obj).append(html);
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function SetOrgList(html1, row, count, str, level) {
	if(row["parentId"] == 0) {
		html1 += "<tr>";
	} else {
		html1 += "<tr class=\"org" + level + "\" > ";
	}
	html1 += "<td>" + str + (count + 1) + "</td>"
	html1 += "<td>" + row["orgCode"] + "</td>";
	html1 += "<td>" + row["orgName"] + "</td>";
	html1 += "<td>" + (row["activation"] == true ? "启用" : "停用") + "</td>";
	html1 += "<td width=\"12%\">";

	html1 += "<a href=\"050201.html?moduleId=" + moduleId + "&action=view&id=" + row["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
	html1 += "<a href=\"050201.html?moduleId=" + moduleId + "&action=edit&id=" + row["id"] + "\" style=\"background: #ff0000;\">修改</a>";

	html1 += "</td>";
	html1 += "</tr>";
	if(row["subOrgList"].length > 0) {
		for(j = 0; j < row["subOrgList"].length; j++) {
			html1 += SetOrgList("", row["subOrgList"][j], j, "├" + str, (level + 1));
		}
	}
	return html1;
}

//*********************岗位列表查询*****************************//
//注意：isInit是表示是否是第一次加载，首次加载，要把分页初始化
function GetRoleList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["roleCode"] + "</td>";
						html += "<td>" + rows[i]["roleName"] + "</td>";
						html += "<td>" + rows[i]["deptId"] + "</td>";
						html += "<td>" + rows[i]["orgName"] + "</td>";
						html += "<td width=\"12%\">";

						html += "<a href=\"050301.html?moduleId=" + moduleId + "&action=view&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "<a href=\"050301.html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";

						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetRoleList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}
//*********************岗位权限菜单列表查询*****************************//
//注意：isInit是表示是否是第一次加载，首次加载，要把分页初始化
function GetModuleList(data, obj, pageobj, isInit, url) {
	$.getJSON(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				var html = "";
				var rows = res["result"];
				//for(i = 0; i < rows.length; i++) {
				for(i = 0; i < rows.length; i++) {
					html += SetModuleList("", rows[i], i, "", 0);
				}
				$("#" + obj).append(html);
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function SetModuleList(html1, row, count, str, level) {
	if(row["parentId"] == 0) {
		html1 += "<tr>";
	} else {
		html1 += "<tr class=\"org" + level + "\" > ";
	}
	html1 += "<td>" + row["name"] + "</td>";
	html1 += "<td>";
	html1 += "<input type=\"checkbox\" name=\"View\"/>查看";
	html1 += "<input type=\"checkbox\" name=\"Edit\"/>编辑";
	html1 += "<input type=\"checkbox\" name=\"Add\"/>添加";
	html1 += "<input type=\"checkbox\" name=\"Dele\"/>删除";
	html1 += "</td>";
	html1 += "<td><input type=\"checkbox\" name=\"AllCheck\"/></td>";
	html1 += "</tr>";
	if(row["children"].length > 0) {
		for(j = 0; j < row["children"].length; j++) {
			html1 += SetModuleList("", row["children"][j], j, "├" + str, (level + 1));
		}
	}
	return html1;
}

function GetUserList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				$("#" + obj + " tr").not(':eq(0)').remove();
				if(res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "<td>" + rows[i]["name"] + "</td>";
						html += "<td>" + rows[i]["deptId"] + "</td>";
						if(rows[i]["roleName"] == null) {
							html += "<td></td>";
						} else {
							html += "<td>" + rows[i]["roleName"] + "</td>";
						}
						html += "<td>" + new Date(rows[i]["joinTime"]).toLocaleDateString() + "</td>";
						if(rows[i]["updateTime"] == null) {
							html += "<td>无返回</td>";
						} else {
							html += "<td>" + new Date(rows[i]["updateTime"]).toLocaleDateString() + "</td>";
						}
						html += "<td>" + (rows[i]["status"] == 1 ? "在职" : "离职") + "</td>";
						html += "<td width=\"12%\">";

						html += "<a href=\"050401.html?moduleId=" + moduleId + "&action=view&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "<a href=\"050401.html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";

						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetUserList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

//获取所有菜单列表
function GetAllMenuList() {
	$.getJSON(
		domain + "/api/module/list",
		function(res) {
			if(res["code"] == "0") {
				ParseMenu(res["result"]);
				$("input[name=checkAll]").click(function() {
					var checkbox = $(this.parentNode.parentNode).find("input[type=checkbox]");
					for(var i = 0; i < checkbox.length; i++) {
						checkbox[i].checked = this.checked;
					}
				});
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function CreateMenuList(menudata, deepCnt) {
	var tempstr = "|--";
	for(var i = 0; i < deepCnt; i++) {
		tempstr += "----";
	}

	var html = "";
	html += "<tr>";
	html += "<td style='white-space:nowrap;word-break:break-all;overflow:hidden;'>";
	html += "<span class='folder-open'></span>";
	html += tempstr + menudata["name"] + "<input name='mid' type='hidden' value='" + menudata["id"] + "'>";
	html += "</td>"
	html += "<td>"

	if(menudata["header"] == true)
		html += "<span class='cbllist'><input name='ActionType' id='cblActionType_SHOW_" + menudata["id"] + "' type='checkbox' value='SHOW'><label for='rptList_cblActionType_0_0_0'> 显示 </label></span>";
	else {
		html += "<span class='cbllist'><input name='ActionType' id='cblActionType_SHOW_" + menudata["id"] + "' type='checkbox' value='SHOW'><label for='rptList_cblActionType_0_0_0'> 显示 </label></span>";
		html += "<span class='cbllist'><input name='ActionType' id='cblActionType_ADD_" + menudata["id"] + "' type='checkbox' value='ADD'><label for='rptList_cblActionType_0_0_0'> 新增 </label></span>";
		html += "<span class='cbllist'><input name='ActionType' id='cblActionType_EDIT_" + menudata["id"] + "' type='checkbox' value='EDIT'><label for='rptList_cblActionType_0_0_0'> 修改 </label></span>";
		html += "<span class='cbllist'><input name='ActionType' id='cblActionType_SUBMIT_" + menudata["id"] + "' type='checkbox' value='SUBMIT'><label for='rptList_cblActionType_0_0_0'> 提交 </label></span>";
	}

	html += "</td>";
	html += "<td align='center'><input name='checkAll' type='checkbox'></td>"
	html += "</tr>";
	$("#roleList").append(html);
}

//解析菜单
var deep = 0;

function ParseMenu(menujson) {
	if(typeof(menujson) == "undefined") {
		Toast.Err('错误', '解析菜单出错', 'top-center', 'left');
		return;
	}

	for(var j = 0; j < menujson.length; j++) {
		CreateMenuList(menujson[j], deep);
		//递归调用
		if(typeof(menujson[j]["children"]) == "object" && menujson[j]["children"].length > 0) {
			deep++;
			ParseMenu(menujson[j]["children"]);
		}
		if(menujson[j]["parentId"] == "0")
			deep = 0; //一级菜单深度归零
	}
	deep--;

}

//*********************查询部门列表结束*****************************//

//*********************获取施工单位/监理单位列表********************//
///下拉多选
function SelectUnitList(obj, unitType, projectType) {
	var data = {
		"projectType": projectType,
		"wonBidUnitType": unitType
	};
	$.axse(
		domain + '/api/prophase/invitetender/project/orgs',
		JSON.stringify(data),
		function(res) {
			var list = "[";
			var result = res["result"];
			$.each(result, function(i, n) {
				if(i != result.length - 1)
					list += "{\"" + n.id + "\":\"" + n.name + "\"},";
				else
					list += "{\"" + n.id + "\":\"" + n.name + "\"}";
			});
			list += "]";

			$("#" + obj).hsCheckData({
				isShowCheckBox: true, //默认为false
				minCheck: 0, //默认为0，不限最少选择个数
				maxCheck: 0, //默认为0，不限最多选择个数
				data: JSON.parse(list)
			});
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
		}
	);
}
//下拉单选
function SelectUnit(obj, unitType, projectType) {
	var data = {
		"projectType": projectType,
		"wonBidUnitType": unitType
	};
	$.axse(
		domain + '/api/prophase/invitetender/project/orgs',
		JSON.stringify(data),
		function(res) {
			var list = "";
			var result = res["result"];
			$.each(result, function(i, n) {
				list += "<option value='" + n.id + "'>" + n.name + "</option>";
			});
			$("#" + obj).append(list);
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
		}
	);
}

function SetUnitList(unitList, obj) {
	var unitTemp = "";
	var unitTempname = "";
	$.each(unitList, function(i, unit) {
		if(unitList.length - 1 != i) {
			unitTemp += unit["id"] + "-";
			unitTempname += unit["name"] + ",";
		} else {
			unitTemp += unit["id"];
			unitTempname += unit["name"];
		}
	});
	$("#" + obj).attr("data-id", unitTemp);
	$("#" + obj).text(unitTempname);
}
//*********************获取施工单位/监理单位列表结束********************//

//*********************房建/市政项目列表查询*****************************//
//注意：isInit是表示是否是第一次加载，首次加载，要把分页初始化
function GetProjectList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["projectNo"] + "</td>";
						html += "<td title=\"" + rows[i]["name"] + "\">" + subString(rows[i]["name"].toString(), 6) + "</td>";
						html += "<td title=\"" + rows[i]["address"] + "\">" + subString(rows[i]["address"].toString(), 6) + "</td>";
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "<td>" + rows[i]["totalAmount"] + "</td>";
						if(typeof rows[i]["startTime"] == "undefined")
							html += "<td>无返回</td>";
						else
							html += "<td>" + new Date(rows[i]["startTime"]).toLocaleDateString() + "</td>";
						html += "<td>&nbsp;</td>";
						html += "<td>" + (rows[i]["status"] == 1 ? "已保存" : "已报建") + "</td>";
						html += "<td width=\"12%\">";

						if(data["projectType"] == "CITY") {
							html += "<a href=\"03060101.html?moduleId=" + moduleId + "&action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"03060101.html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						} else if(data["projectType"] == "HOUSE") {
							html += "<a href=\"03050101.html?moduleId=" + moduleId + "&action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"03050101.html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						}
						html += "</td>";
						html += "</tr>";

					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetProjectList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetProjectListForMap(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	//清除上一页地图覆盖物
	if(map != undefined && typeof(map) == "object") {
		map.clearOverlays();
	}
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td title=\"" + (rows[i]["longitude"].toString() + "," + rows[i]["latitude"].toString()) + "\">" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["name"] + "</td>";
						html += "<td>无返回</td>";

						html += "<td title='" + rows[i]["address"] + "'>" + subString(rows[i]["address"], 6) + "</td>";
						html += "<td>" + rows[i]["totalAmount"] + "</td>";
						//						html += "<td>无返回</td>";
						html += "<td>无返回</td>";
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "</tr>";
						//标注地图
						if(map != undefined && typeof(map) == "object") {
							var marker = new BMap.Marker(new BMap.Point(rows[i]["longitude"], rows[i]["latitude"]));
							map.addOverlay(marker)
						}
					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetProjectListForMap(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetProjectList1(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["projectNo"] + "</td>";
						html += "<td>" + rows[i]["name"] + "</td>";
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "<td>" + (rows[i]["projectType"] == "HOUSE" ? "房建项目" : "市政项目") + "</td>";
						html += "<td>" + (rows[i]["status"] == 1 ? "已保存" : "已报建") + "</td>";
						html += "<td>无返回</td>";
						html += "<td>无返回</td>";
						html += "<td>无返回</td>";
						html += "<td width=\"12%\">";

						if(rows[i]["projectType"] == "CITY") {
							html += "<a href=\"03060101.html?moduleId=" + moduleId + "&action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"03060101.html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						} else if(rows[i]["projectType"] == "HOUSE") {
							html += "<a href=\"03050101.html?moduleId=" + moduleId + "&action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"03050101.html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						}
						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetProjectList1(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}
//*********************房建/市政项目列表查询结束*****************************//

//*********************项目中介/参建单位列表查询*****************************//
function GetUnitList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;

	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["orgCategoryName"] + "</td>";
						html += "<td>" + rows[i]["name"] + "</td>";
						html += "<td>" + rows[i]["entity"] + "</td>";
						html += "<td>" + rows[i]["projectEntity"] + "</td>";
						html += "<td>" + rows[i]["contact"] + "</td>";
						html += "<td>" + rows[i]["address"] + "</td>";
						html += "<td>" + rows[i]["chargeProject"] + "</td>";
						html += "<td width=\"12%\">";

						if(rows[i]["orgType"] == "OUT") {
							html += "<a href=\"030701.html?moduleId=" + moduleId + "&action=view&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"030701.html?moduleId=" + moduleId + "&action=edit&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";
						} else if(rows[i]["orgType"] == "AGENT") {
							html += "<a href=\"030801.html?moduleId=" + moduleId + "&action=view&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"030801.html?moduleId=" + moduleId + "&action=edit&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";
						}
						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetUnitList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function() {
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);

}
//*********************项目中介/参建单位列表查询结束*************************//

function meetAdd(apis, data, url) {
	$.ax(
		domain + apis,
		data,
		null,
		'POST',
		'json',
		'application/json; charset=utf-8',
		function(res) {
			if(res["code"] == 0) {
				location.reload();
				Toast.Success('成功', res["description"], 'top-center', 'left');
				GetMessage(1, 999, 1, "nosend", null, true, "/api/sended/message/list");
				if(url != null && url != "")
					location.href = url;
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function meetPut(apis, data, url) {
	$.ax(
		domain + apis,
		data,
		null,
		'put',
		'json',
		'application/json; charset=utf-8',
		function(res) {
			if(res["code"] == 0) {
				location.reload();
				Toast.Success('成功', res["description"], 'top-center', 'left');
				if(url != null && url != "")
					location.href = url;
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}
//==============================公共通知================================
function SetUserList(unitList, obj) {
	var unitTemp = "";
	var unitTempname = "";
	for(var i = 0; i < unitList["names"].length; i++) {
		if(unitList["names"].length - 1 != i) {
			unitTemp += unitList["userIds"][i] + "-";
			unitTempname += unitList["names"][i] + ",";
		} else {
			unitTemp += unitList["userIds"][i];
			unitTempname += unitList["names"][i];
		}
	}
	$("#" + obj).attr("data-id", unitTemp);
	$("#" + obj).text(unitTempname);
}

function GetnoticeTmpList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				if(res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + (rows[i]["noticeType"] == "inform" ? "通知" : "决定") + "</td>";

						if(rows[i]["status"].toString() == "1")
							html += "<td><a href=\"020203.html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "\">" + rows[i]["title"] + "</a></td>";
						else
							html += "<td><a href=\"020201.html?moduleId=" + moduleId + "&id=" + rows[i]["id"] + "\">" + rows[i]["title"] + "</a></td>";
						if(obj == "projectList2")
							html += "<td>" + (rows[i]["userName"] == "" ? "未知" : rows[i]["userName"]) + "</td>";
						else
							html += "<td>" + (rows[i]["status"] == "1" ? "未发布" : "已发布") + "</td>";

						if(rows[i]["publishTime"] != undefined)
							html += "<td>" + new Date(rows[i]["publishTime"]).format("yyyy/MM/dd hh:mm:ss") + "</td>";
						else
							html += "<td></td>"
						html += "</tr>";
					}
					$("#" + obj).append(html);
				} else {
					var html = "";
					html += "<tr>";
					html += "<td colspan=\"5\">查无数据</td>"
					html += "</tr>";

					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetnoticeTmpList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

//=======================多选用户==========================
function SelectUser(obj) {
	var data = {
		"currentPage": 1,
		"pageSize": 0
	};
	$.axse(
		domain + '/api/user/list',
		JSON.stringify(data),
		function(res) {
			var list = "";
			var result = res["result"]["list"];
			$.each(result, function(i, n) {
				list += "<option value='" + n.id + "'>" + n.name + "</option>";
			});
			$("#" + obj).append(list);
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
		}
	);
}

function SelectUserList(obj) {
	var data = {
		"currentPage": 1,
		"pageSize": 0
	};
	$.axse(
		domain + '/api/user/list',
		JSON.stringify(data),
		function(res) {
			var list = "[";
			var result = res["result"]["list"];
			$.each(result, function(i, n) {
				if(i != result.length - 1)
					list += "{\"" + n.id + "\":\"" + n.name + "\"},";
				else
					list += "{\"" + n.id + "\":\"" + n.name + "\"}";
			});
			list += "]";

			$("#" + obj).hsCheckData({
				isShowCheckBox: true, //默认为false
				minCheck: 0, //默认为0，不限最少选择个数
				maxCheck: 0, //默认为0，不限最多选择个数
				data: JSON.parse(list)
			});
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
		}
	);
}

//=======================周报表==========================
function GetProjectWeekList(currentpage, pagesize, data, sort, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				if(res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + new Date(rows[i]["projectTime"]).toLocaleDateString() + "</td>";
						html += "<td title='" + rows[i]["projectName"] + "'>" + subString(rows[i]["projectName"], 6) + "</td>";
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "<td title='" + rows[i]["comment"] + "'>" + subString(rows[i]["comment"], 6) + "</td>";
						html += "<td title='" + rows[i]["allPushPlan"] + "'>" + subString(rows[i]["allPushPlan"], 6) + "</td>";
						html += "<td>" + "无返回" + "</td>";
						html += "<td title='" + rows[i]["tWeekPlan"] + "'>" + subString(rows[i]["tWeekPlan"], 6) + "</td>";
						html += "<td title='" + rows[i]["tWeekCase"] + "'>" + subString(rows[i]["tWeekCase"], 6) + "</td>";
						html += "<td title='" + rows[i]["nWeekCase"] + "'>" + subString(rows[i]["nWeekCase"], 6) + "</td>";
						html += "<td title='" + rows[i]["issue"] + "'>" + subString(rows[i]["issue"], 6) + "</td>";

						html += "<td width=\"12%\"><a href=\"03020" + sort + ".html?moduleId=" + moduleId + "&action=view&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "<a href=\"03020" + sort + ".html?moduleId=" + moduleId + "&action=edit&id=" + rows[i]["id"] + "\" style=\"background: #ff0000 ;\">修改</a></td>";

						html += "</tr>";
					}
					$("#" + obj).append(html);
				} else {
					var html = "";
					html += "<tr>";
					html += "<td colspan=\"11\">查无数据</td>"
					html += "</tr>";

					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetnoticeTmpList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

//=======================周报表项目==========================
function SelectProject(projectType, obj) {
	var data = {
		"currentPage": 1,
		"pageSize": 0,
		"projectType": projectType
	};
	$.axse(
		domain + '/api/project/list',
		JSON.stringify(data),
		function(res) {
			var list = "";
			var result = res["result"]["list"];
			$.each(result, function(i, n) {
				list += "<option value='" + n.id + "'>" + n.name + "</option>";
			});
			$("#" + obj).append(list);
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
		}
	);
}
//===============================文档管理===================================
function GetDocmanageList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						if(rows[i]["folder"].toString() == "true") {
							html += "<li>";
							html += "<a href=\"0401.html?moduleId=" + moduleId + "&id=" + rows[i]["id"] + "\">";
							html += "<img src=\"img/wdgl.png\" />";
							html += "<span>" + rows[i]["title"] + "</span>";
							html += "</a></li>";
						}
					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetDocmanageList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetDocmanageList1(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						var filenum = 1;
						if(rows[i]["folder"].toString() == "false") {
							html += "<tr>";
							html += "<td>" + ((currentpage - 1) * pagesize + (filenum++)) + "</td>";
							html += "<td>" + rows[i]["userName"] + "</td>";
							html += "<td>" + new Date(rows[i]["uploadTime"]).toLocaleDateString() + "</td>";
							html += "<td>" + rows[i]["title"] + "</td>";
							html += "<td width=\"12%\">";
							//html += "<a style=\"background: #33cc00 ;\">预览</a>";
							var fileurl = ";";
							if(rows[i]["fileUrl"] != null && rows[i]["fileUrl"].toString().length > 0)
								fileurl = rows[i]["fileUrl"].toString();
							html += "<a target=\"_blank\" href=\"" + fileurl.substring(0, fileurl.length - 1) + "\" style=\"background: #4bb2ff ;\">下载</a>";
							html += "<a href=\"0402.html?action=edit&id=" + rows[i]["id"] + "&parentId=" + rows[i]["parentId"] + "\" style=\"background: #ff0000 ;\">修改</a>";
							html += "</td>";
							html += "</tr>";
						}
					}
					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetDocmanageList1(index, pagesize, data, obj, pageobj, true, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetDocmanagePath(obj, url, Id) {
	$.getJSON(
		domain + url + Id,
		function(res) {
			if(res["code"] == "0") {
				if(res["result"]["totalCount"] != "0") {
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"];
					html += "<span id=\"" + obj + rows["id"].toString() + "\">> <a href=\"0401.html?id=" + rows["id"] + "\">" + rows["title"] + "</a></span>";
					$("#" + obj).before(html);
					if(rows["parentId"].toString() != "0") {
						GetDocmanagePath(obj + rows["id"].toString(), url, rows["parentId"]);
					}
				}
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

/**
 * 获取配置信息（用户信息，菜单权限信息）
 */
function getConfig() {
	$.ajax({
		type: "post",
		url: domain + "/api/config",
		data: {},
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if(data.code != 0) {
				console.log(data.description)
				return;
			}
			//设置用户信息
			$("#user_info").html("<b>" + data.result.user.userName + "</b>," + data.result.user.name)
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if(XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});

}

function getSchedule() {
	var param = {
		'currentPage': 1,
		'pageSize': 100000
	}
	$("#schedule_list").html('')
	$.ajax({
		type: "post",
		url: domain + "/api/process/task/list",
		data: JSON.stringify(param),
		dataType: "json",
		async: true,
		contentType: "application/json",
		success: function(data) {
			if(data.code != 0) {
				return;
			}

			var rows = data["result"]["list"];
			if(typeof rows == "undefined")
				return;
			var html = ""
			rows.forEach(function(row, index, arr) {
				var foreignType = row.procForeignType;
				var projectType = row.projectType;
				var jumpUrl = "";
				if(foreignType == "project_plan") {
					if(projectType == "HOUSE")
						jumpUrl = "030502.html?action=sp&id=" + row.projectId + "&projectType=" + row.projectType + "&projectName=" + escape(row.projectName);
					else
						jumpUrl = "030602.html?action=sp&id=" + row.projectId + "&projectType=" + row.projectType + "&projectName=" + escape(row.projectName);
				} else if(foreignType == "project_visa_design_change") {
					if(projectType == "HOUSE")
						jumpUrl = "03020004.html?action=sp&id=" + row.procForeignId + "&projectId=" + row.projectId + "&projectType=" + row.projectType + "&projectName=" + escape(row.projectName);
					else
						jumpUrl = "03020004.html?action=sp&id=" + row.procForeignId + "&projectId=" + row.projectId + "&projectType=" + row.projectType + "&projectName=" + escape(row.projectName);
				}
				html = html + '<li><a href="' + jumpUrl + '"><b>' +
					new Date(row.startTime).format("MM-dd") + '</b><span>' +
					row.title + "待审批" +
					'</span></a></li>'
			})
			$("#schedule_list").append(html)
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if(XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});

	$.ajax({
		type: "post",
		url: domain + "/api/process/task/list/count",
		data: {},
		async: true,
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if(data.code != 0) {
				console(data.description)
				return;
			}

			$("#scheduleSize").text(data.result.goingSize)
			$("#doneScheduleSize").text(data.result.doneSize)
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if(XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});

}

function getNoticeList() {
	var param = {
		'currentPage': 1,
		'pageSize': 6
	}

	$.ajax({
		type: "post",
		url: domain + "/api/notice/list",
		data: JSON.stringify(param),
		dataType: "json",
		async: true,
		contentType: "application/json",
		success: function(data) {
			if(data.code != 0) {
				return;
			}

			var rows = data["result"]["list"];
			if(typeof rows == "undefined")
				return;
			var html = ""
			rows.forEach(function(row, index, arr) {
				html = html + '<li><a href="020201.html?moduleId=4&id=' + row.id + '"><b>' +
					new Date(row.publishTime).format("yyyy-MM-dd") + '</b><span>' +
					row.title + '</span></a></li>';
			})
			$(".inform").append(html)
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if(XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});

}

function getProjectNew() {
	var param = {
		'currentPage': 1,
		'pageSize': 6,
		needNew: true
	}
	$("#new_project").html('')
	$.ajax({
		type: "post",
		url: domain + "/api/project/list",
		data: JSON.stringify(param),
		dataType: "json",
		async: true,
		contentType: "application/json",
		success: function(data) {
			if(data.code != 0) {
				return;
			}

			var rows = data["result"]["list"];
			if(typeof rows == "undefined")
				return;
			var html = ""
			rows.forEach(function(row, index, arr) {

				if(row.projectType == "HOUSE") {
					html += "<li><a href=\"03050101.html?moduleId=16&action=view&id=" + row.id + "&projectType=" + row.projectType + "&projectNo=" + row.projectNo + "&projectName=" + escape(row.name) + "\"><b>";
				} else {
					html += "<li><a href=\"03060101.html?moduleId=96&action=view&id=" + row.id + "&projectType=" + row.projectType + "&projectNo=" + row.projectNo + "&projectName=" + escape(row.name) + "\"><b>";
				}
				html += new Date(row.createTime).format("yyyy-MM-dd") + '</b><span>' +
					row.name + '</span></a></li>'
			})
			$("#new_project").append(html)
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if(XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});

	$.ajax({
		type: "post",
		url: domain + "/api/project/list/count",
		data: {},
		dataType: "json",
		async: true,
		contentType: "application/json",
		success: function(data) {
			if(data.code != 0) {
				console(data.description)
				return;
			}

			$("#new_size").text(data.result.newSize)
			$("#total_siz").text(data.result.totalCount)
		},
		error: function(s) {},
		complete: function(XHR, TS) {
			if(XHR.status === 401) {
				location.href = 'login.html';
			}
		}
	});
}

//***********************单位三级联动********************//
function SelectOrgByTypeAndCategory(orgTypeObj, orgCategoryObj, orgObj) {
	$("#" + orgTypeObj).change(function() {
		var orgType = $(this).val();
		$("#" + orgCategoryObj + " option:not(:first)").remove();
		$("#" + orgObj + " option:not(:first)").remove();
		GetOrgCategory(orgType, "#" + orgCategoryObj);
	});
	$("#" + orgCategoryObj).change(function() {
		GetOrgs($("#" + orgTypeObj).val(), $(this).val(), "#" + orgObj);
	});
}

function GetOrgCategory(orgType, obj) {
	$(obj).html("");
	$(obj).append("<option value=''>请选择单位类型</option>");
	if(orgType != "" && orgType != undefined) {
		$.each(unitInfo, function(i, item) {
			$(obj).append("<option value='" + item.id + "'>" + item.name + "</option>");
		});
	}
}

function GetOrgs(orgType, orgCategory, obj) {
	$(obj).html("");
	$(obj).append("<option value=''>请选择单位名称</option>");
	if(orgCategory == "" || orgCategory == undefined)
		return;
	$.axse(
		domain + "/api/proorg/page/list",
		JSON.stringify({
			"currentPage": 1,
			"orgCategory": orgCategory,
			"orgType": orgType,
			"pageSize": 100000,
			"projectType": projectType
		}),
		function(res) {
			$.each(res.result.list, function(i, item) {
				$(obj).append("<option value='" + item.id + "'>" + item.name + "</option>");
			});
		}
	)
}

//**********************单位三级联动结束****************//

//**********************项目签证设计及变更列表********************//
function GetDesignChangeList(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				if(res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["list"];

					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i].name + "</td>";
						html += "<td>" + (rows[i].amountType == "lt_five" ? "小于5万元" : "大于等于5万元") + "</td>";
						html += "<td>" + (rows[i].changeType == "design_change" ? "设计变更" : "工程签证") + "</td>";
						html += "<td>" + rows[i].estimateAmount + "</td>";
						html += "<td>" + (rows[i].visaType == "contact" ? "联系单" : "确认单") + "</td>";
						var status = rows[i].status;
						html += "<td>" + (status == 1 ? "保存" : status == 2 ? "审批通过" : status == 3 ? "流程进行中" : status == 4 ? "拒绝" : "未知") + "</td>";

						html += "<td width=\"12%\"><a href=\"03020004.html?action=view&id=" + rows[i]["id"] + "&projectId=" + projectId + "&projectType=" + projectType + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "<a href=\"03020004.html?action=edit&id=" + rows[i]["id"] + "&projectId=" + projectId + "&projectType=" + projectType + "\" style=\"background: #ff0000 ;\">修改</a></td>";

						html += "</tr>";
					}
					$("#" + obj).append(html);
				} else {
					var html = "";
					html += "<tr>";
					html += "<td colspan=\"11\">查无数据</td>"
					html += "</tr>";

					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetDesignChangeList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetDesignChangeList1(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				if(res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["list"];

					for(i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i].name + "</td>";
						html += "<td>" + (rows[i].amountType == "lt_five" ? "小于5万元" : "大于等于5万元") + "</td>";
						html += "<td>" + (rows[i].changeType == "design_change" ? "设计变更" : "工程签证") + "</td>";
						html += "<td>" + rows[i].estimateAmount + "</td>";
						html += "<td>" + (rows[i].visaType == "contact" ? "联系单" : "确认单") + "</td>";
						var status = rows[i].status;
						html += "<td>" + (status == 1 ? "保存" : status == 2 ? "审批通过" : status == 3 ? "流程进行中" : status == 4 ? "拒绝" : "未知") + "</td>";
						html += "<td width=\"12%\"><a href=\"03020004.html?action=view&id=" + rows[i].id + "&projectId=" + rows[i].projectId + "&projectType=" + rows[i].projectType + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				} else {
					var html = "";
					html += "<tr>";
					html += "<td colspan=\"8\">查无数据</td>"
					html += "</tr>";

					$("#" + obj).append(html);
				}
				if(isInit) {
					if(pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetDesignChangeList1(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}
//查询是否是会签最后一个人
function CheckLastPerson(procTaskId) {
	$.getJSON(
		domain + "/api/process/assessor/last/" + procTaskId,
		function(res) {
			if(res.code == 0) {
				return res.result;
			} else
				return true;
		}
	)
}

//返回操作状态
function GetOperateName(enName) {
	var cnName = "";
	switch(enName) {
		case "SUBMIT":
			cnName = "发起";
			break;
		case "AGREE":
			cnName = "同意";
			break;
		case "REFUSE":
			cnName = "拒绝";
			break;
		case "HANDOVER":
			cnName = "驳回";
			break;
		case "GOING":
			cnName = "进行中";
			break;
		default:
			cnName = "进行中";
			break;
	}
	return cnName;
}
//**********************项目签证及变更列表结束*******************//

//*********************驳回节点查询****************************//
function GetRejectList(procTaskId) {
	var data = {
		"procTaskId": procTaskId
	};
	$.axse(
		domain + "/api/process/assessor/list",
		JSON.stringify(data),
		function(res) {
			if(res.code == 0) {
				$.each(res.result, function(i, item) {
					if(item.checkType != "COUNTERSIGN")
						$("#rejectStepId").append("<option value='" + item.id + "'>" + item.assessor + "</option>")
					else {
						$("#rejectStepId").append("<option value='" + item.id + "_" + item.pId + "'>" + item.assessor + "</option>")
					}
				});
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);

}
//********************驳回节点查询结束************************//

//********************项目进度*******************************//
function CreateProjectStep(data, Type, obj) {
	//$("#" + obj).html = "";
	$("#" + obj + " tr").remove();
	var str = "";
	str += "<tr>"
	if(data != null && data.length > 0) {
		str += "<td>序号</td>";
		str += "<td>项目名称</td>";
		$.each(data, function(i, item) {
			str += "<td>" + item.stageTypeName + "</td>";
		});
	} else {
		if(Type == "HOUSE") {
			str += "<td>序号</td>";
			str += "<td>项目名称</td>";
			str += "<td>会议纪要或抄告单</td>";
			str += "<td>项目选址意见书</td>";
			str += "<td>环评、交评</td>";
			str += "<td>用地预审</td>";
			str += "<td>用地批准</td>";
			str += "<td>土地证</td>";
			str += "<td>用地规划许可证</td>";
			str += "<td>项目建议书请求</td>";
			str += "<td>项目建议书、可研批复</td>";
			str += "<td>地勘</td>";
			str += "<td>测绘</td>";
			str += "<td>水土保持评估</td>";
			str += "<td>地址灾害评估</td>";
			str += "<td>压覆矿评估</td>";
			str += "<td>防洪评估</td>";
			str += "<td>稳定评估</td>";
			str += "<td>施工图设计</td>";
			str += "<td>施工图图审</td>";
			str += "<td>施工图备案</td>";
			str += "<td>工程规划许可证</td>";
			str += "<td>初步设计概算批复请求</td>";
			str += "<td>初步设计概算批复</td>";
			str += "<td>确定招标代理</td>";
			str += "<td>预算控制价编制</td>";
			str += "<td>财政复函、预算控制价审核报告</td>";
			str += "<td>下浮系数</td>";
			str += "<td>期望中标价</td>";
			str += "<td>招标告知</td>";
			str += "<td>招标核准</td>";
			str += "<td>项目招标、确定施工单位及监理单位</td>";
			str += "<td>中标通知书</td>";
			str += "<td>施工合同</td>";
			str += "<td>监理合同</td>";
			str += "<td>质监</td>";
			str += "<td>安检</td>";
			str += "<td>施工许可证</td>";
			str += "<td>征地拆迁交底</td>";
			str += "<td>征地</td>";
			str += "<td>拆迁</td>";
			str += "<td>强弱电改迁</td>";
			str += "<td>其他附着物清除</td>";
			str += "<td>施工图会审</td>";
			str += "<td>施工图交桩手续</td>";
			str += "<td>原地面复测</td>";
			str += "<td>工程清表推进</td>";
			str += "<td>路基工程</td>";
			str += "<td>排水工程</td>";
			str += "<td>路面结构工程</td>";
			str += "<td>非机动车道</td>";
			str += "<td>人行道及路沿石附属工程</td>";
			str += "<td>交通工程</td>";
			str += "<td>绿化工程</td>";
			str += "<td>亮化工程</td>";
			str += "<td>工程签证及变更</td>";
			str += "<td>工程预验收</td>";
			str += "<td>工程竣工验收</td>";
			str += "<td>工程移交</td>";
			str += "<td>工程结算</td>";
			str += "<td>工程保修</td>";
		} else {
			str += "<td>序号</td>";
			str += "<td>项目名称</td>";
			str += "<td>会议纪要或抄告单</td>";
			str += "<td>项目选址意见书</td>";
			str += "<td>环评、交评</td>";
			str += "<td>用地预审</td>";
			str += "<td>用地批准</td>";
			str += "<td>土地证</td>";
			str += "<td>用地规划许可证</td>";
			str += "<td>项目建议书请求</td>";
			str += "<td>项目建议书、可研批复</td>";
			str += "<td>地勘</td>";
			str += "<td>测绘</td>";
			str += "<td>水土保持评估</td>";
			str += "<td>地址灾害评估</td>";
			str += "<td>压覆矿评估</td>";
			str += "<td>防洪评估</td>";
			str += "<td>稳定评估</td>";
			str += "<td>施工图设计</td>";
			str += "<td>施工图图审</td>";
			str += "<td>施工图备案</td>";
			str += "<td>工程规划许可证</td>";
			str += "<td>初步设计概算批复请求</td>";
			str += "<td>初步设计概算批复</td>";
			str += "<td>确定招标代理</td>";
			str += "<td>预算控制价编制</td>";
			str += "<td>财政复函、预算控制价审核报告</td>";
			str += "<td>下浮系数</td>";
			str += "<td>期望中标价</td>";
			str += "<td>招标告知</td>";
			str += "<td>招标核准</td>";
			str += "<td>项目招标、确定施工单位及监理单位</td>";
			str += "<td>中标通知书</td>";
			str += "<td>施工合同</td>";
			str += "<td>监理合同</td>";
			str += "<td>质监</td>";
			str += "<td>安检</td>";
			str += "<td>施工许可证</td>";
			str += "<td>征地拆迁交底</td>";
			str += "<td>征地</td>";
			str += "<td>拆迁</td>";
			str += "<td>强弱电改迁</td>";
			str += "<td>其他附着物清除</td>";
			str += "<td>施工图会审</td>";
			str += "<td>施工图交桩手续</td>";
			str += "<td>原地面复测</td>";
			str += "<td>工程清表推进</td>";
			str += "<td>路基工程</td>";
			str += "<td>排水工程</td>";
			str += "<td>路面结构工程</td>";
			str += "<td>非机动车道</td>";
			str += "<td>人行道及路沿石附属工程</td>";
			str += "<td>交通工程</td>";
			str += "<td>绿化工程</td>";
			str += "<td>亮化工程</td>";
			str += "<td>工程签证及变更</td>";
			str += "<td>工程预验收</td>";
			str += "<td>工程竣工验收</td>";
			str += "<td>工程移交</td>";
			str += "<td>工程结算</td>";
			str += "<td>工程保修</td>";
		}
	}
	str += "</tr>";
	$("#" + obj).append(str);
}

function GetProjectStep(currentpage, pagesize, data, obj, pageobj, isInit, url) {
	data["currentPage"] = currentpage;
	data["pageSize"] = pagesize;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				if(res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["list"];
					for(i = 0; i < rows.length; i++) {
						if(i == 0)
							CreateProjectStep(rows[i]["projectPlanExtensionList"], data["projectType"], obj);
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>";
						html += "<td>" + rows[i]["projectName"] + "</td>";
						$.each(rows[i]["projectPlanExtensionList"], function(i, item) {
							var ClassName = "";
							if(item.done == true) {
								ClassName = "selectGreen";
							} else if(item.delay == true) {
								ClassName = "selectRed";
							}
							html += "<td><span></span>";
							html += "<b class=\"" + ClassName + "\"></b>";
							html += "</td>"
						});
						html += "</tr>";
						//bsStep(step);
					}
					$("#" + obj).append(html);

					if(isInit) {
						if(pageobj != null || pageobj != undefined)
							$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
								GetProjectStep(index, pagesize, data, obj, pageobj, false, url)
							});
					}
				} else {
					var html = "";
					html += "<tr>";
					html += "<td colspan=\"3\">查无数据</td>"
					html += "</tr>";

					$("#" + obj).append(html);
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

//********************项目进度结束*******************************//
function GetMenuList(data, obj, url) {
	$.getJSON(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				//$(obj).find("tr").remove();
				//$("#" + obj + " tr").not(':eq(0)').remove();
				$(obj).html = "";
				if(res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["moduleList"];
					if(typeof rows == "undefined")
						return;
					html += "<h4 class=\"column\">系统栏目</h4>";
					for(i = 0; i < rows.length; i++) {
						if(typeof rows[i]["childMenus"] == "undefined" || rows[i]["name"].toString() == "文档管理" || rows[i]["name"].toString() == "我的账户" || rows[i]["name"].toString() == "首页") {
							html += "<div class=\"" + MenuClass(rows[i]["name"].toString()) + "\">";
							var url = rows[i]["url"].toString();
							html += "<a href=\"" + url.substring(1, url.length) + "?moduleId=" + rows[i]["id"] + "\" target=\"bodyRight\"><h2><span>" + rows[i]["name"] + "</span></h2></a>";
							html += "</div>";
						} else {
							html += "<div class=\"" + MenuClass(rows[i]["name"].toString()) + "\">";
							html += "<h2><span>" + rows[i]["name"] + "</span></h2>";

							html += "<ul>";
							$.each(rows[i]["childMenus"], function(i, item) {
								var url1 = item.url.toString();
								html += "<a href=\"" + url1.substring(1, url1.length) + "?moduleId=" + item.id + "\" target=\"bodyRight\">";
								html += "<li>-" + item.name + " </li></a>";
							});
							html += "</ul></div>";
						}
					}
					$(obj).append(html);
					$('.content .leftNav div h2').click(function() {
						//$(this).siblings('ul').slideToggle();	
						$('.content .leftNav div ul').slideUp();
						$('.information h2 span,.integrated h2 span,.system h2 span').css('background-image', 'url(img/leftNavLeft.png)')
						if($(this).siblings('ul').is(':hidden')) {
							$(this).siblings('ul').slideDown();
							$(this).find('span').css('background-image', 'url(img/leftNavBottom.png)')
						} else {
							$(this).siblings('ul').slideUp();
						}

					});

				} else {
					var html = "";
					html += "<h4 class=\"column\">无栏目</h4>";
					$(obj).append(html);
				}
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetXMMenuList(data, obj, url, moduleId) {
	$.getJSON(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if(res["code"] == "0") {
				$(obj).html = "";
				if(res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["moduleList"];
					if(typeof rows == "undefined")
						return;
					for(i = 0; i < rows.length; i++) {
						if(rows[i]["childMenus"].length > 0) {
							for(var j = 0; j < rows[i]["childMenus"].length; j++) {
								if(rows[i]["childMenus"][j].id == moduleId) {
									var rows1 = rows[i]["childMenus"][j]["childMenus"];
									for(var t = 0; t < rows1.length; t++) {
										if(typeof rows1[t]["childMenus"] == "undefined" || rows1[t]["childMenus"].length == 0) {
											var url = rows1[t]["url"].toString();
											html += "<a href=\"" + url.substring(1, url.length) + "?moduleId=" + rows1[t]["id"] + "\" target=\"szRight\">";
											html += "<h6>" + rows1[t]["name"] + "</h6></a>";
										} else {
											html += "<div>";
											html += "<h2><span>" + rows1[t]["name"] + "</span></h2>";
											html += "<ul>";
											$.each(rows1[t]["childMenus"], function(i, item) {
												var url1 = item.url.toString();
												html += "<a href=\"" + url1.substring(1, url1.length) + "?moduleId=" + item.id + "\" target=\"szRight\">";
												html += "<li>-" + item.name + " </li></a>";
											});
											html += "</ul></div>";
										}
									}
								}
							}
						}
					}
					$(obj).append(html);
					$('.szxmTjPage .leftNavSz div h2').click(function() {
						//$(this).siblings('ul').slideToggle();	
						$('.szxmTjPage .leftNavSz div ul').slideUp();
						$('.information h2 span,.integrated h2 span,.system h2 span').css('background-image', 'url(img/leftNavLeft.png)')
						if($(this).siblings('ul').is(':hidden')) {
							$(this).siblings('ul').slideDown();
							$(this).find('span').css('background-image', 'url(img/leftNavBottom.png)')
						} else {
							$(this).siblings('ul').slideUp();
						}
					});

				} else {
					var html = "";
					html += "<h4 class=\"column\">无栏目</h4>";
					$(obj).append(html);
				}
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

$(function() {
	$.ajaxSettings.async = false;
	var moduleId = $.getUrlParam("moduleId");
	var action = $.getUrlParam("action");
	//var url = this.location.href;
	if(moduleId == null)
		return;
	if(!GetMenuPermission("/api/permission/" + moduleId, "SHOW")) {
		location.href = window.history.back();
		Toast.Err('错误', "无权限", 'top-center', 'left');
	}
	if(action != "" && action != undefined) {
		if(!GetMenuPermission("/api/permission/" + moduleId, "ADD")) {
			$("#saveButton").hide();
			$("#updateBtn").hide();
		}
	} else {
		if(!GetMenuPermission("/api/permission/" + moduleId, "EDIT")) {
			$("#saveButton").hide();
			$("#updateBtn").hide();
		}
	}
	if(!GetMenuPermission("/api/permission/" + moduleId, "SUBMIT")) {
		$("#submitButton").hide();
	}
})

function GetMenuPermission(url, Value) {
	$.ajaxSettings.async = false;
	var State = false;
	$.getJSON(
		domain + url,
		function(res) {
			if(res["code"] == "0") {
				var rows = res["result"];
				for(var i = 0; i < rows.length; i++) {
					if(rows[i] == Value) {
						State = true;
					}
				}
			} else {
				Toast.Err('错误', res["description"], 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if(xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
	return State;
}

function MenuClass(name) {
	switch(name) {
		case "首页":
			return "index";
		case "消息中心":
			return "information";
		case "项目综合管理":
			return "integrated";
		case "文档管理":
			return "doc";
		case "系统管理":
			return "system";
		case "我的账户":
			return "my";
		default:
			return "";
	}
}