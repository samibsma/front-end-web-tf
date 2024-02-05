const baseUrl = "https://back-end-tf-web-three.vercel.app";

function show() {
  var password = document.getElementById("password");
  var icon = document.querySelector(".fas");

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

// Fazer login na aplicação
async function fazerLogin() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;
  const mensagemErro = document.querySelector(".mensagem");

  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email, Senha: senha }),
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token;
      localStorage.setItem("token", token);
      // Redirecionando para a dashboard do usuário
      window.location.href = "../painelAdm/painelAdm.html";
    } else {
      mensagemErro.textContent = `${data.mensagem}`;
      mensagemErro.style.display = "block";
    }
  } catch (error) {
    console.error("Erro durante a requisição de login:", error);
    mensagemErro.textContent = "Erro interno do servidor";
    mensagemErro.style.display = "block";
  }
}
