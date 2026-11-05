// Optional polish for the CSS-only reader. Without this file, cards still open and close via links and Back.
// Adds: Esc to close, close button = Back (keeps the grid's scroll position), focus handling,
// an inert background while a post is open, and a pop that grows from the clicked card.
const postFor = (hash) => {
  const el = hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)));
  return el && el.classList.contains('reader') ? el : null;
};
let shown = null;

function sync(event) {
  const post = postFor(location.hash);
  document.querySelectorAll('[data-behind]').forEach((el) => { el.inert = !!post; });
  if (post && event && !postFor(new URL(event.oldURL).hash)) history.replaceState({ fromGrid: true }, '');
  if (post) post.focus({ preventScroll: true });
  else if (shown) document.getElementById('c-' + shown.id)?.focus({ preventScroll: true });
  shown = post;
}

function close() {
  if (!shown) return;
  if (history.state?.fromGrid) return history.back();
  location.replace('#c-' + shown.id); // opened from a deep link: land on its card instead of leaving the site
  history.replaceState(null, '', location.pathname + location.search);
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && shown) { e.preventDefault(); close(); } });
document.addEventListener('click', (e) => {
  const a = e.target.closest('a.card, a.close');
  if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.classList.contains('close')) { e.preventDefault(); close(); return; }
  const r = a.getBoundingClientRect();
  document.documentElement.style.setProperty('--ox', `${r.left + r.width / 2}px`);
  document.documentElement.style.setProperty('--oy', `${r.top + r.height / 2}px`);
});
addEventListener('hashchange', sync);
sync();

// Listen: reads the open post aloud with the browser's own speech engine (free, no API, nothing leaves the device).
// The button only appears where the browser supports speech synthesis.
if ('speechSynthesis' in window) {
  const synth = window.speechSynthesis;
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>Listen';
  const STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12v12H6z"/></svg>Stop';
  let playing = null;

  const voice = () => {
    const en = synth.getVoices().filter((v) => v.lang.startsWith('en'));
    return en.find((v) => /natural|neural|google|samantha|daniel/i.test(v.name)) || en[0] || null;
  };

  const stop = () => {
    synth.cancel();
    if (playing) { playing.innerHTML = PLAY; playing.setAttribute('aria-pressed', 'false'); }
    playing = null;
  };

  const speak = (post, btn) => {
    stop();
    // One utterance per paragraph: some engines cut off long utterances.
    const parts = [...post.querySelectorAll('.prose h2, .prose h3, .prose p, .prose dl > div')]
      .map((el) => el.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const v = voice();
    parts.forEach((text, i) => {
      const u = new SpeechSynthesisUtterance(text);
      if (v) u.voice = v;
      u.rate = 1.02;
      if (i === parts.length - 1) u.onend = () => { if (playing === btn) stop(); };
      synth.speak(u);
    });
    playing = btn;
    btn.innerHTML = STOP;
    btn.setAttribute('aria-pressed', 'true');
  };

  document.querySelectorAll('.reader .reader-bar').forEach((bar) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'listen';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = PLAY;
    btn.addEventListener('click', () => (playing === btn ? stop() : speak(bar.closest('.reader'), btn)));
    bar.querySelector('.close').before(btn);
  });

  addEventListener('hashchange', () => { if (playing && !playing.closest('.reader').matches(':target')) stop(); });
  addEventListener('pagehide', stop);
}
