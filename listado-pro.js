//Variables globales
let tablePro = document.querySelector("#table-pro > tbody");
let searchInput = document.querySelector("#search-input");

//Evento para probar el campo de buscar
searchInput.addEventListener("keyup", ()=>{
    console.log(searchInput.value);
});

//Evento para el navegador
document.addEventListener("DOMContentLoaded", ()=>{
    getTableData();
});

//Función para traer los datos de la BD a la tabla
let getTableData = async ()=>{
    let url = "http://localhost:3000/api/productos";
    try {
        let respuesta = await fetch(url, { 
            method: "GET", 
            headers: { 
                "Content-Type": "application/json" 
            },           
        });
        if (respuesta.status === 204){ 
            console.log("No hay datos en la BD");
        } else {
            let tableData = await respuesta.json(); 
            console.log(tableData);
            //Agregar los dartos de la tabla a localStorage
            localStorage.setItem("datosTabla", JSON.stringify(tableData));
            //Agregar los datos a la tabla
            tableData.forEach((dato, i) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${i+1}</td>
                    <td>${dato.nombre}</td>
                    <td>${dato.descripcion}</td>
                    <td>${dato.precio}</td>
                    <td>${dato.stock}</td>
                    <td><img src= "${dato.imagen}" width="100"></td>
                    <td>
                         <button id= "btn-edit" onclick="editDataTable(${i})"type="button" class="btn btn-warning btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                    </button>
                       <button id= "btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                   
                    </td>
                `;
                tablePro.appendChild(row);
            });
        }  
    } catch (error) {
       console.log(error);
    }
};



//Función para editar un producto de la tabla
let editDataTable =( pos ) => {
    let products= [];
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave !=null) {
        products = productsSave;
    }
    let singleProduct = products[pos];
    // console.log(singleProduct);
    localStorage.setItem("productEdit", JSON.stringify(singleProduct)); 
    localStorage.removeItem("datosTabla"); 
    location.href = "crear-pro.html";
}

//Función para eliminar un producto de la tabla
let deleteDataTable =( pos ) => {
    let products= [];
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave !=null) {
        products = productsSave;
    }
    let singleProduct = products[pos];
    // console.log("producto a eliminar:" + singleProduct.nombre);
    let idProduct ={
        id: singleProduct.id
    }
    let confirmar = confirm(`¿Estás seguro de eliminar el producto ${singleProduct.nombre}?`);
    if (confirmar) {
        sendDeleteProduct(idProduct);
    }
    
}

//Funcion para realizar la peticion de eliminar un producto al servidor
let sendDeleteProduct = async(id) => {
    let url = `http://localhost:3000/api/productos/${id.id}`;
        try {
        let respuesta = await fetch(url, { // se realiza la petición al backend para validar el login
        method: "DELETE", // se define el método de la petición
        headers: { // se definen los headers de la petición
            "Content-Type": "application/json" // se define el tipo de contenido de la petición
        }
    });
    
    let mensaje = await respuesta.json(); 
    
    if (respuesta.status === 406 || respuesta.status === 400 || respuesta.status === 500) { 
        alert("Error: " + mensaje.message);
    } else if (respuesta.ok) {
        alert(mensaje.message);
        // Recargar la página para ver los cambios
        location.reload();
    } else {
        alert("Error: " + mensaje.message);
        location.reload();
    }

    
    } catch (error) { 
       console.log(error); 
       alert("Error de conexión: No se pudo comunicar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000");
    }
    
};
