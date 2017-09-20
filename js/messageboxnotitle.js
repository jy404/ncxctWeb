
var y = 0;
var styleArray = ["msg_sns", "msg_erp2008", "msg_erp", "msg_xue"];

function MessageBox(CloseCallBack, CloseOnmouseOverImgSrc, DragAreaType, ClassPath, ScreenDivBackgroudColor,opacity) {
    removeCssobject = function (o, po) {
        if (o != null) {
            po.removeChild(o)
        }
    };
    var sdbv = (ScreenDivBackgroudColor!=null&&ScreenDivBackgroudColor!="") ? ScreenDivBackgroudColor : 'gray';
    var oc = (opacity!=null&&opacity!="") ? opacity : '0.3';
    
    removeStyle = function (currentStyleid, currentStylepath) {
        var h = document.getElementsByTagName("head");
        for (var i = 0; i < styleArray.length; i++) {
            var oid = styleArray[i];
            if (oid != currentStyleid) {
                var o = document.getElementById(oid);
                if (h != null) {
                    removeCssobject(o, h[0])
                } else {
                    removeCssobject(o, document)
                }
            }
        }
        var currentStyleo = document.getElementById(currentStyleid);
        currentStyleo = null;
        if (currentStyleo == null) {
            //$U.LC("http://images.21edu.com/ui/plugins/messagebox/css/" + currentStylepath, '', currentStyleid)
        }
    };
    ClassPath = "myclass";
    if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
        removeStyle("msg_xue", "style_exue.css");
        this.InnerTitleHeight = 35
    } else {
        if (document.location.toString().indexOf("http://sns") > -1) {
            removeStyle("msg_sns", "stylesns.css")
        } else {
            if ($C.OS == 'Win2008') {
                removeStyle("msg_erp2008", "style_win7.css")
            } else {
                removeStyle("msg_erp", "style.css")
            }
        }
        this.InnerTitleHeight = 27
    }
    this.ScreenDivBackgroudColor = sdbv;
    this.opacity = oc;
    this.InnerDivBackgroudColor = "white";
    this.InnerTitleDivBackgroudColor = "white";
    this.InnerFooterDivBackgroudColor = "white";
    this.InnerContentDivBackgroudColor = "white";
    this.InnerContentDivClassName = "MSG_Body";
    this.InnerContentDivFrameClassName = "";
    this.InnerTitleDivClassName = "MSG_Title";
    this.CloseButtonClassName = "";
    if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
       // this.CloseButtonValue = "http://images.21edu.com/ui/plugins/messagebox/images/del2.gif"
    } else {
        //this.CloseButtonValue = "http://images.21edu.com/ui/plugins/messagebox/images/del.gif"
    }
    this.Title = "消息对话框";    
    this.ScreenDivClassName = "";
    this.InnerDivClassName = "MSG_Container";
    this.InnerFooterHeight = 1;
    this.InnerFooterDivClassName = "MSG_Clear";
    this.InnerFooterHTML = "";
    this.ScreenDivOpacity = 30;
    this.InnerDivHeight = 0.4;
    this.InnerDivWidth = 0.6;
    this.InnerDivLeft = 0;
    this.InnerDivTop = 0;
    this.ReturnValue = false;
    var offsetH = 0;
    var width = document.documentElement.scrollWidth < document.documentElement.clientWidth ? document.documentElement.clientWidth : document.documentElement.scrollWidth;
    var height = document.documentElement.scrollHeight < document.documentElement.clientHeight ? document.documentElement.clientHeight : document.documentElement.scrollHeight;
    var innerWidth = width * 0.6;
    if (this.InnerDivWidth > 1) {
        innerWidth = this.InnerDivWidth
    } else {
        if (this.InnerDivWidth != 0.6) {
            innerWidth = width * this.InnerDivWidth
        }
    }
    var innerHeight = document.documentElement.clientHeight * 0.4;
    if (this.InnerDivHeight > 1) {
        innerHeight = this.InnerDivHeight
    } else {
        if (this.InnerDivHeight != 0.4) {
            innerHeight = document.documentElement.clientHeight * this.InnerDivHeight
        }
    }
    var innerTop = (document.documentElement.clientHeight - innerHeight) / 2;
    if (this.InnerDivTop != 0) {
        innerTop = this.InnerDivTop
    }
    var innerLeft = (width - innerWidth) / 2;
    if (this.InnerDivLeft != 0) {
        innerLeft = this.InnerDivLeft
    }
    var o = null;
    var innero = null;
    var selects = null;
    var inneroTitle = null;
    var inneroFooter = null;
    var inneroContent = null;
    var inneroContentFrame = null;
    var inputs = null;
    SetObjectSize = function (o, width, height) {
        if (o != null) {
            o.style.width = width + "px";
            if (height == null || typeof (height) == "undefined") {
                o.style.height = "auto"
            } else {
                o.style.height = height + "px"
            }
        }
    };
    SetObjectPosition = function (o, left, top) {
        if (o != null) {
            o.style.left = left + "px";
            o.style.top = top + "px"
        }
    };
    NoneDispleyDropdownList = function () {
        selects = document.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++) {
            if (selects[i].style.display == "none") {
                selects[i].setAttribute("oldDisplay", "none")
            } else {
                selects[i].style.display = "none"
            }
        }
    };
    DispleyDropdownList = function () {
        if (selects != null) {
            for (var i = 0; i < selects.length; i++) {
                if (selects[i].getAttribute("oldDisplay") == "none") {
                    selects[i].removeAttribute("oldDisplay");
                    selects[i].style.display = "none"
                } else {
                    selects[i].style.display = "block"
                }
            }
        }
    };

    function GetScreenSize() {
        width = document.documentElement.scrollWidth < document.documentElement.clientWidth ? document.documentElement.clientWidth : document.documentElement.scrollWidth;
        height = document.documentElement.scrollHeight < document.documentElement.clientHeight ? document.documentElement.clientHeight : document.documentElement.scrollHeight
    }
    Init = function (iw, ih, it, il) {
        if (iw < 1) {
            if (iw != 0.6) {
                innerWidth = width * iw
            }
        } else {
            innerWidth = iw
        }
        innerHeight = document.documentElement.clientHeight * 0.4;
        if (ih < 1) {
            if (ih != 0.4) {
                innerHeight = document.documentElement.clientHeight * ih
            }
        } else {
            innerHeight = ih
        }
        innerTop = (document.documentElement.clientHeight - innerHeight) / 2 + $(window).scrollTop() - offsetH;
        if (it != 0) {
            innerTop = it
        }
        innerLeft = (width - innerWidth) / 2;
        if (il != 0) {
            innerLeft = il
        }
    };

    function RemoveMessageBox() {
        var input = null;
        try {
            input = document.createElement("input");
            document.body.appendChild(input);
            input.style.cssText = "width:0px;height:0px;overflow:hidden;position:absolute;top:" + innerTop + "px;left:" + innerLeft + "px;border:0;";
            input.focus();
            input.value = "&nbsp;";
            input.select()
        } catch (e) { }
        clearTimeout(y);
        if (innero != null) {
            if (typeof (innero.parentNode.tagName) != "undefined") {
                document.body.removeChild(innero)
            } else {
                innero.parentNode.removeChild(innero)
            }
        }
        if (o != null) {
            if (typeof (o.parentNode.tagName) != "undefined") {
                document.body.removeChild(o)
            } else {
                o.parentNode.removeChild(o)
            }
            DispleyDropdownList()
        }
        window.onresize = null;
        try {
            document.body.removeChild(input)
        } catch (e) { }
    }
    function CreateSrceenDiv(ScreenDivClassName, ScreenDivBackgroudColor, ScreenDivOpacity, opacity) {
    	if(opacity==null || opacity == "")
	    {
	    	opacity = "0.3";
	    }
        o = document.createElement("div");
        if (ScreenDivClassName != "") {
            o.className = ScreenDivClassName
        } else {
            o.style.cssText = "position:absolute;left:0px;top:0px;filter:Alpha(Opacity=" + ScreenDivOpacity + "); _filter:Alpha(Opacity=70); opacity:" + opacity + ";z-index:" + $U.GMZI() + "; _z-index:999999; boder:0px;margin:0px;text-align:center;"
        }
        SetObjectSize(o, width, height);
        o.style.backgroundColor = ScreenDivBackgroudColor;
        NoneDispleyDropdownList()
    }
    function CreateInnerDiv(InnerDivClassName, InnerDivBackgroudColor) {
        innero = document.createElement("div");
        if (InnerDivClassName != "") {
            innero.className = InnerDivClassName
        } else {
            innero.style.cssText = "text-align:center; position:absolute;";
            innero.style.backgroundColor = InnerDivBackgroudColor
        }
		var isIE6 = !!window.ActiveXObject;
		if(isIE6==true)
		{
			innero.style.zIndex = 9999999999;			
		}
		else
		{
			innero.style.zIndex = $U.GMZI();
		}
        

        innero.style.width = innerWidth + 'px';
        SetObjectPosition(innero, innerLeft, innerTop)
    }
    function CreateInnerTitleDiv(InnerTitleDivClassName, InnerTitleDivBackgroudColor, InnerHTML, TitleHeight, CloseButtonClassName, CloseButtonValue, isClose) {
        inneroTitle = document.createElement("div");
        //inneroTitle.innerHTML = InnerHTML;
        inneroTitle.innerHTML = "";
        SetObjectSize(inneroTitle, innerWidth, TitleHeight);
        if (InnerTitleDivClassName != "") {
            inneroTitle.className = InnerTitleDivClassName
        } else {
            inneroTitle.style.cssText = "border:0px;margin:0px;padding:0px;text-indent:20px; text-align:left; ";
            inneroTitle.style.backgroundColor = InnerTitleDivBackgroudColor
        }
        var btnp = document.createElement("p");
        if (isClose != false) {
            var btn = document.createElement("img1");
            // btn.setAttribute("src", CloseButtonValue);
            btn.setAttribute("style", "display:none");
            btn.onmouseover = function () {
                if (typeof (CloseOnmouseOverImgSrc) != "undefined" && CloseOnmouseOverImgSrc != "" && CloseOnmouseOverImgSrc != null) {
                    //btn.setAttribute("src", CloseOnmouseOverImgSrc)
                }
            };
            btn.onmouseout = function () {
               // btn.setAttribute("src", CloseButtonValue)
            };
            if (CloseButtonClassName != "") {
                //btn.className = CloseButtonClassName
            }
            btn.style.verticalAlign = "top";
            btn.onclick = function () {
                if (typeof (CloseCallBack) == "function") {
                    CloseCallBack()
                }
                RemoveMessageBox()
            };
            btnp.appendChild(btn)
        }
        inneroTitle.appendChild(btnp)
    }
    function CreateInnerContentDiv(InnerContentDivClassName, InnerContentDivBackgroudColor, InnerTitleHeight, InnerFooterHeight, InnerContentDivFrameClassName, InnerContentDivFrameSrc, id) {
        inneroContent = document.createElement("div");
        if (InnerContentDivClassName != "") {
            inneroContent.className = InnerContentDivClassName
        } else {
            inneroContent.style.cssText = "text-align:center;border:0px;margin:0px;padding:0px;"
        }
        SetObjectSize(inneroContent, innerWidth, innerHeight - InnerTitleHeight - InnerFooterHeight);
        inneroContentFrame = document.createElement("iframe");
        if (InnerContentDivFrameClassName != "") {
            inneroContentFrame.className = InnerContentDivFrameClassName
        }
        SetObjectSize(inneroContentFrame, innerWidth, innerHeight - InnerTitleHeight - InnerFooterHeight);
        inneroContentFrame.id = id || 'messageBoxIframe';
        inneroContentFrame.name = id || 'messageBoxIframe';
        inneroContentFrame.setAttribute("marginheight", "0px");
        inneroContentFrame.setAttribute("marginwidth", "0px");
        inneroContentFrame.setAttribute("frameborder", "0", 0);
        inneroContentFrame.setAttribute("scrolling", "auto");
        inneroContentFrame.setAttribute("allowtransparency", "true");
        inneroContentFrame.setAttribute("src", InnerContentDivFrameSrc);
        inneroContent.appendChild(inneroContentFrame);
        return inneroContentFrame
    }
    function CreateInnerContentStringDiv(InnerContentDivClassName, InnerContentDivBackgroudColor, InnerTitleHeight, InnerFooterHeight, IHTMl, flagHeight) {
        inneroContent = document.createElement("div");
        if (InnerContentDivClassName != "") {
            inneroContent.className = InnerContentDivClassName
        } else {
            inneroContent.style.cssText = "text-align:center;border:0px;margin:0px;padding:0px;"
        }
        if (innerHeight - InnerTitleHeight - InnerFooterHeight < 0) {
            SetObjectSize(inneroContent, innerWidth, InnerTitleHeight)
        } else {
            if (flagHeight == true) {
                SetObjectSize(inneroContent, innerWidth)
            } else {
                SetObjectSize(inneroContent, innerWidth, innerHeight - InnerTitleHeight - InnerFooterHeight)
            }
        }
        inneroContent.innerHTML = IHTMl
    }
    function CreateInnerFooterDiv(InnerFooterDivClassName, InnerFooterDivBackgroudColor, InnerHTML, FooterHeight) {
        inneroFooter = document.createElement("div");
        inneroFooter.innerHTML = InnerHTML;
        if (InnerFooterDivClassName != "") {
            inneroFooter.className = InnerFooterDivClassName
        } else {
            inneroFooter.style.cssText = "text-align:left;border:0px;margin:0px;padding:0px;"
        }
    }
    function DragMessageBox() {
        var drag = new DragResize(innero);
        drag.opacity = false;
        drag.canResize = false;
        drag.availableArea = {
            left: 0,
            top: 0,
            width: innero.offsetWidth,
            height: inneroTitle.offsetHeight
        };
        drag.Init()
    }
    function ResizeWindow(InnerTitleHeight, InnerFooterHeight, InnerTop, InnerLeft, InnerWidth, InnerHeight) {
        var rwidth = document.documentElement.scrollWidth < document.documentElement.clientWidth ? document.documentElement.clientWidth : document.documentElement.scrollWidth;
        var rheight = document.documentElement.scrollHeight < document.documentElement.clientHeight ? document.documentElement.clientHeight : document.documentElement.scrollHeight;
        var rinnerWidth = rwidth * 0.6;
        if (InnerWidth < 1) {
            if (InnerWidth != 0.6) {
                rinnerWidth = rwidth * InnerWidth
            }
        } else {
            rinnerWidth = InnerWidth
        }
        var rinnerHeight = document.documentElement.clientHeight * 0.4;
        if (InnerHeight < 1) {
            if (InnerHeight != 0.4) {
                rinnerHeight = document.documentElement.clientHeight * InnerHeight
            }
        } else {
            rinnerHeight = InnerHeight
        }
        if (o != null) {
            SetObjectSize(o, rwidth, rheight)
        }
        if (innero != null) {
            var rinnerTop = (document.documentElement.clientHeight - rinnerHeight) / 2 + document.documentElement.scrollTop - offsetH;
            if (InnerTop != 0) {
                rinnerTop = InnerTop
            }
            var rinnerLeft = (rwidth - rinnerWidth) / 2;
            if (InnerLeft != 0) {
                rinnerLeft = InnerLeft
            }
            SetObjectPosition(innero, rinnerLeft, rinnerTop);
            if (inneroTitle != null) { }
            if (inneroFooter != null) { }
            if (inneroContent != null) {
                if (rinnerHeight - InnerTitleHeight - InnerFooterHeight < 0) { } else { } if (inneroContentFrame != null) { }
            }
        }
    }
    this.ShowIframeDialog = function (Src, id, isClose) {
        var InnerTitleHeight = this.InnerTitleHeight;
        var InnerFooterHeight = this.InnerFooterHeight;
        var InnerTop = this.InnerDivTop;
        var InnerLeft = this.InnerDivLeft;
        var InnerWidth = this.InnerDivWidth;
        var InnerHeight = this.InnerDivHeight;
        Init(this.InnerDivWidth, this.InnerDivHeight, this.InnerDivTop, this.InnerDivLeft);
        GetScreenSize();
        CreateSrceenDiv(this.ScreenDivClassName, this.ScreenDivBackgroudColor, this.ScreenDivOpacity, this.opacity);
        if (o != null) {
            document.body.appendChild(o)
        }
        CreateInnerDiv(this.InnerDivClassName, this.InnerDivBackgroudColor);
        if (innero != null) {
            document.body.focus();
            CreateInnerTitleDiv(this.InnerTitleDivClassName, this.InnerTitleDivBackgroudColor, this.Title, this.InnerTitleHeight, this.CloseButtonClassName, this.CloseButtonValue, isClose);
            if (inneroTitle != null) {
                innero.appendChild(inneroTitle)
            }
            var a = CreateInnerContentDiv(this.InnerContentDivClassName, this.InnerContentDivBackgroudColor, this.InnerTitleHeight, this.InnerFooterHeight, this.InnerContentDivFrameClassName, Src, id);
            if (inneroContent != null) {
                innero.appendChild(inneroContent)
            }
            CreateInnerFooterDiv(this.InnerFooterDivClassName, this.InnerFooterDivBackgroudColor, this.InnerFooterHTML, this.InnerFooterHeight);
            if (inneroFooter != null) {
                innero.appendChild(inneroFooter)
            }
            document.body.appendChild(innero);
            if (navigator.userAgent.indexOf("MSIE 6.0") > -1) {
                a.src = a.src
            }
        }
        window.onresize = function () {
            ResizeWindow(InnerTitleHeight, InnerFooterHeight, InnerTop, InnerLeft, InnerWidth, InnerHeight)
        };
        DragMessageBox()
    };
    this.Close = function (callback, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10) {
        try {
            if (typeof (callback) == "function") {
                callback(par1, par2, par3, par4, par5, par6, par7, par8, par9, par10)
            }
        } catch (e) { }
        RemoveMessageBox()
    };
    this.ShowDivDialog = function (InnerHTML, isClose) {
        var InnerTitleHeight = this.InnerTitleHeight;
        var InnerFooterHeight = this.InnerFooterHeight;
        var InnerTop = this.InnerDivTop;
        var InnerLeft = this.InnerDivLeft;
        var InnerWidth = this.InnerDivWidth;
        var InnerHeight = this.InnerDivHeight;
        Init(this.InnerDivWidth, this.InnerDivHeight, this.InnerDivTop, this.InnerDivLeft);
        GetScreenSize();
        CreateSrceenDiv(this.ScreenDivClassName, this.ScreenDivBackgroudColor, this.ScreenDivOpacity);
        if (o != null) {
            document.body.appendChild(o)
        }
        CreateInnerDiv(this.InnerDivClassName, this.InnerDivBackgroudColor);
        if (innero != null) {
            CreateInnerTitleDiv(this.InnerTitleDivClassName, this.InnerTitleDivBackgroudColor, this.Title, this.InnerTitleHeight, this.CloseButtonClassName, this.CloseButtonValue, isClose);
            if (inneroTitle != null) {
                innero.appendChild(inneroTitle)
            }
            CreateInnerContentStringDiv(this.InnerContentDivClassName, this.InnerContentDivBackgroudColor, this.InnerTitleHeight, this.InnerFooterHeight, InnerHTML, false);
            if (inneroContent != null) {
                innero.appendChild(inneroContent)
            }
            CreateInnerFooterDiv(this.InnerFooterDivClassName, this.InnerFooterDivBackgroudColor, this.InnerFooterHTML, this.InnerFooterHeight);
            if (inneroFooter != null) {
                innero.appendChild(inneroFooter)
            }
            document.body.appendChild(innero)
        }
        window.onresize = function () {
            ResizeWindow(InnerTitleHeight, InnerFooterHeight, InnerTop, InnerLeft, InnerWidth, InnerHeight)
        };
        DragMessageBox()
    };
    this.ShowConfirmCallackDialog = function (InnerHTML, YesCallback, NoCallBack, SubmitText, CancelText, ImgUrl, isClose) {
        SubmitText = SubmitText || "确定";
        CancelText = CancelText || "取消";
        if (this.InnerDivHeight == 0.4) {
            this.InnerDivHeight = 0.3
        }
        if (this.InnerDivWidth == 0.6) {
            this.InnerDivWidth = 380
        }
        var InnerTitleHeight = this.InnerTitleHeight;
        var InnerFooterHeight = this.InnerFooterHeight;
        var InnerTop = this.InnerDivTop;
        var InnerLeft = this.InnerDivLeft;
        var InnerWidth = this.InnerDivWidth;
        var InnerHeight = this.InnerDivHeight;
        Init(this.InnerDivWidth, this.InnerDivHeight, this.InnerDivTop, this.InnerDivLeft);
        GetScreenSize();
        CreateSrceenDiv(this.ScreenDivClassName, this.ScreenDivBackgroudColor, this.ScreenDivOpacity);
        if (o != null) {
            document.body.appendChild(o)
        }
        ImgUrl = (ImgUrl == null || typeof (ImgUrl) == "undefined" || ImgUrl == "") ? "http://images.21edu.com/ui/plugins/messagebox/images/redirect.gif" : ImgUrl;
       
        InnerHTML = "<div class='MSG_HTML'><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td valign='top'></td><td class='pt15' align='left'>" + InnerHTML + "</td></tr></table></td></tr><tr><td align='center'><input class='MSG_Submit' type='button' value='" + SubmitText + "' onclick='SubmitCallback()'";
        if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
            InnerHTML += " onmouseover=\"this.className='MSG_Submit1'\" onmouseout=\"this.className='MSG_Submit'\" "
        }
        InnerHTML += ">&nbsp;&nbsp;&nbsp;&nbsp;<input class='MSG_Cancel' type='button' value='" + CancelText + "' onclick='CancelCallback();'";
        if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
            InnerHTML += " onmouseover=\"this.className='MSG_Cancel1'\" onmouseout=\"this.className='MSG_Cancel'\" "
        }
        InnerHTML += "></td></tr></table></div>";
        SubmitCallback = function () {
            RemoveMessageBox();
            try {
                if (typeof (YesCallback) == "function") {
                    YesCallback()
                }
            } catch (e) { }
        };
        CancelCallback = function () {
            RemoveMessageBox();
            try {
                if (typeof (NoCallBack) == "function") {
                    NoCallBack()
                }
            } catch (e) { }
        };
        CreateInnerDiv(this.InnerDivClassName, this.InnerDivBackgroudColor);
        if (innero != null) {
            document.body.focus();
            SetObjectPosition(innero, innerLeft, innerTop);
            CreateInnerTitleDiv(this.InnerTitleDivClassName, this.InnerTitleDivBackgroudColor, this.Title, this.InnerTitleHeight, this.CloseButtonClassName, this.CloseButtonValue, isClose);
            if (inneroTitle != null) {
                innero.appendChild(inneroTitle)
            }
            CreateInnerContentStringDiv(this.InnerContentDivClassName, this.InnerContentDivBackgroudColor, this.InnerTitleHeight, this.InnerFooterHeight, InnerHTML, true);
            if (inneroContent != null) {
                innero.appendChild(inneroContent)
            }
            CreateInnerFooterDiv(this.InnerFooterDivClassName, this.InnerFooterDivBackgroudColor, this.InnerFooterHTML, this.InnerFooterHeight);
            if (inneroFooter != null) {
                innero.appendChild(inneroFooter)
            }
            document.body.appendChild(innero)
        }
        window.onresize = function () {
            ResizeWindow(InnerTitleHeight, InnerFooterHeight, InnerTop, InnerLeft, InnerWidth, InnerHeight)
        };
        DragMessageBox()
    };
    this.ShowConfirmTextDialog = function (InnerHTML, YesCallback, SubmitText, CancelText, ImgUrl, isClose) {
        SubmitText = SubmitText || "确定";
        CancelText = CancelText || "取消";
        if (this.InnerDivHeight == 0.4) {
            this.InnerDivHeight = 0.3
        }
        if (this.InnerDivWidth == 0.6) {
            this.InnerDivWidth = 380
        }
        var InnerTitleHeight = this.InnerTitleHeight;
        var InnerFooterHeight = this.InnerFooterHeight;
        var InnerTop = this.InnerDivTop;
        var InnerLeft = this.InnerDivLeft;
        var InnerWidth = this.InnerDivWidth;
        var InnerHeight = this.InnerDivHeight;
        Init(this.InnerDivWidth, this.InnerDivHeight, this.InnerDivTop, this.InnerDivLeft);
        GetScreenSize();
        CreateSrceenDiv(this.ScreenDivClassName, this.ScreenDivBackgroudColor, this.ScreenDivOpacity);
        if (o != null) {
            document.body.appendChild(o)
        }
        ImgUrl = (ImgUrl == null || typeof (ImgUrl) == "undefined" || ImgUrl == "") ? "http://images.21edu.com/ui/plugins/messagebox/images/redirect.gif" : ImgUrl;
        InnerHTML = "<div class='MSG_HTML'><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td valign='top'></td><td class='pt15' align='left'>" + InnerHTML + "</td></tr></table></td></tr><tr><td align='center'><input class='MSG_Submit' type='button' value='" + SubmitText + "' onclick='SubmitCallback()'";
        
        if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
            InnerHTML += " onmouseover=\"this.className='MSG_Submit1'\" onmouseout=\"this.className='MSG_Submit'\" "
        }
        InnerHTML += ">&nbsp;&nbsp;&nbsp;&nbsp;<input class='MSG_Cancel' type='button' value='" + CancelText + "' onclick='RemMessageBox();'";
        if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
            InnerHTML += " onmouseover=\"this.className='MSG_Cancel1'\" onmouseout=\"this.className='MSG_Cancel'\" "
        }
        InnerHTML += "></td></tr></table></div>";
        RemMessageBox = function () {
            RemoveMessageBox()
        };
        SubmitCallback = function () {
            RemoveMessageBox();
            try {
                if (typeof (YesCallback) == "function") {
                    YesCallback()
                }
            } catch (e) { }
        };
        CreateInnerDiv(this.InnerDivClassName, this.InnerDivBackgroudColor);
        if (innero != null) {
            document.body.focus();
            SetObjectPosition(innero, innerLeft, innerTop);
            CreateInnerTitleDiv(this.InnerTitleDivClassName, this.InnerTitleDivBackgroudColor, this.Title, this.InnerTitleHeight, this.CloseButtonClassName, this.CloseButtonValue, isClose);
            if (inneroTitle != null) {
                innero.appendChild(inneroTitle)
            }
            CreateInnerContentStringDiv(this.InnerContentDivClassName, this.InnerContentDivBackgroudColor, this.InnerTitleHeight, this.InnerFooterHeight, InnerHTML, true);
            if (inneroContent != null) {
                innero.appendChild(inneroContent)
            }
            CreateInnerFooterDiv(this.InnerFooterDivClassName, this.InnerFooterDivBackgroudColor, this.InnerFooterHTML, this.InnerFooterHeight);
            if (inneroFooter != null) {
                innero.appendChild(inneroFooter)
            }
            document.body.appendChild(innero)
        }
        window.onresize = function () {
            ResizeWindow(InnerTitleHeight, InnerFooterHeight, InnerTop, InnerLeft, InnerWidth, InnerHeight)
        };
        DragMessageBox()
    };
    this.ShowConfirmDialog = function (InnerHTML, YesCallback, ImgUrl, isClose, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10) {
        if (this.InnerDivHeight == 0.4) {
            this.InnerDivHeight = 0.3
        }
        if (this.InnerDivWidth == 0.6) {
            this.InnerDivWidth = 380
        }
        var InnerTitleHeight = this.InnerTitleHeight;
        var InnerFooterHeight = this.InnerFooterHeight;
        var InnerTop = this.InnerDivTop;
        var InnerLeft = this.InnerDivLeft;
        var InnerWidth = this.InnerDivWidth;
        var InnerHeight = this.InnerDivHeight;
        Init(this.InnerDivWidth, this.InnerDivHeight, this.InnerDivTop, this.InnerDivLeft);
        GetScreenSize();
        CreateSrceenDiv(this.ScreenDivClassName, this.ScreenDivBackgroudColor, this.ScreenDivOpacity);
        if (o != null) {
            document.body.appendChild(o)
        }
        ImgUrl = (ImgUrl == null || typeof (ImgUrl) == "undefined" || ImgUrl == "") ? "http://images.21edu.com/ui/plugins/messagebox/images/redirect.gif" : ImgUrl;
        InnerHTML = "<div class='MSG_HTML'><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td valign='top'></td><td class='pt15' align='left'>" + InnerHTML + "</td></tr></table></td></tr><tr><td align='center'><input class='MSG_Submit' type='button' value='确定' onclick='SubmitCallback(" + par1 + "," + par2 + "," + par3 + "," + par4 + "," + par5 + "," + par6 + "," + par7 + "," + par8 + "," + par9 + "," + par10 + ")'";
        
        if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
            InnerHTML += " onmouseover=\"this.className='MSG_Submit1'\" onmouseout=\"this.className='MSG_Submit'\" "
        }
        InnerHTML += ">&nbsp;&nbsp;&nbsp;&nbsp;<input class='MSG_Cancel' type='button' value='取消' onclick='RemMessageBox();'";
        if (ClassPath != null && ClassPath.toString().toLowerCase() == ".xue") {
            InnerHTML += " onmouseover=\"this.className='MSG_Cancel1'\" onmouseout=\"this.className='MSG_Cancel'\" "
        }
        InnerHTML += "></td></tr></table></div>";
        RemMessageBox = function () {
            RemoveMessageBox()
        };
        SubmitCallback = function (par1, par2, par3, par4, par5, par6, par7, par8, par9, par10) {
            RemoveMessageBox();
            try {
                if (typeof (YesCallback) == "function") {
                    YesCallback(par1, par2, par3, par4, par5, par6, par7, par8, par9, par10)
                }
            } catch (e) { }
        };
        CreateInnerDiv(this.InnerDivClassName, this.InnerDivBackgroudColor);
        if (innero != null) {
            document.body.focus();
            SetObjectPosition(innero, innerLeft, innerTop);
            CreateInnerTitleDiv(this.InnerTitleDivClassName, this.InnerTitleDivBackgroudColor, this.Title, this.InnerTitleHeight, this.CloseButtonClassName, this.CloseButtonValue, isClose);
            if (inneroTitle != null) {
                innero.appendChild(inneroTitle)
            }
            CreateInnerContentStringDiv(this.InnerContentDivClassName, this.InnerContentDivBackgroudColor, this.InnerTitleHeight, this.InnerFooterHeight, InnerHTML, true);
            if (inneroContent != null) {
                innero.appendChild(inneroContent)
            }
            CreateInnerFooterDiv(this.InnerFooterDivClassName, this.InnerFooterDivBackgroudColor, this.InnerFooterHTML, this.InnerFooterHeight);
            if (inneroFooter != null) {
                innero.appendChild(inneroFooter)
            }
            document.body.appendChild(innero)
        }
        window.onresize = function () {
            ResizeWindow(InnerTitleHeight, InnerFooterHeight, InnerTop, InnerLeft, InnerWidth, InnerHeight)
        };
        DragMessageBox()
    };
    AutoClose = function (j, m, Callback, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10) {
        if (j == m) {
            RemoveMessageBox();
            try {
                if (typeof (Callback) == "function") {
                    Callback(par1, par2, par3, par4, par5, par6, par7, par8, par9, par10)
                }
            } catch (e) { }
            return
        } else {
            j++
        }
        y = setTimeout(function () {
            AutoClose(j, m, Callback, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10)
        }, 1000)
    };
    
}