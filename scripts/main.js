// Config rápida editable
const CONFIG = {
  nombre: 'Miguel Miranda', // Cambia este valor para el hero y el footer
  roles: [
    'Desarrollador Web',
    'Diseñador UI/UX',
    'Diseñador Gráfico',
    'Freelancer',
  ],
  email: 'miguelmipo04@gmail.com',
  linkedin: 'https://www.linkedin.com/in/miguel-miranda-60a750388',
  github: 'https://github.com/miguelmirandap',
  twitter: 'https://x.com/iammigue_0',
};

// Escribe el año en el footer y enlaces de contacto
(function initBasics(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const footEl = document.getElementById('footerName');
  if (footEl) footEl.textContent = CONFIG.nombre;
  // Enlaces antiguos (pueden no existir): hacerlos opcionales
  const emailA = document.getElementById('emailLink');
  if (emailA) { emailA.textContent = CONFIG.email; emailA.href = `mailto:${CONFIG.email}`; }
  const liA = document.getElementById('linkedinLink');
  if (liA) liA.href = CONFIG.linkedin;
  const ghA = document.getElementById('githubLink');
  if (ghA) { ghA.href = CONFIG.github; ghA.textContent = '@' + (CONFIG.github.split('/').pop() || 'usuario'); }
})();

// Toggle de tema claro/oscuro con persistencia
(function themeToggle(){
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);
  const btn = document.getElementById('themeToggle');
  if (!btn) return; // si no existe el botón, salir sin romper
  const updateLabel = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    btn.innerHTML = `<span class="label">${isLight ? 'Oscuro' : 'Claro'}</span> <span class="icon" aria-hidden="true">${isLight ? '🌙' : '☀️'}</span>`;
  };
  updateLabel();
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
    // Reemplazar icono con animación spin tipo planeta
    updateLabel();
    const icon = btn.querySelector('.icon');
    if (icon) {
      icon.classList.remove('spin');
      // Forzar reflow para reiniciar animación si se hace clic rápido
      void icon.offsetWidth;
      icon.classList.add('spin');
      // Quitar clase al terminar para poder reactivarla luego
      setTimeout(() => icon.classList.remove('spin'), 800);
    }
  });
})();

// Menú responsive
(function navMenu(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click',()=>{
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();

// Scroll suave personalizado para anchors (recorrer y frenar en la sección)
(function smoothAnchors(){
  const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) || 80;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const duration = 700; // ms

  function smoothScrollTo(targetY){
    const startY = window.scrollY;
    const dist = targetY - startY;
    const startTime = performance.now();
    function step(now){
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(t);
      window.scrollTo(0, startY + dist * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function handleClick(e){
    const a = e.currentTarget;
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const targetY = Math.max(0, rect.top + window.scrollY - headerOffset);
    smoothScrollTo(targetY);
    // Actualizar hash sin salto brusco
    history.pushState(null, '', `#${id}`);
  }

  // Enlaces del nav y CTAs del hero
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', handleClick);
  });
})();

// Efecto typing único en la misma línea (nombre + roles) en bucle infinito
(function typingLoop(){
  const el = document.getElementById('typedName');
  const cursor = document.getElementById('nameCursor');
  const items = [CONFIG.nombre, ...(CONFIG.roles || [])];
  const palette = [
    'var(--brand)',
    'var(--accent)',
    'var(--brand-2)',
    'var(--brand)',
  ];
  if (!items.length) return;

  const typeSpeed = 85;   // ms por carácter (escritura)
  const eraseSpeed = 45;  // ms por carácter (borrado)
  const holdTime = 1500;  // pausa al terminar palabra (antes 1200)
  const gapTime = 320;    // pausa mínima antes de reescribir (antes 250)

  let index = 0;   // índice de palabra
  let i = 0;       // índice de carácter
  let erasing = false;

  function step(){
    const text = items[index % items.length];
    if (!erasing) {
      // escribiendo
      el.textContent = text.slice(0, i);
      i++;
      if (i > text.length) {
        // efecto glow breve
        const color = palette[index % palette.length];
        document.documentElement.style.setProperty('--glow-color', color);
  el.classList.add('glow-on');
  setTimeout(() => { el.classList.remove('glow-on'); }, 900);
        setTimeout(() => { erasing = true; step(); }, holdTime);
        return;
      }
      setTimeout(step, typeSpeed);
    } else {
      // borrando
      i--;
      el.textContent = text.slice(0, Math.max(i, 0));
      if (i <= 0) {
        erasing = false;
        index = (index + 1) % items.length;
        setTimeout(step, gapTime);
        return;
      }
      setTimeout(step, eraseSpeed);
    }
  }
  // mantener cursor visible siempre en modo loop
  cursor.style.opacity = '1';
  step();
})();

// Indicador de progreso de scroll (simple)
(function scrollProgress(){
  const ring = document.querySelector('.ring');
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? scrollTop / docHeight : 0;
    ring.style.transform = `scale(${0.8 + p * 0.6})`;
    ring.style.opacity = String(0.6 + p * 0.4);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Animación de barras de habilidades al entrar/salir del viewport
(function skillBars(){
  const fills = Array.from(document.querySelectorAll('.skill-bar-fill'));
  if (!fills.length || !('IntersectionObserver' in window)) return;

  const apply = (el, percent) => {
    el.style.width = `${percent}%`;
    el.parentElement?.setAttribute('aria-valuenow', String(percent));
  };
  const reset = (el) => {
    el.style.width = '0%';
    el.parentElement?.setAttribute('aria-valuenow', '0');
  };

  // Arrancamos en 0
  fills.forEach(reset);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target.querySelector('.skill-bar-fill');
      if (!el) return;
      const percent = Number(el.getAttribute('data-percent')) || 0;
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        // anima a target
        requestAnimationFrame(() => apply(el, percent));
      } else {
        // resetea al salir para que se vuelva a animar
        requestAnimationFrame(() => reset(el));
      }
    });
  }, { threshold: [0, 0.3, 1] });

  document.querySelectorAll('.skill-item .skill-bar').forEach(bar => observer.observe(bar));
})();

// Contacto: preparar links y envío por mailto
(function contactInit(){
  const email = CONFIG.email || 'tu@email.com';
  const gh = CONFIG.github || '#';
  const li = CONFIG.linkedin || '#';
  // Preferir número escrito en el HTML; si no existe, usar CONFIG.whatsapp
  const whatsNumberEl = document.getElementById('whatsNumber');
  const whatsLinkEl = document.getElementById('whatsLink');
  let wa = (CONFIG.whatsapp || '').trim();
  if ((!wa || wa.length < 6) && whatsNumberEl) {
    const existing = (whatsNumberEl.textContent || '').trim();
    if (existing) wa = existing;
  }

  // Panel CTAs
  const gmailComposeUrl = (to, subject = '', body = '') =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const emailCTA = document.getElementById('emailCTA');
  if (emailCTA) {
    // CTA de email: abrir Gmail compose con asunto genérico
    emailCTA.href = gmailComposeUrl(email, 'Contacto desde el portafolio', 'Hola Miguel, ');
    emailCTA.setAttribute('target', '_blank');
    emailCTA.setAttribute('rel', 'noopener');
  }
  const githubCTA = document.getElementById('githubCTA');
  if (githubCTA) githubCTA.href = gh;
  const linkedinCTA = document.getElementById('linkedinCTA');
  if (linkedinCTA) linkedinCTA.href = li;
  const twitterCTA = document.getElementById('twitterCTA');
  if (twitterCTA) twitterCTA.href = CONFIG.twitter || '#';
  // Actualizar visual y enlace de WhatsApp sin sobrescribir si no hay dato
  if (whatsNumberEl && wa) {
    whatsNumberEl.textContent = wa;
  }
  if (whatsLinkEl) {
    if (wa) {
      const digits = wa.replace(/\D/g,'');
      whatsLinkEl.href = digits ? `https://wa.me/${digits}` : '#';
      if (digits) whatsLinkEl.setAttribute('aria-label', `Contactar por WhatsApp ${wa}`);
    } else {
      whatsLinkEl.href = '#';
    }
  }

  // Formulario -> mailto
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('inputName')?.value || '').trim();
    const from = (document.getElementById('inputEmail')?.value || '').trim();
    const message = (document.getElementById('inputMessage')?.value || '').trim();
    const subject = encodeURIComponent(`Contacto desde el portafolio — ${name || 'Sin nombre'}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${from}\n\nMensaje:\n${message}`);
    // Abrir Gmail compose en nueva pestaña
    const url = gmailComposeUrl(email, decodeURIComponent(subject), decodeURIComponent(body));
    window.open(url, '_blank', 'noopener');
  });
})();

// Reveal on scroll para elementos con .reveal
(function revealOnScroll(){
  if (!('IntersectionObserver' in window)) return;
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
})();

// Footer: inyectar enlaces y comportamientos
(function footerInit(){
  const gh = CONFIG.github || '#';
  const li = CONFIG.linkedin || '#';
  const tw = CONFIG.twitter || '#';
  const email = CONFIG.email || '';
  const gmailComposeUrl = (to, subject = '', body = '') =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const ghA = document.getElementById('footerGithub');
  if (ghA) ghA.href = gh;
  const liA = document.getElementById('footerLinkedin');
  if (liA) liA.href = li;
  const twA = document.getElementById('footerTwitter');
  if (twA) twA.href = tw;
  const emA = document.getElementById('footerEmail');
  if (emA && email) {
    emA.href = gmailComposeUrl(email, 'Contacto desde el portafolio', 'Hola Miguel, ');
    emA.setAttribute('target', '_blank');
    emA.setAttribute('rel', 'noopener');
  }
})();

// Cursor personalizado (triángulo + punto)
(function customCursor(){
  if (!matchMedia('(pointer: fine)').matches) return;
  const tri = document.querySelector('.cursor-m');
  const dot = document.querySelector('.cursor-dot');
  if (!tri || !dot) return;
  let lastX = 0, lastY = 0, lastT = 0;
  const root = document.documentElement;
  function setPos(x, y){
    root.style.setProperty('--x', `${y}px`); // corregir luego si eje invertido
    root.style.setProperty('--y', `${x}px`);
  }
  function onMove(e){
    const x = e.clientX, y = e.clientY;
    const dx = x - lastX, dy = y - lastY;
    const angle = Math.atan2(dy, dx) * (180/Math.PI) + 90; // triángulo apuntando hacia la dirección
    root.style.setProperty('--x', `${x - 12}px`); // centrar SVG de 24px
    root.style.setProperty('--y', `${y - 12}px`);
    root.style.setProperty('--rot', `${angle}deg`);
    document.body.classList.add('cursor-active');
    lastX = x; lastY = y; lastT = performance.now();
  }
  window.addEventListener('mousemove', onMove);
  // Aumentar al pasar por elementos interactivos
  function setHovered(on){
    tri.style.transition = on ? 'transform .08s ease' : 'transform .12s ease';
    tri.style.transform += on ? ' scale(1.2)' : '';
  }
  ['a','button','.btn','.tile','.nav-toggle'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  });
})();
