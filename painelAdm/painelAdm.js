// Função para pegar o token.
function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}

//URL do BACK-END
const baseUrl = "https://back-end-tf-web-three.vercel.app";

//Obtendo a lista de cardápios, para usar nas funções de listar, atualizar e exluir.
async function obterCardapios() {
  try {
    const listaCardapios = await fetch(`${baseUrl}/cardapio`);
    return listaCardapios;
  } catch (error) {
    throw new Error(
      "Erro ao obter cardápios. Por favor, tente novamente mais tarde."
    );
  }
}

// Função menu mobile
function togglemenu() {
  const menuMobile = document.getElementById("menu-mobile");

  if (menuMobile.classList.contains("menu-mobile-active")) {
    menuMobile.classList.remove("menu-mobile-active");
  } else {
    menuMobile.classList.add("menu-mobile-active");
  }
}

// Navegando entre as paginas:
function paginas(paginaId) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "";
  // Adicionar conteúdo da página correspondente
  switch (paginaId) {
    case "criar":
      mainContent.innerHTML = `
        <div class="container">
          <h2 class= "criar-tituto">Criar Cardápio</h2>
          <form class= "criar-formulario"id="cardapioForm">
            <label class="criar-label" for="diaSemana">Dia da Semana:</label>
            <input class="criar-input" type="text" id="diaSemana" name="diaSemana" required />

            <label class="criar-label" for="itensCafe">Itens Café da Manhã:</label>
            <textarea class="criar-textarea" id="itensCafe" name="itensCafe" rows="4" required></textarea>

            <label class="criar-label" for="itensAlmoco">Itens Almoço:</label>
            <textarea class="criar-textarea" id="itensAlmoco" name="itensAlmoco" rows="4" required></textarea>

            <label class="criar-label" for="itensJantar">Itens Jantar:</label>
            <textarea class="criar-textarea" id="itensJantar" name="itensJantar" rows="4" required></textarea>

            <button class="criar-button"type="button" onclick="criarCardapio()">Criar Cardápio</button>
          </form>
        </div>`;
      break;

    case "listar":
      mainContent.innerHTML = `
      <div class="container">
        <h1>Cardápios</h1>
        <div id="cardapio-list" class="cardapio-list">
          <!-- O conteúdo será adicionado dinamicamente pelo JavaScript -->
        </div>
      </div>`;
      carregarCardapios();
      break;

    case "editar":
      mainContent.innerHTML = mainContent.innerHTML = `
        <div class="container">
          <h1>Editar Cardápio</h1>
          <div id="cardapio-list" class="cardapio-list">
            <!-- O conteúdo será adicionado dinamicamente pelo JavaScript -->
          </div>
        </div>`;
      carregarCardapios(false, true);
      break;

    case "excluir":
      mainContent.innerHTML = `
        <div class="container">
          <h1>Excluir Cardápio</h1>
          <div id="cardapio-list" class="cardapio-list">
            <!-- O conteúdo será adicionado dinamicamente pelo JavaScript -->
          </div>
        </div>`;
      carregarCardapios(true);
      break;

    case "feedbacks":
      mainContent.innerHTML = `
        <div class="container">
          <h1>Feedbacks dos alunos</h1>
          <div id="feedback-list" class="feedbaak-list">
            <!-- O conteúdo será adicionado dinamicamente pelo JavaScript -->
          </div>
        </div>`;
      carregarFeedbacks();
      break;
    default:
      break;
  }
}

// Função para criar cardapio, pegando informações do front-end e entregando para o back-end
async function criarCardapio() {
  // Verificação de autenticação
  const authToken = getAuthToken();
  if (!authToken) {
    // Redirecione o usuário para a página de login ou realize outra ação apropriada
    window.location.href = "../index.html";
    return;
  }

  const diaSemana = document.getElementById("diaSemana").value;
  const itensCafe = document.getElementById("itensCafe").value;
  const itensAlmoco = document.getElementById("itensAlmoco").value;
  const itensJantar = document.getElementById("itensJantar").value;

  try {
    const response = await fetch(`${baseUrl}/cardapio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({
        Dia_da_semana: diaSemana,
        Itens_Cafe_Da_Manha: itensCafe,
        Itens_Almoco: itensAlmoco,
        Itens_Jantar: itensJantar,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: "Parabéns!",
        text: "Cardápio criado com sucesso, pressione OK!",
        icon: "success",
      });
      document.getElementById("diaSemana").value = "";
      document.getElementById("itensCafe").value = "";
      document.getElementById("itensAlmoco").value = "";
      document.getElementById("itensJantar").value = "";
    } else {
      Swal.fire({
        title: "Erro ao criar cardápio!",
        text: `${data.mensagem}, preencha por favor`,
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire("Erro interno do servidor");
  }
}

/**
  Função para listar todos os cardapios da api, com botões dinâmicos de editar e excluir que podem ou não aparecer,
  essa função será usada em Listar, editar, e excluir.
 */
async function carregarCardapios(
  permiteExcluir = false,
  permiteEditar = false
) {
  const cardapioList = document.getElementById("cardapio-list");

  try {
    const response = await obterCardapios();

    if (response.ok) {
      const cardapios = await response.json();

      cardapioList.innerHTML = "";

      cardapios.forEach((cardapio) => {
        const cardapioItem = document.createElement("div");
        cardapioItem.classList.add("cardapio-item");

        const diaSemana = document.createElement("h2");
        diaSemana.textContent = cardapio.dia_da_semana;
        cardapioItem.appendChild(diaSemana);

        const cafeManha = document.createElement("p");
        cafeManha.textContent = `CAFÉ DA MANHÃ: ${cardapio.itens_cafe_da_manha}`;
        cardapioItem.appendChild(cafeManha);

        const almoco = document.createElement("p");
        almoco.textContent = `ALMOÇO: ${cardapio.itens_almoco}`;
        cardapioItem.appendChild(almoco);

        const janta = document.createElement("p");
        janta.textContent = `JANTAR: ${cardapio.itens_jantar}`;
        cardapioItem.appendChild(janta);

        // Adiciona um botão de edição condicionalmente
        if (permiteEditar) {
          const btnEditar = document.createElement("button");
          btnEditar.textContent = "Editar";
          btnEditar.addEventListener("click", () =>
            editarCardapio(cardapio.id)
          );
          cardapioItem.appendChild(btnEditar);
          btnEditar.classList.add("btn-editar");
        }
        // Adiciona um botão de exclusão condicionalmente
        if (permiteExcluir) {
          const btnExcluir = document.createElement("button");
          btnExcluir.textContent = "Excluir";
          btnExcluir.addEventListener("click", () =>
            excluirCardapio(cardapio.id)
          );
          btnExcluir.classList.add("btn-excluir");
          cardapioItem.appendChild(btnExcluir);
        }

        cardapioList.appendChild(cardapioItem);
      });
    } else {
      cardapioList.innerHTML = "Nenhum cardápio encontrado";
    }
  } catch (error) {
    cardapioList.innerHTML =
      "Erro ao obter cardápios. Por favor, tente novamente mais tarde.";
  }
}

//Função criada para excluir o cardápio
async function excluirCardapio(cardapioId) {
  if (!getAuthToken()) {
    window.location.href = "../index.html";
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/cardapio/${cardapioId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + getAuthToken(),
      },
    });

    if (response.ok) {
      Swal.fire({
        title: "Parabéns!",
        text: "Cardápio excluído com sucesso!, pressione OK!",
        icon: "success",
      });
      // Atualiza a lista de cardápios após a exclusão
      carregarCardapios(true);
    } else {
      const data = await response.json();
      Swal.fire(`${data.mensagem}`);
    }
  } catch (error) {
    Swal.fire("Erro interno do servidor");
  }
}

/**
  Função para criar elementos de editar cardapio, responsavel por 
  limpa o conteúdo principal da página, faz uma requisição para obter os dados do cardápio, 
  cria dinamicamente elementos HTML para formar um formulário de edição com base nos dados obtidos
  e adiciona esses elementos à página.
 */
async function editarCardapio(cardapioId) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "";

  const response = await fetch(`${baseUrl}/cardapio/${cardapioId}`);
  if (!response.ok) {
    console.error("Erro ao obter dados do cardápio para edição");
    return;
  }

  const cardapio = await response.json();

  const container = document.createElement("div");
  container.classList.add("container");

  const titulo = document.createElement("h2");
  titulo.classList.add("criar-tituto");
  titulo.textContent = "Editar Cardápio";

  const editarFormulario = document.createElement("form");
  editarFormulario.classList.add("criar-formulario");
  editarFormulario.id = "editCardapioForm";

  // Criando elementos diretamente
  const labelDiaSemana = document.createElement("label");
  labelDiaSemana.classList.add("criar-label");
  labelDiaSemana.setAttribute("for", "editDiaSemana");
  labelDiaSemana.textContent = "Dia da Semana:";

  const inputDiaSemana = document.createElement("input");
  inputDiaSemana.classList.add("criar-input");
  inputDiaSemana.setAttribute("type", "text");
  inputDiaSemana.setAttribute("id", "editDiaSemana");
  inputDiaSemana.setAttribute("name", "editDiaSemana");
  inputDiaSemana.setAttribute("required", true);
  inputDiaSemana.value = cardapio.dia_da_semana;

  const labelItensCafe = document.createElement("label");
  labelItensCafe.classList.add("criar-label");
  labelItensCafe.setAttribute("for", "editItensCafe");
  labelItensCafe.textContent = "Itens Café da Manhã:";

  const textareaItensCafe = document.createElement("textarea");
  textareaItensCafe.classList.add("criar-textarea");
  textareaItensCafe.setAttribute("id", "editItensCafe");
  textareaItensCafe.setAttribute("name", "editItensCafe");
  textareaItensCafe.setAttribute("rows", "4");
  textareaItensCafe.setAttribute("required", true);
  textareaItensCafe.value = cardapio.itens_cafe_da_manha;

  const labelItensAlmoco = document.createElement("label");
  labelItensAlmoco.classList.add("criar-label");
  labelItensAlmoco.setAttribute("for", "editItensAlmoco");
  labelItensAlmoco.textContent = "Itens Almoço:";

  const textareaItensAlmoco = document.createElement("textarea");
  textareaItensAlmoco.classList.add("criar-textarea");
  textareaItensAlmoco.setAttribute("id", "editItensAlmoco");
  textareaItensAlmoco.setAttribute("name", "editItensAlmoco");
  textareaItensAlmoco.setAttribute("rows", "4");
  textareaItensAlmoco.setAttribute("required", true);
  textareaItensAlmoco.value = cardapio.itens_almoco;

  const labelItensJantar = document.createElement("label");
  labelItensJantar.classList.add("criar-label");
  labelItensJantar.setAttribute("for", "editItensJantar");
  labelItensJantar.textContent = "Itens Jantar:";

  const textareaItensJantar = document.createElement("textarea");
  textareaItensJantar.classList.add("criar-textarea");
  textareaItensJantar.setAttribute("id", "editItensJantar");
  textareaItensJantar.setAttribute("name", "editItensJantar");
  textareaItensJantar.setAttribute("rows", "4");
  textareaItensJantar.setAttribute("required", true);
  textareaItensJantar.value = cardapio.itens_jantar;

  const editarButton = document.createElement("button");
  editarButton.classList.add("editar-button");
  editarButton.type = "button";
  editarButton.textContent = "Atualizar Cardápio";
  editarButton.addEventListener("click", () => atualizarCardapio(cardapio.id));

  // Adiciona os elementos ao formulário
  editarFormulario.appendChild(labelDiaSemana);
  editarFormulario.appendChild(inputDiaSemana);
  editarFormulario.appendChild(labelItensCafe);
  editarFormulario.appendChild(textareaItensCafe);
  editarFormulario.appendChild(labelItensAlmoco);
  editarFormulario.appendChild(textareaItensAlmoco);
  editarFormulario.appendChild(labelItensJantar);
  editarFormulario.appendChild(textareaItensJantar);
  editarFormulario.appendChild(editarButton);

  // Adiciona os elementos ao contêiner principal
  container.appendChild(titulo);
  container.appendChild(editarFormulario);

  // Adiciona o contêiner principal ao conteúdo principal
  mainContent.appendChild(container);
}

// Função criada para fazer a atualização do cardápio.
async function atualizarCardapio(cardapioId) {
  const editDiaSemana = document.getElementById("editDiaSemana").value;
  const editItensCafe = document.getElementById("editItensCafe").value;
  const editItensAlmoco = document.getElementById("editItensAlmoco").value;
  const editItensJantar = document.getElementById("editItensJantar").value;

  const authToken = getAuthToken();

  if (!authToken) {
    window.location.href = "../index.html";
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/cardapio/${cardapioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({
        Dia_da_semana: editDiaSemana,
        Itens_Cafe_Da_Manha: editItensCafe,
        Itens_Almoco: editItensAlmoco,
        Itens_Jantar: editItensJantar,
      }),
    });

    if (response.ok) {
      Swal.fire({
        title: "Parabéns!",
        text: "Cardápio atualizado com sucesso, pressione OK!",
        icon: "success",
      });
      // Redirecione ou realize outras ações após a atualização bem-sucedida
    } else {
      const data = await response.json();
      Swal.fire({
        title: "Erro ao atualizar cardápio!",
        text: `${data.mensagem}, preencha por favor`,
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire("Erro interno do servidor");
  }
}

// Função criada para buscar no back-end e montar no front-end os feedbacks dos alunos em relação ao cardápio.
async function carregarFeedbacks() {
  const feedbackList = document.getElementById("feedback-list");

  try {
    const response = await fetch(`${baseUrl}/feedback`);
    if (response.ok) {
      const feedbacks = await response.json();

      feedbackList.innerHTML = "";

      feedbacks.forEach((feedback) => {
        const feedbackItemContainer = document.createElement("div");
        feedbackItemContainer.classList.add("feedback-item-container");

        const feedbackItem = document.createElement("div");
        feedbackItem.classList.add("feedback-item");

        const diaSemana = document.createElement("h2");
        diaSemana.textContent = feedback.dia_da_semana;
        feedbackItem.appendChild(diaSemana);

        const nota = document.createElement("p");
        nota.textContent = `Nota: ${feedback.nota}`;
        nota.classList.add("feedback-nota");
        feedbackItem.appendChild(nota);

        const itensCafeDaManha = document.createElement("p");
        itensCafeDaManha.textContent = `Itens Café da Manhã: ${feedback.itens_cafe_da_manha}`;
        feedbackItem.appendChild(itensCafeDaManha);

        const itensAlmoco = document.createElement("p");
        itensAlmoco.textContent = `Itens Almoço: ${feedback.itens_almoco}`;
        feedbackItem.appendChild(itensAlmoco);

        const itensJantar = document.createElement("p");
        itensJantar.textContent = `Itens Jantar: ${feedback.itens_jantar}`;
        feedbackItem.appendChild(itensJantar);

        const btnExcluirFeedback = document.createElement("button");
        btnExcluirFeedback.textContent = "Excluir Feedback";
        btnExcluirFeedback.classList.add("btn-excluir");
        btnExcluirFeedback.addEventListener("click", () =>
          excluirFeedback(feedback.id)
        );
        feedbackItem.appendChild(btnExcluirFeedback);

        feedbackItemContainer.appendChild(feedbackItem);
        feedbackList.appendChild(feedbackItemContainer);
      });
    } else {
      feedbackList.innerHTML = "Nenhum feedback encontrado.";
    }
  } catch (error) {
    feedbackList.innerHTML =
      "Erro ao obter feedbacks. Por favor, tente novamente mais tarde.";
  }
}

//Função criada para excluir um feedbaack pelo id.
async function excluirFeedback(feedbackId) {
  const authToken = getAuthToken();

  if (!authToken) {
    window.location.href = "../index.html";
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/feedback/${feedbackId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    });

    if (response.ok) {
      Swal.fire({
        title: "Parabéns!",
        text: "Feedback excluído com sucesso!",
        icon: "success",
      });
      carregarFeedbacks();
    } else {
      const data = await response.json();
      Swal.fire(`${data.mensagem}`);
    }
  } catch (error) {
    Swal.fire("Erro interno do servidor");
  }
}
