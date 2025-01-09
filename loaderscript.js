// Loader Script
$(window).bind("load", function() {
    jQuery(".loader-ripple").fadeOut("slow");
    jQuery("#loader").delay(0).fadeOut();
});

// YouTube Lazy Loading Script
(function() {
    var elements = document.querySelectorAll(".yt-lazyload"),
        observerOptions = { rootMargin: "200px 0px" },
        thumbnailUrlBase = "https://i.ytimg.com/vi/",
        imageExtension = "jpg";

    if (elements.length > 0) {
        var wrapper = document.createElement("div");
        var content = document.createElement("div");
        var playButton = document.createElement("div");
        var logoLink = document.createElement("a");
        var iframe = document.createElement("iframe");

        wrapper.classList.add("yt-lazyload-wrap");
        content.classList.add("yt-lazyload-content");
        playButton.classList.add("yt-lazyload-playbtn");
        logoLink.classList.add("yt-lazyload-logo");
        logoLink.target = "_blank";
        logoLink.rel = "noreferrer";
        iframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var target = entry.target;
                    var videoId = target.dataset.id;
                    var thumbnail = target.dataset.thumb || "";
                    var playlist = target.dataset.playlist ? "?list=" + target.dataset.playlist : "";
                    var logo = target.dataset.logo || "0";

                    var videoWrapper = wrapper.cloneNode();
                    var videoContent = content.cloneNode();
                    var playIcon = playButton.cloneNode();

                    videoWrapper.append(videoContent);
                    target.append(videoWrapper);

                    videoContent.style.setProperty(
                        "--yt-lazyload-img",
                        `url("${thumbnailUrlBase}${videoId}${thumbnail}/maxresdefault.${imageExtension}")`
                    );

                    videoContent.append(playIcon);

                    if (logo !== "0") {
                        var logoElement = logoLink.cloneNode();
                        logoElement.href = `https://youtu.be/${videoId}?`;
                        videoContent.append(logoElement);
                    }

                    playIcon.addEventListener("click", function() {
                        var videoIframe = iframe.cloneNode();
                        videoIframe.src = `https://www.youtube.com/embed/${videoId}${playlist}&autoplay=1&rel=0`;
                        videoContent.append(videoIframe);
                    });

                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        elements.forEach(function(element) {
            observer.observe(element);
        });
    }
})();
