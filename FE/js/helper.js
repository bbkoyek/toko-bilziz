/* ==========================================================================
   HELPER.JS — Bilziz Sport
   Fungsi utilitas kecil yang dipakai di banyak halaman.
   ========================================================================== */

/** Format angka harga jadi "RpXX.XXX" ala Indonesia. */
function formatHarga(harga) {
  if (harga === null || harga === undefined || harga === '') return '';
  const num = Number(harga);
  if (Number.isNaN(num)) return String(harga);
  return 'Rp' + num.toLocaleString('id-ID');
}

/**
 * Backend mengembalikan "image" sebagai array (nama file). Fungsi ini
 * menormalkan ke satu URL gambar siap pakai, atau null jika kosong
 * sehingga tampilan bisa fallback ke ikon.
 */

const IMAGE_SIZE_PATH = {
  thumbnail: 'thumnail', 
  medium: 'medium',
  original: 'original'
};

/** Bangun URL gambar untuk 1 nama file, sesuai ukuran yang diminta. */
function imageUrl(filename, size = 'thumbnail') {
  if (!filename) return null;
  if (/^https?:\/\//i.test(filename) || filename.startsWith('/') || filename.startsWith('data:')) {
    return filename; // sudah URL utuh, tidak perlu diubah
  }
  const folder = IMAGE_SIZE_PATH[size] || IMAGE_SIZE_PATH.thumbnail;
  return `${SERVER_BASE}/upload/${folder}/${filename}`;
}

/** Ambil gambar pertama dari array "image" milik produk, ukuran bisa dipilih. */
function firstImageUrl(images, size = 'thumbnail') {
  if (!Array.isArray(images) || images.length === 0) return null;
  return imageUrl(images[0], size);
}

// function firstImageUrl(images) {
//   if (!Array.isArray(images) || images.length === 0) return null;
//   const first = images[0];
//   if (!first) return null;
//   if (/^https?:\/\//i.test(first) || first.startsWith('/') || first.startsWith('data:')) {
//     return first;
//   }
//   // Backend menyajikan gambar di baseurl/img/<nama file>.
//   return `${SERVER_BASE}/upload/${first}`;
// }

/** Escape teks supaya aman disisipkan ke innerHTML (cegah XSS sederhana). */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/** Ambil parameter query string dari URL saat ini, mis. getQueryParam('produk'). */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/** Debounce sederhana, dipakai untuk kotak pencarian produk. */
function debounce(fn, delay = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
