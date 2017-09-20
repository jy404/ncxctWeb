var $C = {
    B: function(ua) {
        var b = {
            msie: /msie/.test(ua) && !/opera/.test(ua),
            opera: /opera/.test(ua),
            safari: /webkit/.test(ua) && !/chrome/.test(ua),
            firefox: /firefox/.test(ua),
            chrome: /chrome/.test(ua),
            _360: function(u) {
                var f = false;
                if (u.indexOf("360chrome") > -1) {
                    f = true;
                }
                try {
                    if (window.external && window.external.twGetRunPath) {
                        var r = external.twGetRunPath();
                        if (r && r.toLowerCase().indexOf("360se") > -1) {
                            f = true;
                        }
                    }
                } catch (e) {
                    f = false;
                }
                return f;
            }(ua)
        };
        for (var i in b) {
            if (b[i]) {
                $U.Ext(b, {
                    version: /version\/([\d.]+)/i.test(ua) || RegExp(i + "[\\/| ]([\\d.]+)", "i").test(ua) ? RegExp.$1 : "0"
                });
                break;
            }
        }
        return b;
    }(navigator.userAgent.toLowerCase()),
    P: {
        st: function() {
            return document.documentElement.scrollTop || document.body.scrollTop;
        },
        sh: function() {
            return document.documentElement.scrollHeight || document.body.scrollHeight;
        },
        sl: function() {
            return document.documentElement.scrollLeft || document.body.scrollLeft;
        },
        sw: function() {
            return document.documentElement.scrollWidth || document.body.scrollWidth;
        },
        ch: function() {
            return document.documentElement.clientHeight || document.body.clientHeight;
        },
        cw: function() {
            return document.documentElement.clientWidth || document.body.clientWidth;
        },
        cl: function() {
            return document.documentElement.clientLeft || document.body.clientLeft;
        },
        ct: function() {
            return document.documentElement.clientTop || document.body.clientTop;
        },
        ow: function() {
            return document.body.offsetWidth;
        },
        oh: function() {
            return document.body.offsetHeight;
        },
        maxh: function() {
            return Math.max(document.documentElement.scrollHeight || document.body.scrollHeight, document.documentElement.clientHeight || document.body.clientHeight);
        },
        maxw: function() {
            return Math.max(document.body.offsetWidth, document.documentElement.clientWidth || document.body.clientWidth);
        }
    },
    OS: function(ua) {
        var os = "Unknow";
        if (ua.indexOf("nt 6.0") != -1) {
            os = "WinVista";
        } else if (ua.indexOf("nt 6.1") != -1) {
            os = "Win2008";
        } else if (ua.indexOf("nt 5.2") != -1) {
            os = "Win2003";
        } else if (ua.indexOf("nt 5.1") != -1) {
            os = "WinXP";
        } else if (ua.indexOf("nt 5") != -1) {
            os = "Win2000";
        } else if (ua.indexOf("nt 4") != -1) {
            os = "WinNT4";
        } else if (ua.indexOf("me") != -1) {
            os = "WinMe";
        } else if (ua.indexOf("98") != -1) {
            os = "Win98";
        } else if (ua.indexOf("95") != -1) {
            os = "Win95";
        } else if (ua.indexOf("mac") != -1) {
            os = "Mac";
        } else if (ua.indexOf("unix") != -1) {
            os = "UNIX";
        } else if (ua.indexOf("linux") != -1) {
            os = "Linux";
        } else if (ua.indexOf("sunos") != -1) {
            os = "SunOS";
        }
        return os;
    }(navigator.userAgent.toLowerCase())
};