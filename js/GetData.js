//===========================全局通用变量==========================//
//var domain = "http://139.196.72.104:8082";
var domain = "http://test.ncxct.com:8082";

//===========================公共方法=============================//
(function($) {
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
})(jQuery);
//获取字典
function GetDirection(keyword) {
	var data = {
		"keyWord": keyword
	};
	$.axse(
		domain + "/api/wordbook/list",
		JSON.stringify(data),
		function(res) {},
		function() {}
	);
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
			if (res["code"] == 0)
				window.location = "index.html";
			else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
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
	if (typeof(read) == "number")
		data["status"] = read;
	else
		data["read"] = read;
	$.axse(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if (res["code"] == "0") {
				if (res["result"]["totalCount"] != "0") {
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						if (data["status"] != 1)
							html += "<td><a href='详情页.html?id=" + rows[i]["id"] + "' target='bodyRight'>" + rows[i]["title"] + "</a></td>";
						else
							html += "<td><a onclick='SetMsgContent(" + rows[i]["id"] + ")'>" + rows[i]["title"] + "</a></td>";
						html += "<td>" + new Date(rows[i]["createTime"]).toLocaleDateString() + "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetMessage(index, pagesize, read, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (res["code"] == 0) {
				var html = "";
				var rows = res["result"];
				for (i = 0; i < rows.length; i++) {
					html += " <span><a href=\"javascript:openCity('" + rows[i]["id"] + "','" + rows[i]["orgName"] + "');\">" + rows[i]["orgName"] + " </a></span>";
				}
				$("#province").append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function SelectDept(obj) {
	$.getJSON(
		domain + '/api/system/org/tier/list',
		function(res) {
			if (res["code"] == 0) {
				var html = "";
				var rows = res["result"];
				for (i = 0; i < rows.length; i++) {
					html += "<option value='" + rows[i]["id"] + "'>" + rows[i]["orgName"] + "</option>";
				}
				$("#" + obj).append(html);
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetEmp(orgCode) {
	$.getJSON(
		domain + '/api/org/user/' + orgCode,
		function(res) {
			if (res["code"] == 0) {
				var html = "<dd><ul>";
				var rows = res["result"];
				for (i = 0; i < rows.length; i++) {
					html += "<li rel=\"" + rows[i]["id"] + "\">" + rows[i]["name"] + "</li>"
				}
				html += "</dd></ul>"
				$("#selectemp").append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function GetDept1(obj) {
	$.getJSON(
		domain + '/api/system/org/tier/list',
		function(res) {
			if (res["code"] == 0) {
				var html = "";
				var rows = res["result"];
				for (i = 0; i < rows.length; i++) {
					html += " <option value=\"" + rows[i]["id"] + "\">" + rows[i]["orgName"] + "</option>";
				}
				$("#" + obj).append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (res["code"] == 0) {
				var html = "";
				var rows = res["result"]["list"];
				for (i = 0; i < rows.length; i++) {
					html += " <option value=\"" + rows[i]["id"] + "\">" + rows[i]["roleName"] + "</option>";
				}
				$("#" + obj).append(html)
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
	$.getJSON(
		domain + url,
		JSON.stringify(data),
		function(res) {
			if (res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				var html = "";
				var rows = res["result"];
				for (i = 0; i < rows.length; i++) {
					html += SetOrgList("", rows[i], i, "", 0);
				}
				$("#" + obj).append(html);
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function SetOrgList(html1, row, count, str, level) {
	if (row["parentId"] == 0) {
		html1 += "<tr>";
	} else {
		html1 += "<tr class=\"org" + level + "\" > ";
	}
	html1 += "<td>" + str + (count + 1) + "</td>"
	html1 += "<td>" + row["orgCode"] + "</td>";
	html1 += "<td>" + row["orgName"] + "</td>";
	html1 += "<td>" + (row["activation"] == true ? "启用" : "停用") + "</td>";
	html1 += "<td width=\"12%\">";

	html1 += "<a href=\"050201.html?action=view&id=" + row["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
	html1 += "<a href=\"050201.html?action=edit&id=" + row["id"] + "\" style=\"background: #ff0000;\">修改</a>";

	html1 += "</td>";
	html1 += "</tr>";
	if (row["subOrgList"].length > 0) {
		for (j = 0; j < row["subOrgList"].length; j++) {
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
			if (res["code"] == "0") {
				if (res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["roleCode"] + "</td>";
						html += "<td>" + rows[i]["roleName"] + "</td>";
						html += "<td>" + rows[i]["deptId"] + "</td>";
						html += "<td width=\"12%\">";

						html += "<a href=\"050301.html?action=view&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "<a href=\"050301.html?action=edit&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";

						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetRoleList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				var html = "";
				var rows = res["result"];
				//for(i = 0; i < rows.length; i++) {
				for (i = 0; i < rows.length; i++) {
					html += SetModuleList("", rows[i], i, "", 0);
				}
				$("#" + obj).append(html);
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function SetModuleList(html1, row, count, str, level) {
	if (row["parentId"] == 0) {
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
	if (row["children"].length > 0) {
		for (j = 0; j < row["children"].length; j++) {
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
			if (res["code"] == "0") {
				if (res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "<td>" + rows[i]["name"] + "</td>";
						html += "<td>" + rows[i]["deptId"] + "</td>";
						html += "<td>" + rows[i]["roleName"] + "</td>";
						html += "<td>" + new Date(rows[i]["joinTime"]).toLocaleDateString() + "</td>";
						html += "<td>" + new Date(rows[i]["updateTime"]).toLocaleDateString() + "</td>";
						html += "<td>" + rows[i]["status"] + "</td>";
						html += "<td width=\"12%\">";

						html += "<a href=\"050401.html?action=view&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "<a href=\"050401.html?action=edit&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";

						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetUserList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "登录.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

//获取所有菜单列表
function GetAllMenuList() {
	$.getJSON(
		domain + "/api/module/list",
		function(res) {
			if (res["code"] == "0") {
				ParseMenu(res["result"]);
			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}

function CreateMenuList(menudata, deepCnt) {
	var tempstr = "|--";
	for (var i = 0; i < deepCnt; i++) {
		tempstr += "----";
	}

	var html = "";
	html += "<tr>";
	html += "<td style='white-space:nowrap;word-break:break-all;overflow:hidden;'>";
	html += "<span class='folder-open'></span>";
	html += tempstr + menudata["name"] + "<input name='mid' type='hidden' value='" + menudata["id"] + "'>";
	html += "</td>"
	html += "<td>"

	if (menudata["header"] == true)
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
	if (typeof(menujson) == "undefined") {
		Toast.Err('错误', '解析菜单出错', 'top-center', 'left');
		return;
	}

	for (var j = 0; j < menujson.length; j++) {
		CreateMenuList(menujson[j], deep);
		//递归调用
		if (typeof(menujson[j]["children"]) == "object" && menujson[j]["children"].length > 0) {
			deep++;
			ParseMenu(menujson[j]["children"]);
		}
		if (menujson[j]["parentId"] == "0")
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
				if (i != result.length - 1)
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
			if (xhr.status == "401")
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
			if (xhr.status == "401")
				top.location.href = "login.html";
		}
	);
}

function SetUnitList(unitList, obj) {
	var unitTemp = "";
	var unitTempname = "";
	$.each(unitList, function(i, unit) {
		if (unitList.length - 1 != i) {
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
			if (res["code"] == "0") {
				if (res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["projectNo"] + "</td>";
						html += "<td>" + rows[i]["name"] + "</td>";
						html += "<td>项目地址没有</td>";
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "<td>" + rows[i]["totalAmount"] + "</td>";
						html += "<td>" + new Date(rows[i]["startTime"]).toLocaleDateString() + "</td>";
						html += "<td>结束时间没有</td>";
						html += "<td>" + rows[i]["status"] + "</td>";
						html += "<td width=\"12%\">";

						if (data["projectType"] == "CITY") {
							html += "<a href=\"03060101.html?action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"03060101.html?action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						} else if (data["projectType"] == "HOUSE") {
							html += "<a href=\"030501.html?action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"030501.html?action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						}
						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetProjectList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (res["code"] == "0") {
				if (res["result"]["totalCount"] != "0") {
					//$(obj).find("tr").remove();
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + rows[i]["projectNo"] + "</td>";
						html += "<td>" + rows[i]["name"] + "</td>";
						html += "<td>" + rows[i]["orgName"] + "</td>";
						html += "<td>" + (rows[i]["projectType"] == "HOUSE" ? "房建项目" : "市政项目") + "</td>";
						html += "<td>" + rows[i]["status"] + "</td>";
						html += "<td>" + new Date(rows[i]["startTime"]).toLocaleDateString() + "</td>";
						html += "<td>计划结束时间没有</td>";
						html += "<td>结束时间没有</td>";
						html += "<td width=\"12%\">";

						if (rows[i]["projectType"] == "CITY") {
							html += "<a href=\"03060101.html?action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"03060101.html?action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						} else if (rows[i]["projectType"] == "HOUSE") {
							html += "<a href=\"030501.html?action=view&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"030501.html?action=edit&id=" + rows[i]["id"] + "&projectType=" + rows[i]["projectType"] + "&projectNo=" + rows[i]["projectNo"] + "&projectName=" + escape(rows[i]["name"]) + "\" style=\"background: #ff0000;\">修改</a>";
						}
						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetProjectList1(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (res["code"] == "0") {
				if (res["result"]["totalCount"] != "0") {
					$("#" + obj + " tr").not(':eq(0)').remove();
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
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

						if (rows[i]["orgType"] == "OUT") {
							html += "<a href=\"030701.html?action=view&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"030701.html?action=edit&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";
						} else if (rows[i]["orgType"] == "AGENT") {
							html += "<a href=\"030801.html?action=view&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
							html += "<a href=\"030801.html?action=edit&orgType=" + rows[i]["orgType"] + "&orgCategory=" + rows[i]["orgCategory"] + "&id=" + rows[i]["id"] + "\" style=\"background: #ff0000;\">修改</a>";
						}
						html += "</td>";
						html += "</tr>";
					}
					$("#" + obj).append(html);
				}
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
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
			if (res["code"] == 0) {
				Toast.Success('成功', res["description"], 'top-center', 'left');
				if (url != null && url != "")
					location.href = url;
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (res["code"] == 0) {
				Toast.Success('成功', res["description"], 'top-center', 'left');
				if (url != null && url != "")
					location.href = url;
			} else
				Toast.Err('错误', res["description"], 'top-center', 'left');
		},
		function(xhr, text) {
			if (xhr.status == "401")
				top.location.href = "login.html";
			Toast.Err('错误', '请求数据失败~', 'top-center', 'left');
		}
	);
}
//==============================公共通知================================
function SetUserList(unitList, obj) {
	var unitTemp = "";
	var unitTempname = "";
	for (var i = 0; i < unitList["names"].length; i++) {
		if (unitList["names"].length - 1 != i) {
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
			if (res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				if (res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + (rows[i]["noticeType"] == "inform" ? "通知" : "决定") + "</td>";

						if (rows[i]["status"].toString() == "1")
							html += "<td><a href=\"020203.html?action=edit&id=" + rows[i]["id"] + "\">" + rows[i]["title"] + "</a></td>";
						else
							html += "<td><a href=\"020201.html?id=" + rows[i]["id"] + "\">" + rows[i]["title"] + "</a></td>";

						html += "<td>" + (rows[i]["status"] == "1" ? "未发布" : "已发布") + "</td>";

						if (rows[i]["publishTime"] != undefined)
							html += "<td>" + new Date(rows[i]["publishTime"]).toLocaleDateString() + "</td>";
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
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetnoticeTmpList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (xhr.status == "401")
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
				if (i != result.length - 1)
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
			if (xhr.status == "401")
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
			if (res["code"] == "0") {
				//$(obj).find("tr").remove();
				$("#" + obj + " tr").not(':eq(0)').remove();
				if (res["result"]["totalCount"] != "0") {
					var html = "";
					var rows = res["result"]["list"];
					for (i = 0; i < rows.length; i++) {
						html += "<tr>";
						html += "<td>" + ((currentpage - 1) * pagesize + (i + 1)) + "</td>"
						html += "<td>" + new Date(rows[i]["projectTime"]).toLocaleDateString() + "</td>";
						html += "<td>" + rows[i]["projectName"] + "</td>";
						html += "<td>" + rows[i]["userName"] + "</td>";
						html += "<td>" + "项目概况" + "</td>";
						html += "<td>" + rows[i]["allPushPlan"] + "</td>";
						html += "<td>" + "当前进度情况" + "</td>";
						html += "<td>" + rows[i]["tWeekPlan"] + "</td>";
						html += "<td>" + rows[i]["tWeekCase"] + "</td>";
						html += "<td>" + rows[i]["nWeekCase"] + "</td>";
						html += "<td>" + rows[i]["issue"] + "</td>";

						html += "<td width=\"12%\"><a href=\"03020" + sort + ".html?action=view&id=" + rows[i]["id"] + "\" style=\"background: #4bb2ff ;\">查看</a>";
						html += "<a href=\"03020" + sort + ".html?action=edit&id=" + rows[i]["id"] + "\" style=\"background: #ff0000 ;\">修改</a></td>";

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
				if (isInit) {
					if (pageobj != null || pageobj != undefined)
						$.pagination(pageobj, res["result"]["pageCount"], res["result"]["totalCount"], function(index) {
							GetnoticeTmpList(index, pagesize, data, obj, pageobj, false, url)
						});
				}

			} else {
				Toast.Err('错误', jsondata.description, 'top-center', 'left');
			}
		},
		function(xhr, text) {
			if (xhr.status == "401")
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
			if (xhr.status == "401")
				top.location.href = "login.html";
		}
	);
}