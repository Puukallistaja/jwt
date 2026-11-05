# JWT

Two versions of the same little blog live in this repo:

- **`/` JustWeedThoughts, new version.** Same name, new topic: wild theories for fixing the world. Projects that only feel possible while high: cure cancer, replace money, talk to whales. Funny, with a real core. Plain HTML and CSS, one optional script, no build step and no external requests.
- **`/classic/` JustWeedThoughts, classic version** (original, 2017). The first version of the blog, kept as it was. It loads `articles/<id>.html` into a modal with JavaScript.

Each version has a small New / Classic switch in the top-right corner.

## Run it locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/ and http://localhost:8000/classic/. The classic version needs http (not `file://`) because it fetches its articles.

## How the new version works

- `index.html` holds everything: a grid of cards (`<a class="card" href="#post-id">`) followed by one `<article class="reader" id="post-id">` per post.
- `style.css` shows a reader only when it is the URL `:target`, so opening, closing (Back or the close link) and deep links like `/#whales` all work without JavaScript.
- `reader.js` is optional polish: Esc to close, the close button acts like Back so the grid keeps its scroll position, focus moves to the reader and back to its card, and the pop grows from the clicked card.
- `img/<post-id>.svg` are the illustrations (1200x800, flat colours, `#232332` outlines, sleepy eyes).

## Add a post

1. Draw `img/<post-id>.svg` at 1200x800 in the same style. Keep it small (a few KB).
2. In `index.html`, copy an existing `<li>` card in the grid and change its `id="c-<post-id>"`, `href="#<post-id>"`, image, tag, title, teaser and scores. Pick a theme class: `blue`, `green`, `purple` or `orange`.
3. Copy an existing `<article class="reader">` and change the `id`, the `aria-labelledby`/heading id, the close link `href="#c-<post-id>"`, the image and its `alt` text, and the text. Keep the structure: the idea, *Why it's not as crazy as it sounds*, *Why it is*, *Step one*, and the Sober / Elevated scores (`style="--v:<score>"` sets the bar).
4. Keep it short (about 150 to 300 words), first person, and make the serious part true: real research or real precedent, no invented numbers.
