// ========================================
// SMART STICKY NAVBAR
// ========================================

let lastScrollY = 0;
let isScrollingDown = false;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Only show/hide navbar if we've scrolled more than a small threshold
    if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
            // Scrolling down - hide navbar
            if (!isScrollingDown) {
                navbar.classList.add('navbar-hidden');
                isScrollingDown = true;
            }
        } else {
            // Scrolling up - show navbar
            if (isScrollingDown) {
                navbar.classList.remove('navbar-hidden');
                isScrollingDown = false;
            }
        }
    } else {
        // At the top - always show navbar
        navbar.classList.remove('navbar-hidden');
        isScrollingDown = false;
    }
    
    lastScrollY = currentScrollY;
}, { passive: true });

// ========================================
// SMOOTH SCROLLING & NAVIGATION
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
            // Show navbar when clicking navigation
            navbar.classList.remove('navbar-hidden');
            isScrollingDown = false;
        }
    });
});

// ========================================
// FORM HANDLING
// ========================================

const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Success message (Replace with actual form submission logic)
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Prayer Form Handling
const prayerForm = document.querySelector('#prayerForm');
if (prayerForm) {
    prayerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const prayerRequest = this.querySelector('textarea').value;
        
        // Simple validation - only prayer request is required
        if (!prayerRequest || prayerRequest.trim() === '') {
            alert('Please enter your prayer request');
            return;
        }
        
        // Success message
        alert('Thank you for sharing your prayer request. Our church family will be praying with you.');
        this.reset();
    });
}

// ========================================
// MOBILE MENU TOGGLE (optional enhancement)
// ========================================

// Add this if you want to add a mobile menu toggle button in the future
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// ========================================
// SCROLL ANIMATIONS (optional enhancement)
// ========================================

// Fade in elements as they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to mission pillars and other elements
document.querySelectorAll('.pillar, .leader-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
