/* ==========================================================================
   CHECKOUT.JS — Bilziz Sport (pages/checkout.html)
   Form pemesanan yang meneruskan detail pesanan ke WhatsApp toko.
   ========================================================================== */

let selectedProduk = null; // { name, harga, Id }
let allProducts = [];

function renderOrderSummary() {
  const box = document.getElementById('order-summary');
  if (!selectedProduk) {
    box.className = 'order-summary empty';
    box.innerHTML = 'Belum ada produk dipilih. Pilih produk di bawah.';
    return;
  }
  box.className = 'order-summary';
  const harga = selectedProduk.harga ? formatHarga(selectedProduk.harga) : 'Hubungi kami';
  box.innerHTML = `
    <h4>${escapeHtml(selectedProduk.name)}</h4>
    <p class="harga">${harga}</p>
  `;
}

function renderProdukSelect(products) {
  const select = document.getElementById('f-produk');
  const current = select.value;
  select.innerHTML = '<option value="">-- Pilih produk --</option>' +
    products.map((p) => `<option value="${escapeHtml(p.name)}" data-id="${p.Id}" data-harga="${p.harga ?? ''}">${escapeHtml(p.name)}</option>`).join('');
  if (current) select.value = current;
}

function selectProdukInForm(nama) {
  const select = document.getElementById('f-produk');
  select.value = nama;
  select.dispatchEvent(new Event('change'));
}

async function muatOpsiProduk() {
  try {
    allProducts = await Api.getProducts();
    renderProdukSelect(allProducts);

    // Jika datang dari tombol "Pesan" di kartu produk (index/product.html),
    // produk yang diklik sudah dibawa lewat query string.
    const produkDariUrl = getQueryParam('produk');
    if (produkDariUrl) {
      selectProdukInForm(produkDariUrl);
    }
  } catch (err) {
    console.error(err);
    Notify.error('Gagal memuat daftar produk.');
  }
}

function kirimPesan(e) {
  e.preventDefault();
  const form = e.target;

  const nama = document.getElementById('f-nama').value.trim();
  const wa = document.getElementById('f-wa').value.trim();
  const produkSelect = document.getElementById('f-produk');
  const produk = produkSelect.value;
  const produkOpt = produkSelect.options[produkSelect.selectedIndex];
  const harga = produkOpt ? produkOpt.getAttribute('data-harga') : '';
  const kota = document.getElementById('f-kota').value.trim();
  const pesan = document.getElementById('f-pesan').value.trim();

  const { valid, errors } = Validation.validateOrderForm({ nama, wa, produk, kota });
  Validation.applyFieldErrors(form, errors);
  if (!valid) return;

  const hargaText = harga ? formatHarga(harga) : '-';

  const lines = [
    `Halo Bilziz Sport! 🏓`,
    ``,
    `*Nama:* ${nama}`,
    `*No. WA:* ${wa}`,
    `*Produk:* ${produk}`,
    `*Harga:* ${hargaText}`,
    `*Kota:* ${kota || '-'}`,
    `*Pesan:* ${pesan || '-'}`,
    ``,
    `Terima kasih!`
  ];
  const msg = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');

  const successBox = document.getElementById('form-success');
  successBox.classList.add('show');
  setTimeout(() => successBox.classList.remove('show'), 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar({ base: '../', active: 'pesan' });
  renderFooter({ base: '../' });

  document.getElementById('f-produk').addEventListener('change', (e) => {
    const opt = e.target.options[e.target.selectedIndex];
    const id = opt ? opt.getAttribute('data-id') : null;
    const produk = allProducts.find((p) => String(p.Id) === String(id));
    selectedProduk = produk || (e.target.value ? { name: e.target.value, harga: opt?.getAttribute('data-harga') } : null);
    renderOrderSummary();
  });

  document.getElementById('checkout-form').addEventListener('submit', kirimPesan);

  renderOrderSummary();
  muatOpsiProduk();
});
