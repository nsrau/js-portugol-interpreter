// src/js/localization.js

/**
 * Contém as traduções da interface e as palavras-chave específicas de cada idioma
 * para o interpretador.
 */
export const localization = {
  pt: {
    lang: "pt",
    langName: "Português",
    appTitle: "Interpretador Portugol / Italiano",
    codeHeader: "Código Fonte",
    outputHeader: "Saída",
    runButton: "Executar",
    clearButton: "Limpar",
    examplesButton: "Exemplos",
    helpButton: "Ajuda",
    themeToggleButton: "Alternar Tema",
    languageSelectorLabel: "Selecionar Idioma",
    developedBy: "Interpretador desenvolvido em JavaScript",
    footerSignature: "Feito com ❤️ por VIBE Coding", // Chave para o rodapé
    helpModalTitle: "Ajuda do Interpretador",
    helpIntro:
      'Este é um interpretador online para uma versão simplificada de Portugol e sua adaptação para Italiano. Escreva o seu código no editor à esquerda e clique em "Executar".',
    helpSyntaxTitle: "Sintaxe Básica:",
    helpSupportedTypes: "Tipos suportados", // Removido ':' para JS adicionar dinamicamente
    helpComments: "Comentários",
    helpExpressions: "Expressões",
    helpExampleAlgorithmName: "NomeDoAlgoritmo",
    helpExampleString: "Olá",
    keywords: {
      ALGORITHM: "algoritmo",
      VARIABLES: "var",
      START_BLOCK: "inicio",
      END_BLOCK: "fimalgoritmo",
      END_BLOCK_ALT: "fim",
      INTEGER: "inteiro",
      REAL: "real",
      STRING: "caractere",
      BOOLEAN: "logico",
      ARRAY_DEF: "vetor",
      OF_TYPE: "de",
      WRITE: "escreva",
      READ: "leia",
      ASSIGNMENT_OP: "<-",
      IF: "se",
      THEN: "entao",
      ELSE: "senao",
      END_IF: "fimse",
      FOR_LOOP: "para",
      FROM: "de",
      TO: "ate",
      STEP: "passo",
      DO_LOOP: "faca",
      END_FOR: "fimpara",
      WHILE_LOOP: "enquanto",
      END_WHILE: "fimenquanto",
      TRUE: "verdadeiro",
      FALSE: "falso",
      LOGICAL_AND: "e",
      LOGICAL_OR: "ou",
      LOGICAL_NOT: "nao",
      FUNCTION_RANDOM: "aleatorio",
      NULL_VALUE: "nulo",
    },
    types: {
      inteiro: "integer",
      real: "real",
      caractere: "string",
      logico: "boolean",
    },
    messages: {
      errorPrefix: "ERRO",
      errorAlgorithmKeywordMissing:
        "O algoritmo deve conter a palavra-chave '{0}'.",
      errorStartBlockKeywordMissing:
        "O algoritmo deve conter a palavra-chave '{0}'.",
      errorVarAfterStart:
        "A declaração de '{0}' não pode aparecer após o bloco '{1}'.",
      errorArrayDeclarationBounds:
        "Declaração de vetor inválida (limites não numéricos ou início > fim): {0}",
      errorArrayDeclarationBoundsInvalidExpr:
        'Declaração de vetor inválida: não foi possível avaliar os limites em "{0}". Detalhes: {1}',
      errorIdentifierDeclared: "Identificador '{0}' já declarado.",
      errorArrayDeclarationSyntax:
        "Sintaxe de declaração de vetor inválida: {0}",
      errorVariableDeclarationSyntax:
        "Sintaxe de declaração de variável inválida: {0}",
      errorUnknownDataTypeDeclaration:
        "Tipo de dado desconhecido na declaração: {0}",
      errorUnknownCommandSyntax:
        'Comando desconhecido ou sintaxe inválida na linha {0} do bloco de execução: "{1}"',
      errorWriteSyntaxParenthesis:
        "Sintaxe de 'escreva' inválida: Problema com parênteses em \"{0}\"",
      errorReadSyntax:
        "Sintaxe de '{1}' inválida: {0}. Esperado '{1}(variavel)'.",
      inputPrompt: "Entrada para {0}:",
      errorInputCancelled: "Entrada de dados cancelada pelo utilizador.",
      errorInvalidIntegerInput:
        'Valor de entrada "{0}" não é um inteiro válido para o tipo {1}.',
      errorInvalidRealInput:
        'Valor de entrada "{0}" não é um número real válido para o tipo {1}.',
      errorInvalidBooleanInput:
        "Valor de entrada \"{0}\" não é um lógico válido (esperado '{1}' ou '{2}').",
      errorAssignmentSyntax:
        "Sintaxe de atribuição inválida: {0}. Esperado 'variavel {1} expressao'.",
      errorArrayIndexOutOfBoundsRead:
        "Índice {0} fora dos limites [{1}..{2}] para o vetor {3} no comando de leitura.",
      errorArrayNotDeclaredRead:
        "Vetor não declarado: {0} no comando de leitura.",
      errorInvalidArrayAccessRead:
        "Acesso inválido ao vetor no comando de leitura: {0}",
      errorVariableNotDeclaredRead:
        "Variável não declarada no comando de leitura: {0}",
      errorArrayIndexOutOfBoundsAssign:
        "Índice {0} fora dos limites [{1}..{2}] para o vetor {3} em atribuição.",
      errorArrayNotDeclaredAssign: "Vetor não declarado: {0} em atribuição.",
      errorInvalidArrayAccessAssign:
        "Acesso inválido ao vetor em atribuição: {0}",
      errorIdentifierNotDeclaredAssign:
        "Variável ou vetor não declarado para atribuição: {0}.",
      errorIfSyntax:
        "Sintaxe de '{1}' inválida na linha {0}: {2}. Esperado '{1} condicao {3}'.",
      errorIfNoEndIf:
        "Bloco '{1}' iniciado na linha {0} (\" {2} \") não possui '{3}' correspondente.",
      errorForLoopSyntax: "Sintaxe de ciclo 'para' inválida na linha {0}.",
      errorForLoopCounterVariable:
        "Variável de controlo do ciclo 'para' (\"{0}\") deve ser numérica e declarada.",
      errorForLoopBoundsNotNumeric:
        "Valores de início, fim ou passo do ciclo 'para' devem ser numéricos.",
      errorForLoopStepZero: "O passo do ciclo 'para' não pode ser zero.",
      errorForLoopNoEndFor:
        "Ciclo 'para' iniciado na linha {0} (\" {1} \") não possui '{2}' correspondente.",
      errorWhileLoopSyntax:
        "Sintaxe de ciclo 'enquanto' inválida na linha {0}.",
      errorWhileLoopMaxIterations:
        "Ciclo 'enquanto' excedeu o limite máximo de {0} iterações na linha {1}. Possível ciclo infinito.",
      errorWhileLoopNoEndWhile:
        "Ciclo 'enquanto' iniciado na linha {0} (\" {1} \") não possui '{2}' correspondente.",
      errorArrayIndexNotInteger:
        'Índice de vetor "{0}" (para "{1}") não resulta num inteiro.',
      errorUnexpectedEndOfExpressionConsume:
        "Fim inesperado da expressão ao tentar consumir token.",
      errorUnexpectedEndOfExpressionPrimary:
        "Fim inesperado da expressão ao tentar analisar um termo primário.",
      errorLogicalNotOperand:
        "Operador 'nao' só pode ser aplicado a valores lógicos.",
      errorUnaryMinusOperand:
        "Operador '-' unário só pode ser aplicado a números.",
      errorFunctionArgsParenthesis:
        "Esperado ')' ou ',' na lista de argumentos da função '{0}'. Encontrado: {1}",
      errorRandomFunctionArgsCount:
        "Função '{0}' espera 2 argumentos (min, max).",
      errorRandomFunctionArgsType: "Argumentos para '{0}' devem ser números.",
      errorRandomFunctionArgsInteger:
        "Argumentos para '{0}' devem ser inteiros.",
      errorRandomFunctionMinMax:
        "Em '{0}(min, max)', min ({1}) não pode ser maior que max ({2}).",
      errorUnknownFunction: "Função desconhecida: '{0}'.",
      errorArrayAccessBracket: "Esperado ']' para fechar acesso ao vetor {0}.",
      errorArrayNotDeclaredExpression:
        "Vetor '{0}' não declarado ou usado incorretamente na expressão.",
      errorArrayIndexOutOfBoundsExpression:
        "Índice {0} fora dos limites [{1}..{2}] para o vetor {3}.",
      errorIdentifierNotDeclaredExpression:
        "Variável, vetor ou função '{0}' não declarado ou usado incorretamente na expressão.",
      errorExpressionParenthesis:
        "Esperado ')' para fechar parênteses na expressão.",
      errorUnexpectedTokenPrimary:
        "Token inesperado ao analisar termo primário da expressão: '{0}' (tipo: {1})",
      errorArithmeticOperandType:
        "Operador aritmético '{0}' requer operandos numéricos. Recebeu '{1}' ({2}) e '{3}' ({4}).",
      errorDivisionByZero: "Divisão por zero na expressão.",
      errorModuloByZero: "Módulo por zero na expressão.",
      errorModuloOperandsInteger:
        "Operador '%' (mod) requer operandos inteiros.",
      errorLogicalAndOperands: "Operador 'e' requer operandos lógicos.",
      errorLogicalOrOperands: "Operador 'ou' requer operandos lógicos.",
      errorUnknownOperatorExpression: "Operador desconhecido na expressão: {0}",
      errorInvalidExpressionType:
        "Tipo de expressão inválido para avaliação: {0}. Esperada string.",
      errorEmptyExpression: "Expressão vazia fornecida para avaliação.",
      errorEmptyOrInvalidExpressionTokenize:
        'Expressão vazia ou inválida para avaliação após tokenização: "{0}"',
      errorExpressionSyntaxRemainingTokens:
        "Sintaxe de expressão inválida. Tokens restantes não processados: {0}",
      errorUnknownTokenInExpression: "Token desconhecido na expressão: '{0}'",
    },
  },
  it: {
    lang: "it",
    langName: "Italiano",
    appTitle: "Interprete Portugol / Italiano",
    codeHeader: "Codice Sorgente",
    outputHeader: "Output",
    runButton: "Esegui",
    clearButton: "Pulisci",
    examplesButton: "Esempi",
    helpButton: "Aiuto",
    themeToggleButton: "Alterna Tema",
    languageSelectorLabel: "Seleziona Lingua",
    developedBy: "Interprete sviluppato in JavaScript",
    footerSignature: "Fatto con ❤️ da VIBE Coding", // Chave para o rodapé em Italiano
    helpModalTitle: "Aiuto dell'Interprete",
    helpIntro:
      'Questo è un interprete online per una versione semplificata di "Portugol" e il suo adattamento in Italiano. Scrivi il tuo codice nell\'editor a sinistra e clicca su "Esegui".',
    helpSyntaxTitle: "Sintassi di Base:",
    helpSupportedTypes: "Tipi supportati",
    helpComments: "Commenti",
    helpExpressions: "Espressioni",
    helpExampleAlgorithmName: "NomeAlgoritmo",
    helpExampleString: "Ciao",
    keywords: {
      ALGORITHM: "algoritmo",
      VARIABLES: "variabili",
      START_BLOCK: "inizio",
      END_BLOCK: "finealgoritmo",
      END_BLOCK_ALT: "fine",
      INTEGER: "intero",
      REAL: "reale",
      STRING: "carattere",
      BOOLEAN: "logico",
      ARRAY_DEF: "vettore",
      OF_TYPE: "di",
      WRITE: "scrivi",
      READ: "leggi",
      ASSIGNMENT_OP: "<-",
      IF: "se",
      THEN: "allora",
      ELSE: "altrimenti",
      END_IF: "finese",
      FOR_LOOP: "per",
      FROM: "da",
      TO: "a",
      STEP: "passo",
      DO_LOOP: "fai",
      END_FOR: "fineper",
      WHILE_LOOP: "mentre",
      END_WHILE: "finementre",
      TRUE: "vero",
      FALSE: "falso",
      LOGICAL_AND: "e",
      LOGICAL_OR: "o",
      LOGICAL_NOT: "non",
      FUNCTION_RANDOM: "casuale",
      NULL_VALUE: "nullo",
    },
    types: {
      intero: "integer",
      reale: "real",
      carattere: "string",
      logico: "boolean",
    },
    messages: {
      errorPrefix: "ERRORE",
      errorAlgorithmKeywordMissing:
        "L'algoritmo deve contenere la parola chiave '{0}'.",
      errorStartBlockKeywordMissing:
        "L'algoritmo deve contenere la parola chiave '{0}'.",
      errorVarAfterStart:
        "La dichiarazione di '{0}' non può apparire dopo il blocco '{1}'.",
      errorArrayDeclarationBounds:
        "Dichiarazione di vettore non valida (limiti non numerici o inizio > fine): {0}",
      errorArrayDeclarationBoundsInvalidExpr:
        'Dichiarazione di vettore non valida: impossibile valutare i limiti in "{0}". Dettagli: {1}',
      errorIdentifierDeclared: "Identificatore '{0}' già dichiarato.",
      errorArrayDeclarationSyntax:
        "Sintassi di dichiarazione del vettore non valida: {0}",
      errorVariableDeclarationSyntax:
        "Sintassi di dichiarazione della variabile non valida: {0}",
      errorUnknownDataTypeDeclaration:
        "Tipo di dato sconosciuto nella dichiarazione: {0}",
      errorUnknownCommandSyntax:
        'Comando sconosciuto o sintassi non valida alla riga {0} del blocco di esecuzione: "{1}"',
      errorWriteSyntaxParenthesis:
        "Sintassi 'scrivi' non valida: Problema con le parentesi in \"{0}\"",
      errorReadSyntax:
        "Sintassi '{1}' non valida: {0}. Atteso '{1}(variabile)'.",
      inputPrompt: "Input per {0}:",
      errorInputCancelled: "Input dati annullato dall'utente.",
      errorInvalidIntegerInput:
        'Valore di input "{0}" non è un intero valido per il tipo {1}.',
      errorInvalidRealInput:
        'Valore di input "{0}" non è un numero reale valido per il tipo {1}.',
      errorInvalidBooleanInput:
        "Valore di input \"{0}\" non è un logico valido (atteso '{1}' o '{2}').",
      errorAssignmentSyntax:
        "Sintassi di assegnazione non valida: {0}. Atteso 'variabile {1} espressione'.",
      errorArrayIndexOutOfBoundsRead:
        "Indice {0} fuori dai limiti [{1}..{2}] per il vettore {3} nel comando di lettura.",
      errorArrayNotDeclaredRead:
        "Vettore non dichiarato: {0} nel comando di lettura.",
      errorInvalidArrayAccessRead:
        "Accesso non valido al vettore nel comando di lettura: {0}",
      errorVariableNotDeclaredRead:
        "Variabile non dichiarata nel comando di lettura: {0}",
      errorArrayIndexOutOfBoundsAssign:
        "Indice {0} fuori dai limiti [{1}..{2}] per il vettore {3} in assegnazione.",
      errorArrayNotDeclaredAssign:
        "Vettore non dichiarato: {0} in assegnazione.",
      errorInvalidArrayAccessAssign:
        "Accesso non valido al vettore in assegnazione: {0}",
      errorIdentifierNotDeclaredAssign:
        "Variabile o vettore non dichiarato per l'assegnazione: {0}.",
      errorIfSyntax:
        "Sintassi '{1}' non valida alla riga {0}: {2}. Atteso '{1} condizione {3}'.",
      errorIfNoEndIf:
        "Blocco '{1}' iniziato alla riga {0} (\" {2} \") non ha un '{3}' corrispondente.",
      errorForLoopSyntax: "Sintassi ciclo 'per' non valida alla riga {0}.",
      errorForLoopCounterVariable:
        "Variabile di controllo del ciclo 'per' (\"{0}\") deve essere numerica e dichiarata.",
      errorForLoopBoundsNotNumeric:
        "Valori di inizio, fine o passo del ciclo 'per' devono essere numerici.",
      errorForLoopStepZero: "Il passo del ciclo 'per' non può essere zero.",
      errorForLoopNoEndFor:
        "Ciclo 'per' iniziato alla riga {0} (\" {1} \") non ha un '{2}' corrispondente.",
      errorWhileLoopSyntax: "Sintassi ciclo 'mentre' non valida alla riga {0}.",
      errorWhileLoopMaxIterations:
        "Ciclo 'mentre' ha superato il limite massimo di {0} iterazioni alla riga {1}. Possibile ciclo infinito.",
      errorWhileLoopNoEndWhile:
        "Ciclo 'mentre' iniziato alla riga {0} (\" {1} \") non ha un '{2}' corrispondente.",
      errorArrayIndexNotInteger:
        'Indice del vettore "{0}" (per "{1}") non risulta in un intero.',
      errorUnexpectedEndOfExpressionConsume:
        "Fine imprevista dell'espressione durante il tentativo di consumare un token.",
      errorUnexpectedEndOfExpressionPrimary:
        "Fine imprevista dell'espressione durante il tentativo di analizzare un termine primario.",
      errorLogicalNotOperand:
        "L'operatore 'non' può essere applicato solo a valori logici.",
      errorUnaryMinusOperand:
        "L'operatore '-' unario può essere applicato solo a numeri.",
      errorFunctionArgsParenthesis:
        "Attesa ')' o ',' nella lista argomenti della funzione '{0}'. Trovato: {1}",
      errorRandomFunctionArgsCount:
        "La funzione '{0}' si aspetta 2 argomenti (min, max).",
      errorRandomFunctionArgsType:
        "Gli argomenti per '{0}' devono essere numeri.",
      errorRandomFunctionArgsInteger:
        "Gli argomenti per '{0}' devono essere interi.",
      errorRandomFunctionMinMax:
        "In '{0}(min, max)', min ({1}) non può essere maggiore di max ({2}).",
      errorUnknownFunction: "Funzione sconosciuta: '{0}'.",
      errorArrayAccessBracket:
        "Attesa ']' per chiudere l'accesso al vettore {0}.",
      errorArrayNotDeclaredExpression:
        "Vettore '{0}' non dichiarato o usato in modo errato nell'espressione.",
      errorArrayIndexOutOfBoundsExpression:
        "Indice {0} fuori dai limiti [{1}..{2}] per il vettore {3}.",
      errorIdentifierNotDeclaredExpression:
        "Variabile, vettore o funzione '{0}' non dichiarato o usato in modo errato nell'espressione.",
      errorExpressionParenthesis:
        "Attesa ')' per chiudere le parentesi nell'espressione.",
      errorUnexpectedTokenPrimary:
        "Token imprevisto durante l'analisi del termine primario dell'espressione: '{0}' (tipo: {1})",
      errorArithmeticOperandType:
        "L'operatore aritmetico '{0}' richiede operandi numerici. Ricevuti '{1}' ({2}) e '{3}' ({4}).",
      errorDivisionByZero: "Divisione per zero nell'espressione.",
      errorModuloByZero: "Modulo per zero nell'espressione.",
      errorModuloOperandsInteger:
        "L'operatore '%' (mod) richiede operandi interi.",
      errorLogicalAndOperands: "L'operatore 'e' richiede operandi logici.",
      errorLogicalOrOperands: "L'operatore 'o' richiede operandi logici.",
      errorUnknownOperatorExpression:
        "Operatore sconosciuto nell'espressione: {0}",
      errorInvalidExpressionType:
        "Tipo di espressione non valido per la valutazione: {0}. Attesa stringa.",
      errorEmptyExpression: "Espressione vuota fornita per la valutazione.",
      errorEmptyOrInvalidExpressionTokenize:
        'Espressione vuota o non valida per la valutazione dopo la tokenizzazione: "{0}"',
      errorExpressionSyntaxRemainingTokens:
        "Sintassi dell'espressione non valida. Token rimanenti non elaborati: {0}",
      errorUnknownTokenInExpression:
        "Token sconosciuto nell'espressione: '{0}'",
    },
  },
};
