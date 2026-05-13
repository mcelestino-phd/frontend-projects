/* ============================================================
   Anexa Digital — Lógica dos filtros do catálogo
   ============================================================
   Este arquivo cuida de TUDO que torna a página interativa:
     • Filtrar por categoria (clicar nos links da nav)
     • Filtrar por faixa de preço (checkboxes da sidebar)
     • Filtrar por marca (checkboxes da sidebar)
     • Mostrar mensagem quando nenhum produto bater com os filtros
     • Botão "Limpar filtros" para resetar tudo

   Como funciona em alto nível:
     1. Cada produto tem atributos data-* no HTML
        (data-category, data-price, data-brand)
     2. Cada filtro do menu/sidebar guarda seu valor escolhido
     3. A função applyFilters() percorre todos os cartões e
        decide quais ficam visíveis (vários filtros somados em E lógico)
   ============================================================ */


/* ─── 1. SELECIONAR ELEMENTOS DA PÁGINA ─────────────────────
   document.querySelectorAll devolve uma NodeList com todos os
   elementos que batem com o seletor CSS passado.
   --------------------------------------------------------- */
const cards            = document.querySelectorAll('.card-wrapper');
const navLinks         = document.querySelectorAll('.nav__link');
const priceCheckboxes  = document.querySelectorAll('input[data-filter="price"]');
const brandCheckboxes  = document.querySelectorAll('input[data-filter="brand"]');
const emptyState       = document.getElementById('empty');
const resetButton      = document.getElementById('resetFilters');


/* ─── 2. ESTADO ATUAL DOS FILTROS ───────────────────────────
   Usamos uma variável simples para a categoria ativa porque
   só pode haver uma de cada vez (clicar substitui).
   Já preço e marca aceitam várias opções → leio dos checkboxes.
   --------------------------------------------------------- */
let activeCategory = 'todos';


/* ─── 3. HELPERS ───────────────────────────────────────────
   Funções pequenas que fazem uma coisa só. Deixam o código
   da função principal (applyFilters) mais limpo de ler.
   --------------------------------------------------------- */

// Pega os VALORES dos checkboxes que estão marcados de um certo tipo
function getCheckedValues(checkboxes) {
  const checked = [];
  checkboxes.forEach(cb => {
    if (cb.checked) checked.push(cb.value);
  });
  return checked;
}

// Verifica se um preço cai dentro de uma das faixas escolhidas
function priceMatches(price, ranges) {
  // Se nenhuma faixa foi marcada, qualquer preço passa
  if (ranges.length === 0) return true;

  return ranges.some(range => {
    if (range === 'low')     return price < 500;
    if (range === 'mid')     return price >= 500  && price < 1500;
    if (range === 'high')    return price >= 1500 && price < 3000;
    if (range === 'premium') return price >= 3000;
    return false;
  });
}


/* ─── 4. FUNÇÃO PRINCIPAL: APLICAR OS FILTROS ──────────────
   Roda toda vez que o usuário clica numa categoria ou marca/
   desmarca um checkbox. Decide quais cartões ficam visíveis.
   --------------------------------------------------------- */
function applyFilters() {
  const selectedPrices = getCheckedValues(priceCheckboxes);
  const selectedBrands = getCheckedValues(brandCheckboxes);

  let visibleCount = 0;

  cards.forEach(card => {
    // Lê os data-* do cartão
    const cat   = card.dataset.category;
    const price = Number(card.dataset.price); // string → número
    const brand = card.dataset.brand;

    // Cada condição: ou o filtro está vazio (passa todo mundo) ou bate
    const passesCategory = activeCategory === 'todos' || cat === activeCategory;
    const passesPrice    = priceMatches(price, selectedPrices);
    const passesBrand    = selectedBrands.length === 0 || selectedBrands.includes(brand);

    // Só aparece se passar em TODOS os filtros (E lógico)
    const visible = passesCategory && passesPrice && passesBrand;

    // Mostra ou esconde. O '' (string vazia) volta o display ao padrão do CSS.
    card.style.display = visible ? '' : 'none';

    if (visible) visibleCount++;
  });

  // Mostra a mensagem "nenhum produto" se nada apareceu
  emptyState.hidden = visibleCount > 0;
}


/* ─── 5. EVENTOS: CATEGORIA (NAV) ───────────────────────────
   Ao clicar num link da nav:
     • Cancela o comportamento padrão do <a> (e.preventDefault)
     • Tira a classe "ativo" de todos
     • Marca o link clicado como ativo
     • Atualiza a categoria e reaplica os filtros
   --------------------------------------------------------- */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    navLinks.forEach(l => l.classList.remove('nav__link--active'));
    link.classList.add('nav__link--active');

    activeCategory = link.dataset.category;
    applyFilters();
  });
});


/* ─── 6. EVENTOS: CHECKBOXES (PREÇO + MARCA) ────────────────
   O evento 'change' dispara só quando o estado muda
   (mais eficiente que 'click' para checkboxes).
   --------------------------------------------------------- */
priceCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
brandCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));


/* ─── 7. EVENTO: BOTÃO "LIMPAR FILTROS" ─────────────────────
   Reseta tudo para o estado inicial.
   --------------------------------------------------------- */
resetButton.addEventListener('click', () => {
  // Desmarca todos os checkboxes
  priceCheckboxes.forEach(cb => cb.checked = false);
  brandCheckboxes.forEach(cb => cb.checked = false);

  // Volta a categoria para "Todos"
  activeCategory = 'todos';
  navLinks.forEach(l => l.classList.remove('nav__link--active'));
  navLinks[0].classList.add('nav__link--active'); // primeiro link = "Todos"

  applyFilters();
});


/* ─── 8. ESTADO INICIAL ─────────────────────────────────────
   Roda uma vez no carregamento para garantir que tudo
   está consistente (caso algum checkbox venha marcado do HTML).
   --------------------------------------------------------- */
applyFilters();
