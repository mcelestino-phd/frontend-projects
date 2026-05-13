# Anexa Digital — Product Catalog

A front-end study project built while learning CSS layout techniques during my Computer Science degree.

The idea was simple: build a product catalog that actually works — responsive layout, real filters, no frameworks.

---

## What I practiced here

- **CSS Grid with `grid-template-areas`** — naming layout regions instead of counting columns
- **Flexbox** — for components like the header, cards, and nav
- **Container Queries** — cards that respond to their own width, not the screen's
- **Vanilla JavaScript** — category and price/brand filters with combined logic

---

## Project structure

```
anexa-catalogo/
├── index.html   — semantic markup and data-* attributes for filtering
├── style.css    — all styles, organized by section with comments
├── script.js    — filter logic explained step by step
└── README.md
```

---

## How to run

1. Open the folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey) if you haven't
3. Right-click `index.html` → **Open with Live Server**

Or just open `index.html` directly in the browser — it works without a server.

---

## The Container Queries part

This was the thing I found most interesting in the project. Instead of using `@media` to change card layout based on screen width, I used `@container` to react to the card's own width:

```css
.card-wrapper {
  container-type: inline-size;
}

@container card (min-width: 460px) {
  .card { flex-direction: row; }
}
```

The result: the same card component adapts automatically wherever it's placed, without needing extra media queries.

---

## Filter logic (JavaScript)

Each product card has `data-*` attributes in the HTML:

```html
<article data-category="audio" data-price="2499" data-brand="anexa">
```

The JS reads these and applies all active filters together (AND logic) — a card only appears if it passes every active filter at once.

---

## Notes

- No frameworks or libraries — plain HTML, CSS and JS
- CSS illustrations instead of images (gradients + border-radius)
- Mobile-first: base styles are for small screens, larger screens override
- Accessibility: `:focus-visible` on interactive elements, `aria-label` on buttons

---

*Part of my [frontend-projects](https://github.com/mcelestino-phd/frontend-projects) portfolio.*
