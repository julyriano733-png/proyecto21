
var pantallaTiempo = document.getElementById("tiempo");
var textoTipo = document.getElementById("tipo-sesion");
var textoContador = document.getElementById("contador");
var mensajeConfig = document.getElementById("mensaje-config");

var btnIniciar = document.getElementById("btn-iniciar");
var btnPausar = document.getElementById("btn-pausar");
var btnReiniciar = document.getElementById("btn-reiniciar");

var formulario = document.getElementById("form-config");
var inputTrabajo = document.getElementById("input-trabajo");
var inputCorto = document.getElementById("input-corto");
var inputLargo = document.getElementById("input-largo");


var minutosTrabajo = 25;
var minutosCorto = 5;
var minutosLargo = 15;

var tipoSesion = "trabajo";

var segundos = minutosTrabajo * 60;//segundos que tiene un minuto


//contador secciones
var sesiones = 0;

// null=reloj no corre
var reloj = null;

var alarma = new Audio("alarma.mp3");

//  MOSTRAR EL TIEMPO 
function mostrarTiempo() {
    //redondea
  var min = Math.floor(segundos / 60); // minutos completos
  var seg = segundos % 60;             // los segundos que sobran

  //  (5 -> 05)
  if (min < 10) {
    min = "0" + min;
  }
  if (seg < 10) {
    seg = "0" + seg;
  }

  pantallaTiempo.textContent = min + ":" + seg;
}

// ===== 4. PREPARAR UNA SESIÓN =====

function prepararSesion() {
  if (tipoSesion === "trabajo") {
    segundos = minutosTrabajo * 60;
    textoTipo.textContent = "Trabajo";
  } else if (tipoSesion === "descansoCorto") {
    segundos = minutosCorto * 60;
    textoTipo.textContent = "Descanso corto";
  } else {
    segundos = minutosLargo * 60;
    textoTipo.textContent = "Descanso largo";
  }

  // El CSS cambia el color de fondo
  document.body.className = tipoSesion;
  mostrarTiempo();//funcion
}

// ===== 5. BOTONES =====

// INICIAR
function iniciar() {
  if (reloj !== null) {//corriendo
    return;
  }
  // Cada 1000 milisegundos (1 segundo) se ejecuta pasarSegundo
  reloj = setInterval(pasarSegundo, 1000);//ejecuta repetidamente
}

// PAUSAR
function pausar() {
  clearInterval(reloj); // detiene el reloj
  reloj = null;
}

// REINICIAR
function reiniciar() {
  pausar();//frena 
  prepararSesion();//carga minutos
}

// ===== reduccion de cada seg =====
function pasarSegundo() {
  segundos = segundos - 1;
  mostrarTiempo();


  if (segundos <= 0) {
    terminar();
  }
}

// ===== 7. CUANDO TERMINA UNA SESIÓN =====
function terminar() {
  pausar();
  alarma.play(); // suena la alarma

  if (tipoSesion === "trabajo") {
    sesiones = sesiones + 1;//suma1 a sesiones
    textoContador.textContent = sesiones;// pon num sesiones

    // Cada 4 sesiones toca descanso largo 
    if (sesiones % 4 === 0) {
      tipoSesion = "descansoLargo";
    } else {
      tipoSesion = "descansoCorto";
    }
  } else {
    tipoSesion = "trabajo";//termina descanso
  }
  prepararSesion();
}

// ===== 8. GUARDAR LA CONFIGURACIÓN =====
function guardar(evento) {
  evento.preventDefault(); // no recargue

  // combierte en num
  var nuevoTrabajo = Number(inputTrabajo.value);
  var nuevoCorto = Number(inputCorto.value);
  var nuevoLargo = Number(inputLargo.value);

  // ERROR
  if (nuevoTrabajo < 1 || nuevoCorto < 1 || nuevoLargo < 1) {
    mensajeConfig.textContent = "Escribe números mayores a 0.";
    return;
  }

  minutosTrabajo = nuevoTrabajo;
  minutosCorto = nuevoCorto;
  minutosLargo = nuevoLargo;

  reiniciar(); // reinicia reloj
  mensajeConfig.textContent = "Configuración guardada.";
}

// ===== 9. EVENTOS =====
//click y funcion
btnIniciar.addEventListener("click", iniciar);
btnPausar.addEventListener("click", pausar);
btnReiniciar.addEventListener("click", reiniciar);
formulario.addEventListener("submit", guardar);


prepararSesion();//funcion