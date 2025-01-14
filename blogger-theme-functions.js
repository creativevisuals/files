//Blogger Theme Functions
$(document)["ready"](function() {
"use strict";
    var a = $(window);
$(".full-height")["height"](a["height"]());
        a["on"]("resize", function() {
            $(".full-height")["height"](a["height"]());
        });
 });

$(function() {
$(".header-inner-footer .scroll-down").on("click", function(e) {
		e.preventDefault();
		var target = $($(this).attr("href")).offset().top;
		$("html, body").animate({
			scrollTop: target,
		}, 1000);
	});
    $('#main-menu').each(function() {
        var iTms = $(this).find('.LinkList ul > li').children('a'),
            iLen = iTms.length;
        for (var i = 0; i < iLen; i++) {
            var i1 = iTms.eq(i),
                t1 = i1.text();
            if (t1.charAt(0) !== '_') {
                var i2 = iTms.eq(i + 1),
                    t2 = i2.text();
                if (t2.charAt(0) === '_') {
                    var l1 = i1.parent();
                    l1.append('<ul class="sub-menu m-sub"/>');
                }
            }
            if (t1.charAt(0) === '_') {
                i1.text(t1.replace('_', ''));
                i1.parent().appendTo(l1.children('.sub-menu'));
            }
        }
        for (var i = 0; i < iLen; i++) {
            var i3 = iTms.eq(i),
                t3 = i3.text();
            if (t3.charAt(0) !== '_') {
                var i4 = iTms.eq(i + 1),
                    t4 = i4.text();
                if (t4.charAt(0) === '_') {
                    var l2 = i3.parent();
                    l2.append('<ul class="sub-menu2 m-sub"/>');
                }
            }
            if (t3.charAt(0) === '_') {
                i3.text(t3.replace('_', ''));
                i3.parent().appendTo(l2.children('.sub-menu2'));
            }
        }
        $('#main-menu ul li ul').parent('li').addClass('has-sub');
        $('#main-menu .widget').addClass('show-menu');
    });
    $('#main-menu-nav').clone().appendTo('.mobile-menu');
    $('.mobile-menu .has-sub').append('<div class="submenu-toggle"/>');
    $('.mobile-menu-toggle,.overlay').on('click', function() {
        $('body').toggleClass('nav-active');
        $('.overlay').fadeToggle(170);
    });
    $('.mobile-menu ul li .submenu-toggle').on('click', function($this) {
        if ($(this).parent().hasClass('has-sub')) {
            $this.preventDefault();
            if (!$(this).parent().hasClass('show')) {
                $(this).parent().addClass('show').children('.m-sub').slideToggle(170);
            } else {
                $(this).parent().removeClass('show').find('> .m-sub').slideToggle(170);
            }
        }
    });
    $('.Label a').attr('href', function($this, href) {
        return href.replace(href, href + '?&max-results=' + postPerPage);
    });
    $('.avatar-image-container img').attr('src', function($this, i) {
        i = i.replace('/s35-c/', '/s45-c/');
        i = i.replace('//img1.blogblog.com/img/blank.gif', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQXg81eKT9Jy-AWjXlfD7ds9r9zQW2u2MZAOSIq2ycN_DgO3NOUfXsDEkdezTNwGzLzbyjhtrC-FiZIwUYp4lj6R148LkUiSKMF1Ev5Tok_sVeuN698KfHp5HVDLQSMfKYCzy-0PZwjvz2/s55-r/avatar.png');
        return i;
    });
$('.author-description a').each(function() {
        $(this).attr('target', '_blank');
    });
    $('.back-top').each(function() {
        var $this = $(this);
        $(window).on('scroll', function() {
            $(this).scrollTop() >= 100 ? $this.fadeIn(250) : $this.fadeOut(250)
        }), $this.click(function() {
            $('html, body').animate({
                scrollTop: 0
            }, 500)
        });
    });
 $('.post-body strike').each(function() {
        var $this = $(this),
            type = $this.text();
        if (type.match('left-sidebar')) {
            $this.replaceWith('<style>.item #main-wrapper{float:right}.item #sidebar-wrapper{float:left}</style>');
        }
        if (type.match('right-sidebar')) {
            $this.replaceWith('<style>.item #main-wrapper{float:left}.item #sidebar-wrapper{float:right}</style>');
        }
        if (type.match('full-width')) {
            $this.replaceWith('<style>.item #main-wrapper{width:100%}.item #sidebar-wrapper{display:none}</style>');
        }
    });
    $('.common-widget .widget-content').each(function() {
        var $this = $(this),
            text = $this.text().trim(),
            type = text.toLowerCase(),
            map = text.split('/'),
            num = map[0],
            label = map[1];
        ajaxPosts($this, type, num, label);
    });
    $('.related-ready').each(function() {
        var $this = $(this),
            label = $this.find('.related-tag').data('label');
        ajaxPosts($this, 'related', 3, label);
    });

    function post_link(feed, i) {
        for (var x = 0; x < feed[i].link.length; x++)
            if (feed[i].link[x].rel == 'alternate') {
                var link = feed[i].link[x].href;
                break
            }
        return link;
    }

    function post_title(feed, i, link) {
        var n = feed[i].title.$t,
            code = '<a href="' + link + '">' + n + '</a>';
        return code;
    }

    function post_date(feed, i) {
        var c = feed[i].published.$t,
            d = c.substring(0, 4),
            f = c.substring(5, 7),
            m = c.substring(8, 10),
            h = monthFormat[parseInt(f, 10) - 1] + ' ' + m + ', ' + d,
            code = '<span class="post-date">' + h + '</span>';
        return code;
    }

    function post_image(feed, i) {
        var n = feed[i].title.$t,
            p = feed[i].content.$t,
            u = $('<div>').html(p);
        if ('media$thumbnail' in feed[i]) {
            var src = feed[i].media$thumbnail.url,
                s1 = src.replace('/s72-c', '/w680');
           if (src.match('img.youtube.com')) {
                s1 = src.replace('/default.', '/hqdefault.');
            }
        } else if (p.indexOf('<img') > -1) {
            s1 = u.find('img:first').attr('src');
        } else {
            s1 = noThumbnail;
        }
        var code = '<img class="post-thumb" alt="' + n + '" src="' + s1 + '"/>';
        return code;
    }

    function ajaxPosts($this, type, num, label) {
        if (type.match('post-list') || type.match('related')) {
            var url = '';
            if (label == 'recent') {
                url = '/feeds/posts/default?alt=json-in-script&max-results=' + num;
            } else if (label == 'random') {
                var index = Math.floor(Math.random() * num) + 1;
                url = '/feeds/posts/default?max-results=' + num + '&start-index=' + index + '&alt=json-in-script';
            } else {
                url = '/feeds/posts/default/-/' + label + '?alt=json-in-script&max-results=' + num;
            }
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'jsonp',
                success: function(json) {
                    if (type.match('post-list')) {
                        var kode = '<ul class="custom-widget">';
                    } else if (type.match('related')) {
                        var kode = '<ul class="related-posts">';
                    }
                    var entry = json.feed.entry;
                    if (entry != undefined) {
                        for (var i = 0, feed = entry; i < feed.length; i++) {
                            var link = post_link(feed, i),
                                title = post_title(feed, i, link),
                                image = post_image(feed, i),
                                date = post_date(feed, i);
                            var kontent = '';
                            if (type.match('post-list')) {
                                kontent += '<li class="item-' + i + '"><a class="post-image-link" href="' + link + '">' + image + '</a><div class="post-info"><h2 class="post-title">' + title + '</h2><div class="post-meta">' + date + '</div></div></div></li>';
                            } else if (type.match('related')) {
                                kontent += '<li class="related-item item-' + i + '"><div class="post-image-wrap"><a class="post-image-link" href="' + link + '">' + image + '</a></div><h2 class="post-title">' + title + '</h2><div class="post-meta">' + date + '</div></li>';
                            }
                            kode += kontent;
                        }
                        kode += '</ul>';
                    } else {
                        kode = '<ul class="no-posts">Error: No Posts Found <i class="fa fa-frown"/></ul>';
                    }
                    $this.html(kode);
                }
            });
        }
    }
    $('.blog-post-comments').each(function() {
        var system = commentsSystem,
            disqus_url = disqus_blogger_current_url,
            disqus = '<div id="disqus_thread"/>',
            current_url = $(location).attr('href'),
            facebook = '<div class="fb-comments" data-width="100%" data-href="' + current_url + '" data-numposts="5"></div>',
            sClass = 'comments-system-' + system;
        if (system == 'blogger') {
            $(this).addClass(sClass).show();
        } else if (system == 'disqus') {
            (function() {
                var dsq = document.createElement('script');
                dsq.type = 'text/javascript';
                dsq.async = true;
                dsq.src = '//' + disqusShortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            })();
            $('#comments, #gpluscomments').remove();
            $(this).append(disqus).addClass(sClass).show();
        } else if (system == 'facebook') {
            $('#comments, #gpluscomments').remove();
            $(this).append(facebook).addClass(sClass).show();
        } else if (system == 'hide') {
            $(this).hide();
        } else {
            $(this).addClass('comments-system-blogger').show();
        }
    });
});
