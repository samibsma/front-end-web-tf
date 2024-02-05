const baseUrl = "https://back-end-tf-web-three.vercel.app";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(`${baseUrl}/cardapio`);
    const cardapios = await response.json();

    const cardapioContainer = document.getElementById("cardapio-container");

    /*
        diasDaSemana que associa cada dia da semana a um número de 0 a 6. Em seguida, 
        utilizamos o método sort para ordenar os cardápios com base nos números associados 
        aos dias da semana. A função de comparação compara os cardápios, mantendo a ordem 
        se o número do dia de a for menor que o de b. Dessa forma, ao final do processo, 
        os cardápios são ordenados seguindo a ordem dos dias da semana definida no objeto diasDaSemana.
     */
    const diasDaSemana = {
      Domingo: 0,
      "Segunda-Feira": 1,
      "Terça-Feira": 2,
      "Quarta-Feira": 3,
      "Quinta-Feira": 4,
      "Sexta-Feira": 5,
      Sábado: 6,
    };

    // Ordenar os cardápios pelo dia da semana
    cardapios.sort(
      (a, b) => diasDaSemana[a.dia_da_semana] - diasDaSemana[b.dia_da_semana]
    );

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
