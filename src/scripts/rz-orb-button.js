/* RAIZ orb button — animated blurred-orb CTA (adapted from Uiverse.io by Ashon-G) in RAIZ brand colours.
   <rz-orb-button href="/contact/" height="52" full>Book a Call</rz-orb-button> */
(() => {
  if (customElements.get('rz-orb-button')) return;
  const CSS = `
  :host { display: inline-block; vertical-align: middle; }
  :host([full]) { display: block; width: 100%; }
  a {
    --duration: 7s;
    --c-1: rgba(155, 91, 165, 0.75);    /* purple */
    --c-2: #D4A54A;                     /* gold */
    --c-3: #9B5BA5;                     /* purple */
    --c-4: rgba(212, 165, 74, 0.75);    /* gold */
    position: relative; display: flex; align-items: center; justify-content: center; box-sizing: border-box;
    width: 100%; height: var(--h, 52px); padding: 0 var(--px, 32px); border-radius: 24px;
    font-family: var(--rz-font-body, Inter, system-ui, sans-serif); font-size: 15px; font-weight: 600; letter-spacing: 0.02em;
    color: #0F0F12; text-decoration: none; white-space: nowrap; cursor: pointer; -webkit-tap-highlight-color: transparent;
    background: radial-gradient(circle, #D4A54A, #E5BD6A 80%);
    box-shadow: 0 0 14px rgba(212, 165, 74, 0.45);
    transition: box-shadow 220ms ease, transform 220ms ease;
  }
  a:hover { --duration: 2800ms; box-shadow: 0 0 20px rgba(155, 91, 165, 0.45); transform: translateY(-1px); }
  a:focus-visible { outline: 2px solid #9B5BA5; outline-offset: 3px; }
  a::before {
    content: ""; position: absolute; inset: 0; z-index: 3; pointer-events: none; border-radius: inherit;
    box-shadow: inset 0 3px 12px rgba(229, 189, 106, 0.9), inset 0 -3px 4px rgba(250, 250, 250, 0.7);
  }
  .clip { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; -webkit-mask-image: -webkit-radial-gradient(white, black); }
  .field { position: absolute; left: 0; top: 0; width: 132px; height: 48px; transform-origin: 0 0; }
  .label { position: relative; z-index: 1; }
  .c { position: absolute; left: 0; top: 0; width: 40px; height: 40px; border-radius: 50%;
    filter: blur(var(--blur, 8px)); background: var(--bg, transparent);
    transform: translate(var(--x, 0), var(--y, 0)) translateZ(0);
    animation: var(--anim, none) var(--duration) linear infinite; }
  .c1, .c9, .c10 { --bg: var(--c-4); }
  .c3, .c4 { --bg: var(--c-2); --blur: 14px; }
  .c5, .c6 { --bg: var(--c-3); --blur: 16px; }
  .c2, .c7, .c8, .c11, .c12 { --bg: var(--c-1); --blur: 12px; }
  .c1 { --x: 0; --y: -40px; --anim: rz-c1; }  .c2 { --x: 92px; --y: 8px; --anim: rz-c2; }
  .c3 { --x: -12px; --y: -12px; --anim: rz-c3; } .c4 { --x: 80px; --y: -12px; --anim: rz-c4; }
  .c5 { --x: 12px; --y: -4px; --anim: rz-c5; }  .c6 { --x: 56px; --y: 16px; --anim: rz-c6; }
  .c7 { --x: 8px; --y: 28px; --anim: rz-c7; }   .c8 { --x: 28px; --y: -4px; --anim: rz-c8; }
  .c9 { --x: 20px; --y: -12px; --anim: rz-c9; } .c10 { --x: 64px; --y: 16px; --anim: rz-c10; }
  .c11 { --x: 4px; --y: 4px; --anim: rz-c11; }  .c12 { --blur: 14px; --x: 52px; --y: 4px; --anim: rz-c12; }
  @keyframes rz-c1 { 33% { transform: translate(0px, 16px) translateZ(0); } 66% { transform: translate(12px, 64px) translateZ(0); } }
  @keyframes rz-c2 { 33% { transform: translate(80px, -10px) translateZ(0); } 66% { transform: translate(72px, -48px) translateZ(0); } }
  @keyframes rz-c3 { 33% { transform: translate(20px, 12px) translateZ(0); } 66% { transform: translate(12px, 4px) translateZ(0); } }
  @keyframes rz-c4 { 33% { transform: translate(76px, -12px) translateZ(0); } 66% { transform: translate(112px, -8px) translateZ(0); } }
  @keyframes rz-c5 { 33% { transform: translate(84px, 28px) translateZ(0); } 66% { transform: translate(40px, -32px) translateZ(0); } }
  @keyframes rz-c6 { 33% { transform: translate(28px, -16px) translateZ(0); } 66% { transform: translate(76px, -56px) translateZ(0); } }
  @keyframes rz-c7 { 33% { transform: translate(8px, 28px) translateZ(0); } 66% { transform: translate(20px, -60px) translateZ(0); } }
  @keyframes rz-c8 { 33% { transform: translate(32px, -4px) translateZ(0); } 66% { transform: translate(56px, -20px) translateZ(0); } }
  @keyframes rz-c9 { 33% { transform: translate(20px, -12px) translateZ(0); } 66% { transform: translate(80px, -8px) translateZ(0); } }
  @keyframes rz-c10 { 33% { transform: translate(68px, 20px) translateZ(0); } 66% { transform: translate(100px, 28px) translateZ(0); } }
  @keyframes rz-c11 { 33% { transform: translate(4px, 4px) translateZ(0); } 66% { transform: translate(68px, 20px) translateZ(0); } }
  @keyframes rz-c12 { 33% { transform: translate(56px, 0px) translateZ(0); } 66% { transform: translate(60px, -32px) translateZ(0); } }
  @media (prefers-reduced-motion: reduce) { .c { animation: none; } }`;

  class RzOrbButton extends HTMLElement {
    static get observedAttributes() { return ['href', 'height', 'padding']; }
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      const circles = Array.from({ length: 12 }, (_, i) => `<div class="c c${12 - i}"></div>`).join('');
      root.innerHTML = `<style>${CSS}</style><a part="button"><div class="clip"><div class="field">${circles}</div></div><span class="label"><slot></slot></span></a>`;
      this._a = root.querySelector('a');
      this._field = root.querySelector('.field');
      this._label = root.querySelector('.label');
      this._ro = new ResizeObserver(() => this._fit());
      new ResizeObserver(() => this._widen()).observe(this._label);
      // <rz-orb-button submit> acts as the submit button of its enclosing <form>.
      const submit = (e) => {
        if (!this.hasAttribute('submit')) return;
        e.preventDefault();
        this.closest('form')?.requestSubmit();
      };
      this._a.addEventListener('click', submit);
      this._a.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') submit(e); });
    }
    connectedCallback() { this._sync(); this._ro.observe(this._a); }
    disconnectedCallback() { this._ro.disconnect(); }
    attributeChangedCallback() { this._sync(); }
    _sync() {
      const href = this.getAttribute('href');
      if (href) this._a.setAttribute('href', href); else this._a.removeAttribute('href');
      this._a.setAttribute('role', 'button');
      if (this.hasAttribute('submit')) this._a.setAttribute('tabindex', '0'); // focusable without an href
      this._a.style.setProperty('--h', (this.getAttribute('height') || 52) + 'px');
      this._widen();
    }
    _widen() {
      // 15% wider than the natural label + padding width
      const px = +(this.getAttribute('padding') || 32);
      const lw = this._label ? this._label.getBoundingClientRect().width : 0;
      this._a.style.setProperty('--px', (px + (lw + px * 2) * 0.075) + 'px');
    }
    _fit() {
      const r = this._a.getBoundingClientRect();
      if (!r.width) return;
      this._field.style.transform = `scale(${r.width / 132}, ${r.height / 48})`;
    }
  }
  customElements.define('rz-orb-button', RzOrbButton);
})();
