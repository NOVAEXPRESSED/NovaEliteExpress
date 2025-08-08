/* assets/app.js
   JS para Nova Elite:
   - movimiento estrella RGB grande con estela
   - partículas estelares aleatorias
   - flame effect al click
   - lightbox para imágenes
   - manejo simple de formularios (console / instructivo)
   - puntos de edición marcados con comentarios
*/

(() => {
  // ======= VARIABLES QUE PUEDES EDITAR =======
  // Cambia estos en el JS si quieres que la estrella sea mas grande/rapida
  const STAR_SIZE = 120;           // px
  const STAR_SPEED = 7000;         // ms para un ciclo completo
  const TRAIL_DENSITY = 18;        // cuantas partículas en la estela
  const TRAIL_FADE_MS = 1200;      // tiempo de vida de cada partícula

  // ======= CREAR STAR (GRANDE) =======
  const star = document.createElement('div');
  star.className = 'star-large';
  star.style.width = `${STAR_SIZE}px`;
  star.style.height = `${STAR_SIZE}px`;
  // star inner
  star.innerHTML = `
    <div class="star-core"></div>
  `;
  document.body.appendChild(star);

  // Función para animar color RGB hue cycling
  function hueRGB(t) {
    // retorna un color RGB animado (t entre 0 y 1)
    const a = Math.sin(2*Math.PI * t) * 0.5 + 0.5;
    const b = Math.sin(2*Math.PI * t + 2) * 0.5 + 0.5;
    const c = Math.sin(2*Math.PI * t + 4) * 0.5 + 0.5;
    const r = Math.round(80 + a * 175);
    const g = Math.round(40 + b * 190);
    const bl = Math.round(100 + c * 155);
    return `rgb(${r},${g},${bl})`;
  }

  // movimiento orbital random/curvado
  let start = performance.now();
  function animateStar(now){
    const t = ((now - start) % STAR_SPEED) / STAR_SPEED; // 0..1
    // trayectoria tipo Lissajous para ser más épica
    const A = window.innerWidth * 0.36;
    const B = window.innerHeight * 0.36;
    const x = window.innerWidth/2 + A * Math.sin(2*Math.PI* t * 1.2 + 0.5);
    const y = window.innerHeight/2 + B * Math.sin(2*Math.PI* t * 0.9);
    star.style.transform = `translate(${x - STAR_SIZE/2}px, ${y - STAR_SIZE/2}px) rotate(${t*720}deg)`;
    // color
    const color = hueRGB(t);
    star.style.boxShadow = `0 0 40px ${color}, 0 0 120px ${color}`;
    star.querySelector('.star-core').style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, ${color} 12%, transparent 40%)`;
    // crear trail
    createTrailParticle(x, y, color);
    requestAnimationFrame(animateStar);
  }
  // trail particles pool (para no crear demasiados elementos)
  function createTrailParticle(x,y,color){
    const p = document.createElement('div');
    p.className = 'star-trail';
    p.style.left = `${x + (Math.random()*40-20)}px`;
    p.style.top = `${y + (Math.random()*40-20)}px`;
    p.style.width = `${6 + Math.random()*12}px`;
    p.style.height = p.style.width;
    p.style.opacity = 0.9;
    p.style.background = color;
    p.style.boxShadow = `0 0 14px ${color}`;
    document.body.appendChild(p);
    setTimeout(()=> {
      p.style.transition = `opacity ${TRAIL_FADE_MS}ms linear, transform ${TRAIL_FADE_MS}ms`;
      p.style.opacity = 0;
      p.style.transform = `translateY(-30px) scale(0.2)`;
    }, 20);
    setTimeout(()=> p.remove(), TRAIL_FADE_MS + 80);
  }

  requestAnimationFrame(animateStar);

  // ======= FLAME ON CLICK =======
  document.addEventListener('click', (e) => {
    // ignora si el click fue en enlace que navega fuera
    if (e.target.tagName === 'A') return;
    const flame = document.createElement('div');
    flame.className = 'click-flame';
    flame.style.left = `${e.clientX - 12}px`;
    flame.style.top = `${e.clientY - 12}px`;
    document.body.appendChild(flame);
    setTimeout(()=> flame.remove(), 700);
  });

  // ======= LIGHTBOX SIMPLE =======
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `<img alt="imagen">`;
  document.body.appendChild(lightbox);
  lightbox.addEventListener('click', () => lightbox.style.display = 'none');

  // cuando hacen click en una imagen con data-light
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.matches && t.matches('[data-light="true"]')) {
      const src = t.getAttribute('src');
      lightbox.querySelector('img').src = src;
      lightbox.style.display = 'flex';
    }
  });

  // ======= NAV SMOOTH SCROLL para enlaces internos (si usas) =======
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });

  // ======= FORM SIMPLE (SI USAS FORMSPREE) =======
  // Si quieres enviar a Formspree, en los forms pon action="FORMSPREE_ACTION_URL" y method="POST"
  // Aquí solo evitamos que el formulario recargue la página si usas data-async="true"
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form && form.dataset && form.dataset.async === "true") {
      e.preventDefault();
      // ejemplo: recolectar datos y enviar por fetch - si no tienes un endpoint no lo envía
      const data = new FormData(form);
      const obj = {};
      for (const [k,v] of data.entries()) obj[k]=v;
      console.log('Formulario (simulado) enviado:', obj);
      // Si quieres que realmente llegue al correo, usa Formspree o EmailJS; cambia action a la URL que te dan.
      form.reset();
      // pequeña confirmación visual
      form.querySelectorAll('button').forEach(b => b.textContent = "Enviado ✓");
      setTimeout(()=> form.querySelectorAll('button').forEach(b => b.textContent = "Entrar"), 2000);
    }
  });

  // ======= UTILS: responsive adjustments =======
  window.addEventListener('resize', () => {
    // nada importante por ahora, placeholder
  });

})();
