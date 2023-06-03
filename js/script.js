const dateUrna = document.getElementById("time");

// atualização da data em tempo real.
function refreshTime() {
  const refresh = 1000;
  time = setTimeout("showTime()", refresh);
}

function showTime() {
  const data = new Date();

  const fullDay = Array("DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB");
  let day = data.getDate().toString();
  day = day.length == 1 ? 0 + day : day;
  let month = (data.getMonth() + 1).toString();
  month = month.length == 1 ? 0 + month : month;
  let hours = data.getHours().toString();
  hours = hours.length == 1 ? 0 + hours : hours;
  let minutes = data.getMinutes().toString();
  minutes = minutes.length == 1 ? 0 + minutes : minutes;
  let seconds = data.getSeconds().toString();
  seconds = seconds.length == 1 ? 0 + seconds : seconds;

  const data_atual = `${
    fullDay[data.getDay()]
  } ${day}/${month}/${data.getFullYear()}`;
  let hora_atual = `${hours}:${minutes}:${seconds}`;

  dateUrna.innerHTML = `${data_atual} ${hora_atual}`;
  refreshTime();
}
// fim atualização da data em tempo real.

// Obter referências aos elementos do HTML
const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const numeros = document.getElementsByClassName("numero");
const botaoCorrige = document.getElementById("corrige");
const botaoConfirma = document.getElementById("confirma");

// Variável para controlar qual input deve ser preenchido
let inputAtivo = input1;

// Adicionar evento de clique às imagens de números
for (let i = 0; i < numeros.length; i++) {
  numeros[i].addEventListener("click", function () {
    const numero = this.alt;

    // Verificar se ambos os inputs estão preenchidos
    if (input1.value !== "" && input2.value !== "") {
      return;
    }

    // Adicionar o número ao input ativo
    inputAtivo.value += numero;
    inputAtivo.focus();

    // Alternar entre os inputs apenas se o input atual não estiver vazio
    if (inputAtivo.value !== "") {
      inputAtivo = inputAtivo === input1 ? input2 : input1;
    }
  });
}

// Adicionar evento de clique ao botão Corrige
botaoCorrige.addEventListener("click", function () {
  input1.value = "";
  input2.value = "";
  inputAtivo = input1;
});

// Adicionar evento de clique ao botão Confirma
botaoConfirma.addEventListener("click", function () {
  // Verificar se já foi confirmado anteriormente
  //  if (localStorage.getItem("confirmado")) {
  //    console.log("ja votou vacilão");
  //    return;
  //  }

  // Concatenar os valores dos inputs 1 e 2
  const valorConcatenado = input1.value + input2.value;

  // Enviar o valor para a API RESTful (substitua pelo seu código de envio para a API)
  fetch("https://sheetdb.io/api/v1/smd2hz3xwo7f9?sheet=Votos", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [
        {
          Voto: valorConcatenado,
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  // Marcar como confirmado no localStorage
  localStorage.setItem("confirmado", true);
});

//
//
//
//

let myData; // Objeto de escopo global

function fetchDataAndSaveIndicator() {
  // Verificar se o indicador já está presente no localStorage
  if (localStorage.getItem("fetchExecutado")) {
    return;
  }

  fetch("https://sheetdb.io/api/v1/smd2hz3xwo7f9")
    .then((response) => response.json())
    .then((data) => {
      // Copiar o JSON para o objeto de escopo global
      myData = data;

      // Salvar o objeto no localStorage
      localStorage.setItem("meuObjeto", JSON.stringify(myData));

      // Salvar indicador no localStorage
      localStorage.setItem("fetchExecutado", "true");
    })
    .catch((error) => {
      console.error("Ocorreu um erro:", error);
    });
}

// Chamar a função para fazer a solicitação
fetchDataAndSaveIndicator();

// Recuperar o objeto salvo no localStorage
const savedObject = localStorage.getItem("meuObjeto");
if (savedObject) {
  myData = JSON.parse(savedObject);
  console.log("Objeto recuperado do localStorage:", myData);
}
