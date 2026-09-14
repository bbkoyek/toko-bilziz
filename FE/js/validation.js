/* ==========================================================================
   VALIDATION.JS — Bilziz Sport
   Validasi form sisi klien. Setiap fungsi mengembalikan
   { valid: boolean, errors: { fieldName: 'pesan error' } }
   ========================================================================== */

const Validation = {
  isEmpty(value) {
    return value === null || value === undefined || String(value).trim() === '';
  },

  isValidPhone(value) {
    // Nomor WA Indonesia: dimulai 08 atau +62/62, 9-13 digit.
    return /^(?:\+?62|0)8[0-9]{8,11}$/.test(String(value).trim());
  },

  validateLoginForm({ username, password }) {
    const errors = {};
    if (this.isEmpty(username)) errors.username = 'Username wajib diisi.';
    if (this.isEmpty(password)) errors.password = 'Password wajib diisi.';
    return { valid: Object.keys(errors).length === 0, errors };
  },

  validateOrderForm({ nama, wa, produk, kota }) {
    const errors = {};
    if (this.isEmpty(nama)) errors.nama = 'Nama wajib diisi.';
    if (this.isEmpty(wa)) {
      errors.wa = 'No. WhatsApp wajib diisi.';
    } else if (!this.isValidPhone(wa)) {
      errors.wa = 'Format nomor WhatsApp tidak valid.';
    }
    if (this.isEmpty(produk)) errors.produk = 'Pilih produk yang diminati.';
    if (this.isEmpty(kota)) errors.kota = 'Kota tujuan wajib diisi.';
    return { valid: Object.keys(errors).length === 0, errors };
  },

  validateProductForm({ name, harga }) {
    const errors = {};
    if (this.isEmpty(name)) errors.name = 'Nama produk wajib diisi.';
    if (this.isEmpty(harga) || Number.isNaN(Number(harga))) errors.harga = 'Harga wajib berupa angka.';
    return { valid: Object.keys(errors).length === 0, errors };
  },

  /** Terapkan pesan error ke elemen .form-group yang membungkus sebuah input. */
  applyFieldErrors(formEl, errors) {
    formEl.querySelectorAll('.form-group').forEach((group) => {
      group.classList.remove('has-error');
      const errEl = group.querySelector('.field-error');
      if (errEl) errEl.textContent = '';
    });
    Object.entries(errors).forEach(([field, message]) => {
      const input = formEl.querySelector(`[name="${field}"], #${CSS.escape(field)}`);
      const group = input ? input.closest('.form-group') : null;
      if (group) {
        group.classList.add('has-error');
        const errEl = group.querySelector('.field-error');
        if (errEl) errEl.textContent = message;
      }
    });
  }
};
