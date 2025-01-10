!function(a) {
    var b = function(c, d) {
        this.el = a(c),
        this.options = a.extend({}, a.fn.typed.defaults, d),
        this.baseText = this.el.text() || this.el.attr("placeholder") || "",
        this.typeSpeed = this.options.typeSpeed,
        this.startDelay = this.options.startDelay,
        this.backSpeed = this.options.backSpeed,
        this.backDelay = this.options.backDelay,
        this.strings = this.options.strings,
        this.strPos = 0,
        this.arrayPos = 0,
        this.stopNum = 0,
        this.loop = this.options.loop,
        this.loopCount = this.options.loopCount,
        this.curLoop = 0,
        this.stop = !1,
        this.showCursor = !this.isInput && this.options.showCursor,
        this.cursorChar = this.options.cursorChar,
        this.isInput = this.el.is("input"),
        this.attr = this.options.attr || (this.isInput ? "placeholder" : null),
        this.build()
    };
    b.prototype = {
        constructor: b,
        init: function() {
            var c = this;
            c.timeout = setTimeout(function() {
                c.typewrite(c.strings[c.arrayPos], c.strPos)
            }, c.startDelay)
        },
        build: function() {
            !0 === this.showCursor && (this.cursor = a('<span class="typed-cursor">' + this.cursorChar + "</span>"),
            this.el.after(this.cursor)),
            this.init()
        },
        typewrite: function(d, e) {
            if (!0 !== this.stop) {
                var f = Math.round(70 * Math.random()) + this.typeSpeed, c = this;
                c.timeout = setTimeout(function() {
                    var i = 0,
                        h = d.substr(e);
                    if ("^" === h.charAt(0)) {
                        var g = 1;
                        /^\^\d+/.test(h) && (g += (h = /\d+/.exec(h)[0]).length, i = parseInt(h)),
                        d = d.substring(0, e) + d.substring(e + g)
                    }
                    c.timeout = setTimeout(function() {
                        if (e === d.length) {
                            if (c.options.onStringTyped(c.arrayPos), c.arrayPos === c.strings.length - 1 && (c.options.callback(), c.curLoop++, !1 === c.loop || c.curLoop === c.loopCount)) {
                                return
                            }
                            c.timeout = setTimeout(function() {
                                c.backspace(d, e)
                            }, c.backDelay)
                        } else {
                            0 === e && c.options.preStringTyped(c.arrayPos);
                            var j = c.baseText + d.substr(0, e + 1);
                            c.attr ? c.el.attr(c.attr, j) : c.el.text(j),
                            e++,
                            c.typewrite(d, e)
                        }
                    }, i)
                }, f)
            }
        },
        backspace: function(d, e) {
            if (!0 !== this.stop) {
                var f = Math.round(70 * Math.random()) + this.backSpeed, c = this;
                c.timeout = setTimeout(function() {
                    var g = c.baseText + d.substr(0, e);
                    c.attr ? c.el.attr(c.attr, g) : c.el.text(g),
                    e > c.stopNum ? (e--, c.backspace(d, e)) : e <= c.stopNum && (c.arrayPos++, c.arrayPos === c.strings.length ? (c.arrayPos = 0, c.init()) : c.typewrite(c.strings[c.arrayPos], e))
                }, f)
            }
        },
        reset: function() {
            clearInterval(this.timeout);
            var c = this.el.attr("id");
            this.el.after('<span id="' + c + '"/>'),
            this.el.remove(),
            this.cursor.remove(),
            this.options.resetCallback()
        }
    },
    a.fn.typed = function(c) {
        return this.each(function() {
            var g = a(this),
                f = g.data("typed"),
                d = "object" == typeof c && c;
            f || g.data("typed", f = new b(this, d)),
            "string" == typeof c && f[c]()
        })
    },
    a.fn.typed.defaults = {
        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        typeSpeed: 0,
        startDelay: 0,
        backSpeed: 0,
        backDelay: 1500,
        loop: !0,
        loopCount: !1,
        showCursor: !0,
        cursorChar: "|",
        attr: null,
        callback: function() {},
        preStringTyped: function() {},
        onStringTyped: function() {},
        resetCallback: function() {}
    }
}(window.jQuery);
$(function() {
    var a = $(".intro-snippet");
    a.typed({
        strings: a.attr("data-text").split(","),
        typeSpeed: 50
    });
});

$(".skill-percent").each(function() {
    $(this).animate({
        width: $(this).data("percent") + "%"
    }, 1000)
});
