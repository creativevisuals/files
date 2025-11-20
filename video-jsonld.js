async function generateVideoJsonLd() { 
  // Esta API Key parece ser de uso público. Para um uso mais seguro, considere ocultá-la no backend se possível.
  const apiKey = "AIzaSyBGvD7UpetQ2FymMgu3gtFTs5K-bWFF3qQ"; 
  const videoElements = document.querySelectorAll(".yt-lazyload"); 
  
  videoElements.forEach(async (element) => { 
    const videoId = element.dataset.id; 
    
    // Tentativa de obter dados do YouTube
    try { 
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`); 
      const data = await response.json(); 
      
      if (data.items.length > 0) { 
        const videoData = data.items[0]; 
        const snippet = videoData.snippet; 
        const contentDetails = videoData.contentDetails; 
        
        const title = snippet.title; 
        const description = snippet.description; 
        const uploadDate = snippet.publishedAt; 
        const thumbnailUrl = snippet.thumbnails.maxres ? snippet.thumbnails.maxres.url : snippet.thumbnails.high.url; 
        const duration = contentDetails.duration; 
        
        // Estrutura JSON-LD otimizada para VideoObject
        const jsonLd = { 
          "@context": "https://schema.org", 
          "@type": "VideoObject", 
          "name": title, 
          "description": description, 
          "thumbnailUrl": thumbnailUrl, 
          "uploadDate": uploadDate, 
          "embedUrl": `https://www.youtube-nocookie.com/embed/${videoId}`, 
          "contentUrl": `https://www.youtube.com/watch?v=${videoId}`, 
          "duration": duration, 
          "publisher": { 
            "@type": "Organization", 
            "name": "Creative Visuals by Diogo Pessoa de Andrade", // Nome da marca unificado
            "url": "https://www.diogo-andrade.com/", // Adiciona URL para resolver o aviso de autor/publisher
            "address": { // Adiciona morada mínima para SEO local/validação
                "@type": "PostalAddress",
                "addressLocality": "Lisbon",
                "addressCountry": "PT"
            },
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
    } catch (error) { 
      console.error(`Erro ao obter dados do vídeo ${videoId}:`, error); 
    } 
  }); 
} 
generateVideoJsonLd();
