var $$ = function (o) {
    return "string" == typeof o ? document.getElementById(o) : o
};
var $T = function (obj, tarName) {
    return obj.getElementsByTagName(tarName)
};
var $$C = function (obj, n) {
    var objs = $T($$(obj), '*');
    var ret = [];
    for (var i = 0; i < objs.length; i++) if (objs[i].className == n) ret.push(objs[i]);
    return ret
};
var $PluginsPath = 'http://image.pongo.com.cn/ui/plugins/';
if (document.namespaces) document.namespaces.add('ui', 'http://www.pongo.cn');
else document.documentElement.setAttribute('xmlns:ui', 'http://www.pongo.cn');
var $U = {
    B: function (o, f) {
        return function () {
            return o[f].apply(o, arguments)
        }
    },
    BE: function (o, f) {
        return function (event) {
            return o[f].apply(o, arguments)
        }
    },
    AL: function (o, es) {
        for (var e in es) {
            try {
                if (o.addEventListener) o.addEventListener(e, es[e], false);
                else if (o.attachEvent) o.attachEvent("on" + e, es[e]);
                else o["on" + e] = es[e]
            } catch (e) { }
        }
    },
    RL: function (o, es) {
        for (var e in es) {
            if (o.removeEventListener) o.removeEventListener(e, es[e], false);
            else if (o.detachEvent) o.detachEvent("on" + e, es[e]);
            else o["on" + e] = null
        }
    },
    CE: function (o) {
        if (!o.type) return null;
        var e = document.createElement(o.type);
        if (o.attr) $U.SA(e, o.attr);
        if (o.css) $U.SS(e, o.css);
        if (o.cssTxt) $U.SS(e, {
            cssText: o.cssTxt
        });
        if (o.events) $U.AL(e, o.events);
        if (o.childs) $U.AC(e, o.childs);
        return e
    },
    RE: function (o, es) {
        for (var e in es) try {
            o.removeChild(es[e])
        } catch (e) { }
    },
    CI: function (o, i, n, u, c) {
        o.innerHTML = "<iframe id='" + i + "' name='" + n + "' scrolling='auto' frameBorder='0' marginWidth='0' marginHeight='0' allowtransparency='true' src='" + u + "' class='" + c + "'></iframe>"
    },
    AC: function (o, es) {
        for (var e in es) try {
            o.appendChild(es[e])
        } catch (e) { }
        return o
    },
    E: function (e) {
        var e = e || window.event;
        if ($C.B.msie) {
            try {
                e.pageX = e.clientX || e.pageX;
                e.pageY = e.clientY || e.pageY;
                e.target = e.srcElement || e.target;
                e.preventDefault = function () {
                    this.returnValue = false
                };
                e.stopPropagation = function () {
                    this.cancelBubble = true
                };
                e.detail = e.wheelDelta / (-40);
                e.keyCode = e.keyCode || e.which || e.charCode
            } catch (e) { }
        }
        return e
    },
    SA: function (o, as) {
        for (var a in as) try {
            /innerhtml|id|classname|disabled|name/i.test(a) ? o[a] = as[a] : o.setAttribute(a, as[a])
        } catch (e) { }
    },
    SS: function (o, ss) {
        for (var s in ss) try {
            o.style[s] = (/top|left|height|width/i.test(s) ? ss[s].toString().replace(/(.*?)(?:px)?$/i, '$1px').replace(/^px$/i, '') : ss[s])
        } catch (e) { }
    },
    SO: function (o, v) {
        if ($C.B.msie) {
            v = v == 100 ? '' : 'alpha(opacity=' + v + ')';
            $U.SS(o, {
                filter: v
            })
        } else {
            $U.SS(o, {
                opacity: v / 100
            })
        }
    },
    GetCK: function (n) {
        var a, r = new RegExp('(^| )' + n + '=([^;]*)(;|$)');
        if (a = document.cookie.match(r)) return unescape(a[2]);
        else return ''
    },
    SetCK: function (n, v, t, p, d) {
        p = p || '/';
        d = d || '';
        t = t || 0;
        var c = n + '=' + escape(v);
        if (t != 0) {
            var e = new Date();
            e.setTime(e.getTime() + t * 24 * 60 * 60 * 1000);
            c += '; expires=' + e.toGMTString()
        }
        c += '; path=' + p;
        if (d != '') c += '; domain=' + d;
        if (c.length < 4096) document.cookie = c
    },
    Ext: function (os, ot) {
        for (var o in ot) os[o] = ot[o]
    },
    DExt: function (os, ot) {
        for (var p in ot) {
            var c = ot[p];
            if (os === c) continue;
            os[p] = typeof c === "object" ? arguments.callee(os[p] || {}, c) : c
        }
        return os
    },
    Each: function (o, callback) {
        if (undefined === o.length) for (var n in o) if (false === callback(o[n], n, o)) break;
        else for (var i = 0; i < o.length; i++) if (i in o) {
            if (false === callback(o[i], i, o)) break
        }
    },
    GMZI: function () {
        var os = $T(document, "*");
        var m = 0;
        for (var i = 0; i < os.length; i++) {
            var z = parseInt($U.GS(os[i], 'zIndex'));
            if (m < z) m = z
        }
        return ++m
    },
    SMZI: function (o) {
        $U.SS(o, {
            'zIndex': $U.GMZI()
        })
    },
    GS: function (obj, name) {
        obj = $$(obj);
        if (obj.style[name]) return obj.style[name];
        else if (obj.currentStyle) return obj.currentStyle[name];
        else if (document.defaultView && document.defaultView.getComputedStyle) {
            name = name.replace(/([A-Z])/g, "-$1");
            name = name.toLowerCase();
            var s = document.defaultView.getComputedStyle(obj, "");
            return s && s.getPropertyValue(name)
        } else return null
    },
    SB: function (input, len, moreFlag, info) {
        var txt = input,
            l = len;
        if (txt == '' || l < 0) return '';
        txt = txt.replace(/<.*?>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        l = 2 * l;
        var ret = '';
        for (var i = 0; i < txt.length; i++) {
            l -= /[\u4e00-\u9fa5]/.test(txt[i]) ? 2 : 1;
            if (l < 0) break;
            ret += txt[i]
        }
        if (moreFlag && input.RealLen() > len * 2) ret += info || '...';
        return ret.replace(/\s/g, '&nbsp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    },
    GO: function (o) {
        o = $$(o);
        var l = 0,
            t = 0;
        if (o.getBoundingClientRect) {
            var p = o.getBoundingClientRect();
            l = p.left + $C.P.sl() - $C.P.cl();
            t = p.top + $C.P.st() - $C.P.ct()
        } else {
            while (o.offsetParent) {
                l += o.offsetLeft;
                t += o.offsetTop;
                o = o.offsetParent
            }
        }
        return {
            left: l,
            top: t
        }
    },
    LC: function (url, charset, id) {
        var css = $U.CE({
            type: 'link',
            attr: {
                type: 'text/css',
                charset: charset,
                rel: 'stylesheet',
                href: url,
                id: id
            }
        });
        var head = $T(document, 'head')[0] || document.documentElement;
        head.insertBefore(css, head.firstChild)
    },
    LJ: function (url, handler) {
        var script = $U.CE({
            type: 'script',
            attr: {
                type: 'text/javascript',
                src: url
            }
        });
        var head = $T(document, 'head')[0] || document.documentElement;
        head.insertBefore(script, head.firstChild);
        var suc = (handler && handler.onsuccess) ||
        function () { };
        var fail = (handler && handler.onfailure) ||
        function () { };
        if (document.attachEvent) {
            script.onreadystatechange = function () {
                if (this.readyState && this.readyState == "loading") return;
                suc();
                head.removeChild(script)
            }
        } else {
            script.onload = function () {
                suc();
                head.removeChild(script)
            }
        }
        script.onerror = function () {
            fail();
            head.removeChild(script)
        }
    },
    GUI: function (o, t) {
        return $T(o, ($C.B.msie && $.CB.version < 9) ? t : 'ui:' + t)
    }
};
$U.Ext($U, {
    Queue: function (t) {
        var q = new Array();
        this.Enqueue = function (o) {
            if (typeof o != t) {
                alert('please enqueue ' + t + ' object')
            } else {
                q.push(o)
            }
        };
        this.Dequeue = function () {
            return q.shift()
        };
        this.Count = function () {
            return q.length
        }
    }
});
$U.Ext($U, {
    readyQueue: new $U.Queue('function'),
    readyListener: false,
    ready: function (fn) {
        $U.readyQueue.Enqueue(fn);
        if (!$U.readyListener) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", $U.readyHandler, false)
            } else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", $U.readyHandler)
            }
            $U.readyListener = true
        }
    },
    readyHandler: function () {
        while ($U.readyQueue.Count() > 0) {
            try {
                $U.readyQueue.Dequeue()()
            } catch (e) { }
        }
        if (document.addEventListener) {
            document.removeEventListener("DOMContentLoaded", $U.readyHandler, false)
        } else if (document.attachEvent) {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", $U.readyHandler)
            }
        }
    }
});
$U.Ext($U, {
    insert: function (e, n, p) {
        switch (p.toLowerCase()) {
            case 'before':
                e.parentNode.insertBefore(n, e);
                break;
            case 'top':
                e.insertBefore(n, e.firstChild);
                break;
            case 'bottom':
                e.appendChild(n);
                break;
            case 'after':
                e.parentNode.insertBefore(n, e.nextSibling);
                break
        }
    }
});
$U.Ext(String.prototype, {
    Trim: function () {
        return this.replace(/(^\s*)|(\s*$)/g, "")
    },
    LTrim: function () {
        return this.replace(/(^\s*)/g, "")
    },
    Rtrim: function () {
        return this.replace(/(\s*$)/g, "")
    },
    RealLen: function () {
        return this.replace(/[\u4E00-\u9FA5]/g, '**').length
    },
    RealTrim: function () {
        return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '')
    }
});
try {
    HTMLElement.prototype.click = function () {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt)
    }
} catch (e) { }