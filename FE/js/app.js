/* ==========================================================================
   APP.JS — Bilziz Sport
   Script khusus index.html: render preview produk, galeri, dan statistik hero.
   Untuk semua produk + pencarian, lihat js/pages/product.js (pages/product.html).
   ========================================================================== */

let allProducts = [];

function produkCardHTML(p) {
  const imgUrl = firstImageUrl(p.image,'thumnail');
  const visual = imgUrl
    ? `<img src="${imgUrl}" alt="${escapeHtml(p.name)}" onerror="this.remove()">`
    : `🏓`;
  const harga = formatHarga(p.harga);
  return `
    <div class="produk-card" data-id="${p.Id}">
      <div class="produk-card-inner">
        <div class="produk-visual">${visual}</div>
        <div class="produk-info">
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.deskripsi || 'Peralatan tenis meja berkualitas')}</p>
          <div class="produk-info-row">
            <span class="produk-tag">${harga || 'Hubungi kami'}</span>
            <span class="produk-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProdukGrid(products, { limit = 8 } = {}) {
  const grid = document.getElementById('produk-grid');
  if (!grid) return;
  const list = limit ? products.slice(0, limit) : products;
  if (!list.length) {
    grid.innerHTML = '<div class="produk-empty">Belum ada produk tersedia saat ini.</div>';
    return;
  }
  grid.innerHTML = list.map(produkCardHTML).join('');

  grid.querySelectorAll('.produk-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const produk = allProducts.find((p) => String(p.Id) === String(id));
      if (produk) goToCheckout(produk);
    });
  });
}

function renderGallery(products) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  if (!products.length) {
    grid.innerHTML = '<div class="produk-empty">Belum ada galeri untuk ditampilkan.</div>';
    return;
  }
  // Tampilkan hingga 5 produk pertama pada layout galeri (1 besar + 4 kecil)
  const items = products.slice(0, 5);
  grid.innerHTML = items.map((p) => {
    const imgUrl = firstImageUrl(p.image,'medium');
    const visual = imgUrl
      ? `<img src="${imgUrl}" alt="${escapeHtml(p.name)}" onerror="this.remove()">`
      : `🏓`;
    return `
      <div class="gallery-item" data-id="${p.Id}">
        ${visual}
        <div class="gallery-overlay"><span>${escapeHtml(p.name)}</span></div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      const produk = allProducts.find((p) => String(p.Id) === String(id));
      if (produk) goToCheckout(produk);
    });
  });
}

/** Bawa produk terpilih ke halaman checkout via query string. */
function goToCheckout(produk) {
  const params = new URLSearchParams({
    produk: produk.name,
    harga: produk.harga ?? '',
    id: produk.Id ?? ''
  });
  window.location.href = `pages/checkout.html?${params.toString()}`;
}

async function muatProdukIndex() {
  const grid = document.getElementById('produk-grid');
  const galeri = document.getElementById('gallery-grid');
  try {
    allProducts = await Api.getProducts();
    renderProdukGrid(allProducts, { limit: 8 });
    renderGallery(allProducts);

    const countEl = document.getElementById('stat-produk-count');
    if (countEl) countEl.textContent = allProducts.length;
  } catch (err) {
    console.error(err);
    if (grid) grid.innerHTML = `<div class="produk-error">Gagal memuat produk. Pastikan server backend berjalan di ${API_BASE}.</div>`;
    if (galeri) galeri.innerHTML = `<div class="produk-error">Gagal memuat galeri.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar({ base: '', active: '' });
  renderFooter({ base: '' });
  muatProdukIndex();
});
