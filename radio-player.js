// ========================================
// RADIO PLAYER FUNCTIONALITY
// ========================================

let isPlaying = false;
let isLoading = false;
let audioElement = null;
let loadingTimeout = null;

const ZENO_MAIN_STREAM = 'https://stream.zeno.fm/oq5cxilmz7xvv';

const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');

function setButtonStatePlaying() {
    if (!playBtn) {
        return;
    }

    playBtn.classList.remove('loading');
    playBtn.classList.add('playing');
    playBtn.disabled = false;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function setButtonStatePaused() {
    if (!playBtn) {
        return;
    }

    playBtn.classList.remove('loading');
    playBtn.classList.remove('playing');
    playBtn.disabled = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function setButtonStateLoading() {
    if (!playBtn) {
        return;
    }

    playBtn.classList.remove('playing');
    playBtn.classList.add('loading');
    playBtn.disabled = true;
    playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
}

function clearLoadingTimeout() {
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }
}

function startLoadingTimeout() {
    clearLoadingTimeout();
    loadingTimeout = setTimeout(function() {
        if (!isPlaying) {
            isLoading = false;
            setButtonStatePaused();
            updateNowPlaying('Still Connecting', 'Stream is taking longer than expected. Tap play once to retry.');
        }
    }, 12000);
}

// Initialize audio element and bind to Zeno stream
function initializePlayer() {
    audioElement = new Audio();
    audioElement.preload = 'none';
    audioElement.volume = 0.7;
    audioElement.src = ZENO_MAIN_STREAM;

    audioElement.addEventListener('waiting', function() {
        if (!isPlaying) {
            isLoading = true;
            setButtonStateLoading();
            updateNowPlaying('Buffering...', 'Connecting to live stream...');
            startLoadingTimeout();
        }
    });

    audioElement.addEventListener('playing', function() {
        isPlaying = true;
        isLoading = false;
        clearLoadingTimeout();
        setButtonStatePlaying();
        updateNowPlaying('Now Streaming', 'Vision of Acts Radio - live from Zeno');
    });

    audioElement.addEventListener('pause', function() {
        if (!isLoading) {
            isPlaying = false;
            setButtonStatePaused();
        }
    });

    audioElement.addEventListener('error', function() {
        isPlaying = false;
        isLoading = false;
        clearLoadingTimeout();
        setButtonStatePaused();
        updateNowPlaying('Stream Unavailable', 'Could not play stream right now. Please try again.');
    });

    updateNowPlaying('Gospel Africa Radio Ready', 'Click play to start live stream');
}

async function playStream() {
    if (!audioElement || isLoading) {
        return;
    }

    isLoading = true;
    setButtonStateLoading();
    updateNowPlaying('Buffering...', 'Connecting to live stream...');
    startLoadingTimeout();

    try {
        await audioElement.play();
    } catch (error) {
        isPlaying = false;
        isLoading = false;
        clearLoadingTimeout();
        setButtonStatePaused();
        updateNowPlaying('Playback Blocked', 'Tap play again to allow audio in this browser');
        console.error('Playback error:', error);
    }
}

function pauseStream() {
    clearLoadingTimeout();
    isLoading = false;
    isPlaying = false;

    if (audioElement) {
        audioElement.pause();
    }

    setButtonStatePaused();
    updateNowPlaying('Paused', 'Click play to resume streaming');
}

// Update now playing information
function updateNowPlaying(title, subtitle) {
    const titleEl = document.getElementById('nowPlayingText');
    const subtitleEl = document.getElementById('programTime');

    if (titleEl) {
        titleEl.textContent = title;
    }
    if (subtitleEl) {
        subtitleEl.textContent = subtitle;
    }
}

// Initialize player on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            if (isLoading) {
                return;
            }

            if (isPlaying) {
                pauseStream();
            } else {
                playStream();
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            if (audioElement) {
                audioElement.volume = this.value / 100;
            }
        });

        if (audioElement) {
            audioElement.volume = volumeSlider.value / 100;
        }
    }

    setInterval(function() {
        if (isPlaying) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const programTimeEl = document.getElementById('programTime');
            if (programTimeEl) {
                programTimeEl.textContent = 'Now streaming - ' + timeStr;
            }
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
