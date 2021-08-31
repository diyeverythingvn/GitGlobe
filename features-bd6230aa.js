!function() {
    "use strict";
    var e = function() {
        for (var e = new Uint32Array(256), t = 256; t--; ) {
            for (var n = t, r = 8; r--; )
                n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            e[t] = n
        }
        return function(t) {
            var n = -1;
            "string" == typeof t && (t = function(e) {
                for (var t = e.length, n = new Array(t), r = -1; ++r < t; )
                    n[r] = e.charCodeAt(r);
                return n
            }(t));
            for (var r = 0, o = t.length; r < o; r++)
                n = n >>> 8 ^ e[255 & n ^ t[r]];
            return (-1 ^ n) >>> 0
        }
    }();
    function t(...e) {
        return JSON.stringify(e, ((e,t)=>"object" == typeof t ? t : String(t)))
    }
    function n(e, n={}) {
        const {hash: r=t, cache: o=new Map} = n;
        return function(...t) {
            const n = r.apply(this, t);
            if (o.has(n))
                return o.get(n);
            let i = e.apply(this, t);
            return i instanceof Promise && (i = i.catch((e=>{
                throw o.delete(n),
                e
            }
            ))),
            o.set(n, i),
            i
        }
    }
    class Feature {
        constructor(e, t, n, r) {
            this.name = e,
            this.enabled = t,
            this.percentageOfActors = n,
            this.actors = r
        }
        isEnabled(e) {
            return this.enabled || this.actorGateOpen(e) || this.percentageOfActorsGateOpen(e)
        }
        percentageOfActorsGateOpen(t) {
            if (!t || this.percentageOfActors < 1)
                return !1;
            const n = `${this.name}${t}`;
            var r, o, i;
            return (i = e(n),
            r ? ((o = i) < 0 && (o = 4294967295 + o + 1),
            ("0000000" + o.toString(16)).slice(-8)) : i) % 1e5 < 1e3 * this.percentageOfActors
        }
        actorGateOpen(e) {
            return !(!e || this.actors.length < 1) && this.actors.includes(e)
        }
    }
    function r(e) {
        return !("object" != typeof e || !e) && !!("name"in e && "string" == typeof e.name && "enabled"in e && "boolean" == typeof e.enabled && "percentageOfActors"in e && "number" == typeof e.percentageOfActors && "actors"in e && Array.isArray(e.actors))
    }
    class FeaturesDatafile {
        constructor(e) {
            this.features = (e.features || []).filter(r).map((e=>new Feature(e.name,e.enabled,e.percentageOfActors,e.actors)))
        }
        getFeature(e) {
            return this.features.find((t=>t.name === e))
        }
    }
    const o = n((function() {
        var e;
        const t = null === (e = document.head) || void 0 === e ? void 0 : e.querySelector('meta[name="features-datafile"]')
          , n = (null == t ? void 0 : t.content) || "{}"
          , r = JSON.parse(n);
        return new FeaturesDatafile(r)
    }
    ));
    function i() {
        if (!(this instanceof i))
            return new i;
        this.size = 0,
        this.uid = 0,
        this.selectors = [],
        this.indexes = Object.create(this.indexes),
        this.activeIndexes = []
    }
    var a = window.document.documentElement
      , s = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector;
    i.prototype.matchesSelector = function(e, t) {
        return s.call(e, t)
    }
    ,
    i.prototype.querySelectorAll = function(e, t) {
        return t.querySelectorAll(e)
    }
    ,
    i.prototype.indexes = [];
    var c = /^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    i.prototype.indexes.push({
        name: "ID",
        selector: function(e) {
            var t;
            if (t = e.match(c))
                return t[0].slice(1)
        },
        element: function(e) {
            if (e.id)
                return [e.id]
        }
    });
    var l = /^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    i.prototype.indexes.push({
        name: "CLASS",
        selector: function(e) {
            var t;
            if (t = e.match(l))
                return t[0].slice(1)
        },
        element: function(e) {
            var t = e.className;
            if (t) {
                if ("string" == typeof t)
                    return t.split(/\s/);
                if ("object" == typeof t && "baseVal"in t)
                    return t.baseVal.split(/\s/)
            }
        }
    });
    var u, d = /^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    i.prototype.indexes.push({
        name: "TAG",
        selector: function(e) {
            var t;
            if (t = e.match(d))
                return t[0].toUpperCase()
        },
        element: function(e) {
            return [e.nodeName.toUpperCase()]
        }
    }),
    i.prototype.indexes.default = {
        name: "UNIVERSAL",
        selector: function() {
            return !0
        },
        element: function() {
            return [!0]
        }
    },
    u = "function" == typeof window.Map ? window.Map : function() {
        function e() {
            this.map = {}
        }
        return e.prototype.get = function(e) {
            return this.map[e + " "]
        }
        ,
        e.prototype.set = function(e, t) {
            this.map[e + " "] = t
        }
        ,
        e
    }();
    var f = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
    function h(e, t) {
        var n, r, o, i, a, s, c = (e = e.slice(0).concat(e.default)).length, l = t, u = [];
        do {
            if (f.exec(""),
            (o = f.exec(l)) && (l = o[3],
            o[2] || !l))
                for (n = 0; n < c; n++)
                    if (a = (s = e[n]).selector(o[1])) {
                        for (r = u.length,
                        i = !1; r--; )
                            if (u[r].index === s && u[r].key === a) {
                                i = !0;
                                break
                            }
                        i || u.push({
                            index: s,
                            key: a
                        });
                        break
                    }
        } while (o);
        return u
    }
    function v(e, t) {
        var n, r, o;
        for (n = 0,
        r = e.length; n < r; n++)
            if (o = e[n],
            t.isPrototypeOf(o))
                return o
    }
    function m(e, t) {
        return e.id - t.id
    }
    i.prototype.logDefaultIndexUsed = function() {}
    ,
    i.prototype.add = function(e, t) {
        var n, r, o, i, a, s, c, l, d = this.activeIndexes, f = this.selectors;
        if ("string" == typeof e) {
            for (n = {
                id: this.uid++,
                selector: e,
                data: t
            },
            c = h(this.indexes, e),
            r = 0; r < c.length; r++)
                i = (l = c[r]).key,
                (a = v(d, o = l.index)) || ((a = Object.create(o)).map = new u,
                d.push(a)),
                o === this.indexes.default && this.logDefaultIndexUsed(n),
                (s = a.map.get(i)) || (s = [],
                a.map.set(i, s)),
                s.push(n);
            this.size++,
            f.push(e)
        }
    }
    ,
    i.prototype.remove = function(e, t) {
        if ("string" == typeof e) {
            var n, r, o, i, a, s, c, l, u = this.activeIndexes, d = {}, f = 1 === arguments.length;
            for (n = h(this.indexes, e),
            o = 0; o < n.length; o++)
                for (r = n[o],
                i = u.length; i--; )
                    if (s = u[i],
                    r.index.isPrototypeOf(s)) {
                        if (c = s.map.get(r.key))
                            for (a = c.length; a--; )
                                (l = c[a]).selector !== e || !f && l.data !== t || (c.splice(a, 1),
                                d[l.id] = !0);
                        break
                    }
            this.size -= Object.keys(d).length
        }
    }
    ,
    i.prototype.queryAll = function(e) {
        if (!this.selectors.length)
            return [];
        var t, n, r, o, i, a, s, c, l = {}, u = [], d = this.querySelectorAll(this.selectors.join(", "), e);
        for (t = 0,
        r = d.length; t < r; t++)
            for (i = d[t],
            n = 0,
            o = (a = this.matches(i)).length; n < o; n++)
                l[(c = a[n]).id] ? s = l[c.id] : (s = {
                    id: c.id,
                    selector: c.selector,
                    data: c.data,
                    elements: []
                },
                l[c.id] = s,
                u.push(s)),
                s.elements.push(i);
        return u.sort(m)
    }
    ,
    i.prototype.matches = function(e) {
        if (!e)
            return [];
        var t, n, r, o, i, a, s, c, l, u, d, f = this.activeIndexes, h = {}, v = [];
        for (t = 0,
        o = f.length; t < o; t++)
            if (c = (s = f[t]).element(e))
                for (n = 0,
                i = c.length; n < i; n++)
                    if (l = s.map.get(c[n]))
                        for (r = 0,
                        a = l.length; r < a; r++)
                            !h[d = (u = l[r]).id] && this.matchesSelector(e, u.selector) && (h[d] = !0,
                            v.push(u));
        return v.sort(m)
    }
    ;
    var p = {}
      , g = {}
      , y = new WeakMap
      , b = new WeakMap
      , w = new WeakMap
      , S = Object.getOwnPropertyDescriptor(Event.prototype, "currentTarget");
    function A(e, t, n) {
        var r = e[t];
        return e[t] = function() {
            return n.apply(e, arguments),
            r.apply(e, arguments)
        }
        ,
        e
    }
    function O() {
        y.set(this, !0)
    }
    function M() {
        y.set(this, !0),
        b.set(this, !0)
    }
    function x() {
        return w.get(this) || null
    }
    function k(e, t) {
        S && Object.defineProperty(e, "currentTarget", {
            configurable: !0,
            enumerable: !0,
            get: t || S.get
        })
    }
    function E(e) {
        if (function(e) {
            try {
                return e.eventPhase,
                !0
            } catch (t) {
                return !1
            }
        }(e)) {
            var t = (1 === e.eventPhase ? g : p)[e.type];
            if (t) {
                var n = function(e, t, n) {
                    var r = []
                      , o = t;
                    do {
                        if (1 !== o.nodeType)
                            break;
                        var i = e.matches(o);
                        if (i.length) {
                            var a = {
                                node: o,
                                observers: i
                            };
                            n ? r.unshift(a) : r.push(a)
                        }
                    } while (o = o.parentElement);
                    return r
                }(t, e.target, 1 === e.eventPhase);
                if (n.length) {
                    A(e, "stopPropagation", O),
                    A(e, "stopImmediatePropagation", M),
                    k(e, x);
                    for (var r = 0, o = n.length; r < o && !y.get(e); r++) {
                        var i = n[r];
                        w.set(e, i.node);
                        for (var a = 0, s = i.observers.length; a < s && !b.get(e); a++)
                            i.observers[a].data.call(i.node, e)
                    }
                    w.delete(e),
                    k(e)
                }
            }
        }
    }
    function q(e) {
        const t = [];
        for (const n of function() {
            try {
                return document.cookie.split(";")
            } catch (e) {
                return []
            }
        }()) {
            const [r,o] = n.trim().split("=");
            e === r && void 0 !== o && t.push({
                key: r,
                value: o
            })
        }
        return t
    }
    function N() {
        const e = (new Date).getTime()
          , t = `${Math.round(Math.random() * (Math.pow(2, 31) - 1))}.${Math.round(e / 1e3)}`;
        return function(e, t, n=null, r=!1, o="lax") {
            let i = document.domain;
            if (null == i)
                throw new Error("Unable to get document domain");
            i.endsWith(".github.com") && (i = "github.com");
            const a = "https:" === location.protocol ? "; secure" : ""
              , s = n ? "; expires=" + n : "";
            !1 === r && (i = "." + i);
            try {
                document.cookie = `${e}=${t}; path=/; domain=${i}${s}${a}; samesite=${o}`
            } catch (c) {}
        }("_octo", "GH1.1." + t, new Date(e + 31536e6).toUTCString()),
        t
    }
    !function(e, t, n) {
        var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}
          , o = !!r.capture
          , a = o ? g : p
          , s = a[e];
        s || (s = new i,
        a[e] = s,
        document.addEventListener(e, E, o)),
        s.add(t, n)
    }("click", "[data-octo-click]", (function(e) {
        if (!window._octo)
            return;
        !function(e) {
            if (!window._octo)
                return;
            const t = Math.floor((new Date).getTime() / 1e3);
            e.timestamp = t;
            const n = 'meta[name="octolytics-event-url"]';
            if (document.head && document.head.querySelector(n)) {
                const t = document.head.querySelector(n).content
                  , o = JSON.stringify(e);
                try {
                    navigator.sendBeacon && navigator.sendBeacon(t, o)
                } catch (r) {}
            }
        }(function(e) {
            const t = (null == e ? void 0 : e.getAttribute("data-octo-click")) || ""
              , n = {};
            n.event_type = t;
            const r = {}
              , o = {}
              , i = {};
            let a = [];
            (null == e ? void 0 : e.hasAttribute("data-octo-dimensions")) && (a = (e.getAttribute("data-octo-dimensions") || "").split(","));
            const s = document.head ? document.head.querySelectorAll('meta[name^="octolytics-"]') : [];
            for (const l of s)
                if (l instanceof HTMLMetaElement)
                    if (l.name.startsWith("octolytics-dimension-")) {
                        r[l.name.replace(/^octolytics-dimension-/, "")] = l.content
                    } else if (l.name.startsWith("octolytics-measure-")) {
                        o[l.name.replace(/^octolytics-measure-/, "")] = l.content
                    } else if (l.name.startsWith("octolytics-context-")) {
                        i[l.name.replace(/^octolytics-context-/, "")] = l.content
                    } else if (l.name.startsWith("octolytics-actor-")) {
                        r[l.name.replace(/^octolytics-/, "").replace(/-/g, "_")] = l.content
                    } else if (l.name.startsWith("octolytics-")) {
                        n[l.name.replace(/^octolytics-/, "").replace(/-/g, "_")] = l.content
                    }
            const c = document.querySelector("meta[name=visitor-payload]");
            if (c instanceof HTMLMetaElement) {
                const e = JSON.parse(atob(c.content));
                Object.assign(r, e)
            }
            if (null == e ? void 0 : e.hasAttribute("data-ga-click")) {
                const t = (e.getAttribute("data-ga-click") || "").split(",").map((e=>e.trim()));
                r.category = t[0],
                r.action = t[1]
            }
            for (const l of a) {
                const e = l.split(":")
                  , t = e.shift();
                t && (r[t] = e.join(":"))
            }
            return n.dimensions = r,
            n.measures = o,
            n.context = i,
            n
        }(e.currentTarget instanceof HTMLElement ? e.currentTarget : void 0))
    }
    ));
    const T = n((function() {
        var e, t;
        return ((null === (t = null === (e = document.head) || void 0 === e ? void 0 : e.querySelector('meta[name="enabled-features"]')) || void 0 === t ? void 0 : t.content) || "").split(",")
    }
    ));
    const D = n((function(e) {
        return -1 !== T().indexOf(e)
    }
    ));
    var C = null
      , F = null
      , P = [];
    function L(e, t) {
        var n = [];
        function r() {
            var e = n;
            n = [],
            t(e)
        }
        return function() {
            for (var t = arguments.length, o = Array(t), i = 0; i < t; i++)
                o[i] = arguments[i];
            n.push(o),
            1 === n.length && _(e, r)
        }
    }
    function _(e, t) {
        F || (F = new MutationObserver(j)),
        C || (C = e.createElement("div"),
        F.observe(C, {
            attributes: !0
        })),
        P.push(t),
        C.setAttribute("data-twiddle", "" + Date.now())
    }
    function j() {
        var e = P;
        P = [];
        for (var t = 0; t < e.length; t++)
            try {
                e[t]()
            } catch (n) {
                setTimeout((function() {
                    throw n
                }
                ), 0)
            }
    }
    var W = new WeakMap
      , H = new WeakMap
      , $ = new WeakMap
      , I = new WeakMap;
    function z(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n]
              , o = r[0]
              , i = r[1]
              , a = r[2];
            o === K ? (U(a, i),
            G(a, i)) : o === Q ? J(a, i) : o === X && V(e.observers, i)
        }
    }
    function U(e, t) {
        if (t instanceof e.elementConstructor) {
            var n = W.get(t);
            if (n || (n = [],
            W.set(t, n)),
            -1 === n.indexOf(e.id)) {
                var r = void 0;
                if (e.initialize && (r = e.initialize.call(void 0, t)),
                r) {
                    var o = H.get(t);
                    o || (o = {},
                    H.set(t, o)),
                    o["" + e.id] = r
                }
                n.push(e.id)
            }
        }
    }
    function G(e, t) {
        if (t instanceof e.elementConstructor) {
            var n = I.get(t);
            if (n || (n = [],
            I.set(t, n)),
            -1 === n.indexOf(e.id)) {
                e.elements.push(t);
                var r = H.get(t)
                  , o = r ? r["" + e.id] : null;
                if (o && o.add && o.add.call(void 0, t),
                e.subscribe) {
                    var i = e.subscribe.call(void 0, t);
                    if (i) {
                        var a = $.get(t);
                        a || (a = {},
                        $.set(t, a)),
                        a["" + e.id] = i
                    }
                }
                e.add && e.add.call(void 0, t),
                n.push(e.id)
            }
        }
    }
    function J(e, t) {
        if (t instanceof e.elementConstructor) {
            var n = I.get(t);
            if (n) {
                var r = e.elements.indexOf(t);
                if (-1 !== r && e.elements.splice(r, 1),
                -1 !== (r = n.indexOf(e.id))) {
                    var o = H.get(t)
                      , i = o ? o["" + e.id] : null;
                    if (i && i.remove && i.remove.call(void 0, t),
                    e.subscribe) {
                        var a = $.get(t)
                          , s = a ? a["" + e.id] : null;
                        s && s.unsubscribe && s.unsubscribe()
                    }
                    e.remove && e.remove.call(void 0, t),
                    n.splice(r, 1)
                }
                0 === n.length && I.delete(t)
            }
        }
    }
    function V(e, t) {
        var n = I.get(t);
        if (n) {
            for (var r = n.slice(0), o = 0; o < r.length; o++) {
                var i = e[r[o]];
                if (i) {
                    var a = i.elements.indexOf(t);
                    -1 !== a && i.elements.splice(a, 1);
                    var s = H.get(t)
                      , c = s ? s["" + i.id] : null;
                    c && c.remove && c.remove.call(void 0, t);
                    var l = $.get(t)
                      , u = l ? l["" + i.id] : null;
                    u && u.unsubscribe && u.unsubscribe(),
                    i.remove && i.remove.call(void 0, t)
                }
            }
            I.delete(t)
        }
    }
    var B = null;
    function R(e) {
        return "matches"in e || "webkitMatchesSelector"in e || "mozMatchesSelector"in e || "oMatchesSelector"in e || "msMatchesSelector"in e
    }
    var K = 1
      , Q = 2
      , X = 3;
    function Y(e, t, n) {
        for (var r = 0; r < n.length; r++) {
            var o = n[r];
            "childList" === o.type ? (Z(e, t, o.addedNodes),
            ee(e, t, o.removedNodes)) : "attributes" === o.type && te(e, t, o.target)
        }
        (function(e) {
            if (null === B) {
                var t = e.createElement("div")
                  , n = e.createElement("div")
                  , r = e.createElement("div");
                t.appendChild(n),
                n.appendChild(r),
                t.innerHTML = "",
                B = r.parentNode !== n
            }
            return B
        }
        )(e.ownerDocument) && function(e, t) {
            for (var n = 0; n < e.observers.length; n++) {
                var r = e.observers[n];
                if (r)
                    for (var o = r.elements, i = 0; i < o.length; i++) {
                        var a = o[i];
                        a.parentNode || t.push([X, a])
                    }
            }
        }(e, t)
    }
    function Z(e, t, n) {
        for (var r = 0; r < n.length; r++) {
            var o = n[r];
            if (R(o))
                for (var i = e.selectorSet.matches(o), a = 0; a < i.length; a++) {
                    var s = i[a].data;
                    t.push([K, o, s])
                }
            if ("querySelectorAll"in o)
                for (var c = e.selectorSet.queryAll(o), l = 0; l < c.length; l++)
                    for (var u = c[l], d = u.data, f = u.elements, h = 0; h < f.length; h++)
                        t.push([K, f[h], d])
        }
    }
    function ee(e, t, n) {
        for (var r = 0; r < n.length; r++) {
            var o = n[r];
            if ("querySelectorAll"in o) {
                t.push([X, o]);
                for (var i = o.querySelectorAll("*"), a = 0; a < i.length; a++)
                    t.push([X, i[a]])
            }
        }
    }
    function te(e, t, n) {
        if (R(n))
            for (var r = e.selectorSet.matches(n), o = 0; o < r.length; o++) {
                var i = r[o].data;
                t.push([K, n, i])
            }
        if ("querySelectorAll"in n) {
            var a = I.get(n);
            if (a)
                for (var s = 0; s < a.length; s++) {
                    var c = e.observers[a[s]];
                    c && (e.selectorSet.matchesSelector(n, c.selector) || t.push([Q, n, c]))
                }
        }
    }
    var ne = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    }
    : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }
      , re = 0;
    function oe(e) {
        this.rootNode = 9 === e.nodeType ? e.documentElement : e,
        this.ownerDocument = 9 === e.nodeType ? e : e.ownerDocument,
        this.observers = [],
        this.selectorSet = new i,
        this.mutationObserver = new MutationObserver(se.bind(this, this)),
        this._scheduleAddRootNodes = L(this.ownerDocument, ae.bind(this, this)),
        this._handleThrottledChangedTargets = L(this.ownerDocument, le.bind(this, this)),
        this.rootNode.addEventListener("change", ce.bind(this, this), !1),
        function(e, t) {
            var n = e.readyState;
            "interactive" === n || "complete" === n ? _(e, t) : e.addEventListener("DOMContentLoaded", _(e, t))
        }(this.ownerDocument, ie.bind(this, this))
    }
    function ie(e) {
        e.mutationObserver.observe(e.rootNode, {
            childList: !0,
            attributes: !0,
            subtree: !0
        }),
        e._scheduleAddRootNodes()
    }
    function ae(e) {
        var t = [];
        Z(e, t, [e.rootNode]),
        z(e, t)
    }
    function se(e, t) {
        var n = [];
        Y(e, n, t),
        z(e, n)
    }
    function ce(e, t) {
        e._handleThrottledChangedTargets(t.target)
    }
    function le(e, t) {
        var n = [];
        !function(e, t, n) {
            for (var r = 0; r < n.length; r++)
                for (var o = n[r], i = o.form ? o.form.elements : e.rootNode.querySelectorAll("input"), a = 0; a < i.length; a++)
                    te(e, t, i[a])
        }(e, n, t),
        z(e, n)
    }
    oe.prototype.disconnect = function() {
        this.mutationObserver.disconnect()
    }
    ,
    oe.prototype.observe = function(e, t) {
        var n = void 0;
        "function" == typeof t ? n = {
            selector: e,
            initialize: t
        } : "object" === (void 0 === t ? "undefined" : ne(t)) ? (n = t).selector = e : n = e;
        var r = this
          , o = {
            id: re++,
            selector: n.selector,
            initialize: n.initialize,
            add: n.add,
            remove: n.remove,
            subscribe: n.subscribe,
            elements: [],
            elementConstructor: n.hasOwnProperty("constructor") ? n.constructor : this.ownerDocument.defaultView.Element,
            abort: function() {
                r._abortObserving(o)
            }
        };
        return this.selectorSet.add(o.selector, o),
        this.observers[o.id] = o,
        this._scheduleAddRootNodes(),
        o
    }
    ,
    oe.prototype._abortObserving = function(e) {
        for (var t = e.elements, n = 0; n < t.length; n++)
            J(e, t[n]);
        this.selectorSet.remove(e.selector, e),
        delete this.observers[e.id]
    }
    ,
    oe.prototype.triggerObservers = function(e) {
        var t = [];
        !function(e, t, n) {
            if ("querySelectorAll"in n) {
                te(e, t, n);
                for (var r = n.querySelectorAll("*"), o = 0; o < r.length; o++)
                    te(e, t, r[o])
            }
        }(this, t, e),
        z(this, t)
    }
    ;
    var ue = void 0;
    function de() {
        return ue || (ue = new oe(window.document)),
        ue
    }
    "interactive" === document.readyState || "complete" === document.readyState ? Promise.resolve() : new Promise((e=>{
        document.addEventListener("DOMContentLoaded", (()=>{
            e()
        }
        ))
    }
    ));
    const fe = "complete" === document.readyState ? Promise.resolve() : new Promise((e=>{
        window.addEventListener("load", e)
    }
    ));
    let he = [];
    function ve(e, t=!1) {
        var n, r;
        void 0 === e.timestamp && (e.timestamp = (new Date).getTime()),
        e.loggedIn = !!(null === (r = null === (n = document.head) || void 0 === n ? void 0 : n.querySelector('meta[name="user-login"]')) || void 0 === r ? void 0 : r.content),
        he.push(e),
        t ? pe() : async function() {
            await fe,
            null == me && (me = window.requestIdleCallback(pe))
        }()
    }
    let me = null;
    function pe() {
        var e, t;
        if (me = null,
        function(e) {
            var t, n;
            const r = null === (n = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="expected-hostname"]')) || void 0 === n ? void 0 : n.content;
            return !!r && r.replace(/\.$/, "").split(".").slice(-2).join(".") !== e.location.hostname.replace(/\.$/, "").split(".").slice(-2).join(".")
        }(document))
            return;
        const n = null === (t = null === (e = document.head) || void 0 === e ? void 0 : e.querySelector('meta[name="browser-stats-url"]')) || void 0 === t ? void 0 : t.content;
        if (!n)
            return;
        const r = JSON.stringify({
            stats: he
        });
        try {
            navigator.sendBeacon && navigator.sendBeacon(n, r)
        } catch (o) {}
        he = []
    }
    function ge(e) {
        const t = e.getAttribute("data-feature")
          , n = "true" === e.getAttribute("data-show-when-feature-enabled");
        if (!t)
            return;
        const r = D(t) || function(e) {
            const t = o().getFeature(e);
            if (!t)
                return !1;
            const n = "User::CurrentVisitorActor:" + ye();
            return t.isEnabled(n)
        }(t);
        e.hidden = r ? !n : n,
        function(e, t) {
            if (!e.hasAttribute("data-feature-hydro") || !e.hasAttribute("data-feature-hydro-hmac"))
                return;
            const n = e.getAttribute("data-feature-hydro") || ""
              , r = e.getAttribute("data-feature-hydro-hmac") || "";
            !function(e, t, n) {
                const r = {
                    hydroEventPayload: e,
                    hydroEventHmac: t,
                    visitorPayload: "",
                    visitorHmac: "",
                    hydroClientContext: n
                }
                  , o = document.querySelector("meta[name=visitor-payload]");
                o instanceof HTMLMetaElement && (r.visitorPayload = o.content);
                const i = document.querySelector("meta[name=visitor-hmac]") || "";
                i instanceof HTMLMetaElement && (r.visitorHmac = i.content),
                ve(r, !0)
            }(n, r, JSON.stringify({
                octolytics_id: ye(),
                feature_flag_enabled: t
            }))
        }(e, r)
    }
    function ye() {
        return "GH1.1." + (function() {
            let e = "";
            const t = q("_octo")
              , n = [];
            for (const r of t) {
                const t = r.value.split(".");
                if ("GH1" === t.shift() && t.length > 1) {
                    const r = (t.shift() || "").split("-");
                    1 === r.length && (r[1] = "1");
                    const o = [Number(r[0]), Number(r[1])];
                    e = t.join("."),
                    n.push([o, e])
                }
            }
            return e = "",
            n.length > 0 && (e = String(n.sort().reverse()[0][1])),
            e
        }() || N())
    }
    !function() {
        var e;
        (e = de()).observe.apply(e, arguments)
    }("[data-feature]", {
        add(e) {
            ge(e)
        }
    })
}();
