// CREAR OBJETO
class Jugador {
    constructor(nombre, color, posicion) {
        this.nombre = nombre
        this.color = color
        this.posicion = posicion

    }
}
// VALIDAR LOCALSTORAGE Y CREACION DEL MISMO, DONDE SE ALOJARAN LOS 4 JUGADORES DE LA PARTIDA.
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
    mostrarTurno.innerHTML += `
    <div class="card" style="width: 13rem;">
        <div>
            <img style="width: 13rem;" src="${color}" alt="img${nombre}">
        </div>
            <div  class="card-body">
                <p style=" font-size: 1.2rem ;" class="card-text text-center">Turno de ${nombre}</p>
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
    // MOVER AL JUGADOR 1 A 1. (VISUAL)
    for (i = 1; i <= dado; i++) {
        mostrarPos.innerHTML = ""
        posicion++
        mostrarPos = document.getElementById(`casi${posicion}${turnoNumero}`)
        mostrarPos.innerHTML += `<div class="jugador" > <img style="width:30px;" src="${color}" alt=""> </div> `
    }
    // MOVER AL JUGADOR (LOCALSTORAGE)
    (posicion > 50 ) ? posicion = 50 : 
    jugador[turnoNumero].posicion = posicion
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
        jugador[turnoNumero].posicion = posicion - 3
        posicion = posicion - 3
        player = jugador
        localStorage.setItem("player", JSON.stringify(player))
        // MOVER AL JUGADOR HACIA ATRAS 
        mostrarPos.innerHTML = ""
        mostrarPos = document.getElementById(`casi${posicion}${turnoNumero}`)
        mostrarPos.innerHTML += `<div class="jugador" > <img style="width:30px;" src="${color}" alt=""> </div> `
    }

    

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

// 6.CREACION TRAMPA RETROCEDER CASILLEROS
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


// 7.GANADOR
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
    let nombre = datForm.get("nombre")
    crearHeroe(nombre)

    

})
//CREACION DE JUGADOR OBTTENIENDO DATOS DESDE MARVEL API 
function crearHeroe(nombre) {
    fetch(`https://gateway.marvel.com:443/v1/public/characters?name=${nombre}&ts=1&apikey=e0a42b963a14341819f859be4522f20a&hash=bb31ec982c352936c9d3c268270564a5`)
        .then(res => res.json())
        .then(json => {
            console.log(json, "RES.JSON")
            const hero = json.data.results[0]
            let name = hero.name
            let picture = `${hero.thumbnail.path}.${hero.thumbnail.extension}`

            let nuevoJugador = new Jugador(name, picture, 1, 10)
            console.log(nuevoJugador)

            validacion(player, nuevoJugador)
        })
    
}




// REGLAS
mostrarReglas.addEventListener("click", () => {
    Swal.fire(
        'Como jugar?',
        `El primer jugador en llegar al casillero 50 es el ganador! Para empezar, cada jugador debe crear un personaje (1-4 jugadores), para eso, debes escribir el nombre de algun personaje de los comics de marvel y darle a crear jugador. ATENCION! Los nombres deben estar en ingles. (e.g hulk, captain america, vision). Luego de que todos los jugadores tengan su personaje haz click en comenzar a jugar. Ojo ese boton reinicia el juego. Por ultimo tirar un dado en tu turno hara que tu personaje se mueva. Mucha suerte y cuidado con los casilleros trampa, podes retroceder casilleros.`,
        'question',
    )
})

// CREACION DEL TABLERO 
btnComenzar.addEventListener("click", () => {
    // CRACION DE EVENTOS
    // GENERAR CASILLEROS CON TRAMPA.
    let arrayTrap = trampas(), posTrampa = 0

    let tablero = document.getElementById("filas")
    tablero.innerHTML = ""
    for (let i = 0; i < 5; i++) {
        tablero.innerHTML += `<div id="fila${i}" class="container"  ></div>`
        for (let p = 1; p <= 10; p++) {
            if (arrayTrap[posTrampa] == p + (i * 10)) {
                tablero.innerHTML += `
                <div style="background-color: red; " class="casillero" id="trampa${p + (i * 10)}">
                <p style="
    margin-bottom: 5px;
" class="texto-casi text-end">${p + (i * 10)}</p>
                <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;align-content: center;">
                    <div id="casi${p + (i * 10)}0"></div>
                    <div id="casi${p + (i * 10)}1"></div>
                    <div id="casi${p + (i * 10)}2"></div>
                    <div id="casi${p + (i * 10)}3"></div>
                    </div>
                </div>`
                posTrampa++
            } else {
                tablero.innerHTML += `
                <div class="casillero" id="safe${p + (i * 10)}">
                <p style="
    margin-bottom: 5px;
" class="texto-casi text-end">${p + (i * 10)}</p>
                <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;align-content: center;">
                    <div id="casi${p + (i * 10)}0"></div>
                    <div id="casi${p + (i * 10)}1"></div>
                    <div id="casi${p + (i * 10)}2"></div>
                    <div id="casi${p + (i * 10)}3"></div>
                    </div>
                </div>`
            }

        }
        // AL TOCAR EL BOTAN SE REINICIA EL JUEGO
        turnoNumero = 0 
        player.forEach(jugador => {
            jugador.posicion = 1  
            localStorage.setItem("player", JSON.stringify(player))
        });
        mosTurno(turnoNumero)
    }
    // POSICION INICIAL 
    let ubi = 0
    player.forEach(jugador => {
        mostrarPos = document.getElementById(`casi${jugador.posicion}${ubi}`)
        mostrarPos.innerHTML += `<div class="jugador" > <img style="width:30px;" src="${jugador.color}" alt=""> </div> `
        ubi++
    });

    mosTurno(turnoNumero)
})

btnTirar.addEventListener("click", () => {
    let dado = tirarDado()
    moverJugador(dado, turnoNumero)
    turnoNumero = turno(turnoNumero)
    mosTurno(turnoNumero)
})



/*
 FALTA: 
 1. ANIMACION DE MOVIMIENTO PARA LOS PEONES una promise 


*/


