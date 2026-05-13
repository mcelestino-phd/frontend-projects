/* ============================================================
   Anexa Digital — filter logic
   ============================================================
   Three filters working together: category (nav), price range
   and brand (checkboxes in the sidebar).

   A card only shows if it passes ALL active filters at once.
   If no filter is active for a type, everything passes.
   ============================================================ */


/* --- 1. grab the elements we need ------------------------- */
const cards            = document.querySelectorAll('.card-wrapper');
const navLinks         = document.querySelectorAll('.nav__link');
const priceCheckboxes  = document.querySelectorAll('input[data-filter="price"]');
const brandCheckboxes  = document.querySelectorAll('input[data-filter="brand"]');
const emptyState       = document.getElementById('empty');
const resetButton      = document.getElementById('resetFilters');


/* --- 2. current filter state ------------------------------ */
// category is a single value (clicking replaces it)
// price and brand can have multiple values — read from checkboxes
let activeCategory = 'todos';


/* --- 3. helpers ------------------------------------------- */

// returns the values of all checked checkboxes of a given group
function getCheckedValues(checkboxes) {
  const checked = [];
  checkboxes.forEach(cb => {
    if (cb.checked) checked.push(cb.value);
  });
  return checked;
}

// checks if a price falls inside any of the selected ranges
// if no range is selected, everything passes
function priceMatches(price, ranges) {
  if (ranges.length === 0) return true;

  return ranges.some(range => {
    if (range === 'low')     return price < 500;
    if (range === 'mid')     return price >= 500  && price < 1500;
    if (range === 'high')    return price >= 1500 && price < 3000;
    if (range === 'premium') return price >= 3000;
    return false;
  });
}


/* --- 4. main filter function ------------------------------ */
// runs every time the user interacts with any filter
function applyFilters() {
  const selectedPrices = getCheckedValues(priceCheckboxes);
  const selectedBrands = getCheckedValues(brandCheckboxes);

  let visibleCount = 0;

  cards.forEach(card => {
    const cat   = card.dataset.category;
    const price = Number(card.dataset.price); // dataset values are strings
    const brand = card.dataset.brand;

    const passesCategory = activeCategory === 'todos' || cat === activeCategory;
    const passesPrice    = priceMatches(price, selectedPrices);
    const passesBrand    = selectedBrands.length === 0 || selectedBrands.includes(brand);

    // AND logic: must pass all three
    const visible = passesCategory && passesPrice && passesBrand;

    // '' returns display control to CSS instead of hardcoding 'block'
    card.style.display = visible ? '' : 'none';

    if (visible) visibleCount++;
  });

  // show empty state message if nothing is visible
  emptyState.hidden = visibleCount > 0;
}


/* --- 5. category filter (nav links) ----------------------- */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // stop the <a> from jumping to #

    navLinks.forEach(l => l.classList.remove('nav__link--active'));
    link.classList.add('nav__link--active');

    activeCategory = link.dataset.category;
    applyFilters();
  });
});


/* --- 6. price and brand checkboxes ------------------------ */
// 'change' fires only when the state actually changes
priceCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
brandCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));


/* --- 7. reset button -------------------------------------- */
resetButton.addEventListener('click', () => {
  priceCheckboxes.forEach(cb => cb.checked = false);
  brandCheckboxes.forEach(cb => cb.checked = false);

  activeCategory = 'todos';
  navLinks.forEach(l => l.classList.remove('nav__link--active'));
  navLinks[0].classList.add('nav__link--active');

  applyFilters();
});


/* --- 8. run once on load ---------------------------------- */
// in case any checkbox comes pre-checked from the HTML
applyFilters();
