# Interpretador Portugol/Italiano Web

Um interpretador online para uma versão simplificada de Portugol e sua adaptação para Italiano.

## Funcionalidades

- Suporte a português e italiano
- Tema claro/escuro
- Editor com syntax highlighting
- Exemplos de código
- Interface intuitiva
- Funções básicas do Portugol:
  - Variáveis (inteiro, real, caractere, lógico)
  - Vetores
  - Estruturas de controle (se/senao, para, enquanto)
  - Entrada/saída (leia/escreva)
  - Função aleatório

## Uso Online

Acesse a versão online em: https://nsrau.github.io/js-portugol-interpreter/

## Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/nsrau/js-portugol-interpreter.git
```

2. Abra o arquivo `index.html` em um navegador web moderno.

## Exemplos

```portugol
algoritmo "OlaMundo"
var
inicio
   escreva("Olá, Mundo!")
fimalgoritmo
```

```portugol
algoritmo "SomaDoisNumeros"
var
   num1, num2, soma: real
inicio
   escreva("Digite o primeiro número: ")
   leia(num1)
   escreva("Digite o segundo número: ")
   leia(num2)
   soma <- num1 + num2
   escreva("A soma é: ", soma)
fimalgoritmo
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.