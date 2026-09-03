/*
 * Creative Visuals — YouTube lazy-load player
 *
 * Keeps the existing thumbnail-first lazy-load behaviour and creates a larger
 * internal iframe viewport so that YouTube is more likely to select 1080p on
 * desktop and 720p on mobile. YouTube still retains adaptive control and may
 * lower playback quality when connection or device conditions require it.
 */
(function () {
  "use strict";

  var players = document.querySelectorAll(".yt-lazyload");

  if (!players.length) {
    return;
  }

  var wrapTemplate = document.createElement("div");
  var contentTemplate = document.createElement("div");
  var playTemplate = document.createElement("div");
  var logoTemplate = document.createElement("a");
  var iframeTemplate = document.createElement("iframe");

  wrapTemplate.classList.add("yt-lazyload-wrap");
  contentTemplate.classList.add("yt-lazyload-content");
  playTemplate.classList.add("yt-lazyload-playbtn");
  logoTemplate.classList.add("yt-lazyload-logo");

  logoTemplate.target = "_blank";
  logoTemplate.rel = "noreferrer";

  iframeTemplate.setAttribute(
    "allow",
    "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture"
  );

  iframeTemplate.setAttribute("allowfullscreen", "");

  function applyQualityViewportBoost(
    iframe,
    content,
    container
  ) {
    /*
     * Test results on the live site:
     *
     * 1150x647                    -> YouTube selected 1280x720
     * 1609x905 (factor 1.40)      -> YouTube still selected 1280x720
     * 1666x937 (factor 1.45)      -> YouTube selected 1920x1080
     * 1725x970 (factor 1.50)      -> YouTube selected 1920x1080
     * 1670x881 (panoramic video)  -> YouTube still selected 1280x676
     * 322x181 at DPR 2.63         -> YouTube selected 640x360 without boost
     */

    var animationFrame = null;

    function updateViewport() {
      animationFrame = null;

      if (!iframe.isConnected) {
        return;
      }

      var visualWidth =
        content.clientWidth || container.clientWidth;

      var visualHeight =
        content.clientHeight || container.clientHeight;

      if (!visualWidth || !visualHeight) {
        return;
      }

      var pixelRatio =
        window.devicePixelRatio || 1;

      var effectiveWidth =
        visualWidth * pixelRatio;

      var effectiveHeight =
        visualHeight * pixelRatio;

      /*
       * Players com menos de 1000px usam o perfil mobile.
       */
      var isMobilePlayer =
        visualWidth < 1000;

      /*
       * Mobile: tenta obter 720p.
       * Desktop: tenta obter 1080p.
       */
      var targetEffectiveWidth =
        isMobilePlayer ? 1280 : 1670;

      var targetEffectiveHeight =
        isMobilePlayer ? 720 : 940;

      var maximumBoost =
        isMobilePlayer ? 1.6 : 1.56;

      /*
       * Utiliza o maior fator necessário para atingir
       * simultaneamente a largura e a altura pretendidas.
       */
      var factor = Math.max(
        targetEffectiveWidth / effectiveWidth,
        targetEffectiveHeight / effectiveHeight
      );

      var shouldBoost =
        factor > 1 &&
        factor <= maximumBoost;

      /*
       * Se o ecrã já tiver resolução suficiente ou se o
       * aumento necessário for excessivo, remove o boost.
       */
      if (!shouldBoost) {
        iframe.style.removeProperty("max-width");
        iframe.style.removeProperty("max-height");
        iframe.style.removeProperty("width");
        iframe.style.removeProperty("height");
        iframe.style.removeProperty("transform");
        iframe.style.removeProperty("transform-origin");
        container.style.removeProperty("overflow");

        return;
      }

      container.style.setProperty(
        "overflow",
        "hidden",
        "important"
      );

      iframe.style.setProperty(
        "max-width",
        "none",
        "important"
      );

      iframe.style.setProperty(
        "max-height",
        "none",
        "important"
      );

      iframe.style.setProperty(
        "width",
        Math.round(visualWidth * factor) + "px",
        "important"
      );

      iframe.style.setProperty(
        "height",
        Math.round(visualHeight * factor) + "px",
        "important"
      );

      iframe.style.setProperty(
        "transform",
        "scale(" + 1 / factor + ")",
        "important"
      );

      iframe.style.setProperty(
        "transform-origin",
        "0 0",
        "important"
      );
    }

    function scheduleUpdate() {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame =
        requestAnimationFrame(updateViewport);
    }

    /*
     * Aplica o boost antes de iniciar o carregamento
     * do iframe do YouTube.
     */
    updateViewport();

    if ("ResizeObserver" in window) {
      var resizeObserver =
        new ResizeObserver(scheduleUpdate);

      resizeObserver.observe(content);
    }

    window.addEventListener(
      "resize",
      scheduleUpdate,
      {
        passive: true
      }
    );

    document.addEventListener(
      "fullscreenchange",
      scheduleUpdate
    );

    document.addEventListener(
      "webkitfullscreenchange",
      scheduleUpdate
    );
  }

  function initialisePlayer(container) {
    var videoId =
      container.dataset.id;

    if (!videoId) {
      return;
    }

    var customThumbnail =
      container.dataset.thumb;

    var showLogo =
      container.dataset.logo;

    var playlistId =
      container.dataset.playlist;

    var wrap =
      wrapTemplate.cloneNode(false);

    var content =
      contentTemplate.cloneNode(false);

    var playButton =
      playTemplate.cloneNode(false);

    container.appendChild(wrap);
    wrap.appendChild(content);

    var thumbnailUrl =
      customThumbnail &&
      customThumbnail.startsWith("http")
        ? customThumbnail
        : "https://i.ytimg.com/vi/" +
          videoId +
          (customThumbnail || "") +
          "/maxresdefault.jpg";

    content.style.setProperty(
      "--yt-lazyload-img",
      'url("' + thumbnailUrl + '")'
    );

    content.appendChild(playButton);

    if (showLogo !== "0") {
      var logo =
        logoTemplate.cloneNode(false);

      logo.href =
        "https://youtu.be/" +
        encodeURIComponent(videoId);

      content.appendChild(logo);
    }

    playButton.addEventListener(
      "click",
      function () {
        var iframe =
          iframeTemplate.cloneNode(false);

        var query =
          "autoplay=1&rel=0";

        if (playlistId) {
          query =
            "list=" +
            encodeURIComponent(playlistId) +
            "&autoplay=1&rel=0";
        }

        iframe.title =
          container.getAttribute("aria-label") ||
          "YouTube video player";

        content.appendChild(iframe);

        /*
         * Primeiro aumenta o viewport interno.
         */
        applyQualityViewportBoost(
          iframe,
          content,
          container
        );

        /*
         * Só depois inicia o carregamento do YouTube.
         */
        iframe.src =
          "https://www.youtube.com/embed/" +
          encodeURIComponent(videoId) +
          "?" +
          query;
      },
      {
        once: true
      }
    );
  }

  if ("IntersectionObserver" in window) {
    var observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            initialisePlayer(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: "200px 0px"
        }
      );

    players.forEach(function (player) {
      observer.observe(player);
    });
  } else {
    players.forEach(initialisePlayer);
  }
})();
