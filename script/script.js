// CREAR OBJETO
class Jugador {
    constructor(nombre, color, posicion, vida) {
        this.nombre = nombre
        this.color = color
        this.posicion = posicion
        this.vida = vida
    }
}
// VALIDAR LOCALSTORAGE
let player = JSON.parse(localStorage.getItem("player")) ?? []

// INICIALIZAR BOTONES
const form = document.getElementById("form")
const btnComenzar = document.getElementById("comenzar")
const btnTirar = document.getElementById("tirar")
const mostrarDado = document.getElementById("dado")
const mostrarTurno = document.getElementById("turno")
const mostrarReglas = document.getElementById("instructions")

// FUNCIONES
// 1.GENERAR UN DADO DE SEIS CARAS 
function tirarDado() {
    let dado = parseInt(Math.floor((Math.random() * 6) + 1))
    mostrarDado.innerHTML = ""
    mostrarDado.innerHTML += ` 
    <p class="numeroDado text-center fs-4"> ${dado} </p> `
    return dado
};
// 2.SISTEMA DE TURNOS
let turnoNumero = 0
function turno(contador) {
    contador < player.length - 1 ? contador++ : contador = 0
    return contador
}
// 3.GENERAR CARDS PARA SABER DE QUIEN ES EL TURNO
function mosTurno(contador) {
    let jugador = JSON.parse(localStorage.getItem("player"))
    let { nombre, color } = jugador[contador]
    mostrarTurno.innerHTML = ""
    mostrarTurno.innerHTML += `<div class="card" style="width: 18rem;">
    <div style="background-color: ${color}; height: 1rem;"></div>
    <div class="card-body">
      <p class="card-text">Turno de ${nombre}</p>
    </div>
  </div>`
}
// 4.MOVIMIENTO DE LOS JUGADORES
function moverJugador(dado, turno) {
    // OBTENER LA POSICION DEL JUGADOR
    let jugador = JSON.parse(localStorage.getItem("player"))
    let { posicion, color, nombre } = jugador[turno]

    // ELIMINAR LA POSICION ANTERIOR 
    let mostrarPos = document.getElementById(`casi${posicion}`)
    mostrarPos.innerHTML = ""

    jugador[turno].posicion = posicion + dado

    if (ganador(jugador[turno].posicion)) {
        jugador[turno].posicion = 50
        Swal.fire(
            'Felicitaciones',
            `El ganador es ${nombre}`,
            'success',
          )
    }

    // MOVER AL JUGADOR 
    player = jugador
    localStorage.setItem("player", JSON.stringify(player))

    // MOSTRAR LA NUEVA POSICION DEL JUGADOR 
    mostrarPos = document.getElementById(`casi${jugador[turno].posicion}`)
    mostrarPos.innerHTML += `<div class="jugador " style="background-color:${color};"></div> `
}

// 5.VALIDAR UN MAXIMO DE 4 JUGADORES. 
function validacion(array, nuevoJugador) {
    if (array.length < 4) {
        player.push(nuevoJugador)
        localStorage.setItem("player", JSON.stringify(player))
        form.reset()
    } else {
        Swal.fire(
            'Cuidado!',
            `Maximo 4 jugadores`,
            'warning',
          )
    }
}

// 6.GANADOR
function ganador(pos) {
    let ganador = false
    if (pos >= 50) {
        ganador = true
    }
    return ganador
}

// CREACION DEL JUGADOR 
form.addEventListener("submit", (e) => {
    e.preventDefault()
    let datForm = new FormData(e.target)
    let nuevoJugador = new Jugador(datForm.get("nombre"), datForm.get("color"), 1, 10)
    validacion(player, nuevoJugador)

})

// REGLAS
mostrarReglas.addEventListener("click", ()=>{
    Swal.fire(
        'Reglas',
        `El primer jugador en llegar al casillero 50 es el ganador! Cuidado con los casilleros trampa, podes perder turnos o retroceder casilleros.`,
        'question',
      )
})

// CREACION DEL TABLERO 
btnComenzar.addEventListener("click", () => {
    let tablero = document.getElementById("filas")
    tablero.innerHTML = ""
    for (let i = 0; i < 5; i++) {
        tablero.innerHTML += `<div id="fila${i}" class="container row"></div>`
        for (let p = 1; p <= 10; p++) {
            tablero.innerHTML += `
            <div class="casillero" id="pos${p + (i * 10)}">
                <p class="text-end">${p + (i * 10)}</p>
                <div class="container" id="casi${p + (i * 10)}"></div>
            </div>`
        }
    }
    // UBICAR A CADA JUGADOR EN SU POSICION 
    player.forEach(jugador => {
        mostrarPos = document.getElementById(`casi${jugador.posicion}`)
        mostrarPos.innerHTML += `<div class="jugador " style="background-color:${jugador.color};"></div> `
    });
})

btnTirar.addEventListener("click", () => {
    let dado = tirarDado()
    moverJugador(dado, turnoNumero)
    turnoNumero = turno(turnoNumero)
    mosTurno(turnoNumero)
})



/*
 FALTA: 
 1. ANIMACION DE MOVIMIENTO PARA LOS PEONES
 2. CUANDO DOS JUGADORES ESTAN EN EL MISMO CASSILLERO BORRA AMBOS JUGADORES CUANDO UNO DEJA EL CASILLERO
 4. AGREGAR CASILLEROS CON EVENTOS

*/