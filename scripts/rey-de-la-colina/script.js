const blueTeam = document.getElementById("blueTeamContainer");
const redTeam = document.getElementById("redTeamContainer");
const progressBar = document.getElementById("progressBar");

let currentState = 0;
let currentTeam = "";

let countDownCronometer;
let mouseDownCronometer;

let sBlue = 0;
let sRed = 0;

let sMouseDown = 0;

let clicState;

let minimumMouseDown = 3;
let maxGameTime = 300;

//Prevenir menu contextual -- INICIO
function absorbEvent_(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function preventLongPressMenu(node) {
  node.ontouchstart = absorbEvent_;
  node.ontouchmove = absorbEvent_;
  node.ontouchend = absorbEvent_;
  node.ontouchcancel = absorbEvent_;
}

function init() {
  preventLongPressMenu(document.body);
  preventLongPressMenu(blueTeam);
  preventLongPressMenu(redTeam);
}
//Prevenir menu contextual -- FIN

const asignClassCurrentTeam = () => {
  let elements = document.getElementsByName("team");

  elements.forEach((item, index) => {
    if (item.id === currentTeam) {
      item.classList.remove("paused");
      item.classList.add("countdown");
    } else {
      item.classList.remove("countdown");
      item.classList.add("paused");
    }
  });
};

const endGame= ()=>{
  //Desktop
  blueTeam.removeEventListener("mousedown", handleMouseDown, false);
  blueTeam.removeEventListener("mouseup", handleMouseUp, false);
  redTeam.removeEventListener("mousedown", handleMouseDown, false);
  redTeam.removeEventListener("mouseup", handleMouseUp, false);
  //Mobile
  blueTeam.removeEventListener("touchstart", handleMouseDown, false);
  blueTeam.removeEventListener("touchend", handleMouseUp, false);
  redTeam.removeEventListener("touchstart", handleMouseDown, false);
  redTeam.removeEventListener("touchend", handleMouseUp, false);

  if(sBlue > sRed){
    blueTeam.classList.add("winner");
    redTeam.classList.add("loser");
    blueTeam.textContent = "EQUIPO AZUL ES EL GANADOR";
  }else if( sBlue < sRed ){
    blueTeam.classList.add("loser");
    redTeam.classList.add("winner");
    redTeam.textContent = "EQUIPO ROJO ES EL GANADOR";
  }else{
    blueTeam.classList.add("loser");
    redTeam.classList.add("tie");
    redTeam.textContent = "EMPATE";
  }
}

const changeTeam = (evt) => {
  currentTeam =
    currentTeam === "blueTeamContainer"
      ? "redTeamContainer"
      : "blueTeamContainer";

  asignClassCurrentTeam();
};

const formatClock = (seconds) => {
  let min = seconds / 60;
  let sec = seconds % 60;
  return `${Math.trunc(min)}:${sec < 10 ? "0" + sec : sec}`;
};

const countDown = () => {
  switch (currentTeam) {
    case "blueTeamContainer":
      sBlue++;
      break;
    case "redTeamContainer":
      sRed++;
      break;
    default:
      alert("Bugsaso papichulo");
      break;
  }

  blueTeam.textContent = formatClock(sBlue);
  redTeam.textContent = formatClock(sRed);

  if (sBlue + sRed === maxGameTime) {
    //Finalizar
    endGame();
    clearInterval(countDownCronometer);
  }
};

const setProgressBar = () => {
  progressBar.value = sMouseDown;
  progressBar.style.display = "block";
};

const hiddenProgressBar = () => {
  progressBar.value = 0;
  progressBar.style.display = "none";
};

const handleMouseUp = () => {
  sMouseDown = 0;
  clicState = 0;
  clearInterval(mouseDownCronometer);
  hiddenProgressBar();
};

const mouseDown = () => {
  console.log("Tiempo presionado: " + sMouseDown);
  setProgressBar();
  if (sMouseDown === minimumMouseDown) {
    handleMouseUp();
    changeTeam();
  } else {
    sMouseDown++;
  }
};

const handleMouseDown = () => {
  clicState = 1;
  sMouseDown++;
  mouseDownCronometer = setInterval(mouseDown, 1000);
};

const startCountDown = (evt) => {
  currentTeam = evt.target.id;
  currentState = 1;
  countDown();
  countDownCronometer = setInterval(countDown, 1000);
  asignClassCurrentTeam();

  blueTeam.removeEventListener("click", startCountDown);
  redTeam.removeEventListener("click", startCountDown);

  //Desktop
  blueTeam.addEventListener("mousedown", handleMouseDown, false);
  blueTeam.addEventListener("mouseup", handleMouseUp, false);
  redTeam.addEventListener("mousedown", handleMouseDown, false);
  redTeam.addEventListener("mouseup", handleMouseUp, false);

  //Mobile
  blueTeam.addEventListener("touchstart", handleMouseDown, false);
  blueTeam.addEventListener("touchend", handleMouseUp, false);
  redTeam.addEventListener("touchstart", handleMouseDown, false);
  redTeam.addEventListener("touchend", handleMouseUp, false);
};

function load() {
  blueTeam.addEventListener("click", startCountDown, false);
  redTeam.addEventListener("click", startCountDown, false);

  const querystring = window.location.search
  console.log(querystring);
  const params = new URLSearchParams(querystring);
  minimumMouseDown = params.get('minimumMouseDown') ? parseInt(params.get('minimumMouseDown')) : 3;
  maxGameTime = params.get('maxGameTime') ? parseInt(params.get('maxGameTime'))*60 : 300;

  progressBar.max = minimumMouseDown;
}

document.addEventListener("DOMContentLoaded", load, false);
