/* ==========================================================================
   LOADING.JS — Bilziz Sport
   Overlay loading full-screen (untuk aksi seperti login, hapus produk, dll).
   Butuh css/modal.css (.loading-overlay, .loading-spinner).
   ========================================================================== */

const Loading = {
  _ensureOverlay() {
    let el = document.getElementById('loading-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'loading-overlay';
      el.className = 'loading-overlay';
      el.innerHTML = '<div class="loading-spinner"></div>';
      document.body.appendChild(el);
    }
    return el;
  },

  show() {
    this._ensureOverlay().classList.add('show');
  },

  hide() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('show');
  },

  /** Set tombol ke keadaan "memproses..." dan kembalikan fungsi untuk memulihkannya. */
  setButtonBusy(btnEl, busyText = 'Memproses...') {
    const original = btnEl.textContent;
    btnEl.disabled = true;
    btnEl.textContent = busyText;
    return () => {
      btnEl.disabled = false;
      btnEl.textContent = original;
    };
  }
};
