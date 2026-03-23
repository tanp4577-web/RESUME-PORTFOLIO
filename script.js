/**
 * SonicStream - Premium Music Player Engine
 * Powered by Jamendo API
 */

const JAMENDO_CLIENT_ID = '56d30862'; // Public client ID for demonstration
const API_BASE = 'https://api.jamendo.com/v3.0';

// State Management
const state = {
    tracks: [],
    currentTrackIndex: -1,
    isPlaying: false,
    audio: new Audio(),
    isShuffle: false,
    isRepeat: false,
    favorites: JSON.parse(localStorage.getItem('sonic_favs')) || []
};

// UI Elements
const els = {
    trackGrid: document.getElementById('trackGrid'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    repeatBtn: document.getElementById('repeatBtn'),
    progressBar: document.getElementById('progressBar'),
    progressFill: document.getElementById('progressFill'),
    currentTime: document.getElementById('currentTime'),
    durationTime: document.getElementById('durationTime'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeFill: document.getElementById('volumeFill'),
    playerTrackName: document.getElementById('playerTrackName'),
    playerArtistName: document.getElementById('playerArtistName'),
    playerTrackImg: document.getElementById('playerTrackImg'),
    imgPlaceholder: document.querySelector('.img-placeholder'),
    trackSearch: document.getElementById('trackSearch'),
    heroTitle: document.getElementById('hero-title'),
    heroSubtitle: document.getElementById('hero-subtitle')
};

// Initialize App
async function init() {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Fetch initial trending tracks
    await fetchTracks();

    // Set initial volume
    state.audio.volume = 0.7;

    setupEventListeners();
}

/**
 * API SERVICE
 */
async function fetchTracks(query = '', category = '') {
    try {
        els.trackGrid.innerHTML = Array(8).fill('<div class="skeleton-card"></div>').join('');

        let baseUrl = `${API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=100&include=musicinfo&imagesize=400&audioformat=mp32&type=single+albumtrack`;
        let url = baseUrl;

        if (query) {
            url += `&namesearch=${encodeURIComponent(query)}&order=relevance`;
        } else if (category && category !== 'all') {
            url += `&fuzzytags=${category}&order=popularity_total`;
        } else {
            // Comprehensive Discovery: Fetch across multiple popular genres if no specific filter
            url += `&fuzzytags=rock+pop+electronic+jazz+chillout&order=popularity_total`;
        }

        console.log("Fetching tracks from:", url);
        let response = await fetch(url);
        let data = await response.json();

        // Robust Search Fallback: If namesearch fails, try a broader search
        if (query && data.results.length === 0) {
            console.log("Namesearch yield no results, trying broad search...");
            let fallbackUrl = `${baseUrl}&search=${encodeURIComponent(query)}&order=relevance`;
            response = await fetch(fallbackUrl);
            data = await response.json();
        }

        state.tracks = (data.results || []).filter(t => t.audio); // Only keep tracks with audio URLs
        renderTrackGrid(state.tracks);

        // Update hero if we have results and it's the home view
        if (state.tracks.length > 0 && !query && (!category || category === 'all')) {
            updateHero(state.tracks[0]);
        }
    } catch (error) {
        console.error('Failed to fetch tracks:', error);
        els.trackGrid.innerHTML = '<p class="error">Failed to load music. Please check your connection or try again later.</p>';
    }
}

function renderTrackGrid(tracks) {
    if (tracks.length === 0) {
        els.trackGrid.innerHTML = '<p class="error">No tracks found.</p>';
        return;
    }

    els.trackGrid.innerHTML = tracks.map((track, index) => `
        <div class="track-card animate-in" onclick="playTrack(${index})">
            <div class="card-img-container">
                <img src="${track.image}" alt="${track.name}" loading="lazy">
                <div class="play-overlay">
                    <div class="play-circle">
                        <i data-lucide="play"></i>
                    </div>
                </div>
            </div>
            <p class="track-name-grid">${track.name}</p>
            <p class="artist-name-grid">${track.artist_name}</p>
        </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
}

function updateHero(track) {
    els.heroTitle.innerText = track.name;
    els.heroSubtitle.innerText = `By ${track.artist_name}`;
    document.querySelector('.bh-hero').style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${track.image}) center/cover no-repeat`;
}

/**
 * PLAYER ENGINE
 */
function playTrack(index) {
    if (index === state.currentTrackIndex && state.isPlaying) {
        pause();
        return;
    }

    state.currentTrackIndex = index;
    const track = state.tracks[index];

    console.log("Playing track:", track.name, "URL:", track.audio);

    state.audio.src = track.audio;
    state.audio.play()
        .then(() => {
            state.isPlaying = true;
            updatePlayPauseIcon();
        })
        .catch(error => {
            console.error('Playback failed:', error);
            state.isPlaying = false;
            updatePlayPauseIcon();
            alert("Unable to play this track. Please try another one. (Browser might be blocking auto-play or audio link is broken)");
        });

    updatePlayerUI(track);
}

function togglePlay() {
    if (state.currentTrackIndex === -1 && state.tracks.length > 0) {
        playTrack(0);
        return;
    }

    if (state.isPlaying) {
        pause();
    } else {
        resume();
    }
}

function pause() {
    state.audio.pause();
    state.isPlaying = false;
    updatePlayPauseIcon();
}

function resume() {
    state.audio.play()
        .then(() => {
            state.isPlaying = true;
            updatePlayPauseIcon();
        })
        .catch(err => console.error("Resume failed:", err));
}

function nextTrack() {
    if (state.isShuffle) {
        playTrack(Math.floor(Math.random() * state.tracks.length));
    } else {
        const nextIndex = (state.currentTrackIndex + 1) % state.tracks.length;
        playTrack(nextIndex);
    }
}

function prevTrack() {
    const prevIndex = (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length;
    playTrack(prevIndex);
}

/**
 * UI UPDATES
 */
function updatePlayerUI(track) {
    els.playerTrackName.innerText = track.name;
    els.playerArtistName.innerText = track.artist_name;
    els.playerTrackImg.src = track.image;
    els.playerTrackImg.classList.remove('hidden');
    els.imgPlaceholder.classList.add('hidden');

    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    els.playPauseBtn.innerHTML = state.isPlaying ?
        '<i data-lucide="pause"></i>' :
        '<i data-lucide="play"></i>';
    if (window.lucide) window.lucide.createIcons();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

/**
 * EVENT LISTENERS
 */
function setupEventListeners() {
    els.playPauseBtn.addEventListener('click', togglePlay);
    els.nextBtn.addEventListener('click', nextTrack);
    els.prevBtn.addEventListener('click', prevTrack);

    // Progress Bar
    state.audio.addEventListener('timeupdate', () => {
        const percent = (state.audio.currentTime / state.audio.duration) * 100;
        els.progressFill.style.width = `${percent}%`;
        els.currentTime.innerText = formatTime(state.audio.currentTime);
    });

    state.audio.addEventListener('loadedmetadata', () => {
        els.durationTime.innerText = formatTime(state.audio.duration);
    });

    state.audio.addEventListener('ended', () => {
        if (state.isRepeat) {
            state.audio.currentTime = 0;
            state.audio.play();
        } else {
            nextTrack();
        }
    });

    els.progressBar.addEventListener('click', (e) => {
        const rect = els.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        state.audio.currentTime = percent * state.audio.duration;
    });

    // Volume
    els.volumeSlider.addEventListener('click', (e) => {
        const rect = els.volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        state.audio.volume = percent;
        els.volumeFill.style.width = `${percent * 100}%`;
    });

    // Search with Debounce
    let searchTimeout;
    els.trackSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        if (query.length > 2) {
            searchTimeout = setTimeout(() => {
                fetchTracks(query);
                els.heroTitle.innerText = `Search results for "${query}"`;
                els.heroSubtitle.innerText = "Found in SonicStream collection";
            }, 500);
        } else if (query.length === 0) {
            fetchTracks();
        }
    });

    // Favorite Button
    document.querySelector('.favorite-btn').addEventListener('click', () => {
        if (state.currentTrackIndex === -1) return;
        const trackId = state.tracks[state.currentTrackIndex].id;
        const index = state.favorites.indexOf(trackId);

        if (index === -1) {
            state.favorites.push(trackId);
        } else {
            state.favorites.splice(index, 1);
        }

        localStorage.setItem('sonic_favs', JSON.stringify(state.favorites));
        document.querySelector('.favorite-btn i').classList.toggle('fill-accent');
    });

    // Shuffle & Repeat toggles
    els.shuffleBtn.addEventListener('click', () => {
        state.isShuffle = !state.isShuffle;
        els.shuffleBtn.classList.toggle('active', state.isShuffle);
        els.shuffleBtn.style.color = state.isShuffle ? 'var(--accent-color)' : 'var(--text-dim)';
    });

    els.repeatBtn.addEventListener('click', () => {
        state.isRepeat = !state.isRepeat;
        els.repeatBtn.classList.toggle('active', state.isRepeat);
        els.repeatBtn.style.color = state.isRepeat ? 'var(--accent-color)' : 'var(--text-dim)';
    });

    // Sidebar Category Links
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.innerText.trim().toLowerCase();
            document.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
            item.classList.add('active');

            if (category === 'home') {
                fetchTracks();
            } else if (category === 'library') {
                renderTrackGrid(state.tracks.filter(t => state.favorites.includes(t.id)));
                els.heroTitle.innerText = "Your Library";
                els.heroSubtitle.innerText = "All your favorite tracks in one place";
            }
        });
    });
}

// Start the app
init();
