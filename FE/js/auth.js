/* ==========================================================================
   AUTH.JS — Bilziz Sport
   Manajemen sesi login admin.

   Catatan: di file HTML lama, token JWT hanya disimpan di variabel JS
   (hilang saat refresh). Sekarang situs terdiri dari banyak halaman
   (index.html, pages/login.html, pages/admin.html, dst), jadi token
   perlu bertahan saat berpindah halaman. Untuk itu dipakai
   sessionStorage: token hilang otomatis saat tab ditutup, tapi tetap
   ada selama navigasi antar halaman di tab yang sama.
   ========================================================================== */

const Auth = {
  TOKEN_KEY: 'bilziz_admin_token',
  USER_KEY: 'bilziz_admin_username',

  setSession(token, username) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USER_KEY, username);
  },

  getToken() {
    return sessionStorage.getItem(this.TOKEN_KEY);
  },

  getUsername() {
    return sessionStorage.getItem(this.USER_KEY);
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  clearSession() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  },

  /** Panggil di halaman admin: redirect ke login.html kalau belum login. */
  requireAuth(loginPagePath = 'login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = loginPagePath;
      return false;
    }
    return true;
  }
};
