// src/js/main.js
import { PortugolInterpreter } from "./PortugolInterpreter.js";
import { examples } from "./examples.js";
import { localization } from "./localization.js";
import { initializeTheme } from "./themeManager.js";

document.addEventListener("DOMContentLoaded", function () {
  const monacoEditorContainer = document.getElementById(
    "monaco-editor-container"
  );
  const outputElement = document.getElementById("output");
  const runBtn = document.getElementById("run-btn");
  const clearBtn = document.getElementById("clear-btn");
  const examplesSelector = document.getElementById("examples-selector"); // Alterado para select
  const languageSelector = document.getElementById("language-selector");
  const helpBtn = document.getElementById("help-btn");
  const helpModal = document.getElementById("help-modal");
  const closeHelpModalBtn = document.getElementById("close-help-modal");
  const favicon = document.getElementById("favicon");

  let currentLanguage = "pt";
  let currentLanguageConfig = localization[currentLanguage];
  let monacoEditor; // Variável para guardar a instância do editor Monaco

  initializeTheme(); // Inicializa o tema (claro/escuro)

  // --- Configuração do Monaco Editor ---
  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs",
    },
  });
  require(["vs/editor/editor.main"], function () {
    // Função para registar a linguagem dinamicamente
    function registerPortugolLanguage(langConfig) {
      const langId = "portugol-custom"; // Usar um ID fixo, mas redefinir as regras

      // Remove a definição anterior se existir, para evitar erros ao re-registrar
      const existingLanguages = monaco.languages.getLanguages();
      if (existingLanguages.some((lang) => lang.id === langId)) {
        // Não há uma forma direta de "desregistrar" ou "atualizar" um provider de tokens Monarch.
        // A melhor abordagem é garantir que o novo `setMonarchTokensProvider` sobrescreva o antigo
        // ou usar IDs de linguagem diferentes (ex: 'portugol-pt', 'portugol-it'),
        // mas isso exigiria mudar o `language` do editor a cada troca.
        // Por simplicidade, vamos sobrescrever.
      }

      monaco.languages.register({ id: langId });

      const kw = langConfig.keywords;
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
        kw.END_WHILE,
        kw.TRUE,
        kw.FALSE,
        kw.LOGICAL_AND,
        kw.LOGICAL_OR,
        kw.LOGICAL_NOT,
        kw.FUNCTION_RANDOM,
      ]
        .filter(Boolean)
        .flat()
        .map((k) => k.toLowerCase()); // Todas as keywords em minúsculas

      const typeKeywords = Object.keys(langConfig.types).map((k) =>
        k.toLowerCase()
      );
      const combinedKeywordsForRegex = [
        ...new Set([...allKeywords, ...typeKeywords]),
      ]
        .sort((a, b) => b.length - a.length) // Importante para o regex
        .join("|");

      monaco.languages.setMonarchTokensProvider(langId, {
        defaultToken: "invalid",
        ignoreCase: true, // Monarch trata case-insensitivity, mas o regex também pode
        keywords: combinedKeywordsForRegex.split("|"), // Passar como array para Monarch
        typeKeywords: typeKeywords,
        operators: [
          "<-",
          "<=",
          ">=",
          "<>",
          "=",
          "+",
          "-",
          "*",
          "/",
          "%",
          langConfig.keywords.LOGICAL_AND,
          langConfig.keywords.LOGICAL_OR,
          langConfig.keywords.LOGICAL_NOT,
        ].map((op) => op.toLowerCase()),
        symbols: /[=><!~?:&|+\-*/^%]+/,

        tokenizer: {
          root: [
            // Identificadores e Palavras-chave
            [
              /[a-zA-Z_]\w*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@typeKeywords": "type",
                  "@operators": "operator", // Para operadores como 'e', 'ou', 'nao'
                  "@default": "identifier",
                },
              },
            ],

            // Números
            [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
            [/\d+/, "number"],

            // Delimitadores e parênteses
            [/[;,.]/, "delimiter"],
            [/[()\[\]]/, "@brackets"],

            // Strings
            [/"([^"\\]|\\.)*$/, "string.invalid"], // String não fechada
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

            // Comentários
            [/\/\/.*$/, "comment"],

            // Operadores (símbolos)
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "",
                },
              },
            ],
          ],
          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
        },
      });

      // Define o tema (pode ser chamado uma vez, mas as cores podem vir de vars CSS)
      monaco.editor.defineTheme("portugol-theme-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "569CD6", fontStyle: "bold" }, // Azul para keywords
          { token: "type", foreground: "4EC9B0" }, // Turquesa para tipos
          { token: "identifier", foreground: "9CDCFE" }, // Azul claro para identificadores
          { token: "operator", foreground: "D4D4D4" }, // Cinza claro para operadores
          { token: "number", foreground: "B5CEA8" }, // Verde claro para números
          { token: "string", foreground: "CE9178" }, // Laranja/castanho para strings
          { token: "comment", foreground: "6A9955", fontStyle: "italic" }, // Verde para comentários
          { token: "delimiter", foreground: "D4D4D4" },
          { token: "invalid", foreground: "FF0000", fontStyle: "bold" }, // Vermelho para inválido
        ],
        colors: {
          "editor.background": "#1E1E1E",
          "editor.foreground": "#D4D4D4",
        },
      });
      monaco.editor.defineTheme("portugol-theme-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "0000FF", fontStyle: "bold" },
          { token: "type", foreground: "267F99" },
          { token: "identifier", foreground: "001080" },
          { token: "operator", foreground: "A71D5D" },
          { token: "number", foreground: "098658" },
          { token: "string", foreground: "A31515" },
          { token: "comment", foreground: "008000", fontStyle: "italic" },
          { token: "delimiter", foreground: "000000" },
          { token: "invalid", foreground: "FF0000", fontStyle: "bold" },
        ],
        colors: {
          "editor.background": "#FFFFFF",
          "editor.foreground": "#000000",
        },
      });
    }

    // Inicializa o editor Monaco
    monacoEditor = monaco.editor.create(monacoEditorContainer, {
      value: "",
      language: "portugol-custom", // ID da linguagem registrada
      theme:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "portugol-theme-dark"
          : "portugol-theme-light",
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      wordWrap: "on", // Quebra de linha automática
      padding: { top: 10, bottom: 10 },
    });

    function updateTheme() {
      setTimeout(() => {
        const newTheme = document.documentElement.getAttribute("data-theme");
          monacoEditor.updateOptions({
            theme:
              newTheme === "dark"
                ? "portugol-theme-dark"
                : "portugol-theme-light",
          });
      }); // Para garantir que o Monaco já está carregado
    }
    updateTheme()

    // Atualiza o tema do editor quando o tema da página muda
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          updateTheme()
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    // --- Restante da lógica de UI ---
    function updateUIForLanguage(lang) {
      currentLanguage = lang;
      currentLanguageConfig = localization[lang];
      document.documentElement.lang = lang;

      registerPortugolLanguage(currentLanguageConfig); // Re-registra a linguagem com as novas keywords
      if (monacoEditor) {
        monaco.editor.setModelLanguage(
          monacoEditor.getModel(),
          "portugol-custom"
        );
      }

      document.querySelectorAll("[data-translate-key]").forEach((element) => {
        const key = element.getAttribute("data-translate-key");
        let textContent;

        if (currentLanguageConfig.hasOwnProperty(key)) {
          textContent = currentLanguageConfig[key];
        } else if (
          key.startsWith("keywords.") &&
          currentLanguageConfig.keywords.hasOwnProperty(
            key.substring("keywords.".length)
          )
        ) {
          const kwKey = key.substring("keywords.".length);
          textContent = currentLanguageConfig.keywords[kwKey];
          if (element.classList.contains("help-kw-title")) {
            textContent =
              textContent.charAt(0).toUpperCase() + textContent.slice(1);
          }
        } else if (currentLanguageConfig.messages.hasOwnProperty(key)) {
          textContent = currentLanguageConfig.messages[key];
        } else {
          const path = key.split(".");
          let text = currentLanguageConfig;
          path.forEach((p) => {
            text = text ? text[p] : undefined;
          });
          textContent = typeof text === "string" ? text : `[${key}]`;
        }
        element.textContent = textContent;
      });

      document
        .querySelectorAll("#help-modal-body code[data-kw-key]")
        .forEach((codeEl) => {
          const kwKey = codeEl.getAttribute("data-kw-key");
          if (currentLanguageConfig.keywords[kwKey]) {
            codeEl.textContent = currentLanguageConfig.keywords[kwKey];
          } else {
            codeEl.textContent = `[kw:${kwKey}]`;
          }
        });
      document
        .querySelectorAll("#help-modal-body code[data-op-key]")
        .forEach((codeEl) => {
          const opKey = codeEl.getAttribute("data-op-key");
          if (currentLanguageConfig.keywords[opKey]) {
            codeEl.textContent = currentLanguageConfig.keywords[opKey];
          } else {
            codeEl.textContent = `[op:${opKey}]`;
          }
        });

      const helpExampleAlgorithmNameEl = document.querySelector(
        '#help-modal-body span[data-translate-key="helpExampleAlgorithmName"]'
      );
      if (helpExampleAlgorithmNameEl) {
        helpExampleAlgorithmNameEl.textContent =
          currentLanguageConfig.messages.helpExampleAlgorithmName ||
          (currentLanguage === "pt" ? "NomeDoAlgoritmo" : "NomeAlgoritmo");
      }
      const helpExampleStringEl = document.querySelector(
        '#help-modal-body span[data-translate-key="helpExampleString"]'
      );
      if (helpExampleStringEl) {
        helpExampleStringEl.textContent =
          currentLanguageConfig.messages.helpExampleString ||
          (currentLanguage === "pt" ? "Olá" : "Ciao");
      }

      document.title = currentLanguageConfig.appTitle || "Interpretador";
      if (favicon) {
        if (lang === "pt") {
          favicon.href =
            "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🇵🇹</text></svg>";
        } else if (lang === "it") {
          favicon.href =
            "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🇮🇹</text></svg>";
        }
      }

      if (monacoEditor) monacoEditor.setValue("");
      if (outputElement) outputElement.innerHTML = "";
      loadExamplesForLanguage(lang);

      const defaultExampleKey =
        currentLanguage === "pt" ? "olaMundo" : "ciaoMondo";
      if (
        monacoEditor &&
        examples[currentLanguage] &&
        examples[currentLanguage][defaultExampleKey]
      ) {
        monacoEditor.setValue(
          examples[currentLanguage][defaultExampleKey].code
        );
      } else if (
        monacoEditor &&
        examples[currentLanguage] &&
        Object.keys(examples[currentLanguage]).length > 0
      ) {
        monacoEditor.setValue(
          examples[currentLanguage][Object.keys(examples[currentLanguage])[0]]
            .code
        );
      }
    }

    function loadExamplesForLanguage(lang) {
      if (examplesSelector) {
        examplesSelector.innerHTML = ""; // Limpa opções anteriores
        const langExamples = examples[lang] || examples.pt;

        // Adiciona uma opção placeholder
        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent =
          currentLanguageConfig.examplesButton || "Exemplos"; // Usa a tradução do botão
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        examplesSelector.appendChild(placeholderOption);

        for (const key in langExamples) {
          if (langExamples.hasOwnProperty(key)) {
            const example = langExamples[key];
            const option = document.createElement("option");
            option.value = example.code; // O valor da opção será o código
            option.textContent = example.name;
            examplesSelector.appendChild(option);
          }
        }
      }
    }

    if (examplesSelector) {
      examplesSelector.addEventListener("change", (e) => {
        if (e.target.value && monacoEditor) {
          // Garante que não é a opção placeholder
          monacoEditor.setValue(e.target.value);
          // Opcional: resetar o select para o placeholder após a seleção
          // e.target.selectedIndex = 0;
        }
      });
    }

    if (languageSelector) {
      languageSelector.addEventListener("change", (event) => {
        updateUIForLanguage(event.target.value);
      });
    }

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

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (monacoEditor) monacoEditor.setValue("");
        if (outputElement) outputElement.innerHTML = "";
      });
    }

    if (runBtn) {
      runBtn.addEventListener("click", function () {
        executeCode();
      });
    }

    function executeCode() {
      if (outputElement) outputElement.innerHTML = "";
      const code = monacoEditor ? monacoEditor.getValue() : "";

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

    const initialLang = languageSelector ? languageSelector.value : "pt";
    updateUIForLanguage(initialLang);
  }); // Fim do require do Monaco
});
