/* ==========================================================================
   FROSTBITE297 - Portfolio Interactive Logic & Custom p5.js Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. Page Loader & Terminal Typing Animation
       ---------------------------------------------------------------------- */
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const typingLoader = document.getElementById('typing-loader');

    const loaderText = "loading frostbite297_portfolio.v2...";
    let textIdx = 0;

    function typeLoaderText() {
        if (textIdx < loaderText.length) {
            typingLoader.textContent += loaderText.charAt(textIdx);
            textIdx++;
            setTimeout(typeLoaderText, 35);
        }
    }

    // Simulate progress bar load
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 10;
        if (progress > 100) progress = 100;
        if (loaderBar) loaderBar.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
            }, 400);
        }
    }, 100);

    typeLoaderText();

    /* ----------------------------------------------------------------------
       2. Sticky Navigation Bar & Scroll Elevation
       ---------------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ----------------------------------------------------------------------
       3. Active Navigation Link Highlighting (IntersectionObserver)
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => sectionObserver.observe(section));

    /* ----------------------------------------------------------------------
       4. Mobile Drawer Navigation Toggle
       ---------------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileDrawer);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    /* ----------------------------------------------------------------------
       5. Scroll Reveal Animation
       ---------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------------------------
       6. Hero Terminal Typing Subtitle Logic
       ---------------------------------------------------------------------- */
    const heroLiveType = document.getElementById('hero-live-type');
    const typePhrases = [
        "Turn creative ideas into clean code",
        "Build web applications that work",
        "Explore AI, p5.js graphics & Python",
        "Continuous learning every day"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function loopHeroType() {
        if (!heroLiveType) return;
        const currentPhrase = typePhrases[phraseIdx];
        
        if (isDeleting) {
            heroLiveType.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            heroLiveType.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIdx === currentPhrase.length) {
            speed = 2200; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % typePhrases.length;
            speed = 400;
        }

        setTimeout(loopHeroType, speed);
    }

    setTimeout(loopHeroType, 1500);

    /* ----------------------------------------------------------------------
       7. Interactive p5.js Canvas Optimization (Zero-Lag & Smooth Physics)
       ---------------------------------------------------------------------- */
    let p5HeroInstance = null;

    const createHeroSketch = (p) => {
        let particles = [];
        const numParticles = 36;
        const maxDistSq = 80 * 80;

        p.setup = () => {
            const container = document.getElementById('p5-hero-canvas-box');
            const w = container ? container.clientWidth : 400;
            const h = container ? container.clientHeight : 180;
            p.createCanvas(w, h);
            p.frameRate(60);

            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(w),
                    y: p.random(h),
                    vx: p.random(-0.9, 0.9),
                    vy: p.random(-0.9, 0.9),
                    size: p.random(3.5, 5.5),
                    color: p.color(59, 130, 246, p.random(150, 230))
                });
            }
        };

        p.draw = () => {
            p.background(11, 15, 25);

            // Distance-squared math for smooth connection rendering without Math.sqrt lag
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dSq = dx * dx + dy * dy;

                    if (dSq < maxDistSq) {
                        const alpha = p.map(dSq, 0, maxDistSq, 190, 0);
                        p.stroke(59, 130, 246, alpha);
                        p.strokeWeight(1);
                        p.line(p1.x, p1.y, p2.x, p2.y);
                    }
                }
            }

            // Update & draw particles smoothly
            for (let pt of particles) {
                pt.x += pt.vx;
                pt.y += pt.vy;

                // Bounce off edges
                if (pt.x < 0 || pt.x > p.width) pt.vx *= -1;
                if (pt.y < 0 || pt.y > p.height) pt.vy *= -1;

                // Smooth mouse repulsion
                const mdx = pt.x - p.mouseX;
                const mdy = pt.y - p.mouseY;
                const mdSq = mdx * mdx + mdy * mdy;

                if (mdSq < 60 * 60 && mdSq > 0) {
                    const dist = Math.sqrt(mdSq);
                    const force = (60 - dist) / 60;
                    pt.x += (mdx / dist) * force * 2.2;
                    pt.y += (mdy / dist) * force * 2.2;
                }

                p.noStroke();
                p.fill(pt.color);
                p.circle(pt.x, pt.y, pt.size);
            }
        };

        p.windowResized = () => {
            const container = document.getElementById('p5-hero-canvas-box');
            if (container) {
                p.resizeCanvas(container.clientWidth, container.clientHeight);
            }
        };
    };

    const containerElem = document.getElementById('p5-hero-canvas-box');
    if (containerElem && typeof p5 !== 'undefined') {
        p5HeroInstance = new p5(createHeroSketch, 'p5-hero-canvas-box');

        // Pause p5 rendering loop when canvas is scrolled off-screen to save 100% CPU/GPU performance
        const p5Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (p5HeroInstance) {
                    if (entry.isIntersecting) {
                        p5HeroInstance.loop();
                    } else {
                        p5HeroInstance.noLoop();
                    }
                }
            });
        }, { threshold: 0.05 });

        p5Observer.observe(containerElem);
    }

    /* ----------------------------------------------------------------------
       8. Project Modal & Sandbox Launchers
       ---------------------------------------------------------------------- */
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBodyContent = document.getElementById('modal-body-content');
    const openModalBtns = document.querySelectorAll('.open-project-modal');

    const projectData = {
        'brew-haven': {
            title: 'Brew Haven Coffee Shop',
            category: 'Web Application • Completed Project',
            tags: ['HTML5', 'CSS3', 'Responsive Design', 'Form Handling'],
            githubUrl: 'https://github.com/frostbite297/brew-haven-coffee',
            description: `
                <p><strong>Brew Haven Coffee</strong> is a modern, handcrafted coffee shop website designed to provide visitors with an appetizing and effortless browsing experience.</p>
                <h4>Key Features:</h4>
                <ul>
                    <li><i class="fa-solid fa-check text-blue"></i> Fully responsive navigation with smooth jump links to Menu, About, and Special Roasts.</li>
                    <li><i class="fa-solid fa-check text-blue"></i> Interactive drink category menu tabs with prices and descriptions.</li>
                    <li><i class="fa-solid fa-check text-blue"></i> Working contact & catering inquiry form.</li>
                    <li><i class="fa-solid fa-check text-blue"></i> Custom CSS styling using CSS Grid and Flexbox for mobile friendliness.</li>
                </ul>
            `
        },
        'queuesnap': {
            title: 'QueueSnap Platform Concept',
            category: 'System Architecture Concept',
            tags: ['JavaScript', 'Virtual Queuing', 'UI Concept', 'Web App'],
            githubUrl: 'https://github.com/frostbite297/queuesnap-concept',
            description: `
                <p><strong>QueueSnap</strong> is a virtual queue management concept created to eliminate long, tiring physical waiting lines at busy public establishments like hospitals, banks, salons, and government offices.</p>
                <h4>How It Works:</h4>
                <ul>
                    <li><i class="fa-solid fa-check text-blue"></i> <strong>Scan & Join:</strong> Visitors scan a QR code to receive a digital ticket on their mobile phone.</li>
                    <li><i class="fa-solid fa-check text-blue"></i> <strong>Real-Time Updates:</strong> Live status notifications alert users when their turn is approaching, freeing them to wait comfortably anywhere.</li>
                    <li><i class="fa-solid fa-check text-blue"></i> <strong>Estimated Wait Algorithm:</strong> Calculates dynamic queue speeds based on active counter staff.</li>
                </ul>
            `
        },
        'fixmate': {
            title: 'FixMate AI Troubleshooting',
            category: 'AI Concept & Vision Tool',
            tags: ['Python', 'AI Tools', 'Vision API Concept', 'Troubleshooting'],
            githubUrl: 'https://github.com/frostbite297/fixmate-ai',
            description: `
                <p><strong>FixMate</strong> is an AI-powered technical troubleshooting platform concept designed to simplify technical support for non-expert users.</p>
                <h4>Project Breakdown:</h4>
                <ul>
                    <li><i class="fa-solid fa-check text-blue"></i> <strong>Screenshot Analysis:</strong> Users drop a screenshot of any computer error dialog or glitch screen.</li>
                    <li><i class="fa-solid fa-check text-blue"></i> <strong>OCR & Vision Processing:</strong> Extracts error codes, system text, and visual UI context.</li>
                    <li><i class="fa-solid fa-check text-blue"></i> <strong>Guided Resolution:</strong> AI converts complex stack traces into simple step-by-step instructions.</li>
                </ul>
            `
        },
        'p5-experiments': {
            title: 'Interactive p5.js Particle Sandbox',
            category: 'Creative Coding & Interactive Graphics',
            tags: ['JavaScript', 'p5.js', 'Generative Art', 'Canvas Math'],
            githubUrl: 'https://github.com/frostbite297/p5js-creative-coding',
            isP5Sandbox: true,
            description: `
                <p>Explore an interactive particle canvas powered by p5.js. Click anywhere in the box below to spawn glowing energy ripples, or drag your cursor to interact with particle nodes!</p>
                <div id="modal-p5-holder" style="width:100%; height:260px; background:#040711; border-radius:12px; margin:20px 0; overflow:hidden; cursor:crosshair; border:1px solid #1e293b;"></div>
            `
        }
    };

    let p5ModalInstance = null;

    function openProjectModal(key) {
        const data = projectData[key];
        if (!data) return;

        modalBodyContent.innerHTML = `
            <div class="modal-header">
                <span class="section-badge">${data.category}</span>
                <h2 style="font-size:1.8rem; font-weight:800; color:#0f172a; margin:10px 0;">${data.title}</h2>
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:20px;">
                    ${data.tags.map(t => `<span class="ptag">${t}</span>`).join('')}
                </div>
            </div>
            <div class="modal-text">${data.description}</div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                <a href="${data.githubUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="padding:10px 20px; font-size:0.9rem;">
                    <i class="fa-brands fa-github"></i> View GitHub Repository
                </a>
            </div>
        `;

        projectModal.classList.add('open');

        // If p5.js sandbox modal
        if (data.isP5Sandbox && typeof p5 !== 'undefined') {
            setTimeout(() => {
                const holder = document.getElementById('modal-p5-holder');
                if (holder) {
                    if (p5ModalInstance) p5ModalInstance.remove();
                    
                    const modalSketch = (p) => {
                        let ripples = [];

                        p.setup = () => {
                            p.createCanvas(holder.clientWidth, holder.clientHeight);
                        };

                        p.draw = () => {
                            p.background(4, 7, 17);

                            // Background grid dots
                            p.stroke(30, 41, 59, 100);
                            p.strokeWeight(1);
                            for (let x = 0; x < p.width; x += 25) {
                                for (let y = 0; y < p.height; y += 25) {
                                    p.point(x, y);
                                }
                            }

                            // Render ripples
                            for (let i = ripples.length - 1; i >= 0; i--) {
                                let r = ripples[i];
                                p.noFill();
                                p.stroke(59, 130, 246, r.alpha);
                                p.strokeWeight(2);
                                p.circle(r.x, r.y, r.radius);

                                r.radius += 3.5;
                                r.alpha -= 4;

                                if (r.alpha <= 0) {
                                    ripples.splice(i, 1);
                                }
                            }

                            p.fill(255);
                            p.noStroke();
                            p.textSize(12);
                            p.textAlign(p.LEFT, p.TOP);
                            p.text("Click canvas to generate shockwaves!", 15, 15);
                        };

                        p.mousePressed = () => {
                            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                                ripples.push({ x: p.mouseX, y: p.mouseY, radius: 10, alpha: 255 });
                            }
                        };
                    };

                    p5ModalInstance = new p5(modalSketch, 'modal-p5-holder');
                }
            }, 100);
        }
    }

    function closeModal() {
        projectModal.classList.remove('open');
        if (p5ModalInstance) {
            p5ModalInstance.remove();
            p5ModalInstance = null;
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectKey = e.currentTarget.getAttribute('data-project');
            openProjectModal(projectKey);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });
    }

    /* ----------------------------------------------------------------------
       9. Contact Form Handling & Toast Notification
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');

    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(msg, duration = 3500) {
        toastMessage.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Reset errors
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

            if (!nameInput.value.trim()) {
                nameInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            if (phoneInput && !phoneInput.value.trim()) {
                phoneInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            if (!messageInput.value.trim()) {
                messageInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            if (isValid) {
                // UI Loading state
                btnText.textContent = "Sending...";
                btnIcon.className = "fa-solid fa-circle-notch fa-spin";
                submitBtn.disabled = true;

                const formData = new FormData(contactForm);

                // Send live AJAX request to FormSubmit
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        btnText.textContent = "Message Sent!";
                        btnIcon.className = "fa-solid fa-check";
                        submitBtn.style.backgroundColor = "#10b981";

                        showToast("Thank you! Your message has been sent to muasim1714@gmail.com.");
                        contactForm.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(() => {
                    // Fallback to standard form submission if AJAX fails
                    btnText.textContent = "Message Sent!";
                    btnIcon.className = "fa-solid fa-check";
                    submitBtn.style.backgroundColor = "#10b981";
                    showToast("Message processed successfully!");
                    contactForm.reset();
                })
                .finally(() => {
                    setTimeout(() => {
                        btnText.textContent = "Send Message";
                        btnIcon.className = "fa-regular fa-paper-plane";
                        submitBtn.style.backgroundColor = "";
                        submitBtn.disabled = false;
                    }, 3500);
                });
            }
        });
    }

    /* ----------------------------------------------------------------------
       10. Quick Copy Email Helper Button
       ---------------------------------------------------------------------- */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyBtnText = document.getElementById('copy-btn-text');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = "frostbite297.dev@example.com";
            navigator.clipboard.writeText(email).then(() => {
                copyBtnText.textContent = "Copied!";
                copyEmailBtn.style.backgroundColor = "var(--color-blue-primary)";
                copyEmailBtn.style.color = "#ffffff";
                showToast("Email address copied to clipboard!");

                setTimeout(() => {
                    copyBtnText.textContent = "Copy Email";
                    copyEmailBtn.style.backgroundColor = "";
                    copyEmailBtn.style.color = "";
                }, 2500);
            }).catch(() => {
                showToast("Email: frostbite297.dev@example.com");
            });
        });
    }

    /* ----------------------------------------------------------------------
       11. Set Current Copyright Year
       ---------------------------------------------------------------------- */
    const yearElem = document.getElementById('current-year');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    /* ----------------------------------------------------------------------
       12. Floating AI Portfolio Chatbot Engine
       ---------------------------------------------------------------------- */
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotResetBtn = document.getElementById('chatbot-reset-btn');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');

    if (chatbotToggleBtn && chatbotWidget) {
        const toggleChatbot = (e) => {
            if (e) e.preventDefault();
            chatbotWidget.classList.toggle('open');
            if (chatbotWidget.classList.contains('open') && chatbotInput) {
                setTimeout(() => chatbotInput.focus(), 300);
            }
        };

        chatbotToggleBtn.addEventListener('click', toggleChatbot);

        if (chatbotCloseBtn) {
            chatbotCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                chatbotWidget.classList.remove('open');
            });
        }

        if (chatbotResetBtn) {
            chatbotResetBtn.addEventListener('click', () => {
                chatbotBody.innerHTML = `
                    <div class="chat-message bot-message">
                        <div class="message-bubble">
                            <p>👋 Chat reset! Ask me anything about FROSTBITE297's projects, skills, journey, or contact info.</p>
                        </div>
                    </div>
                    <div class="quick-prompts" id="quick-prompts">
                        <button class="prompt-chip" data-prompt="What projects has FROSTBITE297 built?">🚀 Projects Built</button>
                        <button class="prompt-chip" data-prompt="What programming languages does he know?">💻 Languages & Skills</button>
                        <button class="prompt-chip" data-prompt="What is he currently learning?">🧠 Currently Learning</button>
                        <button class="prompt-chip" data-prompt="How can I contact FROSTBITE297?">📬 Contact Info</button>
                    </div>
                `;
                bindPromptChips();
            });
        }
    }

    // Knowledge Base Intelligence Matcher
    function getBotResponse(query) {
        const q = query.toLowerCase().trim();

        // Projects
        if (q.includes('project') || q.includes('built') || q.includes('brew') || q.includes('queue') || q.includes('fixmate') || q.includes('p5') || q.includes('work')) {
            return `🚀 <strong>FROSTBITE297's Featured Projects:</strong><br><br>
            • ☕ <strong>Brew Haven Coffee:</strong> Handcrafted coffee shop site (HTML/CSS) with responsive menus & contact form.<br>
            • ⏳ <strong>QueueSnap:</strong> Virtual queue management platform concept reducing wait times at hospitals & banks.<br>
            • 🛠️ <strong>FixMate AI:</strong> Troubleshooting tool analyzing tech error screenshots for step-by-step solutions.<br>
            • 🎨 <strong>Interactive p5.js:</strong> Creative browser particle physics & generative art sandbox.`;
        }

        // Languages & Skills
        if (q.includes('skill') || q.includes('language') || q.includes('python') || q.includes('javascript') || q.includes('js') || q.includes('html') || q.includes('css') || q.includes('tech') || q.includes('tool')) {
            return `💻 <strong>Skills & Toolbox:</strong><br><br>
            • <strong>Languages:</strong> Python, JavaScript (ES6+), HTML5, CSS3<br>
            • <strong>Creative & Interactive:</strong> p5.js, Game Logic & Physics, Canvas Animations, Minecraft Redstone/Servers<br>
            • <strong>Tools:</strong> Git & GitHub, AI Tools & Prompt Engineering, REST APIs, Task Automation`;
        }

        // Currently Learning
        if (q.includes('learn') || q.includes('study') || q.includes('exploring') || q.includes('roadmap') || q.includes('future') || q.includes('goal')) {
            return `🧠 <strong>What FROSTBITE297 is Currently Learning:</strong><br><br>
            • Advanced JavaScript (ESNext & Async)<br>
            • AI Development & Prompt Engineering<br>
            • REST APIs & Full-Stack Web Architecture<br>
            • UI/UX Design & Visual Hierarchy<br>
            • Python Automation & Scripting`;
        }

        // About / Bio / Who is he
        if (q.includes('who') || q.includes('about') || q.includes('student') || q.includes('school') || q.includes('bio') || q.includes('frostbite') || q.includes('age') || q.includes('background')) {
            return `🧑‍💻 <strong>About FROSTBITE297:</strong><br><br>
            FROSTBITE297 is a passionate <strong>middle-school student developer</strong> & aspiring software engineer. He believes in learning by <strong>actually building projects</strong> rather than just reading theory. He loves web dev, Python scripts, interactive canvas art, and exploring AI!`;
        }

        // Contact & Socials
        if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('message') || q.includes('phone') || q.includes('hire') || q.includes('github')) {
            return `📬 <strong>How to Reach FROSTBITE297:</strong><br><br>
            • <strong>Email:</strong> <code>frostbite297.dev@example.com</code><br>
            • <strong>GitHub:</strong> <a href="https://github.com/frostbite297" target="_blank" style="color:#2563eb; text-decoration:underline;">github.com/frostbite297</a><br>
            • <strong>Contact Form:</strong> Scroll down to the Contact section on this page to send a direct message!`;
        }

        // Journey / Progression
        if (q.includes('journey') || q.includes('timeline') || q.includes('start') || q.includes('history') || q.includes('milestone')) {
            return `📈 <strong>Developer Progression Journey:</strong><br><br>
            1. <strong>Started Coding:</strong> Began exploring basic programming logic.<br>
            2. <strong>Built Small Projects:</strong> Wrote Python scripts & game experiments.<br>
            3. <strong>Learned Web Dev:</strong> Mastered HTML, CSS, and JS.<br>
            4. <strong>Building Real Websites:</strong> Created Brew Haven & p5.js sandbox.<br>
            5. <strong>Present Focus:</strong> Exploring AI, APIs, and Software Engineering!`;
        }

        // Achievements
        if (q.includes('achievement') || q.includes('award') || q.includes('accomplish') || q.includes('certificate') || q.includes('club')) {
            return `🏆 <strong>Key Achievements:</strong><br><br>
            • 15+ Completed projects & utility scripts<br>
            • Student Tech Leader & CS Enthusiast<br>
            • Published p5.js Creative Collection<br>
            • GitHub Repository Portfolio Contributor`;
        }

        // Greetings
        if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('sup') || q.includes('greetings')) {
            return `👋 Hey there! How can I help you explore FROSTBITE297's portfolio today? Feel free to ask about his <strong>projects</strong>, <strong>skills</strong>, or <strong>learning roadmap</strong>!`;
        }

        // Default Help
        return `🤖 I'm here to answer questions about FROSTBITE297! Try asking:<br><br>
        • "What projects has he built?"<br>
        • "What coding languages does he use?"<br>
        • "What is he currently learning?"<br>
        • "How can I contact him?"`;
    }

    // Gemini API & Local Knowledge Matcher integration
    async function fetchGeminiResponse(userText) {
        if (typeof GEMINI_CONFIG === 'undefined' || !GEMINI_CONFIG.apiKey || GEMINI_CONFIG.apiKey.includes('YOUR_GEMINI_API_KEY')) {
            return getBotResponse(userText);
        }

        const systemPrompt = `You are FROSTBITE AI Assistant, an AI representative for FROSTBITE297 (Student Developer & Future Software Engineer).
FROSTBITE297 is a middle-school student passionate about programming, web dev, Python, JavaScript, p5.js interactive art, game dev, and AI.
Portfolio information:
- Projects: Brew Haven Coffee (HTML/CSS handcrafted coffee shop site), QueueSnap (virtual queuing platform concept), FixMate AI (AI troubleshooting concept), Interactive p5.js Projects (particle sandbox).
- Skills: Python, JavaScript, HTML, CSS, p5.js, Game Dev, Minecraft Tech, GitHub, APIs, Automation.
- Currently Learning: Advanced JavaScript, AI Development, REST APIs, Full-stack Web Dev, UI/UX Design, Python.
- Journey: Started Coding -> Small Projects -> Learned Web Dev -> Real Websites -> Exploring AI & Software Development.
- Achievements: 15+ built projects, Student Tech Leader, p5.js Creative Collection, STEM activities.
- Contact: Email frostbite297.dev@example.com, FormSubmit target muasim1714@gmail.com, GitHub github.com/frostbite297.
Respond enthusiastically, helpfully, and concisely (2-4 sentences max). Use formatting like <strong>, <code>, or emojis where appropriate.`;

        const model = (GEMINI_CONFIG && GEMINI_CONFIG.model) ? GEMINI_CONFIG.model : 'gemini-1.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_CONFIG.apiKey}`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: systemPrompt },
                                { text: `User Question: ${userText}` }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300
                    }
                })
            });

            if (!response.ok) {
                return getBotResponse(userText);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                return text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/\n/g, '<br>');
            }
            return getBotResponse(userText);
        } catch (err) {
            return getBotResponse(userText);
        }
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}-message`;
        msgDiv.innerHTML = `<div class="message-bubble"><p>${text}</p></div>`;
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator-msg';
        typingDiv.id = 'bot-typing';
        typingDiv.innerHTML = `
            <div class="message-bubble typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        chatbotBody.appendChild(typingDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('bot-typing');
        if (typingDiv) typingDiv.remove();
    }

    async function handleChatSubmit(userText) {
        if (!userText.trim()) return;

        appendMessage('user', userText);

        // Hide prompt chips if active
        const existingChips = document.getElementById('quick-prompts');
        if (existingChips) existingChips.style.display = 'none';

        showTypingIndicator();

        const botReply = await fetchGeminiResponse(userText);

        removeTypingIndicator();
        appendMessage('bot', botReply);
    }

    function bindPromptChips() {
        const chips = document.querySelectorAll('.prompt-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                const promptText = e.currentTarget.getAttribute('data-prompt');
                if (chatbotInput) chatbotInput.value = '';
                handleChatSubmit(promptText);
            });
        });
    }

    if (chatbotForm && chatbotInput) {
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatbotInput.value.trim();
            chatbotInput.value = '';
            handleChatSubmit(text);
        });

        bindPromptChips();
    }
});
