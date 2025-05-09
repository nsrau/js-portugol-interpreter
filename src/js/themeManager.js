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
    // Atualiza a variável CSS para a seta do select
    const arrowColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--select-arrow-svg-fill")
      .trim();
    document.documentElement.style.setProperty(
      "--dynamic-select-arrow",
      `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22${arrowColor}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`
    );

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
