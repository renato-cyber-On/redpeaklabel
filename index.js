// 1. Scroll Reveal Animation
// This checks if elements are in the viewport as you scroll
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", reveal);

// 2. Simple Play Button Toggle
// Switches icon and color when a track is "played"
function togglePlay(btn) {
    if (btn.innerText === "▶") {
        btn.innerText = "⏸";
        btn.style.background = "#ffffff";
        btn.style.color = "#000000";
    } else {
        btn.innerText = "▶";
        btn.style.background = "var(--primary-red)";
        btn.style.color = "#ffffff";
    }
}

// 3. Dynamic Mouse Shadow Effect
// Creates a glowing red shadow that follows the cursor on the main title
const title = document.getElementById('main-title');

if (title) {
    window.addEventListener('mousemove', (e) => {
        // Calculate shadow offset based on mouse position
        let x = (e.clientX / window.innerWidth - 0.5) * 20;
        let y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        title.style.textShadow = `${x}px ${y}px 15px rgba(204, 0, 0, 0.7)`;
    });
}

// Run reveal once on load in case elements are already in view
reveal();

// 4. Merch Cart Functionality
function addToCart(item) {
    alert(`Added ${item} to cart!`);
    // In a real app, this would update a cart state
}

// 5. Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const surname = document.getElementById('surname').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !surname || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Disable submit button during submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';
            
            // Send data to backend
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    email: email,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFormMessage(data.message, 'success');
                    contactForm.reset();
                    submitBtn.innerText = 'Send Message';
                    submitBtn.disabled = false;
                } else {
                    showFormMessage(data.message, 'error');
                    submitBtn.innerText = 'Send Message';
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFormMessage('An error occurred. Please try again later.', 'error');
                submitBtn.innerText = 'Send Message';
                submitBtn.disabled = false;
            });
        });
    }

    // Logo heartbeat animation after intro
    const logo = document.querySelector('.logo');
    if (logo) {
        setTimeout(() => {
            logo.classList.add('heartbeat');
        }, 2000);
    }
});

// Function to display form messages
function showFormMessage(message, type) {
    let messageDiv = document.getElementById('form-message');
    
    // Create message div if it doesn't exist
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'form-message';
        const contactForm = document.getElementById('contact-form');
        contactForm.parentElement.insertBefore(messageDiv, contactForm);
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}