//querySelector
const contenedorCards = document.querySelector("#contenedorCards");
const btnBuscar = document.querySelector('#btnBuscar');
const formularioSearch = document.querySelector('#formularioSearch');
const buscados = document.querySelector('#buscados');
const contenedorCarrito = document.querySelector('#lista-carrito');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const btnComprar = document.querySelector('#comprar');
const mensaje = document.querySelector('#noEncontrado');

let ObjPersonajes = [];
let personajeBuscado = []


document.addEventListener('DOMContentLoaded', () => {
    personajeBuscado = JSON.parse( localStorage.getItem('buscado') ) || []  ;
    // console.log(articulosCarrito);
    pintarCarrito(personajeBuscado)
});

window.onload = () => {
    llamarInfor();
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
            price: numeroRandom(500),
            cantidad: 1
        };

        ObjPersonajes = [...ObjPersonajes, personajeObj];
    });

    pintarCards(ObjPersonajes, contenedorCards)
}

function pintarCards(personajes, contenedor) {
    contenedor.innerHTML = ""
    personajes.forEach((info) => {
        const { imageUrl, name, originplanet, price, specie, id } = info;
        const card = document.createElement("div");
        card.innerHTML = `
        <div id="card" class="card bg-transparent border border-0 align-items-center" style="width: 18rem;">
        <div class="d-flex justify-content-center">
            <img src="${imageUrl}" class="card-img-top" style="height: 14rem"">
        </div>
        <div class="card d-flex justify-content-center" style="width: 15rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">${name}</li>
                <li class="list-group-item">${specie}</li>
                <li class="list-group-item">${originplanet}</li>
                <li class="list-group-item">$${price}</li>
            </ul>
            <button onclick="myFunction(${id})" class="btn btn-warning">Comprar</button>
        </div>
    </div>
        `;
        contenedor.appendChild(card);
    });
}

formularioSearch.addEventListener('submit', e => {
    e.preventDefault()
    let buscado = btnBuscar.value;
    buscarPersonaje(ObjPersonajes, buscado);
    pintarCards(buscarPersonaje(ObjPersonajes, buscado), contenedorCards)
})

function buscarPersonaje(array, personaje) {

    let ingresado = personaje.charAt(0).toUpperCase() + personaje.slice(1);
    let buscado = array.filter(ele => ele.name === ingresado);
    if (buscado.length > 0) {
        return buscado
    }
    noEncontrado('Personaje no encontrado!')
    return array

}

function myFunction(nroCard) {
    
    let nuevoObj;

    ObjPersonajes.forEach((personaje) => {
        const { id, imageUrl, name, originplanet, specie, price } = personaje;
        if(personaje.id === nroCard) {
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
                let precio = perso.price;
                precio += perso.price
                cantidad++
                perso.price = precio
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

    console.log(personajeBuscado)
    sincronizarStorage()
    pintarCarrito(personajeBuscado);
}

function pintarCarrito(array) {
    contenedorCarrito.innerHTML = ""
    array.forEach( ele => {
        const { imageUrl, name, originplanet, price, specie, id,cantidad } = ele;
            const contenedorCardCarrito = document.createElement('div');
            contenedorCardCarrito.classList.add('contendor-card-carrito')
            contenedorCardCarrito.innerHTML = `
                <img src="${imageUrl}" width=70>
                <div class="h-50">
                    <p>Nombre <strong>${name}</strong></p>
                    <p>Origen <strong>${originplanet}</strong></p>
                    <p>Especie <strong>${specie}</strong></p>
                    <p>Cantidad <strong>${cantidad}</strong></p>
                    <p>Precio $<strong>${price}</strong></p>
                </div>
                
            `

            contenedorCarrito.appendChild(contenedorCardCarrito)
    })
}

vaciarCarrito.addEventListener('click', () => {
    contenedorCarrito.innerHTML = ""
    localStorage.clear()
})

function sincronizarStorage() {
    localStorage.setItem('buscado', JSON.stringify(personajeBuscado));
}

btnComprar.addEventListener("click", () => {
    Swal.fire({
        title: 'Quieres comprar lo añadido?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Comprar'
      }).then((result) => {
        if (result.isConfirmed) {
            contenedorCarrito.innerHTML = ""
            localStorage.clear()
          Swal.fire(
            'Comprado!',
            'Su compra fue realizada',
            'success'
          )
        }
      })

})

function noEncontrado(msj){
    mensaje.innerHTML = "";

    const parrafo = document.createElement('p');
    parrafo.classList.add('text-center', 'fs-1', 'text-warning', 'p-4')
    parrafo.innerHTML = msj
    mensaje.appendChild(parrafo)

    setTimeout(() => {
        parrafo.remove()
    }, 2500);
}