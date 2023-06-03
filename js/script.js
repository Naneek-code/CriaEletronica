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
