/* ====================
   Suren Speech Therapist
   Main JavaScript
   ==================== */

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// ===== FORM SUBMISSION =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMsg = document.getElementById('successMessage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.btn-submit');
            
            // Show loading
            submitBtn.textContent = '⏳ Submitting...';
            submitBtn.disabled = true;
            
            // Send to Google Sheets
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    form.style.display = 'none';
                    successMsg.style.display = 'block';
                    
                    // Send WhatsApp notification (optional)
                    sendWhatsAppNotification(formData);
                } else {
                    alert('❌ There was an error. Please try again.');
                }
            })
            .catch(error => {
                alert('❌ Network error. Please check your connection.');
            })
            .finally(() => {
                submitBtn.textContent = '✅ Submit Registration';
                submitBtn.disabled = false;
                form.reset();
            });
        });
    }
});

// ===== SEND WHATSAPP NOTIFICATION =====
function sendWhatsAppNotification(data) {
    const name = data.get('name');
    const phone = data.get('phone');
    const city = data.get('city');
    const service = data.get('service');
    
    const message = `New Registration:
    Name: ${name}
    Phone: ${phone}
    City: ${city}
    Service: ${service}
    Date: ${new Date().toLocaleDateString()}`;
    
    // Replace with your WhatsApp number
    const waLink = `https://wa.me/917617489130?text=${encodeURIComponent(message)}`;
    
    // Open in new window (optional - you can comment this out)
    // window.open(waLink, '_blank');
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PWA INSTALLATION =====
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Optional: Show install button
    console.log('App can be installed');
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// ===== FORM VALIDATION =====
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#ff4444';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#00897b';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
});

// ===== PHONE NUMBER FORMAT =====
document.querySelector('input[name="phone"]')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// ===== SCROLL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature, .service-card, .testimonial, .contact-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat .number');
counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
    if (target) {
        let current = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = current + (counter.textContent.includes('+') ? '+' : '');
        }, 30);
    }
});

console.log('🗣️ Suren Speech Therapist - Website Loaded Successfully!');
