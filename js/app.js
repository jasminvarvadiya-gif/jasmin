// Jasmin Varvadiya Portfolio — High Performance, Lag-Free Engine
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const projects = [
    { title: 'Ochi Inspired Animated Website', description: 'A premium animated website inspired by Ochi Design. Features smooth scroll, complex GSAP animations, and custom cursor.', url: 'https://ochi-clone-byjasmin.vercel.app' },
    { title: 'Dynamic React Dashboard', description: 'A comprehensive analytics dashboard with CRUD operations, real-time data handling, and interactive charts.', url: 'https://react-dashboard-seven-sigma.vercel.app' },
    { title: 'E-Commerce Fusion', description: 'A modern e-commerce platform with a focus on smooth transitions, cart functionality, and responsive design.', url: 'https://male-fashion-pi-five.vercel.app' },
    { title: 'J.J Trader Website', description: 'An exploration of minimalist design and simple animations, brought together in a responsive website.', url: 'https://j-j-trader.vercel.app' }
];

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let active = 0;
let animating = false;
let lenis = null;

// Lightweight 3D Orbit Carousel (GPU-accelerated, zero blur overhead)
function renderOrbit(animate = true) {
    const cards = $$('.orbit-card');
    const stage = $('.orbit-stage');
    const stageWidth = stage ? stage.clientWidth : innerWidth;

    cards.forEach((card, index) => {
        let relative = (index - active + 4) % 4;
        if (relative > 2) relative -= 4;
        const isActive = relative === 0;

        card.style.zIndex = String(10 - Math.abs(relative));
        card.inert = !isActive;
        card.setAttribute('aria-hidden', String(!isActive));

        const params = {
            xPercent: -50,
            yPercent: -50,
            x: relative === 0 ? 0 : relative * stageWidth * 0.36,
            y: relative === 0 ? 0 : Math.abs(relative) * -75,
            rotation: relative * 12,
            rotationY: relative * -11,
            scale: isActive ? 1 : 0.72,
            opacity: isActive ? 1 : relative === 2 ? 0 : 0.5,
            duration: animate && !reduced ? 0.75 : 0,
            ease: 'power3.out',
            overwrite: 'auto'
        };

        if (window.gsap) {
            gsap.to(card, params);
        } else {
            card.style.opacity = isActive ? '1' : '0';
            card.style.transform = 'translate(-50%, -50%)';
        }
    });

    $$('[data-project]').forEach((b, i) => b.setAttribute('aria-pressed', String(i === active)));
}

function selectProject(index) {
    if (animating) return;
    const next = (index + projects.length) % projects.length;
    if (next === active) return;
    active = next;

    const update = () => {
        const p = projects[active];
        const currentEl = $('#current');
        const titleEl = $('#projectTitle');
        const descEl = $('#projectDescription');
        const linkEl = $('#projectLink');

        if (currentEl) currentEl.textContent = String(active + 1).padStart(2, '0');
        if (titleEl) titleEl.textContent = p.title;
        if (descEl) descEl.textContent = p.description;
        if (linkEl) linkEl.href = p.url;
    };

    renderOrbit(true);

    if (window.gsap && !reduced) {
        animating = true;
        gsap.to('.project-copy', {
            opacity: 0,
            y: -14,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
                update();
                gsap.fromTo('.project-copy',
                    { opacity: 0, y: 18 },
                    { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', onComplete: () => { animating = false; } }
                );
            }
        });
    } else {
        update();
    }
}

// Carousel Controls
const prevBtn = $('#previous');
if (prevBtn) prevBtn.addEventListener('click', () => selectProject(active - 1));

const nextBtn = $('#next');
if (nextBtn) nextBtn.addEventListener('click', () => selectProject(active + 1));

$$('[data-project]').forEach(b => {
    b.addEventListener('click', () => selectProject(Number(b.dataset.project)));
});

let startX = null;
const stageEl = $('.orbit-stage');
if (stageEl) {
    stageEl.addEventListener('pointerdown', e => { startX = e.clientX; });
    stageEl.addEventListener('pointerup', e => {
        if (startX !== null && Math.abs(e.clientX - startX) > 40) {
            selectProject(active + (e.clientX < startX ? 1 : -1));
            e.preventDefault();
        }
        startX = null;
    });
}

const orbitEl = $('.orbit');
if (orbitEl) {
    orbitEl.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); selectProject(active + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); selectProject(active - 1); }
    });
}

// Initialize animations and smooth scrolling
function init() {
    renderOrbit(false);
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);

    // Luxury Smooth Scroll with Lenis
    if (!reduced && window.Lenis) {
        document.documentElement.style.scrollBehavior = 'auto';
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(500, 33);

        $$('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const href = a.getAttribute('href');
                if (href && href.length > 1) {
                    const target = $(href);
                    if (target) {
                        e.preventDefault();
                        lenis.scrollTo(target, {
                            duration: 1.1,
                            offset: 0,
                            onComplete: () => {
                                target.setAttribute('tabindex', '-1');
                                target.focus({ preventScroll: true });
                            }
                        });
                    }
                }
            });
        });
    }

    function heroSetup() {
        const name = $('.name');
        if (!name) return 1;
        const base = innerWidth < 768 ? 18 : 26;
        gsap.set(name, { fontSize: base, clearProps: 'transform' });
        return (innerWidth * 0.84) / name.offsetWidth;
    }

    const mm = gsap.matchMedia();

    if (!reduced) {
        // Smooth initial page load
        gsap.set('.loader', { display: 'flex' });
        gsap.timeline({
            onComplete: () => {
                gsap.set('.loader', { display: 'none' });
                ScrollTrigger.refresh();
            }
        })
        .from('.loader span', { opacity: 0, y: 20, duration: 0.4 })
        .to('.loader span', { opacity: 0, y: -16, duration: 0.32 }, '+=0.1')
        .to('.loader', { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.75, ease: 'power3.inOut' }, '<0.08');

        // Hero Typography & Portrait Scale
        mm.add('(min-width: 1px)', () => {
            const scale = heroSetup();
            const travel = innerWidth < 768 ? 80 : 80;
            gsap.fromTo('.name',
                { scale, y: travel },
                { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } }
            );
            gsap.to('.portrait', {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
            });
            return () => {};
        });

        // SplitText Roll & Scatter
        if (window.SplitText) {
            $$('[data-roll]').forEach(el => {
                SplitText.create(el, {
                    type: 'chars,lines',
                    autoSplit: true,
                    mask: 'lines',
                    onSplit: split => {
                        gsap.set(split.lines, { perspective: 600 });
                        return gsap.from(split.chars, {
                            rotationX: -100,
                            y: 40,
                            z: -40,
                            opacity: 0,
                            transformOrigin: '50% 50% -40px',
                            duration: 0.75,
                            stagger: 0.025,
                            ease: 'power4.out',
                            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
                        });
                    }
                });
            });

            $$('[data-lines]').forEach(el => {
                SplitText.create(el, {
                    type: 'lines',
                    autoSplit: true,
                    mask: 'lines',
                    onSplit: split => gsap.from(split.lines, {
                        yPercent: 110,
                        duration: 0.75,
                        stagger: 0.08,
                        ease: 'power4.out',
                        scrollTrigger: { trigger: el, start: 'top 87%', once: true }
                    })
                });
            });

            $$('[data-scatter]').forEach(el => {
                SplitText.create(el, {
                    type: 'words,chars',
                    autoSplit: true,
                    onSplit: split => gsap.from(split.chars, {
                        x: () => gsap.utils.random(-120, 120),
                        y: () => gsap.utils.random(-120, 120),
                        rotation: () => gsap.utils.random(-60, 60),
                        scale: () => gsap.utils.random(0.7, 1.3),
                        opacity: 0,
                        stagger: { each: 0.02, from: 'random' },
                        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: 0.5 }
                    })
                });
            });
        }

        // Bracket reveals
        $$('.bracket').forEach(el => {
            const brackets = el.querySelectorAll('span');
            gsap.from(brackets, {
                x: i => i === 0 ? 60 : -60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 87%', once: true }
            });
        });

        // Manifesto Paint Path — Exact dynamic length so no premature blue lines appear
        const path = $('.paint path');
        if (path) {
            const length = path.getTotalLength ? Math.ceil(path.getTotalLength()) : 7500;
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, strokeWidth: 0 });
            gsap.timeline({
                scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=90%', scrub: 0.6, pin: true, anticipatePin: 1 }
            })
            .to(path, { strokeDashoffset: 0, strokeWidth: 25, duration: 0.6, ease: 'none' }, 0)
            .to(path, { strokeWidth: 540, duration: 0.8, ease: 'none' }, 0.2);
        }

        // Services Horizontal Scroll (Desktop)
        mm.add('(min-width: 992px)', () => {
            const items = $$('.service');
            const rows = $$('.service-row');
            const visuals = $$('.service-visual');
            const imgs = $$('.service-image');

            gsap.set('.services', { height: '100vh' });
            const rowHeights = rows.map(r => r.offsetHeight || 65);
            const baseRowH = rowHeights[0] || 65;
            const vHeight = Math.max(260, innerHeight - baseRowH * 2);

            visuals.forEach(v => gsap.set(v, { height: vHeight }));
            imgs.forEach((im, i) => gsap.set(im, { width: i === 0 ? '71%' : '0%', left: '29%' }));

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.services',
                    start: 'top top',
                    end: () => '+=' + innerHeight * (items.length - 1),
                    pin: true,
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });

            items.slice(0, -1).forEach((item, i) => {
                tl.to(visuals[i], { height: 0, duration: 1, ease: 'none' }, i)
                  .to(imgs[i], { left: '100%', width: '0%', duration: 1, ease: 'none' }, i)
                  .to(imgs[i + 1], { left: '29%', width: '71%', duration: 1, ease: 'none' }, i)
                  .to('.services-list', { y: -rowHeights.slice(0, i + 1).reduce((sum, h) => sum + h, 0), duration: 1, ease: 'none' }, i);
            });

            return () => {
                gsap.set(['.services', '.services-list', ...visuals, ...imgs], { clearProps: 'height,width,left,transform' });
            };
        });

        // Contact Section Entrance
        gsap.from('.contact-content', {
            opacity: 0,
            yPercent: 20,
            scale: 0.96,
            scrollTrigger: { trigger: '.contact', start: 'top 65%', end: 'top 20%', scrub: 0.5 }
        });

        // Contact 3D Flying Words (Optimized to 18 words for zero-lag 60fps)
        const terms = ['CONTACT', 'LET’S TALK', 'HELLO', 'નમસ્તે', 'CONTACTO', 'BONJOUR', 'CIAO', 'नमस्ते', 'KONTAKT'];
        const field = $('.contact-words');
        if (field) {
            field.replaceChildren();
            const fly = gsap.timeline({
                scrollTrigger: { trigger: '.contact', start: 'top top', end: 'bottom bottom', scrub: 0.5 }
            });

            const count = 18;
            for (let i = 0; i < count; i++) {
                const word = document.createElement('span');
                word.className = 'contact-word';
                word.textContent = terms[i % terms.length];
                field.appendChild(word);

                const angle = (i / count) * Math.PI * 2;
                const x = Math.cos(angle) * 40;
                const y = Math.sin(angle) * 38;
                const at = (i / count) * 0.5;

                gsap.set(word, {
                    xPercent: -50,
                    yPercent: -50,
                    x: x * 0.14 + 'vw',
                    y: y * 0.14 + 'vh',
                    z: -1200,
                    scale: 0.3,
                    opacity: 0
                });

                fly.to(word, {
                    x: x + 'vw',
                    y: y + 'vh',
                    z: 0,
                    scale: 0.85 + (i % 3) * 0.15,
                    opacity: 0.6,
                    duration: 0.18,
                    ease: 'power1.inOut'
                }, at)
                .to(word, {
                    x: x * 1.15 + 'vw',
                    y: y * 1.15 + 'vh',
                    z: 900,
                    scale: 1.4,
                    opacity: 0,
                    duration: 0.18,
                    ease: 'power1.in'
                }, at + 0.18);
            }
        }

        // Footer Parallax
        mm.add('(min-width: 768px)', () => {
            gsap.from('footer', {
                yPercent: -60,
                ease: 'none',
                scrollTrigger: { trigger: '.footer-wrap', start: 'top bottom', end: 'top top', scrub: true }
            });
        });
    } else {
        heroSetup();
        const nameEl = $('.name');
        if (nameEl) {
            gsap.set('.name', { scale: Math.min(2.5, innerWidth * 0.45 / nameEl.offsetWidth), y: 70 });
        }
        if ($('.contact-words')) $('.contact-words').hidden = true;
    }

    // High-performance Header Theme Toggle (Zero reflow / Zero getBoundingClientRect)
    const activeDarkSections = new Set();
    const darkSections = ['.services', '.contact', '.footer-wrap'];

    darkSections.forEach(sel => {
        ScrollTrigger.create({
            trigger: sel,
            start: 'top 50px',
            end: 'bottom 50px',
            onEnter: () => {
                activeDarkSections.add(sel);
                $('.header').classList.add('light');
            },
            onLeave: () => {
                activeDarkSections.delete(sel);
                if (activeDarkSections.size === 0) $('.header').classList.remove('light');
            },
            onEnterBack: () => {
                activeDarkSections.add(sel);
                $('.header').classList.add('light');
            },
            onLeaveBack: () => {
                activeDarkSections.delete(sel);
                if (activeDarkSections.size === 0) $('.header').classList.remove('light');
            }
        });
    });

    // Debounced Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            renderOrbit(false);
            ScrollTrigger.refresh();
        }, 150);
    });

    ScrollTrigger.refresh();
}

const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
Promise.race([fontsReady, new Promise(r => setTimeout(r, 800))])
    .then(init)
    .catch(() => { const l = $('.loader'); if (l) l.style.display = 'none'; });

// Signature Service Paint Transition & Modal Controls
let isTransitioning = false;
const cachedPathLength = 3800;

function triggerServicePaintTransition({ tag = '[ service ]', title = "LET'S TALK [JV]", onPeak, onComplete }) {
    if (isTransitioning) return;
    isTransitioning = true;
    if (window.lenis) lenis.stop();

    const curtain = $('#contactCurtain');
    const paintPath = $('#contactCurtain .curtain-paint path');
    const curtainContent = $('#curtainContent');
    const tagEl = $('#curtainTag');
    const titleEl = $('#curtainTitle');

    if (!curtain || !paintPath || !window.gsap || reduced) {
        if (onPeak) onPeak();
        if (onComplete) onComplete();
        isTransitioning = false;
        return;
    }

    if (tagEl) tagEl.textContent = tag;
    if (titleEl) titleEl.textContent = title;

    gsap.set(curtain, { display: 'flex', opacity: 1 });
    gsap.set(paintPath, {
        strokeDasharray: cachedPathLength,
        strokeDashoffset: cachedPathLength,
        strokeWidth: 40
    });
    gsap.set(curtainContent, { opacity: 0, y: 18, scale: 0.96 });

    const tl = gsap.timeline({
        onComplete: () => {
            gsap.set(curtain, { display: 'none', opacity: 1 });
            isTransitioning = false;
            if (onComplete) onComplete();
        }
    });

    // 1. Fast, silky paint stroke sweep (0.45s)
    tl.to(paintPath, {
        strokeDashoffset: 0,
        strokeWidth: 540,
        duration: 0.46,
        ease: 'power2.inOut'
    }, 0)
    // 2. Animate tag & title in smoothly
    .to(curtainContent, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: 'power3.out'
    }, 0.18)
    // 3. Peak: screen is fully covered in blue -> reveal destination modal immediately
    .add(() => {
        if (onPeak) onPeak();
    }, 0.44)
    // 4. Brief hold
    .to(curtainContent, {
        opacity: 0,
        y: -14,
        duration: 0.18,
        ease: 'power2.in'
    }, '+=0.18')
    // 5. Fade out blue curtain seamlessly
    .to(curtain, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    }, '-=0.04');
}

function openContactModal() {
    const modal = $('#contactModal');
    if (!modal || isTransitioning) return;

    triggerServicePaintTransition({
        tag: '[ service ]',
        title: "LET'S TALK [JV]",
        onPeak: () => {
            document.body.classList.add('modal-open');
            modal.removeAttribute('hidden');
            gsap.killTweensOf(['.contact-modal-dialog', '.contact-modal-backdrop']);
            gsap.fromTo('.contact-modal-backdrop',
                { opacity: 0 },
                { opacity: 1, duration: 0.24, ease: 'power2.out' }
            );
            gsap.fromTo('.contact-modal-dialog',
                { scale: 0.95, opacity: 0, y: 12 },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.28,
                    ease: 'power3.out',
                    onComplete: () => {
                        const firstInput = $('#formName');
                        if (firstInput) firstInput.focus();
                    }
                }
            );
        }
    });
}

function closeContactModal() {
    const modal = $('#contactModal');
    if (!modal || modal.hasAttribute('hidden') || isTransitioning) return;

    if (window.gsap && !reduced) {
        gsap.killTweensOf(['.contact-modal-dialog', '.contact-modal-backdrop']);
        gsap.to('.contact-modal-dialog', {
            scale: 0.96,
            opacity: 0,
            y: 8,
            duration: 0.18,
            ease: 'power2.in'
        });
        gsap.to('.contact-modal-backdrop', {
            opacity: 0,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
                modal.setAttribute('hidden', '');
                document.body.classList.remove('modal-open');
                if (window.lenis) lenis.start();
                const status = $('#formStatus');
                if (status) status.textContent = '';
            }
        });
    } else {
        modal.setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        if (window.lenis) lenis.start();
    }
}

// Global click delegation for all "Let's talk", "Start a project", and contact buttons
document.addEventListener('click', (e) => {
    const btn = e.target.closest('a[href^="mailto:jasminvarvadiya@gmail.com"]');
    if (btn) {
        e.preventDefault();
        openContactModal();
    }
});

const modalCloseBtn = $('#modalClose');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeContactModal);

const modalBackdrop = $('#modalBackdrop');
if (modalBackdrop) modalBackdrop.addEventListener('click', closeContactModal);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContactModal();
});

// Prevent background website scrolling while modal is open
const modalContainer = $('#contactModal');
if (modalContainer) {
    modalContainer.addEventListener('wheel', (e) => {
        const dialog = modalContainer.querySelector('.contact-modal-dialog');
        if (!dialog || !dialog.contains(e.target)) {
            e.preventDefault();
            return;
        }
        const atTop = dialog.scrollTop <= 0 && e.deltaY < 0;
        const atBottom = dialog.scrollTop + dialog.clientHeight >= dialog.scrollHeight - 1 && e.deltaY > 0;
        if (atTop || atBottom) {
            e.preventDefault();
        }
    }, { passive: false });

    modalContainer.addEventListener('touchmove', (e) => {
        const dialog = modalContainer.querySelector('.contact-modal-dialog');
        if (!dialog || !dialog.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Form Submission with Signature Paint Transition
const contactForm = $('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = $('#submitBtn');
        if (submitBtn) submitBtn.disabled = true;

        triggerServicePaintTransition({
            tag: '[ service ]',
            title: 'THANK YOU! [JV]',
            onPeak: () => {
                const modal = $('#contactModal');
                if (modal) modal.setAttribute('hidden', '');
                document.body.classList.remove('modal-open');
                contactForm.reset();
                if (submitBtn) submitBtn.disabled = false;
            },
            onComplete: () => {
                if (window.lenis) lenis.start();
            }
        });
    });
}
