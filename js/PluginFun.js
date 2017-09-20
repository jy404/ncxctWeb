//************************toast简化封装方法*****************//
/*
 * $.toast({
    text: "Don't forget to star the repository if you like it.", // Text that is to be shown in the toast
    heading: 'Note', // Optional heading to be shown on the toast
    icon: 'warning', // Type of toast icon
    showHideTransition: 'fade', // fade, slide or plain
    allowToastClose: true, // Boolean value true or false
    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
    stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
    position: 'bottom-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
    
    
    
    textAlign: 'left',  // Text alignment i.e. left, right or center
    loader: true,  // Whether to show loader or not. True by default
    loaderBg: '#9EC600',  // Background color of the toast loader
    beforeShow: function () {}, // will be triggered before the toast is shown
    afterShown: function () {}, // will be triggered after the toat has been shown
    beforeHide: function () {}, // will be triggered before the toast gets hidden
    afterHidden: function () {}  // will be triggered after the toast has been hidden
});

 注意：position可选参数: 'top-center', 'bottom-left', 'bottom-right', 'top-left', 'top-right', 'bottom-center', 'mid-center'
 { left : 'auto', right : 'auto', top : 'auto', bottom : 'auto' },
 * 
 */

var Toast = {
	Info: function(headText, content, toastPosition, algin) {
		$.toast({
			heading: headText,
			text: content,
			showHideTransition: 'slide',
			icon: 'info',
			position: toastPosition,
			textAlign: algin
		});
	},
	Err: function(headText, content, toastPosition, algin) {
		$.toast({
			heading: headText,
			text: content,
			showHideTransition: 'fade',
			icon: 'error',
			position: toastPosition,
			textAlign: algin
		})
	},
	Warning: function(headText, content, toastPosition, algin) {
		$.toast({
			heading: headText,
			text: content,
			showHideTransition: 'plain',
			icon: 'warning',
			position: toastPosition,
			textAlign: algin
		})
	},
	Success: function(headText, content, toastPosition, algin) {
		$.toast({
			heading: headText,
			text: content,
			showHideTransition: 'slide',
			icon: 'success',
			position: toastPosition,
			textAlign: algin
		})
	},
	text: function(content, toastPosition, align) {
		$.toast({
			text: content,
			position: toastPosition,
			textAlign: algin
		})
	}
};

//*******************Toast封装结束*************************//

//*******************分页调用简单封装**********************//
jQuery.pagination = function(obj, pageCount, recordCount, callback) {
	var flag = true;
	obj.paging({
		totalPage: pageCount,
		totalSize: recordCount,
		callback: function(num) {
			//这里的两个if顺序不要修改，否则会GG的~
			if (num != pageCount||pageCount==2) {
				flag = true;
			}
			if (flag) {
				//if (num != 1)
				callback(num);
			}
			if (num == pageCount|| num == 1) {
				flag = false;
			}
		}
	})
}

//*****************分页调用封装结束***********************//

//*****************上传控件封装**************************//
var upload = {
	init: function(container, btnText) {
		$("#" + container).append("<br><span class=\"btn btn-success fileinput-button\"><i class=\"glyphicon glyphicon-plus\"></i><span>" + btnText + "</span><input id=\"fileupload\" type=\"file\" name=\"files[]\" multiple></span>");
		$("#" + container).append("<br><br><input type=\"hidden\" id=\"fileurl_" + container + "\" />");
		$("#" + container).append("<div id=\"files_" + container + "\" class=\"files\"></div>");
	},
	show: function(fileUrls, obj) {
		if (fileUrls != undefined && fileUrls != "") {
			var filename;
			var file_div = $("#" + obj);
			var fileUrl = fileUrls.split(";");
			for (i = 0; i < fileUrl.length - 1; i++) {
				filename = fileUrl[i].substr(fileUrl[i].lastIndexOf('/') + 1).substring(13);
				file_div.append("<div/>");
				var node = $('<p/>')
					.append($('<span/>').text(filename))
					.append("<br>")
					.append("<a target='_blank' href='" + fileUrl[i] + "'>下载</a>");
				node.appendTo(file_div);
			}
		}

	}
}