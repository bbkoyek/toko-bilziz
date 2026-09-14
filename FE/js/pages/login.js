/* ==========================================================================
   LOGIN.JS — Bilziz Sport (pages/login.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar({ base: '../', active: '' });
  renderFooter({ base: '../' });

  // Sudah login? Langsung lempar ke admin.
  if (Auth.isLoggedIn()) {
    window.location.href = 'admin.html';
    return;
  }

  const form = document.getElementById('login-form');
  const submitBtn = document.getElementById('login-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const { valid, errors } = Validation.validateLoginForm({ username, password });
    Validation.applyFieldErrors(form, errors);
    if (!valid) return;

    const restore = Loading.setButtonBusy(submitBtn, 'Memproses...');
    try {
      const token = await Api.login(username, password);
      Auth.setSession(token, username);
      Notify.success('Login berhasil! Mengalihkan ke panel admin...');
      setTimeout(() => { window.location.href = 'admin.html'; }, 600);
    } catch (err) {
      Notify.error(err.message || 'Gagal login. Pastikan server backend berjalan.');
    } finally {
      restore();
    }
  });
});
