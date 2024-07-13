document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const refreshButton = document.getElementById('refresh-button');
    const backButton = document.getElementById('back-button');
    let currentQuery = '';
    let currentVideoIndex = -1;
    let videoList = [];

    // Fetch and display trending videos on page load
    fetchTrendingVideos(true);

    searchButton.addEventListener('click', function() {
        const query = document.getElementById('search-input').value;
        if (query.trim()) {
            currentQuery = query.trim();
            searchYouTube(currentQuery);
        }
    });

    refreshButton.addEventListener('click', function() {
        console.log('Refresh button clicked');
        if (currentQuery.trim()) {
            console.log('Refreshing search results for query:', currentQuery);
            searchYouTube(currentQuery);
        } else {
            console.log('Refreshing trending videos');
            fetchTrendingVideos(true);
        }
    });

    backButton.addEventListener('click', function() {
        console.log('Back button clicked');
        document.getElementById('results').innerHTML = '';
        document.getElementById('search-input').value = '';
        currentQuery = '';
        fetchTrendingVideos(true);
    });

    function searchYouTube(query) {
        const apiKey = 'YOUR_YOUTUBE_ACCESS_API_KEY'; // Replace with your YouTube Data API key
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}&_=${new Date().getTime()}`;

        console.log('Searching YouTube for query:', query);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                videoList = data.items;
                displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching YouTube data:', error);
                const results = document.getElementById('results');
                results.innerHTML = '<p>Failed to fetch videos. Please try again later.</p>';
            });
    }

    function fetchTrendingVideos(forceUpdate = false) {
        const apiKey = 'YOUR_YOUTUBE_ACCESS_API_KEY'; // Replace with your YouTube Data API key
        let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&key=${apiKey}`;

        if (forceUpdate) {
            url += `&_=${new Date().getTime()}`;
        }

        console.log('Fetching trending videos');

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                videoList = data.items;
                displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching trending videos:', error);
                const results = document.getElementById('results');
                results.innerHTML = '<p>Failed to fetch videos. Please try again later.</p>';
            });
    }

    function displayResults(data) {
        const results = document.getElementById('results');
        results.innerHTML = '';

        if (data.items.length === 0) {
            results.innerHTML = '<p>No videos found.</p>';
        } else {
            data.items.forEach((item, index) => {
                const videoId = item.id.videoId || item.id;
                const title = item.snippet.title;
                const thumbnail = item.snippet.thumbnails.default.url;

                const videoElement = document.createElement('div');
                videoElement.classList.add('video-element');
                videoElement.innerHTML = `
                    <img src="${thumbnail}" alt="${title}" data-video-id="${videoId}" data-index="${index}">
                    <p>${title}</p>
                `;
                results.appendChild(videoElement);
            });

            document.querySelectorAll('.video-element img').forEach(img => {
                img.addEventListener('click', function() {
                    currentVideoIndex = parseInt(this.dataset.index);
                    playVideo(this.dataset.videoId);
                });
            });
        }
    }

    function playVideo(videoId) {
        const results = document.getElementById('results');
        results.innerHTML = `
            <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            <div class="controls">
                <button id="prev-button">Previous</button>
                <button id="next-button">Next</button>
            </div>
        `;

        document.getElementById('prev-button').addEventListener('click', function() {
            if (currentVideoIndex > 0) {
                currentVideoIndex--;
                playVideo(videoList[currentVideoIndex].id.videoId || videoList[currentVideoIndex].id);
            }
        });

        document.getElementById('next-button').addEventListener('click', function() {
            if (currentVideoIndex < videoList.length - 1) {
                currentVideoIndex++;
                playVideo(videoList[currentVideoIndex].id.videoId || videoList[currentVideoIndex].id);
            }
        });
    }
});
