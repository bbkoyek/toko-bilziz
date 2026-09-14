/* ==========================================================================
   API.JS — Bilziz Sport
   Konfigurasi backend + semua fungsi fetch ke server.
   Sesuaikan API_BASE jika backend di-deploy ke domain/port lain.
   ========================================================================== */

require('dotenv').config();

// const SERVER_BASE = 'https://kfw3bfr4-2000.asse.devtunnels.ms';
const SERVER_BASE = 'http://127.0.0.1:2000';
const API_BASE = `${SERVER_BASE}/toko`;
const ADMIN_BASE = `${API_BASE}/admin`;
const WA_NUMBER = '6287803440181';

const Api = {
  /** Ambil semua produk. GET /toko */
  async getProducts() {
    const res = await fetch(`${API_BASE}`, { method: 'GET' });
    if (!res.ok) throw new Error('Gagal mengambil data produk (' + res.status + ')');
    const json = await res.json();
    if (json.status !== 'success') throw new Error(json.message || 'Gagal mengambil data produk');
    return Array.isArray(json.data) ? json.data : [];
  },

  /** Cari produk berdasarkan kata kunci. GET /toko/search?key= */
  async searchProducts(keyword) {
    const res = await fetch(`${API_BASE}/search?key=${encodeURIComponent(keyword)}`);
    const json = await res.json();
    if (json.status !== 'success') throw new Error(json.message || 'Pencarian gagal');
    return Array.isArray(json.data) ? json.data : [];
  },

  /** Login admin, mengembalikan JWT token. POST /toko/login */
  async login(username, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (!res.ok || !json.token) {
      throw new Error(json.message || 'Username atau password salah.');
    }
    return json.token;
  },

  /** Tambah produk baru. POST /toko/admin — form-data + Bearer token. */
  async createProduct(token, { name, deskripsi, harga, imageFile }) {
    const form = new FormData();
    form.append('name', name);
    if (deskripsi) form.append('deskripsi', deskripsi);
    form.append('harga', harga);
    if (imageFile) form.append('images', imageFile);

    const res = await fetch(`${ADMIN_BASE}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') throw new Error(json.message || 'Gagal menambah produk');
    return json.data;
  },

  /** Ubah produk. PUT /toko/admin — form-data + Bearer token. Wajib sertakan Id. */
  async updateProduct(token, { id, name, deskripsi, harga, imageFile, deleteImages = [] }) {
    const form = new FormData();
    form.append('id', id);
    console.log('product id : ',id);
    if (name !== undefined) form.append('name', name);
    if (deskripsi !== undefined) form.append('deskripsi', deskripsi);
    if (harga !== undefined) form.append('harga', harga);
    if (imageFile) form.append('images', imageFile);
    deleteImages.forEach((filename) => form.append('delete_image', filename));

    const res = await fetch(`${ADMIN_BASE}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') throw new Error(json.message || 'Gagal mengubah produk');
    return json.data;
  },

  /** Hapus produk. DELETE /toko/admin — form-data, key: id. */
  async deleteProduct(token, id) {
    const form = new FormData();
    form.append('id', id);
    const res = await fetch(`${ADMIN_BASE}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    const json = await res.json();
    if (!res.ok || json.status !== 'success') throw new Error(json.message || 'Gagal menghapus produk');
    return true;
  }
};
