# Projeto 1 — Catálogo Anexa Digital (Mobile-First)

> Primeiro projeto do meu portfólio de programação.
> Foco: **CSS Grid · Flexbox · Container Queries** + filtros em **JavaScript**.

---

## 🎯 Objetivo

Construir uma loja online com layout responsivo de verdade — usando técnicas modernas do CSS, sem frameworks. O design segue uma estética premium (estilo Apple / Stripe / SaaS), e os filtros funcionam de verdade com JavaScript puro.

## 📁 Estrutura

```
projeto-01-catalogo/
├── index.html      ← estrutura semântica
├── style.css       ← todo o CSS, comentado por seção
├── script.js       ← lógica dos filtros, comentada
└── README.md       ← este arquivo
```

## ▶️ Como rodar

1. Abra a pasta no **VS Code**.
2. Instale a extensão **Live Server** (Ritwick Dey) se ainda não tiver.
3. Clique com o botão direito no `index.html` → **Open with Live Server**.
4. A página abrirá em `http://127.0.0.1:5500/`.

> 💡 Para ver as **Container Queries** funcionando, redimensione a janela do navegador devagar. Os cartões mudam de layout em pontos diferentes — porque eles reagem ao próprio tamanho, não ao da tela.

---

## 🧠 As 3 técnicas de CSS demonstradas

### 1. CSS Grid com `grid-template-areas`

Em vez de calcular linhas e colunas com números, **damos nomes às regiões** e desenhamos o layout como um mapa:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header"
    "nav"
    "main"
    "sidebar"
    "footer";
}
```

E no desktop, redesenhamos o mapa:

```css
@media (min-width: 1080px) {
  .layout {
    grid-template-columns: 200px 1fr 300px;
    grid-template-areas:
      "header  header   header"
      "nav     main     sidebar"
      "footer  footer   footer";
  }
}
```

**Por que é bom:** o CSS fica legível como um diagrama. Você consegue *ver* o layout só de ler o código.

### 2. Flexbox para componentes

Grid é ótimo para **layout 2D** (a página inteira). Flexbox brilha em **uma dimensão** — alinhar coisas em fila, distribuir espaço, etc.

Usado em:
- `.header` → logo, busca e ações em linha
- `.card` → empilha ou põe lado a lado as partes do cartão
- `.card__footer` → preço à esquerda, botão à direita
- `.nav__list` → categorias em fila com scroll horizontal

### 3. Container Queries (`@container`) — **a estrela do projeto**

Aqui está o salto de modernidade. Media Queries clássicas perguntam "qual é o tamanho da TELA?". Container Queries perguntam "qual é o tamanho deste COMPONENTE?".

```css
.card-wrapper {
  container-type: inline-size;   /* o pai vira um "container observado" */
}

@container (min-width: 460px) {
  .card { flex-direction: row; }   /* agora é horizontal */
}
```

**Por que isso muda tudo:** o mesmo cartão pode aparecer em uma página larga (vira horizontal) ou em uma sidebar estreita (continua empilhado), **automaticamente**, sem JavaScript e sem media queries específicas.

---

## ⚙️ Os filtros (JavaScript puro)

Os filtros funcionam combinando 3 critérios em **E lógico** — um produto só aparece se passar em **todos**:

| Filtro     | Onde fica            | Como escolhe              |
|------------|----------------------|---------------------------|
| Categoria  | Menu superior (nav)  | Único (clicar substitui)  |
| Preço      | Sidebar              | Vários (checkboxes)       |
| Marca      | Sidebar              | Vários (checkboxes)       |

### Como o JS sabe os dados de cada produto

Cada cartão no HTML tem três atributos `data-*`:

```html
<article class="card-wrapper"
         data-category="audio"
         data-price="2499"
         data-brand="anexa">
```

O JS lê esses atributos via `card.dataset.category`, `card.dataset.price`, etc.

### O coração da lógica

```javascript
function applyFilters() {
  cards.forEach(card => {
    const passesCategory = activeCategory === 'todos' || cat === activeCategory;
    const passesPrice    = priceMatches(price, selectedPrices);
    const passesBrand    = selectedBrands.length === 0 || selectedBrands.includes(brand);

    const visible = passesCategory && passesPrice && passesBrand;
    card.style.display = visible ? '' : 'none';
  });
}
```

**Detalhes legais que o código demonstra:**
- `e.preventDefault()` → impede o `<a>` de pular para `#`
- `dataset.xxx` → forma moderna de ler `data-xxx` do HTML
- `Array.some()` e `Array.includes()` → métodos modernos de array
- `''` em `style.display` → **devolve o controle ao CSS** (em vez de hardcode `'block'`)
- Estado vazio com botão de reset → boa UX para quando o filtro zera os resultados

---

## 🎨 Sistema de Design

### Paleta — "Moderna Premium"

| Token             | Cor          | Uso                       |
|-------------------|--------------|---------------------------|
| `--bg`            | `#0F172A`    | Fundo geral               |
| `--surface`       | `#1E293B`    | Cards e barras            |
| `--surface-2`     | `#273449`    | Hover / superfícies aux.  |
| `--primary`       | `#38BDF8`    | Azul de destaque          |
| `--secondary`     | `#A78BFA`    | Roxo (eyebrow, acentos)   |
| `--accent`        | `#22C55E`    | Botões CTA                |
| `--text`          | `#F8FAFC`    | Texto principal           |
| `--text-muted`    | `#94A3B8`    | Texto secundário          |

### Tipografia

- **Display** (títulos): *Bricolage Grotesque* — tem personalidade sem ser exótica.
- **Texto**: *Manrope* — geométrica, limpa, ótima para leitura em tela.

### Princípios aplicados

- **Mobile-first**: o CSS começa pelo celular; tablets e desktops vêm como *upgrades* via `@media`.
- **Design tokens**: tudo que se repete (cor, espaçamento, raio, transição) vira variável CSS no `:root`.
- **Hierarquia tipográfica**: `clamp()` no título principal para escala fluida.
- **Atmosfera**: dois `radial-gradient` sutis no fundo do `body` criam profundidade sem ruído.
- **Acessibilidade**: `:focus-visible`, contraste alto, áreas de toque ≥ 40px nos botões.

---

## 📐 Como o layout muda em cada breakpoint

| Faixa             | Layout                                                  |
|-------------------|---------------------------------------------------------|
| `< 720px`         | Tudo empilhado (header → nav → main → sidebar → footer) |
| `≥ 720px`         | Sidebar entra ao lado do main                           |
| `≥ 1080px`        | Nav vira coluna lateral esquerda (3 colunas)            |

E **dentro** disso, cada cartão decide o próprio layout:

| Largura do cartão | Layout interno                |
|-------------------|-------------------------------|
| `< 460px`         | Imagem em cima, texto embaixo |
| `≥ 460px`         | Imagem à esquerda, texto à direita |

---

## ✅ O que aprendi neste projeto

- [x] Modelar layouts com `grid-template-areas`
- [x] Combinar Grid (página) + Flexbox (componentes)
- [x] Usar `@container` para componentes verdadeiramente reutilizáveis
- [x] Construir um design system com variáveis CSS
- [x] Aplicar mobile-first sem cair em "media query hell"
- [x] Criar ilustrações com gradientes (`::before`) sem precisar de imagens
- [x] Manipular o DOM com JavaScript moderno (querySelectorAll, dataset, addEventListener)
- [x] Filtros combinados com **E lógico** entre múltiplos critérios

---

## 🚀 Próximos passos sugeridos

- Conectar a busca do header também aos filtros (filtrar pelo título)
- Salvar produtos favoritos em `localStorage`
- Animar a entrada dos cartões com `IntersectionObserver`
- Substituir os "ilustradores em CSS" por imagens reais com `<picture>` e `srcset`
- Adicionar contador de "X produtos encontrados" acima do grid
