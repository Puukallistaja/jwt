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
