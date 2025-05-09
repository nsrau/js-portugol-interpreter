// src/js/themeManager.js

/**
 * Gere o tema claro/escuro da aplicação, incluindo o editor Monaco.
 */
export function initializeTheme(monacoThemeUpdateCallback) {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  function applyPageTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
      themeToggleBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
      );
    }

    // Atualiza a cor da seta do select de idioma e exemplos
    // A cor da seta é definida por uma variável CSS que contém o URL do SVG com a cor correta.
    // O CSS já lida com a troca da variável --select-arrow-url e --select-arrow-info-url com base no tema.

    if (typeof monacoThemeUpdateCallback === "function") {
      monacoThemeUpdateCallback(theme);
    }
  }

  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  applyPageTheme(currentTheme); // Aplica o tema inicial

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      let newTheme =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      applyPageTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        const newColorScheme = event.matches ? "dark" : "light";
        applyPageTheme(newColorScheme);
      }
    });
}
