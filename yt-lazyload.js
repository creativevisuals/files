(function () {
    var g = document.querySelectorAll(".yt-lazyload"),
        e,
        h,
        j,
        f,
        b,
        a,
        i = "200px 0px",
        d = "https://i.ytimg.com/vi/",
        c = "jpg";

    if (g.length > 0) {
        h = document.createElement("div");
        j = document.createElement("div");
        f = document.createElement("div");
        b = document.createElement("a");
        a = document.createElement("iframe");

        h.classList.add("yt-lazyload-wrap");
        j.classList.add("yt-lazyload-content");
        f.classList.add("yt-lazyload-playbtn");
        b.classList.add("yt-lazyload-logo");
        b.target = "_blank";
        b.rel = "noreferrer";

        a.setAttribute("allow", "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture");
        a.setAttribute("allowfullscreen", "");

        e = new IntersectionObserver(
            function (k) {
                k.forEach(function (u) {
                    var s = u.target,
                        t,
                        o,
                        r,
                        m,
                        q,
                        l = u.target.dataset.id,
                        n = u.target.dataset.thumb,
                        p = u.target.dataset.logo;

                    if (u.target.dataset.playlist) {
                        this_data_playlist = "?list=" + u.target.dataset.playlist;
                    }

                    if (u.isIntersecting === true) {
                        t = h.cloneNode();
                        s.append(t);
                        o = j.cloneNode();
                        t.append(o);
                        o.style.setProperty(
                            "--yt-lazyload-img",
                            'url("' + d + l + n + "/maxresdefault." + c + '")'
                        );

                        r = f.cloneNode();
                        o.append(r);

                        if (p !== "0") {
                            m = b.cloneNode();
                            m.href = "https://youtu.be/" + l + "?";
                            o.append(m);
                        }

                        r.addEventListener("click", function () {
                            q = a.cloneNode();
                            q.src = "https://www.youtube.com/embed/" + l;

                            if (u.target.dataset.playlist) {
                                q.src =
                                    "https://www.youtube.com/embed/" +
                                    l +
                                    this_data_playlist +
                                    "&autoplay=1&rel=0";
                            } else {
                                q.src = "https://www.youtube.com/embed/" + l + "?&autoplay=1&rel=0";
                            }
                            o.append(q);
                        });
                        e.unobserve(s);
                    }
                });
            },
            { rootMargin: i }
        );

        g.forEach(function (k) {
            e.observe(k);
        });
    }
})();
