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
function moverJugador(dado, turnoNumero) {
    // OBTENER LA POSICION DEL JUGADOR
    let jugador = JSON.parse(localStorage.getItem("player"))
    let { posicion, color, nombre } = jugador[turnoNumero]

    // ELIMINAR LA POSICION ANTERIOR 
    let mostrarPos = document.getElementById(`casi${posicion}${turnoNumero}`)
    mostrarPos.innerHTML = ""

    // MOVER AL JUGADOR 
    jugador[turnoNumero].posicion = posicion + dado
    posicion = posicion + dado
    player = jugador
    localStorage.setItem("player", JSON.stringify(player))

    // DETERMINAR SI EL JUGADOR SE MOVIO HACIA UNA TRAMPA.
    let cayo
    cayo = document.getElementById(`safe${posicion}`)
    console.log(cayo)
    penalizar = cayo ?? "trampa"
    console.log(penalizar)
    if (penalizar == "trampa") {
        Swal.fire(
            'TRAMPA',
            `${nombre} cayo en una trampa. Retrocede 3 casilleros.`,
            'warning',
        )
        jugador[turnoNumero].posicion = posicion -3
        posicion = posicion -3
        player = jugador
        localStorage.setItem("player", JSON.stringify(player))
    }

    // MOSTRAR LA NUEVA POSICION DEL JUGADOR 
    mostrarPos = document.getElementById(`casi${posicion}${turnoNumero}`)
    mostrarPos.innerHTML += `<div class="jugador" style="background-color:${color};"></div> `

    // DETERMINAR GANDOR
    if (ganador(jugador[turnoNumero].posicion)) {
        jugador[turnoNumero].posicion = 50
        Swal.fire(
            'Felicitaciones',
            `El ganador es ${nombre}`,
            'success',
        )
    }
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
mostrarReglas.addEventListener("click", () => {
    Swal.fire(
        'Reglas',
        `El primer jugador en llegar al casillero 50 es el ganador! Cuidado con los casilleros trampa, podes perder turnos o retroceder casilleros.`,
        'question',
    )
})

// CREACION DEL TABLERO 
btnComenzar.addEventListener("click", () => {
    // CRACION DE EVENTOS
    // RETROCEDER CASILLEROS.
    let arrayTrap = trampas(), posTrampa = 0

    let tablero = document.getElementById("filas")
    tablero.innerHTML = ""
    for (let i = 0; i < 5; i++) {
        tablero.innerHTML += `<div id="fila${i}" class="container row"></div>`
        for (let p = 1; p <= 10; p++) {
            if (arrayTrap[posTrampa] == p + (i * 10)) {
                tablero.innerHTML += `
                <div style="background-color: red;" class="casillero" id="trampa${p + (i * 10)}">
                    <p class="text-end">${p + (i * 10)}</p>
                    <div class="container" id="casi${p + (i * 10)}0"></div>
                    <div class="container" id="casi${p + (i * 10)}1"></div>
                    <div class="container" id="casi${p + (i * 10)}2"></div>
                    <div class="container" id="casi${p + (i * 10)}3"></div>
                </div>`
                posTrampa++
            } else {
                tablero.innerHTML += `
                <div class="casillero" id="safe${p + (i * 10)}">
                    <p class="text-end">${p + (i * 10)}</p>
                    <div class="container" id="casi${p + (i * 10)}0"></div>
                    <div class="container" id="casi${p + (i * 10)}1"></div>
                    <div class="container" id="casi${p + (i * 10)}2"></div>
                    <div class="container" id="casi${p + (i * 10)}3"></div>
                </div>`
            }

        }
    }
    // POSICION INICIAL 
    let asd = 0
    player.forEach(jugador => {
        mostrarPos = document.getElementById(`casi${jugador.posicion}${asd}`)
        mostrarPos.innerHTML += `<div class="jugador " style="background-color:${jugador.color};"></div> `
        asd++
    });
})

btnTirar.addEventListener("click", () => {
    let dado = tirarDado()
    moverJugador(dado, turnoNumero)
    turnoNumero = turno(turnoNumero)
    mosTurno(turnoNumero)
})

// TRAMPA RETROCEDER CASILLEROS
function trampas() {
    let randomCas, plus = 0
    let arrayTrap = []
    for (let i = 1; i < 6; i++) {
        // GENERA NUMEROS ALEATOREOS ENTRE 1-10/11-20/21-30/31-40/41-50 (PARA DETERMINAR UNA TRAMPA POR FILA DE TABLERO).
        randomCas = parseInt(Math.floor((Math.random() * 10) + (plus + 1)))
        plus = plus + 10
        arrayTrap.push(randomCas)
    }
    return arrayTrap
}

/*
 FALTA: 
 1. ANIMACION DE MOVIMIENTO PARA LOS PEONES
 4. AGREGAR CASILLEROS CON EVENTOS
        EN TRAMPAS DE RETROCEDER HACER EL RETROCESO ALEATORIO  DE 1 A 3 CASILLEROS. CREANDO OBJETO
 5. AGREGAR FUEGO 

*/



