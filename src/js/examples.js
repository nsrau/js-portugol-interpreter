// js/examples.js

/**
 * Exemplos de código para Português e Italiano.
 * Cada idioma tem um conjunto de exemplos com nome e código.
 */
export const examples = {
    pt: {
        olaMundo: {
            name: "Olá Mundo",
            code: `algoritmo "OlaMundo"\n// Este algoritmo escreve "Olá, Mundo!" na saída.\nvar\n\ninicio\n   escreva("Olá, Mundo!")\nfimalgoritmo`
        },
        somaNumeros: {
            name: "Soma de Dois Números",
            code: `algoritmo "SomaDoisNumeros"\nvar\n   num1, num2, soma: real\ninicio\n   escreva("Digite o primeiro número: ")\n   leia(num1)\n   escreva("Digite o segundo número: ")\n   leia(num2)\n   soma <- num1 + num2\n   escreva("A soma de ", num1, " e ", num2, " é: ", soma)\nfimalgoritmo`
        },
        mediaNotas: {
            name: "Média de Notas",
            code: `algoritmo "MediaNotas"\nvar\n   nota1, nota2, nota3, media: real\ninicio\n   escreva("Digite a primeira nota: ")\n   leia(nota1)\n   escreva("Digite a segunda nota: ")\n   leia(nota2)\n   escreva("Digite a terceira nota: ")\n   leia(nota3)\n\n   media <- (nota1 + nota2 + nota3) / 3\n   escreva("A média é: ", media)\n   \n   se media >= 9.5 entao\n      escreva("Aprovado")\n   senao\n      se media >= 8 entao\n         escreva("Recuperação")\n      senao\n         escreva("Reprovado")\n      fimse\n   fimse\nfimalgoritmo`
        },
        cicloPara: {
            name: "Ciclo Para",
            code: `algoritmo "ExemploCicloPara"\nvar\n   contador, soma: inteiro\ninicio\n   soma <- 0\n   para contador de 1 ate 5 faca\n      soma <- soma + contador\n      escreva("Contador: ", contador, ", Soma: ", soma)\n   fimpara\nfimalgoritmo`
        },
        cicloEnquanto: {
            name: "Ciclo Enquanto",
            code: `algoritmo "ExemploCicloEnquanto"\nvar\n   i: inteiro\ninicio\n   i <- 1\n   enquanto i <= 5 faca\n      escreva("Valor de i: ", i)\n      i <- i + 1\n   fimenquanto\nfimalgoritmo`
        },
        vetores: {
            name: "Vetores",
            code: `algoritmo "ExemploVetor"\nvar\n   idades: vetor[1..3] de inteiro\n   i: inteiro\ninicio\n   para i de 1 ate 3 faca\n      escreva("Digite a idade ", i, ": ")\n      leia(idades[i])\n   fimpara\n   escreva("Idades armazenadas:")\n   para i de 1 ate 3 faca\n      escreva(idades[i])\n   fimpara\nfimalgoritmo`
        },
        aleatorio: {
            name: "Números Aleatórios",
            code: `algoritmo "Sorteio"\nvar\n   num: inteiro\ninicio\n   num <- aleatorio(1, 10)\n   escreva("Número sorteado entre 1 e 10: ", num)\n   \n   num <- aleatorio(-5, 0)\n   escreva("Número sorteado entre -5 e 0: ", num)\nfimalgoritmo`
        },
        pedroJose: {
            name: "Pedro vs José (Altura)",
            code: `Algoritmo "PedroMaiorQueJose"\nVar\n   Jose, Pedro, anos: inteiro\nInicio\n   Jose <- 150\n   Pedro <- 110\n   anos <- 0\n   enquanto Pedro <= Jose faca\n      Jose <- Jose + 2\n      Pedro <- Pedro + 3\n      anos <- anos + 1\n   fimenquanto\n   escreva("Serão necessários ", anos, " anos para Pedro ser maior que José.")\n   escreva("Ao final, Pedro terá ", Pedro, "cm e José terá ", Jose, "cm.")\nFimalgoritmo`
        }
    },
    it: {
        ciaoMondo: {
            name: "Ciao Mondo",
            code: `algoritmo "CiaoMondo"\n// Questo algoritmo scrive "Ciao, Mondo!" nell'output.\nvariabili\n\ninizio\n   scrivi("Ciao, Mondo!")\nfinealgoritmo`
        },
        sommaNumeri: {
            name: "Somma di Due Numeri",
            code: `algoritmo "SommaDueNumeri"\nvariabili\n   num1, num2, somma: reale\ninizio\n   scrivi("Inserisci il primo numero: ")\n   leggi(num1)\n   scrivi("Inserisci il secondo numero: ")\n   leggi(num2)\n   somma <- num1 + num2\n   scrivi("La somma di ", num1, " e ", num2, " è: ", somma)\nfinealgoritmo`
        },
        mediaVoti: {
            name: "Media Voti",
            code: `algoritmo "MediaVoti"\nvariabili\n   voto1, voto2, voto3, media: reale\ninizio\n   scrivi("Inserisci il primo voto: ")\n   leggi(voto1)\n   scrivi("Inserisci il secondo voto: ")\n   leggi(voto2)\n   scrivi("Inserisci il terzo voto: ")\n   leggi(voto3)\n\n   media <- (voto1 + voto2 + voto3) / 3\n   scrivi("La media è: ", media)\n   \n   se media >= 6 allora\n      scrivi("Promosso")\n   altrimenti\n      se media >= 5 allora\n         scrivi("Recupero")\n      altrimenti\n         scrivi("Bocciato")\n      finese\n   finese\nfinealgoritmo`
        },
        cicloPer: {
            name: "Ciclo Per",
            code: `algoritmo "EsempioCicloPer"\nvariabili\n   contatore, somma: intero\ninizio\n   somma <- 0\n   per contatore da 1 a 5 fai\n      somma <- somma + contatore\n      scrivi("Contatore: ", contatore, ", Somma: ", somma)\n   fineper\nfinealgoritmo`
        },
        cicloMentre: {
            name: "Ciclo Mentre",
            code: `algoritmo "EsempioCicloMentre"\nvariabili\n   i: intero\ninizio\n   i <- 1\n   mentre i <= 5 fai\n      scrivi("Valore di i: ", i)\n      i <- i + 1\n   finementre\nfinealgoritmo`
        },
        vettori: {
            name: "Vettori",
            code: `algoritmo "EsempioVettore"\nvariabili\n   eta: vettore[1..3] di intero\n   i: intero\ninizio\n   per i da 1 a 3 fai\n      scrivi("Inserisci l'età ", i, ": ")\n      leggi(eta[i])\n   fineper\n   scrivi("Età memorizzate:")\n   per i da 1 a 3 fai\n      scrivi(eta[i])\n   fineper\nfinealgoritmo`
        },
        casuale: {
            name: "Numeri Casuali",
            code: `algoritmo "Estrazione"\nvariabili\n   num: intero\ninizio\n   num <- casuale(1, 10)\n   scrivi("Numero estratto tra 1 e 10: ", num)\n   \n   num <- casuale(-5, 0)\n   scrivi("Numero estratto tra -5 e 0: ", num)\nfinealgoritmo`
        },
        pietroGiuseppe: {
            name: "Pietro vs Giuseppe (Altezza)",
            code: `Algoritmo "PietroPiuAltoDiGiuseppe"\nVariabili\n   Giuseppe, Pietro, anni: intero\nInizio\n   Giuseppe <- 150\n   Pietro <- 110\n   anni <- 0\n   mentre Pietro <= Giuseppe fai\n      Giuseppe <- Giuseppe + 2\n      Pietro <- Pietro + 3\n      anni <- anni + 1\n   finementre\n   scrivi("Saranno necessari ", anni, " anni perché Pietro sia più alto di Giuseppe.")\n   scrivi("Alla fine, Pietro sarà alto ", Pietro, "cm e Giuseppe ", Giuseppe, "cm.")\nFinealgoritmo`
        }
    }
};
