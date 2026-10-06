const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const projects = [{ title: 'Ochi Inspired Animated Website', description: 'A premium animated website inspired by Ochi Design. Features smooth scroll, complex GSAP animations, and custom cursor.', url: 'https://ochi-clone-byjasmin.vercel.app' }, { title: 'Dynamic React Dashboard', description: 'A comprehensive analytics dashboard with CRUD operations, real-time data handling, and interactive charts.', url: 'https://react-dashboard-seven-sigma.vercel.app' }, { title: 'E-Commerce Fusion', description: 'A modern e-commerce platform with a focus on smooth transitions, cart functionality, and responsive design.', url: 'https://male-fashion-pi-five.vercel.app' }, { title: 'J.J Trader Website', description: 'An exploration of minimalist design and simple animations, brought together in a responsive website.', url: 'https://j-j-trader.vercel.app' }];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; let active = 0, turn = 0, animating = false, lenis;
function renderOrbit(animate = true) { const cards = $$('.orbit-card'); const stage = $('.orbit-stage'); const stageWidth = stage ? stage.clientWidth : innerWidth; cards.forEach((card, index) => { let relative = (index - active + 4) % 4; if (relative > 2) relative -= 4; const isActive = relative === 0; card.style.zIndex = String(10 - Math.abs(relative)); card.inert = !isActive; card.setAttribute('aria-hidden', String(!isActive)); const params = { xPercent: -50, yPercent: -50, x: relative === 0 ? 0 : relative * stageWidth * .36, y: relative === 0 ? 0 : Math.abs(relative) * -80, rotation: relative * 14, rotationY: relative * -13, scale: isActive ? 1 : .7, opacity: isActive ? 1 : relative === 2 ? 0 : .52, filter: isActive ? 'blur(0px)' : 'blur(2px)', duration: animate && !reduced ? .95 : 0, ease: 'power3.inOut' }; if (window.gsap) gsap.to(card, params); else { card.style.opacity = isActive ? 1 : 0; card.style.transform = 'translate(-50%,-50%)' } }); $$('[data-project]').forEach((b, i) => b.setAttribute('aria-pressed', String(i === active))) }
function selectProject(index) { if (animating) return; const next = (index + projects.length) % projects.length; if (next === active) return; active = next; const update = () => { const p = projects[active]; $('#current').textContent = String(active + 1).padStart(2, '0'); $('#projectTitle').textContent = p.title; $('#projectDescription').textContent = p.description; $('#projectLink').href = p.url }; renderOrbit(); if (window.gsap && !reduced) { animating = true; gsap.to('.project-copy', { opacity: 0, y: -18, duration: .22, onComplete: () => { update(); gsap.fromTo('.project-copy', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', onComplete: () => animating = false }) } }) } else update() }
const prevBtn = $('#previous'); if (prevBtn) prevBtn.addEventListener('click', () => selectProject(active - 1));
const nextBtn = $('#next'); if (nextBtn) nextBtn.addEventListener('click', () => selectProject(active + 1));
$$('[data-project]').forEach(b => b.addEventListener('click', () => selectProject(Number(b.dataset.project))));
let startX = null;
const stageEl = $('.orbit-stage');
if (stageEl) {
    stageEl.addEventListener('pointerdown', e => startX = e.clientX);
    stageEl.addEventListener('pointerup', e => { if (startX !== null && Math.abs(e.clientX - startX) > 50) { selectProject(active + (e.clientX < startX ? 1 : -1)); e.preventDefault() } startX = null });
}
const orbitEl = $('.orbit');
if (orbitEl) {
    orbitEl.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); selectProject(active + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); selectProject(active - 1) } });
}
function init() {
    renderOrbit(false); if (!window.gsap || !window.ScrollTrigger) return; gsap.registerPlugin(ScrollTrigger); if (window.SplitText) gsap.registerPlugin(SplitText); const mm = gsap.matchMedia();
    if (!reduced && window.Lenis) {
        document.documentElement.style.scrollBehavior = 'auto';
        lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.3 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
        $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href && href.length > 1) {
                const target = $(href);
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { duration: 1.2, offset: 0, onComplete: () => { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } });
                }
            }
        }));
    }
    function heroSetup() { const name = $('.name'); const base = innerWidth < 768 ? 18 : 26; gsap.set(name, { fontSize: base, clearProps: 'transform' }); const scale = innerWidth * .84 / name.offsetWidth; return scale; }
    if (!reduced) {
        gsap.set('.loader', { display: 'flex' });
        gsap.timeline({
            onComplete: () => {
                gsap.set('.loader', { display: 'none' });
                ScrollTrigger.refresh();
            }
        }).from('.loader span', { opacity: 0, y: 22, duration: .45 }).to('.loader span', { opacity: 0, y: -20, duration: .4 }, '+=.12').to('.loader', { clipPath: 'inset(0% 0% 100% 0%)', duration: .85, ease: 'power3.inOut' }, '<0.1');
        mm.add('(min-width: 1px)', () => {
            const scale = heroSetup();
            const travel = innerWidth < 768 ? 80 : 80;
            gsap.fromTo('.name', { scale, y: travel }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } });
            gsap.to('.portrait', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
            return () => { };
        });
        if (window.SplitText) {
            $$('[data-roll]').forEach(el => SplitText.create(el, { type: 'chars,lines', autoSplit: true, mask: 'lines', onSplit: split => { gsap.set(split.lines, { perspective: 600 }); return gsap.from(split.chars, { rotationX: -110, y: 45, z: -45, opacity: 0, transformOrigin: '50% 50% -45px', duration: .8, stagger: .03, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }); } }));
            $$('[data-lines]').forEach(el => SplitText.create(el, { type: 'lines', autoSplit: true, mask: 'lines', onSplit: split => gsap.from(split.lines, { yPercent: 115, duration: .8, stagger: .1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 87%', once: true } }) }));
            $$('[data-scatter]').forEach(el => SplitText.create(el, { type: 'chars', onSplit: split => gsap.from(split.chars, { x: () => gsap.utils.random(-160, 160), y: () => gsap.utils.random(-160, 160), rotation: () => gsap.utils.random(-90, 90), scale: () => gsap.utils.random(.5, 1.4), opacity: .1, stagger: { each: .025, from: 'random' }, scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: 0.5 } }) }));
        }
        $$('.bracket').forEach(el => { const brackets = el.querySelectorAll('span'); gsap.from(brackets, { x: i => i === 0 ? 70 : -70, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 87%', once: true } }); });
        const path = $('.paint path'), length = path ? path.getTotalLength() : 0;
        if (path) {
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, strokeWidth: 20 });
            gsap.timeline({ scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=90%', scrub: 0.6, pin: true, anticipatePin: 1 } }).to(path, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0).to(path, { strokeWidth: 420, duration: .8, ease: 'none' }, .2);
        }
        mm.add('(min-width: 992px)', () => {
            const items = $$('.service'), rows = $$('.service-row'), visuals = $$('.service-visual'), imgs = $$('.service-image');
            gsap.set('.services', { height: '100vh' });
            const rowHeights = rows.map(r => r.offsetHeight || 65);
            const baseRowH = rowHeights[0] || 65;
            const vHeight = Math.max(260, innerHeight - baseRowH * 2);
            visuals.forEach((v) => gsap.set(v, { height: vHeight }));
            imgs.forEach((im, i) => gsap.set(im, { width: i === 0 ? '71%' : '0%', left: '29%' }));
            const tl = gsap.timeline({ scrollTrigger: { trigger: '.services', start: 'top top', end: () => '+=' + innerHeight * (items.length - 1), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
            items.slice(0, -1).forEach((item, i) => {
                tl.to(visuals[i], { height: 0, duration: 1, ease: 'none' }, i)
                    .to(imgs[i], { left: '100%', width: '0%', duration: 1, ease: 'none' }, i)
                    .to(imgs[i + 1], { left: '29%', width: '71%', duration: 1, ease: 'none' }, i)
                    .to('.services-list', { y: -rowHeights.slice(0, i + 1).reduce((sum, h) => sum + h, 0), duration: 1, ease: 'none' }, i);
            });
            return () => { gsap.set(['.services', '.services-list', ...visuals, ...imgs], { clearProps: 'height,width,left,transform' }); };
        });
        mm.add('(max-width: 991px)', () => { $$('.service-image img').forEach(im => gsap.from(im, { scale: 1.13, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } })); });
        gsap.from('.contact-content', { opacity: 0, yPercent: 25, scale: .96, scrollTrigger: { trigger: '.contact', start: 'top 65%', end: 'top 20%', scrub: 0.5 } });
        const terms = ['CONTACT', 'LET’S TALK', 'HELLO', 'નમસ્તે', 'CONTACTO', 'BONJOUR', 'CIAO', 'नमस्ते', 'KONTAKT'];
        const field = $('.contact-words');
        if (field) {
            field.replaceChildren();
            const fly = gsap.timeline({ scrollTrigger: { trigger: '.contact', start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
            for (let i = 0; i < 48; i++) {
                const word = document.createElement('span');
                word.className = 'contact-word';
                word.textContent = terms[i % terms.length];
                field.appendChild(word);
                const angle = (i % 16) / 16 * Math.PI * 2, x = Math.cos(angle) * 42, y = Math.sin(angle) * 40, at = (i % 16) * .027 + Math.floor(i / 16) * .19;
                gsap.set(word, { xPercent: -50, yPercent: -50, x: x * .14 + 'vw', y: y * .14 + 'vh', z: -1400, scale: .3, opacity: 0 });
                fly.to(word, { x: x + 'vw', y: y + 'vh', z: 0, scale: .8 + (i % 3) * .2, opacity: .65, duration: .17, ease: 'power1.inOut' }, at)
                    .to(word, { x: x * 1.16 + 'vw', y: y * 1.16 + 'vh', z: 1000, scale: 1.5, opacity: 0, duration: .17, ease: 'power1.in' }, at + .17);
            }
        }
        mm.add('(min-width: 768px)', () => gsap.from('footer', { yPercent: -70, ease: 'none', scrollTrigger: { trigger: '.footer-wrap', start: 'top bottom', end: 'top top', scrub: true } }));
    } else {
        heroSetup();
        gsap.set('.name', { scale: Math.min(2.5, innerWidth * .45 / $('.name').offsetWidth), y: 70 });
        if ($('.contact-words')) $('.contact-words').hidden = true;
    }
    ['.services', '.contact', '.footer-wrap'].forEach(sel => ScrollTrigger.create({ trigger: sel, start: 'top 45px', end: 'bottom 45px', onToggle: () => { $('.header').classList.toggle('light', ['.services', '.contact', '.footer-wrap'].some(s => { const r = $(s).getBoundingClientRect(); return r.top < 45 && r.bottom > 45; })); } }));
    let lastWidth = innerWidth;
    window.addEventListener('resize', () => { if (innerWidth !== lastWidth) { lastWidth = innerWidth; clearTimeout(window._orbitResizeTimer); window._orbitResizeTimer = setTimeout(() => { renderOrbit(false); ScrollTrigger.refresh(); }, 120); } });
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    ScrollTrigger.refresh();
}
const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
Promise.race([fontsReady, new Promise(r => setTimeout(r, 1200))]).then(init).catch(() => { const l = $('.loader'); if (l) l.style.display = 'none'; });

// Signature Service Paint Transition & Modal Controls
let isTransitioning = false;

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

    const pathLength = paintPath.getTotalLength ? paintPath.getTotalLength() : 3800;

    gsap.set(curtain, { display: 'flex', opacity: 1 });
    gsap.set(paintPath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        strokeWidth: 40
    });
    gsap.set(curtainContent, { opacity: 0, y: 22, scale: 0.96 });

    const tl = gsap.timeline({
        onComplete: () => {
            gsap.set(curtain, { display: 'none', opacity: 1 });
            isTransitioning = false;
            if (onComplete) onComplete();
        }
    });

    // 1. Blue paint stroke sweeps across the screen smoothly
    tl.to(paintPath, {
        strokeDashoffset: 0,
        strokeWidth: 540,
        duration: 0.52,
        ease: 'power2.inOut'
    }, 0)
    // 2. Animate the tag & title in
    .to(curtainContent, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: 'power3.out'
    }, 0.2)
    // 3. Peak: full coverage reached -> trigger midpoint actions (open modal / reset form)
    .add(() => {
        if (onPeak) onPeak();
    }, 0.5)
    // 4. Brief pleasant hold to let user read
    .to(curtainContent, {
        opacity: 0,
        y: -18,
        duration: 0.22,
        ease: 'power2.in'
    }, '+=0.22')
    // 5. Fade out the blue curtain smoothly
    .to(curtain, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out'
    }, '-=0.05');
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
                { opacity: 1, duration: 0.25, ease: 'power2.out' }
            );
            gsap.fromTo('.contact-modal-dialog',
                { scale: 0.95, opacity: 0, y: 15 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.3, 
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
            y: 10,
            duration: 0.2,
            ease: 'power2.in'
        });
        gsap.to('.contact-modal-backdrop', {
            opacity: 0,
            duration: 0.2,
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

// Bind all "Let's talk", "Start a project", and contact trigger buttons across the site
$$('a[href^="mailto:jasminvarvadiya@gmail.com"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal();
    });
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

// Handle form submit: run signature paint transition on submit
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
