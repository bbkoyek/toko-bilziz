/* ==========================================================================
   ADMIN.JS — Bilziz Sport (pages/admin.html)
   Tabel data produk + form tambah/ubah/hapus (termasuk kelola gambar),
   mengikuti dokumentasi endpoint /toko/admin (POST/GET/PUT/DELETE, form-data).
   ========================================================================== */

let allProducts = [];
let editingId = null;
let imagesToDelete = [];

function rowHTML(p) {
  const imgUrl = firstImageUrl(p.image,'thumnail');
  const thumb = imgUrl
    ? `<img class="cell-thumb" src="${imgUrl}" alt="${escapeHtml(p.name)}" onerror="this.remove()">`
    : `<div class="cell-thumb"></div>`;
  return `
    <tr data-id="${p.Id}">
      <td><div class="cell-produk">${thumb} ${escapeHtml(p.name)}</div></td>
      <td>${escapeHtml(p.deskripsi || '-')}</td>
      <td class="cell-harga">${p.harga ? formatHarga(p.harga) : '-'}</td>
      <td class="cell-aksi">
        <button class="btn-dark btn-edit" data-id="${p.Id}">Ubah</button>
        <button class="btn-danger btn-delete" data-id="${p.Id}">Hapus</button>
      </td>
    </tr>
  `;
}

function renderTable(products) {
  const tbody = document.getElementById('produk-tbody');
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="table-empty">Belum ada produk.</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(rowHTML).join('');

  tbody.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => openProductModal(btn.getAttribute('data-id')));
  });
  tbody.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', () => hapusProduk(btn.getAttribute('data-id')));
  });
}

async function muatProdukAdmin() {
  const tbody = document.getElementById('produk-tbody');
  tbody.innerHTML = '<tr><td colspan="4" class="table-loading">Memuat data...</td></tr>';
  try {
    allProducts = await Api.getProducts();
    renderTable(allProducts);
    document.getElementById('admin-produk-count').textContent = allProducts.length;
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="4" class="table-error">Gagal memuat data produk.</td></tr>`;
  }
}

function openProductModal(id = null) {
  editingId = id;
  const produk = id ? allProducts.find((p) => String(p.Id) === String(id)) : null;
  imagesToDelete = [];

  document.getElementById('produk-modal-title').textContent = produk ? 'Ubah Produk' : 'Tambah Produk';
  document.getElementById('pf-name').value = produk ? produk.name : '';
  document.getElementById('pf-harga').value = produk ? produk.harga : '';
  document.getElementById('pf-deskripsi').value = produk ? (produk.deskripsi || '') : '';
  document.getElementById('pf-image').value = '';
  renderExistingImages(produk);
  document.getElementById('produk-modal-error').classList.remove('show');
  document.getElementById('produk-modal-overlay').classList.add('open');
}

/** Tampilkan gambar produk yang sudah ada; klik gambar untuk menandai dihapus. */
function renderExistingImages(produk) {
  const group = document.getElementById('pf-existing-images-group');
  const wrap = document.getElementById('pf-existing-images');
  const images = (produk && Array.isArray(produk.image)) ? produk.image : [];
  if (!images.length) {
    group.style.display = 'none';
    wrap.innerHTML = '';
    return;
  }
  group.style.display = '';
  wrap.innerHTML = images.map((filename) => `
    <div class="image-preview-item" data-filename="${escapeHtml(filename)}">
      <img src="${SERVER_BASE}/img/${filename}" alt="">
    </div>
  `).join('');

  wrap.querySelectorAll('.image-preview-item').forEach((item) => {
    item.addEventListener('click', () => {
      const filename = item.getAttribute('data-filename');
      item.classList.toggle('marked-delete');
      imagesToDelete = item.classList.contains('marked-delete')
        ? [...imagesToDelete, filename]
        : imagesToDelete.filter((f) => f !== filename);
    });
  });
}

function closeProductModal() {
  document.getElementById('produk-modal-overlay').classList.remove('open');
}

async function simpanProduk(e) {
  e.preventDefault();
  const form = e.target;
  const name = document.getElementById('pf-name').value.trim();
  const harga = document.getElementById('pf-harga').value.trim();
  const deskripsi = document.getElementById('pf-deskripsi').value.trim();

  const { valid, errors } = Validation.validateProductForm({ name, harga });
  Validation.applyFieldErrors(form, errors);
  if (!valid) return;

  const submitBtn = document.getElementById('produk-modal-submit');
  const restore = Loading.setButtonBusy(submitBtn, 'Menyimpan...');
  try {
    const imageFile = document.getElementById('pf-image').files[0] || null;
    if (editingId) {
      await Api.updateProduct(Auth.getToken(), {
        id: editingId, name, harga: Number(harga), deskripsi, imageFile, deleteImages: imagesToDelete
      });
      Notify.success('Produk berhasil diubah.');
    } else {
      await Api.createProduct(Auth.getToken(), { name, harga: Number(harga), deskripsi, imageFile });
      Notify.success('Produk berhasil ditambahkan.');
    }
    closeProductModal();
    muatProdukAdmin();
  } catch (err) {
    const errBox = document.getElementById('produk-modal-error');
    errBox.textContent = err.message || 'Gagal menyimpan produk. Periksa koneksi ke backend.';
    errBox.classList.add('show');
  } finally {
    restore();
  }
}

async function hapusProduk(id) {
  const produk = allProducts.find((p) => String(p.Id) === String(id));
  if (!produk) return;
  if (!confirm(`Hapus produk "${produk.name}"?`)) return;

  Loading.show();
  try {
    await Api.deleteProduct(Auth.getToken(), id);
    Notify.success('Produk berhasil dihapus.');
    muatProdukAdmin();
  } catch (err) {
    Notify.error(err.message || 'Gagal menghapus produk.');
  } finally {
    Loading.hide();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.requireAuth('login.html')) return;

  renderNavbar({ base: '../', active: '' });
  renderSidebar({ base: '../', active: 'produk' });

  document.getElementById('btn-tambah-produk').addEventListener('click', () => openProductModal(null));
  document.getElementById('produk-modal-close').addEventListener('click', closeProductModal);
  document.getElementById('produk-form').addEventListener('submit', simpanProduk);

  const overlay = document.getElementById('produk-modal-overlay');
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeProductModal(); });

  muatProdukAdmin();
});
