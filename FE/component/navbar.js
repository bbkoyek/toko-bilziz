/* ==========================================================================
   NAVBAR.JS — Bilziz Sport (component)
   Render navbar yang sama di semua halaman. Dipasang ke <div id="navbar"></div>.

   options:
     base       - prefix relatif ke root ('' di index.html, '../' di pages/*.html)
     active     - id link yang aktif: 'produk' | 'galeri' | 'pesan' | 'kontak' | ''
   ========================================================================== */

function renderNavbar({ base = '', active = '' } = {}) {
  const mount = document.getElementById('navbar');
  if (!mount) return;

  const isActive = (name) => (active === name ? 'active' : '');

  mount.innerHTML = `
    <nav>
      <a class="nav-logo" href="${base}index.html">BILZIZ <span>SPORT</span></a>
      <div class="nav-links">
        <a href="${base}index.html#produk" class="${isActive('produk')}">Produk</a>
        <a href="${base}pages/product.html" class="${isActive('product')}">Semua Produk</a>
        <a href="${base}index.html#galeri" class="${isActive('galeri')}">Galeri</a>
        <a href="${base}index.html#kontak" class="${isActive('kontak')}">Kontak</a>
        <form class="nav-search" id="nav-search-form" role="search">
          <input type="text" id="nav-search-input" placeholder="Cari produk...">
          <button type="submit" aria-label="Cari">🔍</button>
        </form>
        <a class="nav-login-link" id="nav-login-link" href="${base}pages/login.html">Login</a>
      </div>
      <div class="nav-admin-badge" id="nav-admin-badge">
        <span class="dot"></span>
        <span id="nav-admin-name">Admin</span>
        <a class="nav-dashboard-btn" id="nav-dashboard-btn" href="${base}pages/admin.html">Dashboard</a>
        <button class="nav-logout-btn" id="nav-logout-btn">Logout</button>
      </div>
      <a class="nav-cta" href="${base}pages/checkout.html">Pesan Sekarang</a>
    </nav>
  `;

  updateNavbarAuthState(base);

  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.clearSession();
      updateNavbarAuthState(base);
      Notify.info('Kamu sudah logout.');
    });
  }

  const searchForm = document.getElementById('nav-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('nav-search-input').value.trim();
      window.location.href = `${base}pages/product.html` + (q ? `?q=${encodeURIComponent(q)}` : '');
    });
  }
}

/** Tampilkan badge admin jika sudah login, atau link Login jika belum. */
function updateNavbarAuthState(base = '') {
  const loginLink = document.getElementById('nav-login-link');
  const badge = document.getElementById('nav-admin-badge');
  const nameEl = document.getElementById('nav-admin-name');
  if (!loginLink || !badge) return;

  if (Auth.isLoggedIn()) {
    loginLink.style.display = 'none';
    badge.classList.add('show');
    if (nameEl) nameEl.textContent = Auth.getUsername() || 'Admin';
  } else {
    loginLink.style.display = '';
    badge.classList.remove('show');
  }
}
