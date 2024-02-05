const baseUrl = "https://back-end-tf-web-three.vercel.app";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(`${baseUrl}/cardapio`);
    const cardapios = await response.json();

    const cardapioContainer = document.getElementById("cardapio-container");

    // Função de comparação para ordenar os cardápios por dia da semana
    function compararDiasDaSemana(a, b) {
      const diasOrdenados = [
        "Domingo",
        "Segunda-Feira",
        "Terça-Feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ];
      return (
        diasOrdenados.indexOf(a.dia_da_semana) -
        diasOrdenados.indexOf(b.dia_da_semana)
      );
    }

    // Ordenar os cardápios pelo dia da semana
    cardapios.sort(compararDiasDaSemana);

    cardapios.forEach((cardapio) => {
      const cardapioDiv = document.createElement("div");
      cardapioDiv.classList.add("cardapio");

      const diaSemana = document.createElement("h3");
      diaSemana.textContent = cardapio.dia_da_semana;

      const cafeDaManha = document.createElement("p");
      cafeDaManha.textContent = `Café da Manhã: ${cardapio.itens_cafe_da_manha}`;

      const almoco = document.createElement("p");
      almoco.textContent = `Almoço: ${cardapio.itens_almoco}`;

      const jantar = document.createElement("p");
      jantar.textContent = `Jantar: ${cardapio.itens_jantar}`;

      // Botão para adicionar nota
      const NotaBtn = document.createElement("button");
      NotaBtn.textContent = "AVALIAR";
      NotaBtn.classList.add("adicionar-nota-btn");
      NotaBtn.addEventListener("click", async () => {
        const { value: nota } = await Swal.fire({
          title: "Avalie o cardápio com nota de 0 a 10: ",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonText: "Adicionar",
          cancelButtonText: "Cancelar",
          inputValidator: (value) => {
            const nota = parseFloat(value);
            if (nota < 0 || nota > 10) {
              return "Insira uma nota de 0 a 10";
            }
          },
        });

        if (nota) {
          // Chamar a função para adicionar feedback
          adicionarFeedback(cardapio.id, nota);
        }
      });

      cardapioDiv.appendChild(diaSemana);
      cardapioDiv.appendChild(cafeDaManha);
      cardapioDiv.appendChild(almoco);
      cardapioDiv.appendChild(jantar);

      cardapioDiv.appendChild(NotaBtn);

      cardapioContainer.appendChild(cardapioDiv);
    });
  } catch (error) {
    console.error("Erro ao obter cardápios:", error);
  }
});

//Adicionado nota dos alunos no cardápio
async function adicionarFeedback(idCardapio, nota) {
  try {
    const response = await fetch(
      `${baseUrl}/feedback/${idCardapio}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Nota: nota }),
      }
    );

    const resultado = await response.json();

    if (response.status === 201) {
      Swal.fire({
        title: "Parabéns!",
        text: "Feedback criado com sucesso!",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Algo deu errado!",
        text: "Erro ao criar feedback!",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Erro ao adicionar feedback:", error);
  }
}
