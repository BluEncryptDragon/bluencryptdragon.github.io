document.addEventListener('DOMContentLoaded', function() {

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '&#10005;' : '&#9776;';
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '&#9776;';
            });
        });
    }

    // Form submission to HubSpot (only on contact page)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            const formData = {
                fields: [
                    { name: "firstname", value: document.getElementById('name').value },
                    { name: "email", value: document.getElementById('email').value },
                    { name: "phone", value: document.getElementById('phone').value || '' },
                    { name: "service", value: document.getElementById('service').value || '' },
                    { name: "message", value: document.getElementById('message').value }
                ],
                context: {
                    pageUri: window.location.href,
                    pageName: document.title
                }
            };
            
            try {
                const response = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/442584619/86871598-cf78-4271-95b9-713378947be9', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    formMessage.textContent = "Thank you! Your message has been sent successfully. We'll get back to you shortly.";
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                    setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formMessage.textContent = "Sorry, there was an error sending your message. Please try calling or emailing us directly.";
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
                console.error('Form submission error:', error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Hide/show navigation on scroll
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 80) {
            nav.style.transform = 'translateY(-100%)';
            nav.style.transition = 'transform 0.3s ease-in-out';
        } else if (scrollTop < lastScrollTop) {
            nav.style.transform = 'translateY(0)';
            nav.style.transition = 'transform 0.3s ease-in-out';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

});