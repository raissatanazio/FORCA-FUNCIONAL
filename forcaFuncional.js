/*-------------------FUNÇÃO PRINCIPAL--------------------*/
// Função para iniciar um novo jogo, recebendo a palavra e o número de tentativas (padrão: 6)
const iniciarJogo = (palavra, tentativas = 6) => ({
  palavra: palavra.toUpperCase(), // Palavra a ser adivinhada, em maiúsculas
  letrascertas: [],               // Letras corretas já escolhidas
  letraserradas: [],              // Letras erradas já escolhidas
  tentativasrestantes: tentativas,// Tentativas restantes
  status: 'jogando'               // Status do jogo: 'jogando', 'vitoria' ou 'derrota'
})


//Verifica recursivamente se uma determinada letra está presente em uma string.
const contemLetra = (str, letra, i = 0) => {
  if (i >= str.length) return false
  if (str[i] === letra) return true
  return contemLetra(str, letra, i + 1)
}

/*falha com letras repetidas 
const verificarVitoria = (jogo) =>
  jogo.palavra.length === jogo.letrascertas.length
    ? { ...jogo, status: 'vitoria' }
    : jogo*/

// Função para verificar se o jogador venceu
const verificarVitoria = (jogo) => {
  // Cria um array com as letras únicas da palavra
  const letrasUnicas = [...new Set(jogo.palavra.split(""))]
  // Verifica se todas as letras únicas estão em letrascertas
  const venceu = letrasUnicas.every(l => jogo.letrascertas.includes(l))
  // Se venceu, atualiza o status para 'vitoria', senão retorna o jogo inalterado
  return venceu ? { ...jogo, status: 'vitoria' } : jogo
}

// Função para verificar se o jogador perdeu
const verificarDerrota = (jogo) =>
  jogo.tentativasrestantes <= 0
    ? { ...jogo, status: 'derrota' }
    : jogo

// Adiciona uma letra correta ao jogo, se ainda não foi adicionada
const adicionarLetraCerta = (jogo, letra) => {
  if (!contemLetra(jogo.palavra, letra)) return jogo // Se a letra não está na palavra, retorna o jogo inalterado
  if (contemLetra(jogo.letrascertas, letra)) return jogo // Se a letra já foi adicionada, retorna o jogo inalterado

  const novasCertas = [...jogo.letrascertas, letra] // Adiciona a letra ao array de letras certas
  return verificarVitoria({ ...jogo, letrascertas: novasCertas }) // Verifica se venceu após adicionar
}

// Adiciona uma letra errada ao jogo, se ainda não foi adicionada
const adicionarLetraErrada = (jogo, letra) => {
  if (contemLetra(jogo.palavra, letra)) return jogo // Se a letra está na palavra, retorna o jogo inalterado
  if (contemLetra(jogo.letraserradas, letra)) return jogo // Se a letra já foi adicionada, retorna o jogo inalterado

  const novasErradas = [...jogo.letraserradas, letra] // Adiciona a letra ao array de letras erradas
  return verificarDerrota({
    ...jogo,
    letraserradas: novasErradas,
    tentativasrestantes: jogo.tentativasrestantes - 1 // Decrementa as tentativas restantes
  })
}


 // Adiciona uma letra ao estado do jogo, atualizando conforme acerto ou erro.
  // Se o jogo não estiver em andamento, retorna o estado atual.
  // Converte a letra para maiúscula antes de processar.
 
const adicionarLetra = (jogo, letra) => {
    const letraMaiuscula = letra.toUpperCase();
  if (jogo.status !== 'jogando') return jogo

  return contemLetra(jogo.palavra, letraMaiuscula)
    ? adicionarLetraCerta(jogo, letraMaiuscula)
    : adicionarLetraErrada(jogo, letraMaiuscula)
}

// fim da função principal//

//funções de vizulização

// Mostra a palavra com as letras certas reveladas e as demais como "_"
const mostrarPalavra = (jogo) =>
  jogo.palavra
    .split("")
    .map(letra => jogo.letrascertas.includes(letra) ? letra : "_")
    .join(" ")

// Mostra as letras erradas já escolhidas
const mostrarErradas = (jogo) =>
  jogo.letraserradas.join(", ")

// Mostra o número de tentativas restantes
const mostrarTentativas = (jogo) =>
  `Tentativas restantes: ${jogo.tentativasrestantes}`

// Mostra a mensagem de vitória ou derrota, ou nada se o jogo está em andamento
const mostrarMensagem = (jogo) =>
  jogo.status === "vitoria" ? "🎉 Você venceu!" :
  jogo.status === "derrota" ? "💀 Você perdeu!" : ""


  const desenharForca = (erros) => {
  const desenhos = [
    // 0 erros - apenas a forca
    `   +---+
   |   |
       |
       |
       |
       |
=========`,
    // 1 erro - cabeça
    `   +---+
   |   |
   O   |
       |
       |
       |
=========`,
    // 2 erros - corpo
    `   +---+
   |   |
   O   |
   |   |
       |
       |
=========`,
    // 3 erros - braço esquerdo
    `   +---+
   |   |
   O   |
  /|   |
       |
       |
=========`,
    // 4 erros - braço direito
    `   +---+
   |   |
   O   |
  /|\\  |
       |
       |
=========`,
    // 5 erros - perna esquerda
    `   +---+
   |   |
   O   |
  /|\\  |
  /    |
       |
=========`,
    // 6 erros - perna direita (completo)
    `   +---+
   |   |
   O   |
  /|\\  |
  / \\  |
       |
=========`
  ]
  
  return desenhos[Math.min(erros, 6)]
}

//estado inicial
// Lista de palavras para sortear.
const palavras = ["JAVASCRIPT", "FUNCIONAL", "PROGRAMAR", "RECURSIVIDADE"]

 // Seleciona aleatoriamente uma palavra de uma lista.
const sortearPalavra = (lista) =>
  lista[Math.floor(Math.random() * lista.length)]

// Função para iniciar o jogo com uma palavra sorteada da lista
const iniciar = () =>
  iniciarJogo(sortearPalavra(palavras))

//renderização
// Função utilitária para criar elementos DOM de forma declarativa
const criarElemento = (tag, { className, textContent, onClick, style } = {}, filhos = []) => {
  const elemento = document.createElement(tag)
  if (className) elemento.className = className // Define a classe CSS, se fornecida
  if (textContent) elemento.textContent = textContent // Define o texto, se fornecido
  if (onClick) elemento.addEventListener("click", onClick) // Adiciona evento de clique, se fornecido
  if (style) elemento.style = style // Define o estilo inline, se fornecido
  
  filhos.forEach(filho => elemento.appendChild(filho)) // Adiciona filhos ao elemento
  return elemento // Retorna o elemento criado
}

// Função para renderizar o teclado virtual do jogo
const renderizarTeclado = (jogo, onLetraClick) => {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") // Array com todas as letras do alfabeto

  // Cria um elemento <div> com a classe "teclado" contendo botões para cada letra
  return criarElemento("div", { className: "teclado" },
    letras.map(letra =>
      criarElemento("button", {
        className: "letra-btn", // Classe CSS para o botão
        textContent: letra,     // Texto do botão é a letra
        // Desabilita o botão se a letra já foi escolhida ou se o jogo acabou
        disabled: jogo.letrascertas.includes(letra) ||
                 jogo.letraserradas.includes(letra) ||
                 jogo.status !== "jogando",
        onClick: () => onLetraClick(letra) // Chama a função ao clicar na letra
      })
    )
  )
}

// Função para renderizar toda a interface do jogo da forca
const renderizarJogo = (jogo, onReiniciar, onLetraClick) => {
  return criarElemento("div", { className: "container" }, [
    // Título do jogob
    criarElemento("h1", { textContent: "Jogo da Forca🎯" }),
    // Desenho da forca
    criarElemento("div", { className: "forca-container" }, [
      criarElemento("div", { 
        className: "forca-desenho", 
        textContent: desenharForca(jogo.letraserradas.length) 
      })
    ]),
    // Exibe a palavra com letras reveladas ou "_"
    criarElemento("div", { className: "palavra", textContent: mostrarPalavra(jogo) }),
    // Informações de tentativas e letras erradas
    criarElemento("div", { className: "info" }, [
      criarElemento("p", { textContent: mostrarTentativas(jogo) }),
      criarElemento("p", { textContent: `Letras erradas: ${mostrarErradas(jogo)}` })
    ]),
    // Teclado virtual para escolher letras
    renderizarTeclado(jogo, onLetraClick),
    // Mensagem de vitória ou derrota
    criarElemento("div", { 
      className: `mensagem ${jogo.status}`,
      textContent: mostrarMensagem(jogo)
    }),
    // Botão para reiniciar o jogo (aparece só quando termina)
    criarElemento("button", {
      className: "reiniciar-btn",
      textContent: "Reiniciar Jogo",
      style: `display: ${jogo.status !== "jogando" ? "block" : "none"}`,
      onClick: onReiniciar
    })
  ])
}


//loop principal
// Função principal de ciclo do jogo: renderiza e atualiza o estado conforme as ações do usuário
const cicloDeJogo = (estadoAtual) => {
  // Seleciona o elemento raiz onde o jogo será renderizado
  const root = document.querySelector("#app") || document.body

  // Função chamada ao clicar em uma letra do teclado virtual
  const handleLetraClick = (letra) => {
    // Atualiza o estado do jogo com a letra escolhida
    const novoEstado = adicionarLetra(estadoAtual, letra)
    // Re-renderiza o jogo com o novo estado
    cicloDeJogo(novoEstado)
  }

  // Função chamada ao clicar no botão de reiniciar
  const handleReiniciar = () => {
    // Reinicia o jogo com uma nova palavra sorteada
    cicloDeJogo(iniciar())
  }

  tecladoFisico(handleLetraClick)

  // Renderiza a interface do jogo com os manipuladores de eventos
  const elementoRenderizado = renderizarJogo(
    estadoAtual,
    handleReiniciar,
    handleLetraClick
  )

  // Limpa o conteúdo anterior e adiciona o novo elemento renderizado
  root.innerHTML = ""
  root.appendChild(elementoRenderizado)
}

// Inicialização: executa o ciclo do jogo quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  cicloDeJogo(iniciar())
})
// Função para receber letras do teclado físico
const tecladoFisico = (onLetraClick) => {
  document.addEventListener("keydown", (event) => {
    // verifica se a tecla pressionada é uma letra 
    if(event.key.length === 1 && event.key.match(/[a-z]/i)){
      const letra = event.key.toUpperCase()
      onLetraClick(letra);
    }
  })
}
