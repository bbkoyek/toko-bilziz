/* ==========================================================================
   SIDEBAR.JS — Bilziz Sport (component)
   Sidebar khusus halaman admin. Dipasang ke <div id="sidebar"></div>.
   ========================================================================== */

function renderSidebar({ base = '../', active = 'produk' } = {}) {
  const mount = document.getElementById('sidebar');
  if (!mount) return;

  const item = (key, label, icon) => `
    <a href="#" data-tab="${key}" class="admin-nav-link ${active === key ? 'active' : ''}">
      <span class="admin-nav-icon">${icon}</span> ${label}
    </a>
  `;

  mount.innerHTML = `
    <aside class="admin-sidebar">
      <div class="admin-sidebar-title">Panel Admin</div>
      <nav class="admin-sidebar-nav">
        ${item('produk', 'Data Produk', '🏓')}
      </nav>
      <a href="${base}index.html" class="admin-sidebar-back">&larr; Kembali ke Situs</a>
    </aside>
  `;
}
