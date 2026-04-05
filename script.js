// Set Current Year in Footer
document.getElementById('year').textContent = new Date().getFullYear();

// ─── EmailJS Configuration ─────────────────────────────────────────────────
// Replace the three placeholder values below with your EmailJS credentials.
// See setup instructions provided alongside this file.
const EMAILJS_PUBLIC_KEY = "cMTbYX-EeLSUJTVFy";    // e.g. "abc123XYZ"
const EMAILJS_SERVICE_ID = "service_qvl97zi";    // e.g. "service_xxxxxxx"
const EMAILJS_TEMPLATE_ID = "template_uzk421k";   // e.g. "template_xxxxxxx"

// Initialize EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
// ──────────────────────────────────────────────────────────────────────────

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isIconActive = navLinks.classList.contains('active');
    hamburger.innerHTML = isIconActive
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// ─── Contact Form Handling ─────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect field values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !phone || !address || !message) {
        alert('Please fill in all fields before submitting.');
        return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Template parameters — these must match the variable names
    // used inside your EmailJS email template (e.g. {{from_name}})
    const templateParams = {
        from_name: name,
        from_phone: phone,
        from_address: address,
        message: message,
        to_email: 'bhuktapriyanath@gmail.com'
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            // Success
            formSuccess.style.display = 'block';
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';

            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 6000);
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
            alert('Sorry, there was an error sending your message. Please try again or call us directly.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
});
