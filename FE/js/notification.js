/* ==========================================================================
   NOTIFICATION.JS — Bilziz Sport
   Toast notifikasi kecil di pojok kanan atas. Membutuhkan css/modal.css
   (.toast-wrap, .toast) dan sebuah <div id="toast-wrap"></div> di halaman,
   atau akan dibuat otomatis jika belum ada.
   ========================================================================== */

const Notify = {
  _ensureWrap() {
    let wrap = document.getElementById('toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-wrap';
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    return wrap;
  },

  show(message, type = 'info', duration = 3500) {
    const wrap = this._ensureWrap();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    wrap.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(message, duration) { this.show(message, 'success', duration); },
  error(message, duration) { this.show(message, 'error', duration); },
  info(message, duration) { this.show(message, 'info', duration); }
};
