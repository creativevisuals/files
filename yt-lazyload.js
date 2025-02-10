!function(){
    var t, e, a, l, o, r, d = document.querySelectorAll(".yt-lazyload");
    if (d.length > 0) {
        e = document.createElement("div"),
        a = document.createElement("div"),
        l = document.createElement("div"),
        o = document.createElement("a"),
        r = document.createElement("iframe"),
        e.classList.add("yt-lazyload-wrap"),
        a.classList.add("yt-lazyload-content"),
        l.classList.add("yt-lazyload-playbtn"), // Adiciona botão Play
        o.classList.add("yt-lazyload-logo"),
        o.target = "_blank",
        o.rel = "noreferrer",
        r.setAttribute("allow", "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture"),
        r.setAttribute("allowfullscreen", ""),
        
        t = new IntersectionObserver(function(d) {
            d.forEach(function(d) {
                var n, s, c, i, p, u = d.target,
                    y = d.target.dataset.id,
                    m = d.target.dataset.thumb,
                    g = d.target.dataset.logo;
                
                d.target.dataset.playlist && (this_data_playlist = "?list=" + d.target.dataset.playlist),
                
                !0 === d.isIntersecting && (
                    n = e.cloneNode(),
                    u.append(n),
                    s = a.cloneNode(),
                    n.append(s),
                    s.style.setProperty("--yt-lazyload-img", 'url("https://i.ytimg.com/vi/' + y + m + '/maxresdefault.jpg")'),
                    
                    // Adiciona o botão de Play ao centro
                    c = l.cloneNode(),
                    c.innerHTML = '<svg width="80" height="55" viewBox="0 0 100 100" fill="red" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(0,0,0,0.7)"/><polygon points="40,30 75,50 40,70" fill="white"/></svg>',
                    c.style.position = "absolute",
                    c.style.top = "50%",
                    c.style.left = "50%",
                    c.style.transform = "translate(-50%, -50%)",
                    c.style.cursor = "pointer",
                    c.style.opacity = "0.9",
                    c.style.transition = "opacity 0.3s ease",
                    
                    s.append(c),
                    
                    // Adiciona logo do YouTube se ativado
                    "0" !== g && ((i = o.cloneNode()).href = "https://youtu.be/" + y + "?", s.append(i)),
                    
                    // Evento de clique para iniciar vídeo
                    c.addEventListener("click", function() {
                        (p = r.cloneNode()).src = "https://www.youtube.com/embed/" + y,
                        d.target.dataset.playlist ? p.src = "https://www.youtube.com/embed/" + y + this_data_playlist + "&autoplay=1&rel=0" : p.src = "https://www.youtube.com/embed/" + y + "?&autoplay=1&rel=0",
                        s.append(p)
                    }),

                    t.unobserve(u)
                )
            })
        }, { rootMargin: "200px 0px" }),
        
        d.forEach(function(e) { t.observe(e) });
    }
}();
