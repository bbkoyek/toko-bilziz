/* ==========================================================================
   PRODUCT.JS — Bilziz Sport (pages/product.html)
   Menampilkan seluruh produk + kotak pencarian (GET /toko/search?key=).
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

function renderProdukGrid(products) {
  const grid = document.getElementById('produk-grid');
  if (!products.length) {
    grid.innerHTML = '<div class="produk-empty">Produk tidak ditemukan.</div>';
    return;
  }
  grid.innerHTML = products.map(produkCardHTML).join('');

  grid.querySelectorAll('.produk-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const produk = allProducts.find((p) => String(p.Id) === String(id));
      if (produk) goToCheckout(produk);
    });
  });
}

function goToCheckout(produk) {
  const params = new URLSearchParams({
    produk: produk.name,
    harga: produk.harga ?? '',
    id: produk.Id ?? ''
  });
  window.location.href = `checkout.html?${params.toString()}`;
}

async function muatSemuaProduk() {
  const grid = document.getElementById('produk-grid');
  grid.innerHTML = '<div class="produk-loading">Memuat produk...</div>';
  try {
    allProducts = await Api.getProducts();
    renderProdukGrid(allProducts);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="produk-error">Gagal memuat produk. Pastikan server backend berjalan di ${API_BASE}.</div>`;
  }
}

async function cariProduk(keyword) {
  const grid = document.getElementById('produk-grid');
  if (!keyword) {
    return muatSemuaProduk();
  }
  grid.innerHTML = '<div class="produk-loading">Mencari produk...</div>';
  try {
    allProducts = await Api.searchProducts(keyword);
    renderProdukGrid(allProducts);
  } catch (err) {
    console.error(err);
    Notify.error('Pencarian gagal. Coba lagi.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar({ base: '../', active: 'product' });
  renderFooter({ base: '../' });

  const searchBox = document.getElementById('produk-search');
  const searchForm = document.getElementById('produk-search-form');
  const initialQuery = getQueryParam('q');

  if (initialQuery) {
    searchBox.value = initialQuery;
    cariProduk(initialQuery);
  } else {
    muatSemuaProduk();
  }

  if (searchBox) {
    searchBox.addEventListener('input', debounce((e) => cariProduk(e.target.value.trim()), 350));
  }
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      cariProduk(searchBox.value.trim());
    });
  }
});
