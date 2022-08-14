const formulario = document.querySelector('#formulario');
const btnEmail = document.querySelector('#email');
const btnPass = document.querySelector('#pass');
const mensaje = document.querySelector('#mensaje');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(btnEmail.value)
    if(btnEmail.vallue != "" && btnPass.value != ""){
        location.replace("news.html")

    }else {
        mostrarMensaje('Ingrese sus datos en ambos campos')
    }
})

function mostrarMensaje(msj){
    mensaje.innerHTML = "";

    const parrafo = document.createElement('p');
    parrafo.classList.add('text-center', 'fs-3', 'text-mensaje', 'p-4')
    parrafo.innerHTML = msj
    mensaje.appendChild(parrafo)

    setTimeout(() => {
        parrafo.remove()
    }, 2500);
}
