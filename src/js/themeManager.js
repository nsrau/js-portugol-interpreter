// js/themeManager.js

/**
 * Gere o tema claro/escuro da aplicação.
 * Ouve as preferências do sistema e permite a alternância manual.
 */
export function initializeTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Função para aplicar o tema
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggleBtn) {
            themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙'; // Sol para tema escuro (para mudar para claro), Lua para tema claro
            themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
        }
    }

    // Determina o tema inicial
    // 1. Verifica o localStorage
    // 2. Verifica a preferência do sistema
    // 3. Padrão para 'light'
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(currentTheme);

    // Event listener para o botão de alternar tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme); // Guarda a preferência manual
        });
    }

    // Ouve mudanças na preferência de tema do sistema (se não houver preferência manual)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) { // Só atualiza se o utilizador não tiver definido manualmente
            const newColorScheme = event.matches ? "dark" : "light";
            applyTheme(newColorScheme);
        }
    });
}
