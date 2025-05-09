// js/main.js
import { PortugolInterpreter } from "./PortugolInterpreter.js";
import { examples } from "./examples.js";
import { localization } from "./localization.js";
import { initializeTheme } from "./themeManager.js";

document.addEventListener("DOMContentLoaded", function () {
  const codeEditor = document.getElementById("code-editor");
  const syntaxHighlightOverlay = document.getElementById(
    "syntax-highlight-overlay"
  );
  const outputElement = document.getElementById("output");
  const runBtn = document.getElementById("run-btn");
  const clearBtn = document.getElementById("clear-btn");
  const examplesDropdownContent = document.getElementById(
    "examples-dropdown-content"
  );
  const languageSelector = document.getElementById("language-selector");
  const helpBtn = document.getElementById("help-btn");
  const helpModal = document.getElementById("help-modal");
  const closeHelpModalBtn = document.getElementById("close-help-modal");
  const favicon = document.getElementById("favicon");

  let currentLanguage = "pt";
  let currentLanguageConfig = localization[currentLanguage];

  initializeTheme();

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateSyntaxHighlight() {
    if (
      !currentLanguageConfig ||
      !currentLanguageConfig.keywords ||
      !syntaxHighlightOverlay
    )
      return;
    const code = codeEditor.value;

    const kw = currentLanguageConfig.keywords;
    const allKeywords = [
      kw.ALGORITHM,
      kw.VARIABLES,
      kw.START_BLOCK,
      kw.END_BLOCK,
      kw.END_BLOCK_ALT,
      kw.INTEGER,
      kw.REAL,
      kw.STRING,
      kw.BOOLEAN,
      kw.ARRAY_DEF,
      kw.OF_TYPE,
      kw.WRITE,
      kw.READ,
      kw.IF,
      kw.THEN,
      kw.ELSE,
      kw.END_IF,
      kw.FOR_LOOP,
      kw.FROM,
      kw.TO,
      kw.STEP,
      kw.DO_LOOP,
      kw.END_FOR,
      kw.WHILE_LOOP,
      kw.END_WHILE, // DO_LOOP já está incluído
      kw.TRUE,
      kw.FALSE,
      kw.LOGICAL_AND,
      kw.LOGICAL_OR,
      kw.LOGICAL_NOT,
      kw.FUNCTION_RANDOM,
    ]
      .filter(Boolean)
      .flat(); // flat para o caso de alguma keyword ser um array (não é o caso aqui, mas boa prática)

    const typeKeywords = Object.keys(currentLanguageConfig.types);
    const combinedKeywords = [...new Set([...allKeywords, ...typeKeywords])];

    const keywordRegexPart = combinedKeywords
      .filter((k) => k && k.trim() !== "")
      .sort((a, b) => b.length - a.length)
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    if (!keywordRegexPart) {
      syntaxHighlightOverlay.textContent = code;
      return;
    }

    const tokenPatterns = [
      { type: "comment", regex: /(\/\/.*$)/gm }, // $ para fim de linha, m para multiline
      { type: "string", regex: /("[^"]*?"|'[^']*?')/g }, // Suporta aspas duplas e simples
      {
        type: "keyword",
        regex: new RegExp(`\\b(${keywordRegexPart})\\b`, "gi"),
      },
      { type: "number", regex: /\b(\d+\.?\d*)\b/g },
      { type: "operator", regex: /(<-|<=|>=|<>|[=+\-*/%])/g },
    ];

    let highlightedCode = escapeHtml(code); // Escapa HTML primeiro

    tokenPatterns.forEach((pattern) => {
      highlightedCode = highlightedCode.replace(
        pattern.regex,
        (match, group1) => {
          // Para comentários, não aplicar outras classes dentro deles
          // A captura de grupo (group1) é importante para o regex de comentário
          const contentToWrap =
            pattern.type === "comment" ? group1 || match : match;
          if (pattern.type === "comment" && contentToWrap.includes("<span"))
            return contentToWrap; // Evita re-wrapping
          return `<span class="${pattern.type}">${escapeHtml(
            contentToWrap
          )}</span>`;
        }
      );
    });

    syntaxHighlightOverlay.innerHTML = highlightedCode + "\n"; // Adiciona uma nova linha para garantir scroll sync no final

    // Sincronizar scroll
    syntaxHighlightOverlay.scrollTop = codeEditor.scrollTop;
    syntaxHighlightOverlay.scrollLeft = codeEditor.scrollLeft;
  }

  codeEditor.addEventListener("input", updateSyntaxHighlight);
  codeEditor.addEventListener("scroll", () => {
    if (syntaxHighlightOverlay) {
      syntaxHighlightOverlay.scrollTop = codeEditor.scrollTop;
      syntaxHighlightOverlay.scrollLeft = codeEditor.scrollLeft;
    }
  });
  codeEditor.addEventListener("keydown", (e) => {
    // Permite a funcionalidade do Tab para indentação (simples)
    if (e.key === "Tab") {
      e.preventDefault();
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      codeEditor.value =
        codeEditor.value.substring(0, start) +
        "\t" +
        codeEditor.value.substring(end);
      codeEditor.selectionStart = codeEditor.selectionEnd = start + 1;
      updateSyntaxHighlight();
    }
  });

  function updateUIForLanguage(lang) {
    currentLanguage = lang;
    currentLanguageConfig = localization[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-translate-key]").forEach((element) => {
      const key = element.getAttribute("data-translate-key");
      let textContent = currentLanguageConfig[key]; // Tenta buscar na raiz da config de idioma

      if (textContent === undefined && key.startsWith("keywords.")) {
        // Se for uma keyword
        const kwKey = key.substring("keywords.".length);
        textContent = currentLanguageConfig.keywords[kwKey];
      }

      if (textContent === undefined) {
        // Fallback para chaves aninhadas
        const path = key.split(".");
        let text = currentLanguageConfig;
        path.forEach((p) => {
          text = text ? text[p] : undefined;
        });
        textContent = typeof text === "string" ? text : `[${key}]`;
      }
      element.textContent = textContent;
    });

    // Atualiza os exemplos de sintaxe no modal de ajuda
    document
      .querySelectorAll("#help-modal-body code[data-kw-key]")
      .forEach((codeEl) => {
        const kwKey = codeEl.getAttribute("data-kw-key");
        if (currentLanguageConfig.keywords[kwKey]) {
          codeEl.textContent = currentLanguageConfig.keywords[kwKey];
        }
      });
    document
      .querySelectorAll("#help-modal-body code[data-op-key]")
      .forEach((codeEl) => {
        const opKey = codeEl.getAttribute("data-op-key");
        if (currentLanguageConfig.keywords[opKey]) {
          codeEl.textContent = currentLanguageConfig.keywords[opKey];
        }
      });

    // Atualiza o título da página
    document.title = currentLanguageConfig.appTitle || "Interpretador";
    // Atualiza o favicon
    if (favicon) {
      if (lang === "pt") {
        favicon.href =
          "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🇵🇹</text></svg>";
      } else if (lang === "it") {
        favicon.href =
          "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🇮🇹</text></svg>";
      }
    }

    loadExamplesForLanguage(lang);
    updateSyntaxHighlight();
  }

  function loadExamplesForLanguage(lang) {
    if (examplesDropdownContent) {
      examplesDropdownContent.innerHTML = "";
      const langExamples = examples[lang] || examples.pt;

      for (const key in langExamples) {
        if (langExamples.hasOwnProperty(key)) {
          const example = langExamples[key];
          const link = document.createElement("a");
          link.textContent = example.name;
          link.href = "#";
          link.addEventListener("click", (e) => {
            e.preventDefault();
            codeEditor.value = example.code;
            updateSyntaxHighlight();
            if (examplesDropdownContent)
              examplesDropdownContent.style.display = "none";
            // Pequeno timeout para permitir que o display:none seja processado antes de remover
            // para que o hover no pai (.examples-dropdown) não o reabra imediatamente.
            setTimeout(() => {
              if (examplesDropdownContent)
                examplesDropdownContent.style.display = "";
            }, 50);
          });
          examplesDropdownContent.appendChild(link);
        }
      }
    }
  }

  languageSelector.addEventListener("change", (event) => {
    updateUIForLanguage(event.target.value);
  });

  if (helpBtn && helpModal && closeHelpModalBtn) {
    helpBtn.addEventListener("click", () => {
      helpModal.style.display = "block";
    });
    closeHelpModalBtn.addEventListener("click", () => {
      helpModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
      if (event.target == helpModal) {
        helpModal.style.display = "none";
      }
    });
  }

  clearBtn.addEventListener("click", function () {
    codeEditor.value = "";
    if (outputElement) outputElement.innerHTML = "";
    updateSyntaxHighlight();
  });

  runBtn.addEventListener("click", function () {
    executeCode();
  });

  function executeCode() {
    if (outputElement) outputElement.innerHTML = "";
    const code = codeEditor.value;

    try {
      const interpreter = new PortugolInterpreter(
        code,
        outputElement,
        currentLanguageConfig
      );
      interpreter.run();
    } catch (error) {
      if (outputElement) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error";
        // Usa a mensagem de erro prefixada do ficheiro de localização
        const prefix = currentLanguageConfig.messages.errorPrefix || "ERRO";
        errorDiv.textContent = `${prefix}: ${error.message}`;
        outputElement.appendChild(errorDiv);
      }
      console.error(
        "Erro de interpretação:",
        error.message,
        error.stack ? "\n" + error.stack : ""
      );
    }
  }

  const initialLang = languageSelector.value || "pt";
  updateUIForLanguage(initialLang);

  const defaultExampleKey =
    currentLanguage === "pt" ? "pedroJose" : "pietroGiuseppe";
  if (
    examples[currentLanguage] &&
    examples[currentLanguage][defaultExampleKey]
  ) {
    codeEditor.value = examples[currentLanguage][defaultExampleKey].code;
  } else if (
    examples[currentLanguage] &&
    Object.keys(examples[currentLanguage]).length > 0
  ) {
    codeEditor.value =
      examples[currentLanguage][Object.keys(examples[currentLanguage])[0]].code;
  }
  updateSyntaxHighlight();
});
