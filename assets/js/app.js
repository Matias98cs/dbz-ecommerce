//querySelector
const contenedorCards = document.querySelector("#contenedorCards");
const btnBuscar = document.querySelector('#btnBuscar');
const formularioSearch = document.querySelector('#formularioSearch');
const buscados = document.querySelector('#buscados');
const contenedorCarrito = document.querySelector('#lista-carrito');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const btnComprar = document.querySelector('#comprar');
const mensaje = document.querySelector('#noEncontrado');
const spinner = document.querySelector('#spinner');
const cantidadTotalBtn = document.querySelector('#cantidadTotal');

let ObjPersonajes = [];
let personajeBuscado = [];
let cantidadTotalAPagar = 0;

document.addEventListener('DOMContentLoaded', () => {
    personajeBuscado = JSON.parse(localStorage.getItem('buscado')) || [];
    pintarCarrito(personajeBuscado);
});

window.onload = () => {
    cargarSpinner();
};

function llamarInfor() {
    const url = `https://dragon-ball-super-api.herokuapp.com/api/characters`;
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            guardarData(data);
        })
        .catch((error) => console.log(error));
}

function numeroRandom(max) {
    return Math.floor(Math.random() * max);
}

function guardarData(data) {

    data.forEach((personaje) => {
        const { id, imageUrl, name, originplanet, specie } = personaje;
        const personajeObj = {
            id: id,
            imageUrl: imageUrl,
            name: name,
            originplanet: originplanet,
            specie: specie,
            price: numeroRandom(1000),
            cantidad: 1
        };

        ObjPersonajes = [...ObjPersonajes, personajeObj];
    });

    pintarCards(ObjPersonajes, contenedorCards);
}

function pintarCards(personajes, contenedor) {
    contenedor.innerHTML = ""
    personajes.forEach((info) => {
        const { imageUrl, name, originplanet, price, specie, id } = info;
        const card = document.createElement("div");
        card.innerHTML = `
        <div id="card" class="card bg-transparent border border-0 align-items-center" style="width: 18rem;">
            <div class="d-flex justify-content-center image-scale">
                <img src="${imageUrl}" class="card-img-top" style="height: 14rem"">
            </div>
            <div class="card d-flex justify-content-center" style="width: 15rem;">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Nombre: <strong>${name}</strong></li>
                    <li class="list-group-item">Especie: <strong>${specie}</strong></li>
                    <li class="list-group-item">Origen: <strong>${originplanet}</strong></li>
                    <li class="list-group-item">Precio: $<strong>${price}</strong></li>
                </ul>
                <button onclick="comprarCarta(${id})" class="btn btn-warning btn-scale">Comprar</button>
            </div>
        </div>
        `;
        contenedor.appendChild(card);
    });
}

formularioSearch.addEventListener('keyup', e => {
    e.preventDefault()
    let buscado = btnBuscar.value;
    buscarPersonaje(ObjPersonajes, buscado);
    pintarCards(buscarPersonaje(ObjPersonajes, buscado), contenedorCards);
})

function buscarPersonaje(array, personaje) {
    let buscadosArray = array.filter((ele) =>
        ele.name.toLocaleLowerCase().includes(personaje.toLowerCase()));
    if (buscadosArray.length > 0) {
        return buscadosArray;
    } else {
        noEncontrado("No se encontro el personaje");
        return [];
    }
}

function comprarCarta(nroCard) {

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Carta agregada al carrito',
        showConfirmButton: false,
        timer: 1500
    })

    let nuevoObj;

    ObjPersonajes.forEach((personaje) => {
        const { id, imageUrl, name, originplanet, specie, price } = personaje;
        if (personaje.id === nroCard) {
            nuevoObj = {
                id: id,
                imageUrl: imageUrl,
                name: name,
                originplanet: originplanet,
                specie: specie,
                price: price,
                cantidad: 1
            };
        }
    });


    if (personajeBuscado.some(perso => perso.id === nuevoObj.id)) {
        const cantidadPerso = personajeBuscado.map(perso => {
            if (perso.id === nuevoObj.id) {
                let cantidad = parseInt(perso.cantidad);
                cantidad++;
                perso.cantidad = cantidad;
                return perso;
            } else {
                return perso;
            }
        })
        personajeBuscado = [...cantidadPerso];
    } else {
        personajeBuscado = [...personajeBuscado, nuevoObj];
    }

    sincronizarStorage();
    pintarCarrito(personajeBuscado);
}

function pintarCarrito(array) {
    contenedorCarrito.innerHTML = "";
    array.forEach(personaje => {
        const { imageUrl, name, originplanet, price, specie, id, cantidad } = personaje;
        let total = cantidad * price;
        personaje.total = total;
        const contenedorCardCarrito = document.createElement('div');
        contenedorCardCarrito.classList.add('contendor-card-carrito');
        contenedorCardCarrito.innerHTML = `
                <img src="${imageUrl}" width=70>
                <div class="h-50">
                    <p>Nombre <strong>${name}</strong></p>
                    <p>Origen <strong>${originplanet}</strong></p>
                    <p>Especie <strong>${specie}</strong></p>
                    <p>Cantidad <strong>${cantidad}</strong></p>
                    <p>Precio $<strong>${total}</strong></p>
                </div>
                <button type="button" onclick="eliminarCartaDeCarrito(${id})" class="borrar-curso btn-close" aria-label="Close"></button>
                
            `;
        contenedorCarrito.appendChild(contenedorCardCarrito);
        sumarCantidadTotal();
        cantidadTotalBtn.textContent = `$${cantidadTotalAPagar}`;
        sincronizarStorage();
    })
}

function limpiarLocalStorage() {
    window.localStorage.clear();
    personajeBuscado = [];
    contenedorCarrito.innerHTML = "";
    cantidadTotalBtn.textContent = `$0`;
}


vaciarCarrito.addEventListener('click', () => {
    limpiarLocalStorage();
})

function sincronizarStorage() {
    localStorage.setItem('buscado', JSON.stringify(personajeBuscado));
}

function sumarCantidadTotal() {
    cantidadTotalAPagar = 0;
    personajeBuscado.forEach(perso => {
        cantidadTotalAPagar += perso.total;
    });
}

btnComprar.addEventListener("click", () => {

    if(personajeBuscado.length > 0){
        Swal.fire({
            title: 'Quieres comprar lo añadido?',
            text: `Cantidad a pagar $${cantidadTotalAPagar}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Comprar'
        }).then((result) => {
            if (result.isConfirmed) {
                limpiarLocalStorage();
                Swal.fire(
                    'Comprado!',
                    'Su compra fue realizada',
                    'success',
                )
            }
        })
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Esta vacio',
        })
    }

})

function noEncontrado(msj) {
    mensaje.innerHTML = "";

    const parrafo = document.createElement('p');
    parrafo.classList.add('text-center', 'fs-1', 'text-mensaje', 'p-4');
    parrafo.innerHTML = msj;
    mensaje.appendChild(parrafo);

    setTimeout(() => {
        parrafo.remove();
    }, 2500);
}

function cargarSpinner() {
    const contenedorSpinner = document.querySelector('#spinner');
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    contenedorSpinner.insertBefore(divSpinner, contenedorSpinner.children[1]);

    setTimeout(() => {
        divSpinner.remove();
        llamarInfor();

    }, 3000);

}


function eliminarCartaDeCarrito(cartaId) {
    personajeBuscado = personajeBuscado.filter( carta => carta.id !== cartaId);
    if(personajeBuscado.length > 0){
        pintarCarrito(personajeBuscado);
    }else{
        limpiarLocalStorage();
    }
}