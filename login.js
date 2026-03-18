//Variables globales del formulario de login
const d = document;
userInput = d.querySelector("#usuarioForm");
passInput = d.querySelector("#contraForm");
btnLogin = d.querySelector(".btnLogin");

// evento click del boton login
btnLogin.addEventListener("click", function(){
    //alert("Usuario: " + userInput.value + "\nContraseña: " + passInput.value);
    let dataForm = getData(); // se llama a la función getData para validar y obtener los datos del formulario del login
    sendData(dataForm); // se llama a la función sendData para enviar los datos al backend para validar el login
});

//validacion para validar y obtener los datos del formulario del login
let getData = () => { // se crea la función getData para validar y obtener los datos del formulario del login
    //validar formulario

    let user ; // son los datos que se van a enviar al backend para validar el login 
    if(userInput.value && passInput.value){ 
        user = { 
            usuario: userInput.value,
            contrasena: passInput.value
        }
        userInput.value = ""; // se limpia el campo de usuario
        passInput.value = ""; // se limpia el campo de contraseña
    }else {
         alert("No se ha podido iniciar sesión. Usuario o contraseña incorrectos.");

    }
    console.log(user); // se muestra el objeto user en la consola para verificar que se han obtenido los datos del formulario
    return user; // se retorna el objeto user con los datos del formulario

};

///funcion para recibir los datos y realizar la petición al backend para validar el login
let sendData = async(data) => { // se crea la función sendData para enviar los datos al backend para validar el login
    let url = "http://localhost/apiCrud/login"; // se define la url del backend para validar el login
    try {
        let respuesta = await fetch(url, { // se realiza la petición al backend para validar el login
        method: "POST", // se define el método de la petición
        headers: { // se definen los headers de la petición
            "Content-Type": "application/json" // se define el tipo de contenido de la petición
        },
        body: JSON.stringify(data) // se convierte el objeto data a formato JSON para enviarlo al backend
    });
    if (respuesta.status==401){ // se verifica si la respuesta del backend es 401 (Unauthorized) para mostrar un mensaje de error al usuario
        alert("No se ha podido iniciar sesión. Usuario o contraseña incorrectos.");
    } else {
        let userLogin = await respuesta.json(); // se obtiene la respuesta del backend en formato JSON
    //console.log(userLogin); // se muestra la respuesta del backend en la consola para verificar que se ha recibido la respuesta del backend

    alert(`Bienvenido ${userLogin.nombre}`); // se muestra un mensaje de bienvenida al usuario con su nombre y apellido obtenido del backend
    //reedirigir al usuario a la página de inicio después de iniciar sesión
    //guardr en el local storage el nombre del usuario para mostrarlo en la página de inicio
    localStorage.setItem("userLogin",JSON.stringify(userLogin)); // se guarda el objeto userLogin en el local storage para mostrarlo en la página de inicio
        location.href = ".../index.html"; // se redirige al usuario a la página de inicio después de iniciar sesión

    }

    
    } catch (error) {
       console.log(error); // se muestra el error en la consola si ocurre algún error al realizar la petición al backend 
    }
    


}