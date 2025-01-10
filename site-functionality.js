// Ajusta a altura dos elementos com a classe .full-height
$(document).ready(function () {
    var b = $(window);
    $(".full-height").height(b.height());
    b.on("resize", function () {
        $(".full-height").height(b.height());
    });
});

// Scroll suave ao clicar em links com a classe .scroll-down
$(function () {
    $(".header-inner-footer .scroll-down").on("click", function (e) {
        e.preventDefault();
        var target = $($(this).attr("href")).offset().top;
        $("html, body").animate({ scrollTop: target }, 1000);
    });
});

// Gera submenus automaticamente para o menu principal
$("#main-menu").each(function () {
    var links = $(this).find(".LinkList ul > li").children("a"),
        totalLinks = links.length;
    var parentMenu;

    for (var i = 0; i < totalLinks; i++) {
        var current = links.eq(i), text = current.text();

        if (text.charAt(0) !== "_") {
            var next = links.eq(i + 1), nextText = next.text();
            if (nextText.charAt(0) === "_") {
                parentMenu = current.parent();
                parentMenu.append('<ul class="sub-menu m-sub"></ul>');
            }
        } else {
            current.text(text.replace("_", ""));
            current.parent().appendTo(parentMenu.children(".sub-menu"));
        }
    }

    $("#main-menu ul li ul").parent("li").addClass("has-sub");
    $("#main-menu .widget").addClass("show-menu");
});

// Funcionalidade de menu móvel
$(".mobile-menu-toggle,.overlay").on("click", function () {
    $("body").toggleClass("nav-active");
    $(".overlay").fadeToggle(170);
});

$(".mobile-menu ul li .submenu-toggle").on("click", function (e) {
    if ($(this).parent().hasClass("has-sub")) {
        e.preventDefault();
        if (!$(this).parent().hasClass("show")) {
            $(this).parent().addClass("show").children(".m-sub").slideToggle(170);
        } else {
            $(this).parent().removeClass("show").find("> .m-sub").slideToggle(170);
        }
    }
});

// Botão "Voltar ao Topo"
$(".back-top").each(function () {
    var backToTop = $(this);
    $(window).on("scroll", function () {
        $(this).scrollTop() >= 100 ? backToTop.fadeIn(250) : backToTop.fadeOut(250);
    });
    backToTop.click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });
});

// Layout dinâmico com base em palavras-chave
$(".post-body strike").each(function () {
    var strike = $(this), text = strike.text();
    if (text.match("left-sidebar")) {
        strike.replaceWith("<style>.item #main-wrapper{float:right}.item #sidebar-wrapper{float:left}</style>");
    } else if (text.match("right-sidebar")) {
        strike.replaceWith("<style>.item #main-wrapper{float:left}.item #sidebar-wrapper{float:right}</style>");
    } else if (text.match("full-width")) {
        strike.replaceWith("<style>.item #main-wrapper{width:100%}.item #sidebar-wrapper{display:none}</style>");
    }
});

// Gera postagens relacionadas ou listas de postagens
function generatePosts(element, type, maxResults, label) {
    var url;
    if (label === "recent") {
        url = `/feeds/posts/default?alt=json-in-script&max-results=${maxResults}`;
    } else if (label === "random") {
        var randomIndex = Math.floor(Math.random() * maxResults) + 1;
        url = `/feeds/posts/default?max-results=${maxResults}&start-index=${randomIndex}&alt=json-in-script`;
    } else {
        url = `/feeds/posts/default/-/${label}?alt=json-in-script&max-results=${maxResults}`;
    }

    $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        success: function (data) {
            var entries = data.feed.entry || [];
            var html = entries.length > 0 ? '<ul class="custom-widget">' : '<ul class="no-posts">Error: No Posts Found</ul>';
            entries.forEach(function (entry, index) {
                var postUrl = entry.link.find(link => link.rel === "alternate").href;
                var title = entry.title.$t;
                var image = entry.media$thumbnail ? entry.media$thumbnail.url.replace("/s72-c", "/w680") : "default-thumbnail.jpg";
                html += `
                    <li class="item-${index}">
                        <a class="post-image-link" href="${postUrl}">
                            <img class="post-thumb" alt="${title}" src="${image}" />
                        </a>
                        <h2 class="post-title"><a href="${postUrl}">${title}</a></h2>
                    </li>
                `;
            });
            html += "</ul>";
            $(element).html(html);
        }
    });
}

$(".related-ready").each(function () {
    var related = $(this), label = related.find(".related-tag").data("label");
    generatePosts(related, "related", 3, label);
});
