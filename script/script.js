// crear el objeto
class Jugador {
    constructor(nombre, color, posicion, vida) {
        this.nombre = nombre
        this.color = color
        this.posicion = posicion
        this.vida = vida
    }

}
//inicializar el localstorage
let player = []
if (localStorage.getItem("player")) {
    player = JSON.parse(localStorage.getItem("player"))
} else {
    localStorage.setItem("player", JSON.stringify("player"))
}
//inicializar constantes, como botones.
const form = document.getElementById("form")
const btnComenzar = document.getElementById("comenzar")
const btnTirar = document.getElementById("tirar")
const mostrarDado = document.getElementById("dado")

// metodos y funciones
function tirarDado() {
    //generar un dado de 6 caras
    let dado = parseInt(Math.floor((Math.random() * 6) + 1))
    mostrarDado.innerHTML = ""
    mostrarDado.innerHTML += ` 
    <p class="numeroDado text-center fs-4"> ${dado} </p>
    `
    return dado
};

function moverJugador(dado){
        // obtener la posicion del jugador
        let jugador = JSON.parse(localStorage.getItem("player"))
        let posicion = jugador[0].posicion
    
         // eliminar posicion anterior
         let mostrarPos = document.getElementById(`casi${posicion}`)
         mostrarPos.innerHTML = ""
    
        jugador[0].posicion = posicion + dado
    
        //mover al jugador
        player = jugador
        localStorage.setItem("player", JSON.stringify(player))
    
        //mostrar la nueva posicion del jugador
         mostrarPos = document.getElementById(`casi${jugador[0].posicion }`)
        mostrarPos.innerHTML += ` yo  `
}

//creacion del jugador
form.addEventListener("submit", (e) => {
    e.preventDefault()
    let datForm = new FormData(e.target)
    let jugador = new Jugador(datForm.get("nombre"), datForm.get("color"), 1, 10)
    player.push(jugador)
    localStorage.setItem("player", JSON.stringify(player))
    form.reset()
})

btnComenzar.addEventListener("click", () => {
    // creacion de tablero
    let tablero = document.getElementById("filas")
    for (let i = 0; i < 5; i++) {
        tablero.innerHTML += `<div id="fila${i}" class="container row"></div>`

        for (let p = 1; p <= 10; p++) {
            tablero.innerHTML += `
            <div class="casillero" id="pos${p + (i * 10)}">
                <p class="text-end">${p + (i * 10)}</p>
                <p id="casi${p + (i * 10)}"></p>
            </div>
            `
        }
    }
})

btnTirar.addEventListener("click", () => {
    let dado = tirarDado()
    moverJugador(dado)
}) 