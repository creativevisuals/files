(function($) {
    var Typed = function(el, options) {
        this.el = $(el);
        this.options = $.extend({}, $.fn.typed.defaults, options);
        this.baseText = this.el.text() || this.el.attr("placeholder") || "";
        this.typeSpeed = this.options.typeSpeed;
        this.startDelay = this.options.startDelay;
        this.backSpeed = this.options.backSpeed;
        this.backDelay = this.options.backDelay;
        this.strings = this.options.strings;
        this.strPos = 0;
        this.arrayPos = 0;
        this.stopNum = 0;
        this.loop = this.options.loop;
        this.loopCount = this.options.loopCount;
        this.curLoop = 0;
        this.stop = false;
        this.showCursor = !this.isInput && this.options.showCursor;
        this.cursorChar = this.options.cursorChar;
        this.isInput = this.el.is("input");
        this.attr = this.options.attr || (this.isInput ? "placeholder" : null);
        this.build();
    };

    Typed.prototype = {
        // Typed.js implementation details
        // Similar to the one provided earlier
    };

    $.fn.typed = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data("typed"),
                options = typeof option === "object" && option;

            if (!data) $this.data("typed", (data = new Typed(this, options)));

            if (typeof option === "string") data[option]();
        });
    };

    $.fn.typed.defaults = {
        strings: ["These are the default values...", "Use your own strings!", "Have a great day!"],
        typeSpeed: 0,
        startDelay: 0,
        backSpeed: 0,
        backDelay: 1500,
        loop: true,
        loopCount: false,
        showCursor: true,
        cursorChar: "|",
        attr: null,
        callback: function() {},
        preStringTyped: function() {},
        onStringTyped: function() {},
        resetCallback: function() {},
    };
})(window.jQuery);

$(function() {
    var $element = $(".intro-snippet");
    $element.typed({
        strings: $element.attr("data-text").split(","),
        typeSpeed: 50,
    });
});
