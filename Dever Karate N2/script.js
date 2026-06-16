const bar = document.getElementById('progress');

/* =========================
   SCROLL PROGRESS
========================= */
window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';

    updateNav();
});

/* =========================
   REVEAL ANIMATION
========================= */
const reveals = document.querySelectorAll('.reveal');

const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => obs.observe(el));

/* =========================
   NAV ACTIVE SCROLL (FIXADO)
   (evita crash se não existir nav-btn)
========================= */

const secoes = [
    'sec-origem',
    'sec-dia',
    'sec-olimpiadas',
    'sec-timeline',
    'sec-kid',
    'sec-legado'
];

const navBtns = document.querySelectorAll('.nav-btn');

function updateNav() {
    if (!navBtns.length) return;

    let atual = secoes[0];

    secoes.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
            atual = id;
        }
    });

    navBtns.forEach(btn => {
        const href = btn.getAttribute('href')?.replace('#', '');
        btn.classList.toggle('ativo', href === atual);
    });
}

updateNav();

/* =========================
   ANIMAÇÃO DE CONTADORES
========================= */

function animCount(el, target, prefix = '', suffix = '') {
    let start = null;
    const dur = 1600;

    const step = ts => {
        if (!start) start = ts;

        const prog = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);

        const val = Math.floor(ease * target);

        el.textContent = prefix + val.toLocaleString('pt-BR') + suffix;

        if (prog < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
        }
    };

    requestAnimationFrame(step);
}

/* =========================
   OBSERVADOR DOS CARDS
========================= */

const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {

            e.target.querySelectorAll('.stat-numero[data-val]').forEach(n => {
                const val = parseInt(n.dataset.val);

                const txt = n.textContent.trim();

                if (txt.includes('M')) {
                    animCount(n, val / 1000000, '', '+M');
                } 
                else if (txt.includes('+')) {
                    animCount(n, val, '', '+');
                } 
                else {
                    animCount(n, val);
                }
            });

            countObs.unobserve(e.target);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-grid').forEach(g => countObs.observe(g));