const dateUrna = document.getElementById("time");

// atualização da data em tempo real.
function refreshTime() {
  const refresh = 1000;
  setTimeout(showTime, refresh);
}

function showTime() {
  const data = new Date();

  const fullDay = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  const day = data.getDate().toString().padStart(2, "0");
  const month = (data.getMonth() + 1).toString().padStart(2, "0");
  const hours = data.getHours().toString().padStart(2, "0");
  const minutes = data.getMinutes().toString().padStart(2, "0");
  const seconds = data.getSeconds().toString().padStart(2, "0");

  const data_atual = `${
    fullDay[data.getDay()]
  } ${day}/${month}/${data.getFullYear()}`;
  const hora_atual = `${hours}:${minutes}:${seconds}`;

  dateUrna.textContent = `${data_atual} ${hora_atual}`;
  refreshTime();
}

const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const numeros = document.getElementsByClassName("numero");
const botaoCorrige = document.getElementById("corrige");
const botaoConfirma = document.getElementById("confirma");
const displayFim = document.querySelector(".alredyVoted");
const nome = document.getElementById("applicantName");
const foto = document.getElementById("photoApplicant");
let isValidApplicant;

// Adicionar evento de clique às imagens de números
for (let i = 0; i < numeros.length; i++) {
  numeros[i].addEventListener("click", handleNumberClick);
}

// Manipula o clique nos números
function handleNumberClick() {
  const numero = this.alt;

  // Verificar se o primeiro input está vazio
  if (input1.value === "") {
    input1.value = numero;
  }
  // Verificar se o segundo input está vazio
  else if (input2.value === "") {
    input2.value = numero;
    idApplicant = input1.value + input2.value;
    showApplicantData(idApplicant);
  }
}

// Manipula o clique no botão "Corrige"
function handleCorrigeClick() {
  input1.value = "";
  input2.value = "";
  idApplicant = undefined;
  nome.textContent = "";
  foto.src = "./image/applicant.png";
  isValidApplicant = false;
}

// Manipula o clique no botão "Confirma"
function handleConfirmaClick() {
  // Verificar se já foi confirmado anteriormente
  if (localStorage.getItem("confirmado")) {
    return;
  }

  if (isValidApplicant) {
    // Enviar o valor para a API
    fetch("https://sheetdb.io/api/v1/smd2hz3xwo7f9?sheet=Votos", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            Voto: idApplicant,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then(() => {
        // Marcar como confirmado no localStorage
        localStorage.setItem("confirmado", true);
        verifyLocalStorage();
        playSound();
      })
      .catch((error) => {
        console.error("Ocorreu um erro:", error);
      });
  }
}

// Reproduzir som de confirmação
function playSound() {
  const audio = document.getElementById("myAudio");
  audio.play();
}

// Verificar se já foi confirmado no localStorage
function verifyLocalStorage() {
  if (localStorage.getItem("confirmado")) {
    displayFim.classList.toggle("display");
  }
}

// Exibir os dados do candidato
function showApplicantData(idApplicant) {
  myData.forEach((e) => {
    if (e.NumeroCandidato === idApplicant) {
      foto.src = e.FotoCandidato;
      nome.textContent = e.NomeCandidato;
      isValidApplicant = true;
    }
  });
}

let myData;

// Buscar os dados da API e salvar no localStorage
function fetchDataAndSaveIndicator() {
  // Verificar se já foi buscado anteriormente
  if (localStorage.getItem("fetchExecutado")) {
    return Promise.resolve();
  }

  return fetch("https://sheetdb.io/api/v1/smd2hz3xwo7f9")
    .then((response) => response.json())
    .then((data) => {
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

// Função de inicialização
function initialize() {
  refreshTime();
  botaoCorrige.addEventListener("click", handleCorrigeClick);
  botaoConfirma.addEventListener("click", handleConfirmaClick);
  verifyLocalStorage();
  const savedObject = localStorage.getItem("meuObjeto");
  if (savedObject) {
    myData = JSON.parse(savedObject);
    console.log("Objeto recuperado do localStorage:", myData);
  }
}

// Chamar a função para buscar os dados e iniciar o código
fetchDataAndSaveIndicator().then(initialize);
