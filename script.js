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

// ─── Previous Works Gallery (localStorage + Static Fallback) ────────────────
const WORKS_PER_PAGE = 9;
let allWorksData     = [];
let currentWorksPage = 1;

const STATIC_FALLBACK = [
    'assets/WhatsApp Image 2026-03-29 at 19.42.01.jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.01 (1).jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.01 (2).jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.02.jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.02 (1).jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.02 (2).jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.03.jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.03 (1).jpeg',
    'assets/WhatsApp Image 2026-03-29 at 19.42.03 (2).jpeg',
];

function showStaticWorks() {
    allWorksData = STATIC_FALLBACK.map(url => ({ url, uploadedAt: null }));
    renderWorksPage(1);
}

function renderWorksPage(page) {
    const grid    = document.getElementById('works-grid');
    const loading = document.getElementById('works-loading');
    const empty   = document.getElementById('works-empty');
    const pag     = document.getElementById('works-pagination');

    loading.style.display = 'none';

    if (!allWorksData.length) {
        empty.style.display = 'flex';
        grid.style.display  = 'none';
        pag.style.display   = 'none';
        return;
    }

    empty.style.display = 'none';
    grid.style.display  = 'grid';

    const total  = Math.ceil(allWorksData.length / WORKS_PER_PAGE);
    const start  = (page - 1) * WORKS_PER_PAGE;
    const items  = allWorksData.slice(start, start + WORKS_PER_PAGE);
    currentWorksPage = page;

    grid.innerHTML = items.map(w => `
        <div class="work-card">
            <img src="${w.url}" alt="Solar Installation Work" loading="lazy">
        </div>
    `).join('');

    if (total > 1) {
        pag.style.display = 'flex';
        document.getElementById('works-page-info').textContent = `Page ${page} of ${total}`;
        document.getElementById('works-prev-btn').disabled = page <= 1;
        document.getElementById('works-next-btn').disabled = page >= total;
    } else {
        pag.style.display = 'none';
    }
}

function changeWorksPage(delta) {
    const total = Math.ceil(allWorksData.length / WORKS_PER_PAGE);
    const np    = currentWorksPage + delta;
    if (np >= 1 && np <= total) {
        renderWorksPage(np);
        document.getElementById('works').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function initWorksGallery() {
    // Always show BOTH: admin-uploaded photos (from localStorage) + static built-in images.
    // Uploaded photos come first (newest first), static ones appear after.
    let uploadedPhotos = [];
    try {
        const stored = localStorage.getItem('svt_works');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                uploadedPhotos = parsed.sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
            }
        }
    } catch (e) {
        console.warn('Could not read localStorage works:', e);
    }

    // Static images always included as the base gallery
    const staticPhotos = STATIC_FALLBACK.map(url => ({ url, uploadedAt: null }));

    // Merge: admin uploads first, then static
    allWorksData = [...uploadedPhotos, ...staticPhotos];
    renderWorksPage(1);
}

initWorksGallery();
// ────────────────────────────────────────────────────────────────────────────


