"use strict";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const navToggle = $(".nav-toggle");
const nav = $(".nav");
const header = $(".site-header");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    nav.style.display = open ? "flex" : "none";
  });
}

function easeInOut(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function smoothScrollTo(targetY, duration=500){
  const startY = window.scrollY;
  const offset = (header?.offsetHeight || 0) + 8;
  const distance = targetY - offset - startY;
  let start;
  function step(ts){
    if(!start) start = ts;
    const p = Math.min((ts-start)/duration,1);
    const eased = easeInOut(p);
    window.scrollTo(0, startY + distance*eased);
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(y,500);
  });
});

$$('.buy-btn').forEach(btn=>{
  const panel = btn.nextElementSibling;
  btn.addEventListener('click',(e)=>{
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    
    // Close all other panels first
    $$('.buy-panel').forEach(p=> p.hidden = true);
    $$('.buy-btn, .shop-toggle').forEach(b=> b.setAttribute('aria-expanded','false'));
    
    // Toggle current
    btn.setAttribute('aria-expanded', String(!expanded));
    if(panel) panel.hidden = expanded;
  });
});

const shopToggle = $('.shop-toggle');
if(shopToggle){
  const panel = shopToggle.nextElementSibling;
  shopToggle.addEventListener('click', ()=>{
    const expanded = shopToggle.getAttribute('aria-expanded') === 'true';
    
    // Close all other panels first
    $$('.buy-panel').forEach(p=> p.hidden = true);
    $$('.buy-btn, .shop-toggle').forEach(b=> b.setAttribute('aria-expanded','false'));
    
    // Toggle current
    shopToggle.setAttribute('aria-expanded', String(!expanded));
    if(panel) panel.hidden = expanded;
  });
}

document.addEventListener('click',e=>{
  const t = e.target;
  if(!(t instanceof Element)) return;
  if(t.closest('.buy-btn') || t.closest('.shop-toggle') || t.closest('.buy-panel')) return;
  $$('.buy-panel').forEach(p=> p.hidden = true);
  $$('.buy-btn, .shop-toggle').forEach(b=> b.setAttribute('aria-expanded','false'));
});

$$(".hero-actions .btn-primary").forEach(el => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById("products");
    if(!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(y,500);
  });
});

const note = $("#newsletterNote");
$("#newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("#email").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setNote("Masukkan email yang valid", "error");
    return;
  }
  setNote("Terima kasih! Kami telah mengirim konfirmasi ke email Anda.", "success");
});

function setNote(text, type){
  if (!note) return;
  note.textContent = text;
  note.style.color = type === "success" ? "#22c55e" : "#ef4444";
}

$$(".card, .hero-copy, .hero-media").forEach(el => el.classList.add("fade-up"));
