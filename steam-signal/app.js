const bands = {
  rising: { title: 'Rising', copy: 'Games with 500–999 reviews.' },
  hits: { title: 'Hits', copy: 'Games with 1,000–9,999 reviews.' },
  megahits: { title: 'Megahits', copy: 'Games with 10,000 reviews or more.' },
};

const state = { category: 'rising', games: [], counts: {}, query: '' };
const body = document.querySelector('#games');
const empty = document.querySelector('#empty');
const search = document.querySelector('#search');

const integer = new Intl.NumberFormat('en-US');
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const price = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function scoreClass(score) {
  if (score >= 85) return 'great';
  if (score >= 70) return 'good';
  return '';
}

function render() {
  const needle = state.query.trim().toLowerCase();
  const visible = state.games.filter((game) => {
    const haystack = `${game.title} ${game.tags.join(' ')}`.toLowerCase();
    return game.category === state.category && (!needle || haystack.includes(needle));
  });

  body.innerHTML = visible.map((game) => {
    const tags = game.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
    const capsuleUrl = game.capsule_url
      || `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/capsule_231x87.jpg`;
    const shownPrice = game.price_cents == null
      ? '—'
      : game.price_cents === 0 ? 'Free' : price.format(game.price_cents / 100);
    const newBadge = game.is_new ? '<span class="new-badge">New this week</span>' : '';
    return `<tr class="${game.is_new ? 'is-new' : ''}">
      <td><div class="game-cell">
        <img class="game-capsule" src="${escapeHtml(capsuleUrl)}" alt="" width="106" height="40" loading="lazy">
        <div><a class="game-title" href="${escapeHtml(game.steam_url)}" target="_blank" rel="noreferrer">${escapeHtml(game.title)}</a>${newBadge}</div>
      </div></td>
      <td class="number">${integer.format(game.reviews_total)}</td>
      <td class="number"><span class="score ${scoreClass(game.reviews_score)}">${game.reviews_score}%</span></td>
      <td>${game.release_date}</td>
      <td class="number">${shownPrice}</td>
      <td class="tags">${tags || '—'}</td>
      <td class="number estimate">${game.owners_estimated == null ? '—' : integer.format(game.owners_estimated)}</td>
      <td class="number estimate">${game.revenue_estimated_cents == null ? '—' : money.format(game.revenue_estimated_cents / 100)}</td>
    </tr>`;
  }).join('');

  body.querySelectorAll('.game-capsule').forEach((image) => {
    image.addEventListener('error', () => image.classList.add('broken'), { once: true });
  });
  empty.hidden = visible.length !== 0;
}

function selectCategory(category) {
  state.category = category;
  document.querySelectorAll('.band').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === category);
  });
  document.querySelector('#section-title').textContent = bands[category].title;
  document.querySelector('#section-copy').textContent = bands[category].copy;
  render();
}

async function loadData() {
  body.innerHTML = '<tr><td colspan="8">Loading Steam signal…</td></tr>';
  empty.hidden = true;
  try {
    const response = await fetch('../data/steam_games.json');
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    state.games = data.games;
    state.counts = data.counts;
    Object.entries(data.counts).forEach(([key, value]) => {
      document.querySelector(`#count-${key}`).textContent = value;
    });
    document.querySelector('#updated').textContent = data.updated_at
      ? `Updated ${data.updated_at.slice(0, 10)} · Window from ${data.cutoff_date}`
      : 'No completed collection yet';
    selectCategory(state.category);
  } catch (error) {
    state.games = [];
    body.innerHTML = `<tr><td colspan="8">Could not load database: ${escapeHtml(error.message)}</td></tr>`;
  }
}

document.querySelectorAll('.band').forEach((button) => {
  button.addEventListener('click', () => selectCategory(button.dataset.category));
});
search.addEventListener('input', () => {
  state.query = search.value;
  render();
});
document.querySelector('#year').textContent = new Date().getFullYear();
loadData();
