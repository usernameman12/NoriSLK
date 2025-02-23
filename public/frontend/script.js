document.addEventListener('DOMContentLoaded', () => {
  const videoFeed = document.getElementById('videoFeed')
  const searchInput = document.getElementById('searchInput')
  const searchBtn = document.getElementById('searchBtn')

  // Function to fetch and render videos via proxy
  async function loadVideos(query = '') {
    try {
      const url = query 
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        : 'https://www.youtube.com'
      const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`
      const res = await fetch(proxyUrl)
      const html = await res.text()

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      videoFeed.innerHTML = ''

      // Grab up to 50 video elements (you may need to adjust selectors based on YouTube's structure)
      const videoElements = doc.querySelectorAll('ytd-rich-item-renderer')
      let count = 0
      videoElements.forEach(video => {
        if (count >= 50) return

        const thumbnailEl = video.querySelector('img')
        const titleEl = video.querySelector('#video-title')
        const channelEl = video.querySelector('ytd-channel-name a')
        const metaEl = video.querySelector('ytd-video-meta-block span')

        if (thumbnailEl && titleEl && channelEl && metaEl) {
          const thumbnail = thumbnailEl.src || thumbnailEl.getAttribute('data-thumb')
          const title = titleEl.textContent.trim()
          const videoUrl = titleEl.href
          const channel = channelEl.textContent.trim()
          const meta = metaEl.textContent.trim()

          const card = document.createElement('div')
          card.className = 'video-card'
          card.innerHTML = `
            <a href="/proxy?url=${encodeURIComponent(videoUrl)}">
              <img src="${thumbnail}" alt="${title}">
            </a>
            <div class="video-info">
              <div class="video-title">${title}</div>
              <div class="video-meta">${channel} • ${meta}</div>
            </div>
          `
          videoFeed.appendChild(card)
          count++
        }
      })

      // Cascading fade-in effect
      const cards = document.querySelectorAll('.video-card')
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('visible')
        }, idx * 50)
      })
    } catch (error) {
      console.error('Failed to load videos:', error)
    }
  }

  // Initial video load
  loadVideos()

  // Search functionality
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim()
    loadVideos(query)
  })
})

// Animated cat follower that follows the mouse cursor
document.addEventListener('mousemove', (e) => {
  const cat = document.getElementById('catFollower')
  const x = e.clientX + 10
  const y = e.clientY + 10
  cat.style.transform = `translate(${x}px, ${y}px)`
})
