// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Form submission to HubSpot (only on contact page)
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Prepare form data for HubSpot
        const formData = {
            fields: [
                {
                    name: "firstname",
                    value: document.getElementById('name').value
                },
                {
                    name: "email",
                    value: document.getElementById('email').value
                },
                {
                    name: "phone",
                    value: document.getElementById('phone').value || ''
                },
                {
                    name: "service",
                    value: document.getElementById('service').value || ''
                },
                {
                    name: "message",
                    value: document.getElementById('message').value
                }
            ],
            context: {
                pageUri: window.location.href,
                pageName: document.title
            }
        };
        
        try {
            // Submit to HubSpot
            const response = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/442584619/86871598-cf78-4271-95b9-713378947be9', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Show success message
                formMessage.textContent = "Thank you! Your message has been sent successfully. We'll get back to you shortly.";
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Show error message
            formMessage.textContent = "Sorry, there was an error sending your message. Please try calling or emailing us directly.";
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Hide/show navigation on scroll (faster hide on scroll down)
let lastScrollTop = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 80) {
        // Scrolling down & past 80px - hide nav immediately
        nav.style.transform = 'translateY(-100%)';
    } else if (scrollTop < lastScrollTop) {
        // Scrolling up - show nav
        nav.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

window.addEventListener('scroll', function() {
    // Clear the timeout throughout the scroll
    window.clearTimeout(scrollTimeout);
    
    // Set a timeout to run after scrolling ends
    scrollTimeout = setTimeout(function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past 100px
            nav.style.transform = 'translateY(-100%)';
            nav.style.transition = 'transform 0.3s ease-in-out';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
            nav.style.transition = 'transform 0.3s ease-in-out';
        }
        
        lastScrollTop = scrollTop;
    }, 100); // Wait 100ms after scroll stops
});