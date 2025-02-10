async function getPlaylistData() {
    const apiKey = "AIzaSyBGvD7UpetQ2FymMgu3gtFTs5K-bWFF3qQ";
    const playlistId = "PLPqrLWadXj9AaBBxu4DnYUIvVGgBu2PnX";
    let totalSeconds = 0;
    let firstVideoId = null;
    let firstVideoUploadDate = null;
    async function fetchPlaylistVideos(pageToken = "") {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=1&playlistId=${playlistId}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`);
      const data = await response.json();
      if (data.items.length > 0) {
        firstVideoId = data.items[0].contentDetails.videoId;
        firstVideoUploadDate = data.items[0].snippet.publishedAt;
      }
      return firstVideoId;
    }
    async function fetchTotalDuration() {
      let nextPageToken = "";
      do {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`);
        const data = await response.json();
        const videoIds = data.items.map(item => item.contentDetails.videoId).join(",");
        await fetchVideoDurations(videoIds);
        nextPageToken = data.nextPageToken;
      } while (nextPageToken);
    }
    async function fetchVideoDurations(videoIds) {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`);
      const data = await response.json();
      data.items.forEach(item => {
        const duration = item.contentDetails.duration;
        totalSeconds += convertISO8601ToSeconds(duration);
      });
    }

    function convertISO8601ToSeconds(duration) {
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] ? parseInt(match[3]) : 0;
      return hours * 3600 + minutes * 60 + seconds;
    }

    function formatDuration(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `PT${hours ? hours + "H" : ""}${minutes ? minutes + "M" : ""}${secs ? secs + "S" : ""}`;
    }
    await fetchPlaylistVideos();
    await fetchTotalDuration();
    return {
      firstVideoId,
      firstVideoUploadDate,
      duration: formatDuration(totalSeconds),
    };
  }
  async function generateJsonLd() {
    const {
      firstVideoId,
      firstVideoUploadDate,
      duration
    } = await getPlaylistData();
    if (!firstVideoId) {
      console.error("Erro ao obter o primeiro vídeo da playlist.");
      return;
    }
    const thumbnailUrl = `https://i.ytimg.com/vi/${firstVideoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube-nocookie.com/embed/${firstVideoId}?list=PLPqrLWadXj9AaBBxu4DnYUIvVGgBu2PnX`;
    const contentUrl = "https://www.youtube.com/playlist?list=PLPqrLWadXj9AaBBxu4DnYUIvVGgBu2PnX";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Most recent Cinematic Film & Video Productions by Diogo Pessoa de Andrade",
      "description": "Professional Film & Video Productions | Cinematic Storytelling\n\nThis playlist showcases a curated selection of my film and video productions, highlighting my work as a filmmaker, director, cinematographer (DoP), and videographer based in Lisbon, Portugal. From branded content, corporate films, and music videos to documentaries, promotional campaigns, and commercial projects, these works reflect my passion for visual storytelling, cinematic aesthetics, and high-quality production.",
      "thumbnailUrl": thumbnailUrl,
      "uploadDate": firstVideoUploadDate,
      "embedUrl": embedUrl,
      "contentUrl": contentUrl,
      "duration": duration,
      "publisher": {
        "@type": "Organization",
        "name": "Creative Visuals | Film & Video Production",
        "logo": {
          "@type": "ImageObject",
          "url": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhT_qloifn63JmZJJFSveaBSRL0vq81uHSwF8QmrqMh9ZC6qkvIydxPqQTjmKD9PnMyrA98bE8LxmRwOcumjei2BR1zsTrEA4AlRHB9PEKfeduA3YdDzoJM3_O6VV8wGeTiTpPehnykWPeNmtdu-HES1oXCS1oODlkMec6oQi2CRRuPNx2oa3lWWn6hpoI/s16000/creative-visuals-logo-with-slogan-square_500x500.jpg",
          "width": 500,
          "height": 500
        }
      }
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.body.appendChild(script);
  }
  generateJsonLd();
