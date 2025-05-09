// js/PortugolInterpreter.js

/**
 * Classe principal do Interpretador de Portugol/Italiano.
 * Responsável por analisar e executar o código na linguagem selecionada.
 */
export class PortugolInterpreter {
  constructor(code, outputElement, languageConfig) {
    this.code = code;
    this.outputElement = outputElement;
    this.config = languageConfig; // Configuração de idioma (palavras-chave, mensagens)
    this.variables = {};
    this.arrays = {};
    this.lines = this.code.split("\n");

    this.tokenRegex = this.buildTokenRegex();
    this.currentTokenIndex = 0;
    this.tokens = [];
  }

  buildTokenRegex() {
    const keywords = Object.values(this.config.keywords).flat();
    const fixedTokens = [
      "<=",
      ">=",
      "<>",
      "<-",
      ":=",
      "=",
      "\\+",
      "-",
      "\\*",
      "/",
      "%",
      "\\(",
      "\\)",
      "\\[",
      "\\]",
      ":",
      ",",
    ];
    const allTokensForRegex = [...new Set(keywords)]
      .map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .concat(fixedTokens)
      .sort((a, b) => b.length - a.length);

    const regexPattern = `\\s*(${allTokensForRegex.join(
      "|"
    )}|[A-Za-z_]\\w*|"[^"]*"|\\d+\\.?\\d*|[^\\s\\w])\\s*`;
    this.log("Regex Pattern for Tokenizer:", regexPattern);
    return new RegExp(regexPattern, "g");
  }

  log(message, data = null) {
    // console.log(`[Interpreter-${this.config.lang.toUpperCase()}] ${message}`, data !== null ? data : "");
  }

  getMessage(key, ...args) {
    let message = this.config.messages[key] || `Message key not found: ${key}`;
    args.forEach((arg, index) => {
      message = message.replace(`{${index}}`, String(arg));
    });
    return message;
  }

  run() {
    this.variables = {};
    this.arrays = {};
    if (this.outputElement) this.outputElement.innerHTML = "";

    const lowerCaseCode = this.code.toLowerCase();
    if (!lowerCaseCode.includes(this.config.keywords.ALGORITHM.toLowerCase())) {
      throw new Error(
        this.getMessage(
          "errorAlgorithmKeywordMissing",
          this.config.keywords.ALGORITHM
        )
      );
    }

    let declarationLines = [];
    let executionLines = [];

    let inVarContext = false;
    let inMainBlock = false;
    let algorithmDeclared = false;
    let startBlockFound = false;

    for (const rawLine of this.lines) {
      const line = rawLine.trim();
      const lineLower = line.toLowerCase();

      if (
        !algorithmDeclared &&
        lineLower.startsWith(this.config.keywords.ALGORITHM.toLowerCase())
      ) {
        algorithmDeclared = true;
        continue; // Próxima linha após declaração do algoritmo
      }
      if (!algorithmDeclared) continue;

      // Verifica o fim do algoritmo de forma mais precisa
      if (
        lineLower === this.config.keywords.END_BLOCK.toLowerCase() ||
        (this.config.keywords.END_BLOCK_ALT &&
          lineLower === this.config.keywords.END_BLOCK_ALT.toLowerCase())
      ) {
        // Se encontrarmos 'fim' ou 'fimalgoritmo' e já passamos pelo 'inicio', consideramos o fim do bloco principal.
        if (startBlockFound) {
          inMainBlock = false;
          break;
        }
      }

      if (inMainBlock) {
        if (line) executionLines.push(line);
      } else if (
        lineLower.startsWith(this.config.keywords.START_BLOCK.toLowerCase())
      ) {
        inMainBlock = true;
        startBlockFound = true; // Marca que o bloco 'inicio' foi encontrado
        inVarContext = false;
      } else if (
        lineLower.startsWith(this.config.keywords.VARIABLES.toLowerCase())
      ) {
        if (startBlockFound) {
          // 'var' não pode aparecer depois de 'inicio'
          throw new Error(
            this.getMessage(
              "errorVarAfterStart",
              this.config.keywords.VARIABLES,
              this.config.keywords.START_BLOCK
            )
          );
        }
        inVarContext = true;
      } else if (inVarContext) {
        if (line) declarationLines.push(line);
      }
    }

    if (!startBlockFound) {
      throw new Error(
        this.getMessage(
          "errorStartBlockKeywordMissing",
          this.config.keywords.START_BLOCK
        )
      );
    }

    this.processDeclarations(declarationLines.join("\n"));

    let i = 0;
    while (i < executionLines.length) {
      const currentLineToProcess = executionLines[i].trim();
      if (currentLineToProcess && !currentLineToProcess.startsWith("//")) {
        const processedUntilIndex = this.processLine(
          currentLineToProcess,
          executionLines,
          i
        );
        i = processedUntilIndex + 1;
      } else {
        i++;
      }
    }
  }

  processDeclarations(section) {
    if (!section.trim()) return;
    const lines = section.split("\n");

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (
        !line ||
        line.toLowerCase() === this.config.keywords.VARIABLES.toLowerCase() ||
        line.startsWith("//")
      )
        continue;

      line = line.split("//")[0].trim();
      if (!line) continue;

      if (
        line
          .toLowerCase()
          .includes(this.config.keywords.ARRAY_DEF.toLowerCase() + "[")
      ) {
        const arrayRegex = new RegExp(
          `([\\w,\\s]+)\\s*:\\s*${this.config.keywords.ARRAY_DEF.toLowerCase()}\\s*\\[\\s*(\\S+?)\\s*\\.\\.\\s*(\\S+?)\\s*\\]\\s*${this.config.keywords.OF_TYPE.toLowerCase()}\\s*(\\w+)`,
          "i"
        );
        const match = line.match(arrayRegex);

        if (match) {
          const names = match[1].split(",").map((n) => n.trim().toLowerCase());
          const startExpr = match[2];
          const endExpr = match[3];
          const typeKeyword = match[4].toLowerCase();
          const type = this.config.types[typeKeyword] || typeKeyword;

          let start, end;
          try {
            // Para avaliar limites, usamos um interpretador temporário sem output e com o escopo atual
            const tempEvalInterpreter = new PortugolInterpreter(
              "",
              null,
              this.config
            );
            tempEvalInterpreter.variables = { ...this.variables }; // Passa uma cópia das variáveis atuais
            tempEvalInterpreter.arrays = { ...this.arrays };
            start = parseInt(tempEvalInterpreter.evaluateExpression(startExpr));
            end = parseInt(tempEvalInterpreter.evaluateExpression(endExpr));
          } catch (e) {
            throw new Error(
              this.getMessage(
                "errorArrayDeclarationBoundsInvalidExpr",
                line,
                e.message
              )
            );
          }

          if (isNaN(start) || isNaN(end) || start > end) {
            throw new Error(
              this.getMessage("errorArrayDeclarationBounds", line)
            );
          }

          names.forEach((name) => {
            if (!name) return;
            if (this.variables[name] || this.arrays[name]) {
              throw new Error(this.getMessage("errorIdentifierDeclared", name));
            }
            this.arrays[name] = {
              start,
              end,
              type,
              values: Array(end - start + 1).fill(
                this.getDefaultValueForType(type)
              ),
            };
            this.log(
              `Declarado vetor ${name} do tipo ${type}[${start}..${end}]`
            );
          });
        } else {
          throw new Error(this.getMessage("errorArrayDeclarationSyntax", line));
        }
      } else {
        const parts = line.split(":");
        if (parts.length === 2) {
          const varNames = parts[0]
            .split(",")
            .map((v) => v.trim().toLowerCase());
          const typeKeyword = parts[1]
            .replace(/[;,]/g, "")
            .trim()
            .toLowerCase();
          const type = this.config.types[typeKeyword] || typeKeyword;

          for (const varName of varNames) {
            if (varName) {
              if (this.variables[varName] || this.arrays[varName]) {
                throw new Error(
                  this.getMessage("errorIdentifierDeclared", varName)
                );
              }
              this.variables[varName] = {
                type,
                value: this.getDefaultValueForType(type),
              };
              this.log(`Declarada variável ${varName} do tipo ${type}`);
            }
          }
        } else if (line.trim()) {
          throw new Error(
            this.getMessage("errorVariableDeclarationSyntax", line)
          );
        }
      }
    }
  }

  getDefaultValueForType(type) {
    switch (type) {
      case "integer":
        return 0;
      case "real":
        return 0.0;
      case "string":
        return "";
      case "boolean":
        return false;
      default:
        throw new Error(
          this.getMessage("errorUnknownDataTypeDeclaration", type)
        );
    }
  }

  processLine(line, allLines, currentIndex) {
    this.log(
      `A processar linha ${
        currentIndex + 1
      } (índice ${currentIndex}): "${line}"`
    );
    const originalLine = line;
    line = line.split("//")[0].trim();
    if (!line) return currentIndex;

    const lineLower = line.toLowerCase();
    const kw = this.config.keywords;

    if (lineLower.startsWith(kw.WRITE.toLowerCase())) {
      this.processEscreva(originalLine);
      return currentIndex;
    } else if (lineLower.startsWith(kw.READ.toLowerCase())) {
      this.processLeia(originalLine);
      return currentIndex;
    } else if (line.includes(kw.ASSIGNMENT_OP)) {
      this.processAssignment(originalLine);
      return currentIndex;
    } else if (lineLower.startsWith(kw.IF.toLowerCase() + " ")) {
      return this.processConditional(originalLine, allLines, currentIndex);
    } else if (lineLower.startsWith(kw.FOR_LOOP.toLowerCase() + " ")) {
      return this.processLoopPara(originalLine, allLines, currentIndex);
    } else if (lineLower.startsWith(kw.WHILE_LOOP.toLowerCase() + " ")) {
      return this.processLoopEnquanto(originalLine, allLines, currentIndex);
    }

    const endKeywords = [
      kw.END_IF.toLowerCase(),
      kw.ELSE.toLowerCase(),
      kw.END_FOR.toLowerCase(),
      kw.END_WHILE.toLowerCase(),
    ];
    if (endKeywords.includes(lineLower)) {
      this.log(
        `Aviso: Palavra-chave de fim de bloco '${lineLower}' encontrada fora de um contexto esperado na linha ${
          currentIndex + 1
        }.`
      );
      return currentIndex;
    }

    const mainStructureKeywords = [
      kw.ALGORITHM.toLowerCase(),
      kw.VARIABLES.toLowerCase(),
      kw.START_BLOCK.toLowerCase(),
      kw.END_BLOCK.toLowerCase(),
      kw.END_BLOCK_ALT?.toLowerCase(),
    ].filter(Boolean);
    if (mainStructureKeywords.some((keyW) => lineLower.startsWith(keyW))) {
      return currentIndex;
    }

    throw new Error(
      this.getMessage(
        "errorUnknownCommandSyntax",
        currentIndex + 1,
        originalLine
      )
    );
  }

  processEscreva(fullLine) {
    let contentLine = fullLine
      .trim()
      .substring(this.config.keywords.WRITE.length)
      .trim();
    if (contentLine.startsWith("(") && contentLine.endsWith(")")) {
      contentLine = contentLine.substring(1, contentLine.length - 1);
    } else if (contentLine.startsWith("(") && !contentLine.endsWith(")")) {
      throw new Error(this.getMessage("errorWriteSyntaxParenthesis", fullLine));
    } else if (!contentLine.startsWith("(") && contentLine.endsWith(")")) {
      throw new Error(this.getMessage("errorWriteSyntaxParenthesis", fullLine));
    }

    if (!contentLine.trim()) {
      if (this.outputElement)
        this.outputElement.innerHTML += `<div class="output-message"><br></div>`;
      return;
    }

    let args = [];
    let currentArg = "";
    let inString = false;
    let parenLevel = 0;

    for (let i = 0; i < contentLine.length; i++) {
      const char = contentLine[i];
      if (char === '"' && (i === 0 || contentLine[i - 1] !== "\\")) {
        inString = !inString;
      } else if (char === "(" && !inString) {
        parenLevel++;
      } else if (char === ")" && !inString) {
        parenLevel--;
      }

      if (char === "," && !inString && parenLevel === 0) {
        args.push(currentArg.trim());
        currentArg = "";
      } else {
        currentArg += char;
      }
    }
    if (currentArg.trim()) args.push(currentArg.trim());

    let outputText = "";
    for (const arg of args) {
      if (arg.startsWith('"') && arg.endsWith('"')) {
        outputText += arg.slice(1, -1).replace(/\\"/g, '"');
      } else {
        const value = this.evaluateExpression(arg);
        outputText +=
          value === undefined || value === null
            ? this.config.keywords.NULL_VALUE
            : String(value);
      }
    }
    if (this.outputElement)
      this.outputElement.innerHTML += `<div class="output-message">${outputText}</div>`;
  }

  processLeia(line) {
    const readKeyword = this.config.keywords.READ;
    const match = line.match(
      new RegExp(`${readKeyword}\\s*\\(([^)]+)\\)`, "i")
    );
    if (!match)
      throw new Error(this.getMessage("errorReadSyntax", line, readKeyword));

    const varNames = match[1].split(",").map((v) => v.trim());

    for (const varName of varNames) {
      const varNameLower = varName.toLowerCase();
      let promptMessage = this.getMessage("inputPrompt", varName);
      const userInput = prompt(promptMessage);

      if (userInput === null) {
        throw new Error(this.getMessage("errorInputCancelled"));
      }

      if (this.variables.hasOwnProperty(varNameLower)) {
        const varInfo = this.variables[varNameLower];
        varInfo.value = this.castToType(userInput, varInfo.type);
        this.log(`Lido para variável ${varNameLower}: ${varInfo.value}`);
      } else if (varName.includes("[")) {
        const arrayAccess = this.parseArrayAccess(varName);
        if (arrayAccess) {
          const { name, index } = arrayAccess;
          const array = this.arrays[name];
          if (array) {
            const adjustedIndex = index - array.start;
            if (adjustedIndex >= 0 && adjustedIndex < array.values.length) {
              array.values[adjustedIndex] = this.castToType(
                userInput,
                array.type
              );
              this.log(
                `Lido para vetor ${name}[${index}]: ${array.values[adjustedIndex]}`
              );
            } else {
              throw new Error(
                this.getMessage(
                  "errorArrayIndexOutOfBoundsRead",
                  index,
                  array.start,
                  array.end,
                  name
                )
              );
            }
          } else {
            throw new Error(this.getMessage("errorArrayNotDeclaredRead", name));
          }
        } else {
          throw new Error(
            this.getMessage("errorInvalidArrayAccessRead", varName)
          );
        }
      } else {
        throw new Error(
          this.getMessage("errorVariableNotDeclaredRead", varName)
        );
      }
      if (this.outputElement)
        this.outputElement.innerHTML += `<div class="output-input-echo">${promptMessage} ${userInput}</div>`;
    }
  }

  castToType(value, type) {
    if (value === null || value === undefined) return value;
    switch (type) {
      case "integer":
        const intVal = parseInt(value);
        if (isNaN(intVal))
          throw new Error(
            this.getMessage("errorInvalidIntegerInput", value, type)
          );
        return intVal;
      case "real":
        const floatVal = parseFloat(String(value).replace(",", "."));
        if (isNaN(floatVal))
          throw new Error(
            this.getMessage("errorInvalidRealInput", value, type)
          );
        return floatVal;
      case "string":
        return String(value);
      case "boolean":
        const lowerValue = String(value).toLowerCase();
        if (
          lowerValue === this.config.keywords.TRUE.toLowerCase() ||
          lowerValue === "true"
        )
          return true;
        if (
          lowerValue === this.config.keywords.FALSE.toLowerCase() ||
          lowerValue === "false"
        )
          return false;
        throw new Error(
          this.getMessage(
            "errorInvalidBooleanInput",
            value,
            this.config.keywords.TRUE,
            this.config.keywords.FALSE
          )
        );
      default:
        this.log(
          `Aviso: Tentativa de conversão para tipo desconhecido '${type}'. O valor será mantido como string.`
        );
        return String(value);
    }
  }

  processAssignment(line) {
    const parts = line.split(this.config.keywords.ASSIGNMENT_OP);
    if (parts.length !== 2)
      throw new Error(
        this.getMessage(
          "errorAssignmentSyntax",
          line,
          this.config.keywords.ASSIGNMENT_OP
        )
      );

    const leftSide = parts[0].trim();
    const rightSideExpression = parts[1].trim();
    const value = this.evaluateExpression(rightSideExpression);

    const leftSideLower = leftSide.toLowerCase();

    if (this.variables.hasOwnProperty(leftSideLower)) {
      this.variables[leftSideLower].value = this.castToType(
        value,
        this.variables[leftSideLower].type
      );
      this.log(
        `Atribuído a variável ${leftSideLower}: ${
          this.variables[leftSideLower].value
        } (tipo: ${typeof this.variables[leftSideLower].value})`
      );
    } else if (leftSide.includes("[")) {
      const arrayAccess = this.parseArrayAccess(leftSide);
      if (arrayAccess) {
        const { name, index } = arrayAccess;
        const array = this.arrays[name];
        if (array) {
          const adjustedIndex = index - array.start;
          if (adjustedIndex >= 0 && adjustedIndex < array.values.length) {
            array.values[adjustedIndex] = this.castToType(value, array.type);
            this.log(
              `Atribuído a vetor ${name}[${index}]: ${array.values[adjustedIndex]}`
            );
          } else {
            throw new Error(
              this.getMessage(
                "errorArrayIndexOutOfBoundsAssign",
                index,
                array.start,
                array.end,
                name
              )
            );
          }
        } else {
          throw new Error(this.getMessage("errorArrayNotDeclaredAssign", name));
        }
      } else {
        throw new Error(
          this.getMessage("errorInvalidArrayAccessAssign", leftSide)
        );
      }
    } else {
      throw new Error(
        this.getMessage("errorIdentifierNotDeclaredAssign", leftSide)
      );
    }
  }

  findMatchingEnd(
    allLines,
    startIndex,
    startKeyword,
    endKeyword,
    otherPotentiallyNestedStartKeywords = []
  ) {
    let nestedLevel = 0;
    const currentBlockStartKeywordLower = startKeyword.toLowerCase().trim();
    const endKeywordLower = endKeyword.toLowerCase().trim();
    // Garante que as palavras-chave de aninhamento são strings válidas antes de chamar toLowerCase
    const allStartKeywordsLower = [
      currentBlockStartKeywordLower,
      ...otherPotentiallyNestedStartKeywords
        .filter((k) => typeof k === "string")
        .map((k) => k.toLowerCase().trim()),
    ];

    this.log(
      `findMatchingEnd: startKW="${currentBlockStartKeywordLower}", endKW="${endKeywordLower}", startIndex=${startIndex}`
    );

    for (let i = startIndex + 1; i < allLines.length; i++) {
      const currentLineTrimmed = allLines[i].trim();
      const currentLineLower = currentLineTrimmed.toLowerCase();

      let isAStart = false;
      for (const skw of allStartKeywordsLower) {
        if (
          currentLineLower.startsWith(skw + " ") ||
          currentLineLower.startsWith(skw + "(") ||
          currentLineLower === skw
        ) {
          if (skw === currentBlockStartKeywordLower) {
            nestedLevel++;
            this.log(
              `  findMatchingEnd: Nível aninhado de '${skw}' ++ para ${nestedLevel} na linha ${
                i + 1
              } ("${currentLineTrimmed}")`
            );
          }
          isAStart = true;
          break;
        }
      }

      if (currentLineLower === endKeywordLower) {
        // Não precisa de !isAStart aqui, pois o fim de um bloco é prioritário
        if (nestedLevel === 0) {
          this.log(
            `  findMatchingEnd: Encontrado '${endKeywordLower}' correspondente na linha ${
              i + 1
            }`
          );
          return i;
        }
        nestedLevel--;
        this.log(
          `  findMatchingEnd: Nível aninhado de '${currentBlockStartKeywordLower}' -- para ${nestedLevel} na linha ${
            i + 1
          } ("${currentLineTrimmed}")`
        );
      }
    }
    this.log(
      `  findMatchingEnd: '${endKeywordLower}' não encontrado para '${currentBlockStartKeywordLower}' iniciado na linha ${
        startIndex + 1
      }`
    );
    return -1;
  }

  processConditional(line, allLines, currentIndex) {
    const kw = this.config.keywords;
    const match = line.match(
      new RegExp(`${kw.IF}\\s+(.+?)\\s+${kw.THEN}`, "i")
    );
    if (!match)
      throw new Error(this.getMessage("errorIfSyntax", line, kw.IF, kw.THEN));

    const condition = match[1];
    const conditionResult = this.evaluateExpression(condition);
    this.log(
      `Condição SE ("${condition}") avaliada para: ${conditionResult} na linha ${
        currentIndex + 1
      }`
    );

    let fimSeIndex = -1;
    let elseIndex = -1;
    let currentNestedIfLevel = 0;

    for (let i = currentIndex + 1; i < allLines.length; i++) {
      const currentLineLower = allLines[i].trim().toLowerCase();
      if (currentLineLower.startsWith(kw.IF.toLowerCase() + " ")) {
        currentNestedIfLevel++;
      } else if (currentLineLower === kw.ELSE.toLowerCase()) {
        if (currentNestedIfLevel === 0 && elseIndex === -1) {
          elseIndex = i;
        }
      } else if (currentLineLower === kw.END_IF.toLowerCase()) {
        if (currentNestedIfLevel === 0) {
          fimSeIndex = i;
          break;
        }
        currentNestedIfLevel--;
      }
    }

    if (fimSeIndex === -1)
      throw new Error(
        this.getMessage("errorIfNoEndIf", currentIndex + 1, line, kw.END_IF)
      );

    if (conditionResult) {
      this.log("  A executar bloco SE (condição verdadeira)");
      const blockEnd =
        elseIndex !== -1 && elseIndex < fimSeIndex ? elseIndex : fimSeIndex;
      for (let j = currentIndex + 1; j < blockEnd; j++) {
        const blockLine = allLines[j].trim();
        if (blockLine && !blockLine.toLowerCase().startsWith("//")) {
          const nextIndex = this.processLine(blockLine, allLines, j);
          if (nextIndex > j) j = nextIndex;
        }
      }
    } else if (elseIndex !== -1) {
      this.log("  A executar bloco SENAO (condição falsa)");
      for (let j = elseIndex + 1; j < fimSeIndex; j++) {
        const blockLine = allLines[j].trim();
        if (blockLine && !blockLine.toLowerCase().startsWith("//")) {
          const nextIndex = this.processLine(blockLine, allLines, j);
          if (nextIndex > j) j = nextIndex;
        }
      }
    }
    this.log(
      `  Bloco SE/SENAO terminado, retornando índice do ${kw.END_IF}: ${fimSeIndex}`
    );
    return fimSeIndex;
  }

  processLoopPara(line, allLines, currentIndex) {
    const kw = this.config.keywords;
    const paraRegex = new RegExp(
      `${kw.FOR_LOOP}\\s+(\\w+)\\s+${kw.FROM}\\s+(.+?)\\s+${kw.TO}\\s+(.+?)\\s+(?:${kw.STEP}\\s+(.+?)\\s+)?${kw.DO_LOOP}`,
      "i"
    );
    const match = line.match(paraRegex);
    if (!match) throw new Error(this.getMessage("errorForLoopSyntax", line));

    const counterVarName = match[1].toLowerCase();
    const startExpr = match[2];
    const endExpr = match[3];
    const stepExpr = match[4];

    if (
      !this.variables.hasOwnProperty(counterVarName) ||
      (this.variables[counterVarName].type !== "integer" &&
        this.variables[counterVarName].type !== "real")
    ) {
      throw new Error(
        this.getMessage("errorForLoopCounterVariable", counterVarName)
      );
    }

    const startValue = this.evaluateExpression(startExpr);
    const endValue = this.evaluateExpression(endExpr);
    const stepValue = stepExpr ? this.evaluateExpression(stepExpr) : 1;

    if (
      typeof startValue !== "number" ||
      typeof endValue !== "number" ||
      typeof stepValue !== "number"
    ) {
      throw new Error(this.getMessage("errorForLoopBoundsNotNumeric"));
    }
    if (stepValue === 0) {
      throw new Error(this.getMessage("errorForLoopStepZero"));
    }

    const fimParaIndex = this.findMatchingEnd(
      allLines,
      currentIndex,
      kw.FOR_LOOP,
      kw.END_FOR,
      [kw.WHILE_LOOP, kw.IF]
    );
    if (fimParaIndex === -1)
      throw new Error(
        this.getMessage(
          "errorForLoopNoEndFor",
          currentIndex + 1,
          line,
          kw.END_FOR
        )
      );

    this.log(
      `Ciclo PARA: ${counterVarName} de ${startValue} até ${endValue} passo ${stepValue}`
    );

    for (
      let count = startValue;
      stepValue > 0 ? count <= endValue : count >= endValue;
      count += stepValue
    ) {
      this.variables[counterVarName].value = this.castToType(
        count,
        this.variables[counterVarName].type
      );
      this.log(
        `  Ciclo PARA ${counterVarName} = ${this.variables[counterVarName].value}`
      );
      for (let j = currentIndex + 1; j < fimParaIndex; j++) {
        const blockLine = allLines[j].trim();
        if (blockLine && !blockLine.toLowerCase().startsWith("//")) {
          const nextIndex = this.processLine(blockLine, allLines, j);
          if (nextIndex > j) j = nextIndex;
        }
      }
    }
    this.log(
      `  Ciclo PARA terminado, retornando índice do ${kw.END_FOR}: ${fimParaIndex}`
    );
    return fimParaIndex;
  }

  processLoopEnquanto(line, allLines, currentIndex) {
    const kw = this.config.keywords;
    const enquantoRegex = new RegExp(
      `${kw.WHILE_LOOP}\\s+(.+?)\\s+${kw.DO_LOOP}`,
      "i"
    );
    const match = line.match(enquantoRegex);
    if (!match) throw new Error(this.getMessage("errorWhileLoopSyntax", line));

    const conditionExpr = match[1];

    const fimEnquantoIndex = this.findMatchingEnd(
      allLines,
      currentIndex,
      kw.WHILE_LOOP,
      kw.END_WHILE,
      [kw.FOR_LOOP, kw.IF]
    );
    if (fimEnquantoIndex === -1)
      throw new Error(
        this.getMessage(
          "errorWhileLoopNoEndWhile",
          currentIndex + 1,
          line,
          kw.END_WHILE
        )
      );

    this.log(`Ciclo ENQUANTO, condição: "${conditionExpr}"`);

    let iterations = 0;
    const MAX_ITERATIONS = 200000;

    while (this.evaluateExpression(conditionExpr)) {
      iterations++;
      if (iterations > MAX_ITERATIONS) {
        throw new Error(
          this.getMessage(
            "errorWhileLoopMaxIterations",
            MAX_ITERATIONS,
            currentIndex + 1
          )
        );
      }
      this.log(
        `  Ciclo ENQUANTO iteração ${iterations}, Condição ("${conditionExpr}") -> true`
      );
      for (let j = currentIndex + 1; j < fimEnquantoIndex; j++) {
        const blockLine = allLines[j].trim();
        if (blockLine && !blockLine.toLowerCase().startsWith("//")) {
          const nextIndex = this.processLine(blockLine, allLines, j);
          if (nextIndex > j) j = nextIndex;
        }
      }
    }
    this.log(
      `  Ciclo ENQUANTO terminado. Condição ("${conditionExpr}") -> false. Retornando índice do ${kw.END_WHILE}: ${fimEnquantoIndex}`
    );
    return fimEnquantoIndex;
  }

  parseArrayAccess(accessString) {
    const match = accessString.match(/(\w+)\s*\[\s*(.+?)\s*\]/);
    if (match) {
      const name = match[1].toLowerCase();
      const indexExpression = match[2];
      const index = this.evaluateExpression(indexExpression);
      if (typeof index !== "number" || !Number.isInteger(index)) {
        throw new Error(
          this.getMessage("errorArrayIndexNotInteger", indexExpression, name)
        );
      }
      return { name, index };
    }
    this.log(`Falha ao analisar acesso ao vetor: ${accessString}`);
    return null;
  }

  tokenize(expression) {
    this.tokens = [];
    let match;
    this.tokenRegex.lastIndex = 0;
    while ((match = this.tokenRegex.exec(expression)) !== null) {
      const tokenValue = match[1];
      let type;
      const tokenLower = tokenValue.toLowerCase();
      const kw = this.config.keywords;

      if (!isNaN(parseFloat(tokenValue)) && isFinite(tokenValue))
        type = "NUMBER";
      else if (tokenValue.startsWith('"') && tokenValue.endsWith('"'))
        type = "STRING";
      else if (
        tokenLower === kw.TRUE.toLowerCase() ||
        tokenLower === kw.FALSE.toLowerCase()
      )
        type = "BOOLEAN";
      else if (
        tokenLower === kw.LOGICAL_AND.toLowerCase() ||
        tokenLower === kw.LOGICAL_OR.toLowerCase() ||
        tokenLower === kw.LOGICAL_NOT.toLowerCase()
      )
        type = "LOGICAL_OPERATOR";
      else if (["+", "-", "*", "/", "%"].includes(tokenValue))
        type = "OPERATOR";
      else if (["=", "<>", "<", ">", "<=", ">="].includes(tokenValue))
        type = "COMPARISON_OPERATOR";
      else if (tokenValue === "(") type = "LPAREN";
      else if (tokenValue === ")") type = "RPAREN";
      else if (tokenValue === "[") type = "LBRACKET";
      else if (tokenValue === "]") type = "RBRACKET";
      else if (tokenValue === ",") type = "COMMA";
      else if (/^[A-Za-z_]\w*$/.test(tokenValue)) {
        // Verifica se é um identificador válido
        // Verifica se é uma palavra-chave de tipo (ex: "inteiro", "reale")
        if (Object.keys(this.config.types).includes(tokenLower)) {
          type = "TYPE_KEYWORD"; // Poderia ser útil para validação, mas não usado no parser atual
        } else {
          type = "IDENTIFIER";
        }
      } else
        throw new Error(
          this.getMessage("errorUnknownTokenInExpression", tokenValue)
        );

      this.tokens.push({ type, value: tokenValue });
    }
    this.currentTokenIndex = 0;
    this.log("Tokens da expressão:", this.tokens);
    return this.tokens;
  }

  peek() {
    return this.tokens[this.currentTokenIndex];
  }
  consume() {
    if (this.currentTokenIndex < this.tokens.length) {
      return this.tokens[this.currentTokenIndex++];
    }
    throw new Error(this.getMessage("errorUnexpectedEndOfExpressionConsume"));
  }

  getPrecedence(token) {
    if (!token) return 0;
    const value = token.value.toLowerCase();
    const kw = this.config.keywords;
    if (value === kw.LOGICAL_OR.toLowerCase()) return 1;
    if (value === kw.LOGICAL_AND.toLowerCase()) return 2;
    if (value === "=" || value === "<>") return 3;
    if (["<", ">", "<=", ">="].includes(value)) return 4;
    if (value === "+" || value === "-") return 5;
    if (["*", "/", "%"].includes(value)) return 6;
    if (value === kw.LOGICAL_NOT.toLowerCase()) return 7;
    return 0;
  }

  parsePrimary() {
    let token = this.peek();
    this.log("parsePrimary token (peek):", token);

    if (!token) {
      throw new Error(this.getMessage("errorUnexpectedEndOfExpressionPrimary"));
    }
    const kw = this.config.keywords;

    if (token.value.toLowerCase() === kw.LOGICAL_NOT.toLowerCase()) {
      this.consume();
      const operand = this.parseExpression(this.getPrecedence(token));
      if (typeof operand !== "boolean")
        throw new Error(this.getMessage("errorLogicalNotOperand"));
      return !operand;
    }
    if (token.value === "-") {
      const prevTokenIndex = this.currentTokenIndex - 1;
      const isUnary =
        this.currentTokenIndex === 0 ||
        (prevTokenIndex >= 0 &&
          [
            "OPERATOR",
            "COMPARISON_OPERATOR",
            "LOGICAL_OPERATOR",
            "LPAREN",
            "LBRACKET",
            "COMMA",
          ].includes(this.tokens[prevTokenIndex]?.type));

      if (isUnary) {
        this.consume();
        const operand = this.parseExpression(8);
        if (typeof operand !== "number")
          throw new Error(this.getMessage("errorUnaryMinusOperand"));
        return -operand;
      }
    }

    token = this.consume();
    this.log("parsePrimary token (consumed):", token);

    if (token.type === "NUMBER") return parseFloat(token.value);
    if (token.type === "STRING")
      return token.value.slice(1, -1).replace(/\\"/g, '"');
    if (token.type === "BOOLEAN")
      return token.value.toLowerCase() === kw.TRUE.toLowerCase();

    if (token.type === "IDENTIFIER") {
      const identifierName = token.value.toLowerCase();
      if (this.peek() && this.peek().type === "LPAREN") {
        this.consume();
        let args = [];
        if (this.peek() && this.peek().type !== "RPAREN") {
          while (true) {
            args.push(this.parseExpression(0));
            if (this.peek() && this.peek().type === "COMMA") {
              this.consume();
            } else {
              break;
            }
          }
        }
        if (!this.peek() || this.peek().type !== "RPAREN") {
          throw new Error(
            this.getMessage(
              "errorFunctionArgsParenthesis",
              identifierName,
              this.peek()?.value
            )
          );
        }
        this.consume();

        if (identifierName === kw.FUNCTION_RANDOM.toLowerCase()) {
          if (args.length !== 2)
            throw new Error(
              this.getMessage(
                "errorRandomFunctionArgsCount",
                kw.FUNCTION_RANDOM
              )
            );
          const minVal = args[0];
          const maxVal = args[1];
          if (typeof minVal !== "number" || typeof maxVal !== "number") {
            throw new Error(
              this.getMessage("errorRandomFunctionArgsType", kw.FUNCTION_RANDOM)
            );
          }
          if (!Number.isInteger(minVal) || !Number.isInteger(maxVal)) {
            throw new Error(
              this.getMessage(
                "errorRandomFunctionArgsInteger",
                kw.FUNCTION_RANDOM
              )
            );
          }
          if (minVal > maxVal) {
            throw new Error(
              this.getMessage(
                "errorRandomFunctionMinMax",
                kw.FUNCTION_RANDOM,
                minVal,
                maxVal
              )
            );
          }
          return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        }
        throw new Error(
          this.getMessage("errorUnknownFunction", identifierName)
        );
      } else if (this.peek() && this.peek().type === "LBRACKET") {
        this.consume();

        const indexExprTokens = [];
        let bracketLevel = 0;
        while (this.peek()) {
          if (this.peek().type === "LBRACKET") bracketLevel++;
          else if (this.peek().type === "RBRACKET") {
            if (bracketLevel === 0) break;
            bracketLevel--;
          }
          indexExprTokens.push(this.consume());
        }

        if (!this.peek() || this.peek().type !== "RBRACKET") {
          throw new Error(
            this.getMessage("errorArrayAccessBracket", identifierName)
          );
        }
        this.consume();

        const indexExpressionString = indexExprTokens
          .map((t) => t.value)
          .join(" ");

        const tempInterpreterForIndex = new PortugolInterpreter(
          "",
          null,
          this.config
        );
        tempInterpreterForIndex.variables = this.variables;
        tempInterpreterForIndex.arrays = this.arrays;
        const index = tempInterpreterForIndex.evaluateExpression(
          indexExpressionString
        );

        const array = this.arrays[identifierName];
        if (!array)
          throw new Error(
            this.getMessage("errorArrayNotDeclaredExpression", identifierName)
          );
        if (typeof index !== "number" || !Number.isInteger(index)) {
          throw new Error(
            this.getMessage(
              "errorArrayIndexNotInteger",
              indexExpressionString,
              identifierName
            )
          );
        }

        const adjustedIndex = index - array.start;
        if (adjustedIndex < 0 || adjustedIndex >= array.values.length) {
          throw new Error(
            this.getMessage(
              "errorArrayIndexOutOfBoundsExpression",
              index,
              array.start,
              array.end,
              identifierName
            )
          );
        }
        return array.values[adjustedIndex];
      }
      if (this.variables.hasOwnProperty(identifierName))
        return this.variables[identifierName].value;
      throw new Error(
        this.getMessage("errorIdentifierNotDeclaredExpression", token.value)
      );
    }

    if (token.type === "LPAREN") {
      const expr = this.parseExpression(0);
      if (!this.peek() || this.peek().type !== "RPAREN") {
        throw new Error(this.getMessage("errorExpressionParenthesis"));
      }
      this.consume();
      return expr;
    }

    throw new Error(
      this.getMessage("errorUnexpectedTokenPrimary", token.value, token.type)
    );
  }

  parseExpression(precedence) {
    this.log(`parseExpression, precedência de entrada: ${precedence}`);
    let left = this.parsePrimary();
    this.log(
      `parseExpression (após parsePrimary) left: ${left}, tipo: ${typeof left}`
    );

    while (this.peek() && precedence < this.getPrecedence(this.peek())) {
      const operatorToken = this.consume();
      const operator = operatorToken.value.toLowerCase();
      this.log(`parseExpression operador: ${operator}`);
      const right = this.parseExpression(this.getPrecedence(operatorToken));
      this.log(`parseExpression right: ${right}, tipo: ${typeof right}`);

      const kw = this.config.keywords;
      if (["+", "-", "*", "/", "%"].includes(operator)) {
        if (typeof left !== "number" || typeof right !== "number") {
          if (
            operator === "+" &&
            (typeof left === "string" || typeof right === "string")
          ) {
            left = String(left) + String(right);
          } else {
            throw new Error(
              this.getMessage(
                "errorArithmeticOperandType",
                operator,
                typeof left,
                typeof right
              )
            );
          }
        } else {
          switch (operator) {
            case "+":
              left = left + right;
              break;
            case "-":
              left = left - right;
              break;
            case "*":
              left = left * right;
              break;
            case "/":
              if (right === 0)
                throw new Error(this.getMessage("errorDivisionByZero"));
              left = left / right;
              break;
            case "%":
              if (right === 0)
                throw new Error(this.getMessage("errorModuloByZero"));
              if (!Number.isInteger(left) || !Number.isInteger(right)) {
                throw new Error(this.getMessage("errorModuloOperandsInteger"));
              }
              left = left % right;
              break;
          }
        }
      } else {
        switch (operator) {
          case "=":
            left = left == right;
            break;
          case "<>":
            left = left != right;
            break;
          case "<":
            left = left < right;
            break;
          case ">":
            left = left > right;
            break;
          case "<=":
            left = left <= right;
            break;
          case ">=":
            left = left >= right;
            break;
          case kw.LOGICAL_AND.toLowerCase():
            if (typeof left !== "boolean" || typeof right !== "boolean")
              throw new Error(this.getMessage("errorLogicalAndOperands"));
            left = left && right;
            break;
          case kw.LOGICAL_OR.toLowerCase():
            if (typeof left !== "boolean" || typeof right !== "boolean")
              throw new Error(this.getMessage("errorLogicalOrOperands"));
            left = left || right;
            break;
          default:
            throw new Error(
              this.getMessage("errorUnknownOperatorExpression", operator)
            );
        }
      }
      this.log(`parseExpression (após operação ${operator}) left: ${left}`);
    }
    return left;
  }

  evaluateExpression(expression) {
    this.log(`A avaliar expressão completa: "${expression}"`);
    if (typeof expression !== "string") {
      if (
        typeof expression === "number" ||
        typeof expression === "boolean" ||
        expression === null ||
        expression === undefined
      ) {
        return expression;
      }
      throw new Error(
        this.getMessage("errorInvalidExpressionType", typeof expression)
      );
    }
    if (!expression.trim()) {
      throw new Error(this.getMessage("errorEmptyExpression"));
    }

    this.tokenize(expression);

    if (this.tokens.length === 0) {
      const trimmedExpr = expression.trim();
      if (!isNaN(parseFloat(trimmedExpr)) && isFinite(trimmedExpr))
        return parseFloat(trimmedExpr);
      if (trimmedExpr.startsWith('"') && trimmedExpr.endsWith('"'))
        return trimmedExpr.slice(1, -1);
      if (trimmedExpr.toLowerCase() === this.config.keywords.TRUE.toLowerCase())
        return true;
      if (
        trimmedExpr.toLowerCase() === this.config.keywords.FALSE.toLowerCase()
      )
        return false;
      if (
        /^[a-zA-Z_]\w*$/.test(trimmedExpr) &&
        this.variables.hasOwnProperty(trimmedExpr.toLowerCase())
      ) {
        return this.variables[trimmedExpr.toLowerCase()].value;
      }
      throw new Error(
        this.getMessage("errorEmptyOrInvalidExpressionTokenize", expression)
      );
    }

    const result = this.parseExpression(0);

    if (this.currentTokenIndex < this.tokens.length) {
      const remainingTokens = this.tokens
        .slice(this.currentTokenIndex)
        .map((t) => t.value)
        .join(" ");
      this.log("Tokens restantes não consumidos:", remainingTokens);
      throw new Error(
        this.getMessage("errorExpressionSyntaxRemainingTokens", remainingTokens)
      );
    }
    this.log(`Resultado final da expressão "${expression}": ${result}`);
    return result;
  }
}
