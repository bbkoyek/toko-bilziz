/* ==========================================================================
   FOOTER.JS — Bilziz Sport (component)
   Dipasang ke <div id="footer"></div>. Juga menyisipkan tombol WA float.
   ========================================================================== */

function renderFooter({ base = '' } = {}) {
  const mount = document.getElementById('footer');
  if (mount) {
    mount.innerHTML = `
      <footer>
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand">
              <h2>BILZIZ <span>SPORT</span></h2>
              <p>Spesialis peralatan tenis meja terpercaya sejak 2019. Melayani seluruh Indonesia dengan produk berkualitas tinggi.</p>
            </div>
            <div class="footer-col">
              <h5>Produk</h5>
              <a href="${base}pages/product.html">Lihat Semua Produk</a>
            </div>
            <div class="footer-col">
              <h5>Ikuti Kami</h5>
              <a href="https://instagram.com/bilzizsport" target="_blank">Instagram</a>
              <a href="https://tiktok.com/@bilzizsport" target="_blank">TikTok</a>
              <a href="https://wa.me/6287803440181" target="_blank">WhatsApp</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 Bilziz Sport. All rights reserved. Jakarta Timur, Indonesia.</p>
            <div class="footer-sosmed">
              <a class="sosmed-link" href="https://instagram.com/bilzizsport" target="_blank">IG</a>
              <a class="sosmed-link" href="https://tiktok.com/@bilzizsport" target="_blank">TK</a>
              <a class="sosmed-link" href="https://wa.me/6287803440181" target="_blank">WA</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  const waMount = document.getElementById('wa-float');
  if (waMount) {
    waMount.innerHTML = `
      <div class="wa-float">
        <div class="wa-tooltip">Chat langsung via WhatsApp</div>
        <a class="wa-btn" href="https://wa.me/6287803440181?text=Halo%20Bilziz%20Sport,%20saya%20ingin%20menanyakan%20produk%20tenis%20meja" target="_blank">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    `;
  }
}
