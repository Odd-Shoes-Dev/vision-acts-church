// ========================================
// RADIO PLAYER FUNCTIONALITY
// ========================================

let isPlaying = false;
let audioElement = null;
const ZENO_MAIN_STREAM = 'https://stream.zeno.fm/oq5cxilmz7xvv';

// Initialize audio element and bind to Zeno stream
function initializePlayer() {
    audioElement = new Audio();
    audioElement.preload = 'none';
    audioElement.volume = 0.7;
    setStreamUrl(ZENO_MAIN_STREAM);

    audioElement.addEventListener('playing', function() {
        updateNowPlaying('Now Streaming', 'Vision of Acts Radio - live from Zeno');
    });

    audioElement.addEventListener('error', function() {
        isPlaying = false;
        playBtn.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        updateNowPlaying('Stream Unavailable', 'Could not play stream right now. Please try again.');
    });

    updateNowPlaying('Gospel Africa Radio Ready', 'Click play to start live stream');
}

// Play/Pause functionality
const playBtn = document.getElementById('playBtn');
if (playBtn) {
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseStream();
        } else {
            playStream();
        }
    });
}

async function playStream() {
    if (!audioElement) {
        return;
    }

    try {
        await audioElement.play();
        isPlaying = true;
        playBtn.classList.add('playing');
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        updateNowPlaying('Buffering...', 'Connecting to live stream...');
    } catch (error) {
        isPlaying = false;
        playBtn.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        updateNowPlaying('Playback Blocked', 'Tap play again to allow audio in this browser');
        console.error('Playback error:', error);
    }
}

function pauseStream() {
    if (audioElement) {
        audioElement.pause();
    }
    isPlaying = false;
    playBtn.classList.remove('playing');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    updateNowPlaying('Paused', 'Click play to resume streaming');
}

// Update now playing information
function updateNowPlaying(title, subtitle) {
    const titleEl = document.getElementById('nowPlayingText');
    const subtitleEl = document.getElementById('programTime');
    
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
}

// Volume control
const volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider) {
    volumeSlider.addEventListener('change', function() {
        if (audioElement) {
            audioElement.volume = this.value / 100;
        }
    });
}

// Set initial volume
if (volumeSlider && audioElement) {
    audioElement.volume = volumeSlider.value / 100;
}

// Function to set stream URL
function setStreamUrl(streamUrl) {
    if (audioElement) {
        audioElement.src = streamUrl;
        audioElement.load();
    }

    console.log('Stream URL set to:', streamUrl);
}

// Function to update stream status
function updateStreamStatus(status) {
    const statusEl = document.querySelector('.stream-status');
    if (statusEl) {
        // Update status - you can modify this based on your needs
        console.log('Stream status:', status);
    }
}

// Initialize player on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    
    // Optional: Auto-update now playing text with current time
    setInterval(function() {
        if (isPlaying) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            document.getElementById('programTime').textContent = 'Now streaming - ' + timeStr;
        }
    }, 1000);
});

// ========================================
// SMART STICKY NAVBAR (from main script)
// ========================================

let lastScrollY = 0;
let isScrollingDown = false;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
            if (!isScrollingDown) {
                navbar.classList.add('navbar-hidden');
                isScrollingDown = true;
            }
        } else {
            if (isScrollingDown) {
                navbar.classList.remove('navbar-hidden');
                isScrollingDown = false;
            }
        }
    } else {
        navbar.classList.remove('navbar-hidden');
        isScrollingDown = false;
    }
    
    lastScrollY = currentScrollY;
}, { passive: true });

// ========================================
// SMOOTH SCROLLING FOR NAVIGATION
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            if (navbar) {
                navbar.classList.remove('navbar-hidden');
            }
        }
    });
});
