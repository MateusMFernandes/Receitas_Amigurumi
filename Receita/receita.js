// Ano automático
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Header shadow on scroll
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// Botão compartilhar — compartilha o link da receita
document.getElementById("btnShare").addEventListener("click", () => {
  const title = document.querySelector(".recipe-title")?.innerText || document.title;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({ title, url })
      .catch(() => {}); // ignora cancelamento do usuário
  } else {
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copiado para a área de transferência!"))
      .catch(() => alert("Não foi possível copiar o link. Copie manualmente: " + url));
  }
});