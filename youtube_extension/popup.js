document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-button').addEventListener('click', function() {
      const query = document.getElementById('search-input').value;
      searchYouTube(query);
    });
  });
  
  function searchYouTube(query) {
    const apiKey = 'AIzaSyBaMSUbARksKDch4UZIVLrSHzN2oLPR3ao'; // Attach_Your_Own_Youtube_Access_API_Key
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const results = document.getElementById('results');
        results.innerHTML = '';
        data.items.forEach(item => {
          const videoId = item.id.videoId;
          const title = item.snippet.title;
          const thumbnail = item.snippet.thumbnails.default.url;
          const videoElement = document.createElement('div');
          videoElement.innerHTML = `
            <div>
              <img src="${thumbnail}" alt="${title}">
              <p>${title}</p>
              <button class="play-button" data-video-id="${videoId}">Play</button>
            </div>
          `;
          results.appendChild(videoElement);
        });
  
        document.querySelectorAll('.play-button').forEach(button => {
          button.addEventListener('click', function() {
            playVideo(this.dataset.videoId);
          });
        });
      })
      .catch(error => console.error('Error:', error));
  }
  
  function playVideo(videoId) {
    const results = document.getElementById('results');
    results.innerHTML = `
      <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
  }
  