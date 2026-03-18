//Variables globales del formulario
const d= document
let nameImput = d.querySelector('#productos-select');
let priceInput = d.querySelector('#precio-pro');
let stockInput = d.querySelector('#stock-pro');
let descripcionInput = d.querySelector('#des-pro');
let imgInput = d.querySelector('#imagen-pro');
let btnCreate = d.querySelector('.btn-create');
let productUpdate;

//Evento para el botón de crear producto
btnCreate.addEventListener('click', ()=>{
//    alert("producto" + nameImput.value );
let dataproduct=getDataProduct()   
sendDataProduct(dataproduct)
});

//Evento al navegador para comprobar si recargó la página
document.addEventListener("DOMContentLoaded", ()=>{
    productUpdate = JSON.parse(localStorage.getItem("productEdit"));
    if (productUpdate != null) {
        updateDataProduct();
}

});


//Funcion para validar el formulario y obtener los datos

let getDataProduct = () => { // se crea la función getData para validar y obtener los datos del formulario del login
    //validar formulario

    let product ; // son los datos que se van a enviar al backend para validar el login 
    
    // Validar que se haya seleccionado un producto válido (no el option por defecto)
    let selectedProduct = nameImput.value;
    if (selectedProduct === "Seleccionar un producto") {
        alert("Por favor, seleccione un producto de la lista.");
        return null;
    }

    // Validar que el precio sea un número positivo
    let precio = parseFloat(priceInput.value);
    if (!precio || precio <= 0) {
        alert("Por favor, ingrese un precio válido.");
        return null;
    }

    // Validar que el stock sea un número entero positivo
    let stock = parseInt(stockInput.value);
    if (isNaN(stock) || stock < 0) {
        alert("Por favor, ingrese un stock válido.");
        return null;
    }

    // Validar descripción
    if (!descripcionInput.value.trim()) {
        alert("Por favor, ingrese una descripción.");
        return null;
    }

    // Validar que la imagen tenga una URL válida
    if (!imgInput.src || imgInput.src === "" || imgInput.src === window.location.href) {
        alert("No se ha podido obtener la imagen del producto.");
        return null;
    }
    
    // Todos los datos son válidos, crear el objeto producto
    product = { 
        nombre: selectedProduct,
        precio: precio,
        stock: stock,
        descripcion: descripcionInput.value.trim(),
        imagen: imgInput.src
    }
    
    console.log(product); // se muestra el objeto product en la consola para verificar que se han obtenido los datos del formulario
    return product; // se retorna el objeto product con los datos del formulario

};

let sendDataProduct = async(data) => { // se crea la función sendData para enviar los datos al backend para validar el login
    if (!data) return; // Si no hay datos, no envía nada
    
    let url = "http://localhost:3000/api/productos";
        try {
        let respuesta = await fetch(url, { // se realiza la petición al backend para validar el login
        method: "POST", // se define el método de la petición
        headers: { // se definen los headers de la petición
            "Content-Type": "application/json" // se define el tipo de contenido de la petición
        },
        body: JSON.stringify(data) // se convierte el objeto data a formato JSON para enviarlo al backend
    });
    
    let mensaje = await respuesta.json(); 
    
    if (respuesta.status === 406 || respuesta.status === 400 || respuesta.status === 500) { 
        alert("Error: " + mensaje.message);
    } else if (respuesta.ok) {
        alert(mensaje.message);
        // Limpiar el formulario después de crear exitosamente
        nameImput.value = "Seleccionar un producto";
        priceInput.value = ""; 
        stockInput.value = ""; 
        descripcionInput.value = ""; 
        imgInput.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";
    } else {
        alert("Error: " + mensaje.message);
    }

    
    } catch (error) {
       console.log(error); 
       alert("Error de conexión: No se pudo comunicar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000");
    }
    
};

//Función para editar el producto
let updateDataProduct = async(data) => { 
    //Agregar datos a editar en los campos del formulario
    nameImput.value= productUpdate.nombre;
    priceInput.value= productUpdate.precio;
    stockInput.value= productUpdate.stock;
    descripcionInput.value= productUpdate.descripcion;
    imgInput.src= productUpdate.imagen;
    let product;

// Alternar el botón de crear y actualizar
let btnEdit = d.querySelector('.btn-update');
btnCreate.classList.toggle("d-none");
btnEdit.classList.toggle("d-none");
//Agregar evento al botón editar
btnEdit.addEventListener('click', async()=>{
    product={
        id: productUpdate.id,
        nombre: nameImput.value,
        descripcion: descripcionInput.value,
        precio: priceInput.value,
        stock: stockInput.value,
        imagen: imgInput.src
    }
    //Borrar info de localstorage
    localStorage.removeItem("productEdit");

    //Pasar los datos del producto a la funcion
    sendUpdateProduct(product);
});
};

//Funcion para realizar la peticion al servidor
let sendUpdateProduct = async(pro) => {

     let url = `http://localhost:3000/api/productos/${pro.id}`;
        try {
        let respuesta = await fetch(url, { // se realiza la petición al backend para validar el login
        method: "PUT", // se define el método de la petición
        headers: { // se definen los headers de la petición
            "Content-Type": "application/json" // se define el tipo de contenido de la petición
        },
        body: JSON.stringify(pro) // se convierte el objeto data a formato JSON para enviarlo al backend
    });
    
    let mensaje = await respuesta.json(); 
    
    if (respuesta.status === 406 || respuesta.status === 400 || respuesta.status === 500) { 
        alert("Error: " + mensaje.message);
    } else if (respuesta.ok) {
        alert(mensaje.message);
        // Limpiar el formulario después de crear exitosamente
        nameImput.value = "Seleccionar un producto";
        priceInput.value = ""; 
        stockInput.value = ""; 
        descripcionInput.value = ""; 
        imgInput.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";
    } else {
        alert("Error: " + mensaje.message);
        location.href = "listado-pro.html";
    }

    
    } catch (error) {
       console.log(error); 
       alert("Error de conexión: No se pudo comunicar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000");
    }
}
