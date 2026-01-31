// ================================
// Anniversary Website - Main JavaScript
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initPasswordProtection();
    initDayCounter();
    initTypingEffects();
    initTimelineAnimations();
    initGallery();
    initMusicPlayer();
    initSmoothScroll();
});

// ================================
// Password Protection with Numpad
// ================================
function initPasswordProtection() {
    const overlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    const errorMsg = document.getElementById('password-error');
    const pinDots = document.querySelectorAll('.pin-dot');
    const numBtns = document.querySelectorAll('.num-btn');
    
    const correctPassword = '010169';
    let currentPin = '';
    
    // Check if already unlocked (session storage)
    if (sessionStorage.getItem('unlocked') === 'true') {
        overlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        return;
    }
    
    // Update PIN display
    function updatePinDisplay() {
        pinDots.forEach((dot, index) => {
            dot.classList.remove('filled', 'error', 'success');
            if (index < currentPin.length) {
                dot.classList.add('filled');
            }
        });
    }
    
    // Show error state
    function showError() {
        pinDots.forEach(dot => dot.classList.add('error'));
        errorMsg.style.opacity = '1';
        
        setTimeout(() => {
            currentPin = '';
            updatePinDisplay();
            errorMsg.style.opacity = '0';
        }, 1500);
    }
    
    // Show success state
    function showSuccess() {
        pinDots.forEach(dot => {
            dot.classList.remove('filled');
            dot.classList.add('success');
        });
        
        // Trigger confetti celebration! 🎉
        if (typeof window.createConfetti === 'function') {
            window.createConfetti();
        }
        
        // Start music immediately (user interaction allows autoplay)
        window.startMusicOnUnlock = true;
        
        setTimeout(() => {
            sessionStorage.setItem('unlocked', 'true');
            overlay.classList.add('fade-out');
            
            setTimeout(() => {
                overlay.classList.add('hidden');
                mainContent.classList.remove('hidden');
                // Trigger animations after content is visible
                initTimelineAnimations();
            }, 500);
        }, 300);
    }
    
    // Check password
    function checkPassword() {
        if (currentPin === correctPassword) {
            showSuccess();
        } else {
            showError();
        }
    }
    
    // Handle numpad button clicks
    numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const num = btn.dataset.num;
            
            if (num === 'delete') {
                // Delete last digit
                currentPin = currentPin.slice(0, -1);
                updatePinDisplay();
            } else if (num === 'enter') {
                // Check password
                if (currentPin.length === 6) {
                    checkPassword();
                }
            } else {
                // Add digit
                if (currentPin.length < 6) {
                    currentPin += num;
                    updatePinDisplay();
                    
                    // Auto-check when 6 digits entered
                    if (currentPin.length === 6) {
                        setTimeout(() => checkPassword(), 200);
                    }
                }
            }
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (overlay.classList.contains('hidden')) return;
        
        if (e.key >= '0' && e.key <= '9') {
            if (currentPin.length < 6) {
                currentPin += e.key;
                updatePinDisplay();
                
                if (currentPin.length === 6) {
                    setTimeout(() => checkPassword(), 200);
                }
            }
        } else if (e.key === 'Backspace') {
            currentPin = currentPin.slice(0, -1);
            updatePinDisplay();
        } else if (e.key === 'Enter') {
            if (currentPin.length === 6) {
                checkPassword();
            }
        }
    });
}

// ================================
// Day Counter
// ================================
function initDayCounter() {
    // Start date: January 1, 2026, 01:08 AM (พ.ศ. 2569)
    const startDate = new Date(2026, 0, 1, 1, 8, 0); // Month is 0-indexed
    
    const updateCounter = () => {
        const now = new Date();
        const diff = now - startDate;
        
        // Handle case where start date is in the future
        const absDiff = Math.abs(diff);
        
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
        
        // Update DOM with animation
        animateNumber('days', days);
        animateNumber('hours', hours);
        animateNumber('minutes', minutes);
        animateNumber('seconds', seconds);
    };
    
    // Initial update
    updateCounter();
    
    // Update every second
    setInterval(updateCounter, 1000);
}

function animateNumber(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const currentValue = element.textContent;
    const newValue = value.toString().padStart(2, '0');
    
    if (currentValue !== newValue) {
        element.style.transform = 'translateY(-10px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            }, 50);
        }, 100);
    }
}

// ================================
// Typing Effects
// ================================
function initTypingEffects() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                typeText(element);
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    typingElements.forEach(el => observer.observe(el));
}

function typeText(element) {
    const text = element.getAttribute('data-text') || element.textContent;
    element.textContent = '';
    element.classList.add('typing');
    
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
        } else {
            clearInterval(typeInterval);
            element.classList.remove('typing');
            element.classList.add('typed');
            
            // Remove cursor after a delay
            setTimeout(() => {
                cursor.style.opacity = '0';
                setTimeout(() => cursor.remove(), 500);
            }, 2000);
        }
    }, 50);
}

// ================================
// Timeline Animations
// ================================
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => observer.observe(item));
}

// ================================
// Photo Gallery
// ================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImg = document.getElementById('lightbox-img');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get the image source from the gallery item
            const img = item.querySelector('.gallery-img');
            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// ================================
// Spotify-Style Music Player
// ================================
function initMusicPlayer() {
    const songs = [
        { title: 'รกแฟน', artist: 'BENT', src: 'BENT - รกแฟน (song).mp3' },
        { title: 'คนพิเศษ', artist: 'URMINE', src: 'URMINE - คนพเศษ (song).mp3' }
    ];
    
    let currentSongIndex = 0;
    let isPlaying = false;
    
    // Create audio element
    const audio = new Audio();
    audio.volume = 0.7;
    audio.loop = false;
    
    // DOM Elements
    const miniPlayer = document.getElementById('mini-player');
    const fullPlayer = document.getElementById('full-player');
    const expandBtn = document.getElementById('expand-player');
    const collapseBtn = document.getElementById('collapse-player');
    
    // Mini player elements
    const miniSongTitle = document.getElementById('mini-song-title');
    const miniProgressBar = document.getElementById('mini-progress-bar');
    const miniPlayPause = document.getElementById('mini-play-pause');
    const miniPrev = document.getElementById('mini-prev');
    const miniNext = document.getElementById('mini-next');
    
    // Full player elements
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-bar-container');
    const timeCurrent = document.getElementById('time-current');
    const timeTotal = document.getElementById('time-total');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const songItems = document.querySelectorAll('.song-item');
    
    // Load song
    function loadSong(index) {
        currentSongIndex = index;
        const song = songs[index];
        audio.src = song.src;
        
        // Update UI
        miniSongTitle.textContent = `${song.title} - ${song.artist}`;
        nowPlayingTitle.textContent = `${song.title} - ${song.artist}`;
        
        // Update active song in playlist
        songItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    
    // Play/Pause
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.log('Playback error:', e));
        }
    }
    
    function updatePlayButton() {
        const icon = isPlaying ? '❚❚' : '▶';
        miniPlayPause.textContent = icon;
        playPauseBtn.textContent = icon;
    }
    
    // Previous/Next
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) audio.play();
    }
    
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) audio.play();
    }
    
    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update progress
    function updateProgress() {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${percent}%`;
            miniProgressBar.style.width = `${percent}%`;
            timeCurrent.textContent = formatTime(audio.currentTime);
        }
    }
    
    // Event Listeners
    audio.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButton();
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButton();
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = formatTime(audio.duration);
    });
    
    audio.addEventListener('ended', nextSong);
    
    // Controls
    miniPlayPause.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);
    miniPrev.addEventListener('click', prevSong);
    prevBtn.addEventListener('click', prevSong);
    miniNext.addEventListener('click', nextSong);
    nextBtn.addEventListener('click', nextSong);
    
    // Volume
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
    
    // Progress seek
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // Playlist click
    songItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadSong(index);
            audio.play();
        });
    });
    
    // Expand/Collapse
    expandBtn.addEventListener('click', () => {
        fullPlayer.classList.remove('hidden');
    });
    
    collapseBtn.addEventListener('click', () => {
        fullPlayer.classList.add('hidden');
    });
    
    // Initialize
    loadSong(0);
    
    // Auto-play when content becomes visible (after password unlock)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'main-content' && !mutation.target.classList.contains('hidden')) {
                // Check if unlock just happened (user interaction allows autoplay)
                if (window.startMusicOnUnlock) {
                    audio.play().then(() => {
                        console.log('🎵 เพลงเริ่มเล่นแล้ว!');
                    }).catch(e => {
                        console.log('Autoplay blocked:', e);
                    });
                    window.startMusicOnUnlock = false;
                }
                observer.disconnect();
            }
        });
    });
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        observer.observe(mainContent, { attributes: true, attributeFilter: ['class'] });
    }
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================
// Parallax Effects (Optional)
// ================================
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ================================
// Add shake animation for wrong password
// ================================
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease;
    }
    
    .counter-number {
        transition: transform 0.2s ease, opacity 0.2s ease;
    }
    
    .typing {
        min-height: 1.5em;
    }
`;
document.head.appendChild(style);

// ================================
// Console Easter Egg
// ================================
console.log('%c💜 สุขสันต์ครบรอบ! 💜', 'font-size: 24px; color: #9d4edd;');
console.log('%cสร้างด้วยความรักเพื่อคุณ', 'font-size: 14px; color: #c77dff;');

// ================================
// Secret Surprise Button
// ================================
function initSecretSurprise() {
    const secretBtn = document.getElementById('secret-surprise');
    if (!secretBtn) return;
    
    const messages = [
        "พี่รักหนูนะ 💜",
        "หนูน่ารักที่สุดเลย! ✨",
        "ขอบคุณที่มาเป็นความสุขให้พี่ 🌟",
        "พี่โชคดีมากที่ได้เจอหนู 💕",
        "ทุกวันกับหนูมีความสุขเสมอ 🎉",
        "หนูคือของขวัญที่ดีที่สุด 🎁",
        "รักหนูมากกว่าเมื่อวาน 💖",
        "พี่ภูมิใจที่มีหนู 🌈",
        "หนูทำให้ชีวิตพี่สดใสขึ้น ☀️",
        "ขอให้เราอยู่ด้วยกันนานๆนะ 💫"
    ];
    
    let clickCount = 0;
    
    secretBtn.addEventListener('click', () => {
        clickCount++;
        
        // Random message
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        // Create message popup
        const popup = document.createElement('div');
        popup.className = 'surprise-popup';
        popup.textContent = randomMsg;
        document.body.appendChild(popup);
        
        // Remove after animation
        setTimeout(() => popup.remove(), 3000);
        
        // Confetti on every 3rd click
        if (clickCount % 3 === 0 && typeof window.createConfetti === 'function') {
            window.createConfetti();
        }
        
        // Create heart rain on every 5th click
        if (clickCount % 5 === 0) {
            createHeartRain();
        }
        
        // Button animation
        secretBtn.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            secretBtn.style.transform = '';
        }, 500);
    });
}

// Heart rain effect
function createHeartRain() {
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'rain-heart';
        heart.textContent = '💜';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 4000);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', initSecretSurprise);

// ================================
// Click to Create Hearts
// ================================
document.addEventListener('click', (e) => {
    // Don't create hearts on button clicks or certain elements
    if (e.target.tagName === 'BUTTON' || 
        e.target.tagName === 'A' || 
        e.target.tagName === 'INPUT' ||
        e.target.closest('.num-btn') ||
        e.target.closest('.lightbox')) {
        return;
    }
    
    // Create floating heart at click position
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.textContent = '💜';
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';
    document.body.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => heart.remove(), 2000);
});
