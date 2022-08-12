const formulario = document.querySelector('#formulario');



formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInpu = document.querySelector('#email');
    const passInpu = document.querySelector('#pass');
    console.log(emailInpu);
    console.log(passInpu)
})
