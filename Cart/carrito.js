import './style.css';

// --- 1. Seleccionar el formulario y el botón de envío ---
const formulario = document.querySelector('#formulario-agregar');

// Asegúrate de que el formulario existe antes de añadir el evento
if (formulario) {
    formulario.addEventListener('submit', agregarAlCarrito);
}

// --- 2. Función Principal para Agregar al Carrito ---
function agregarAlCarrito(e) {
    // Previene que la página se recargue
    e.preventDefault(); 

    // Obtener los datos del formulario y del producto
    const productoInfo = {
        // Datos fijos del formulario
        id: formulario.getAttribute('data-id'),
        nombre: formulario.getAttribute('data-nombre'),
        
        // Datos dinámicos de los campos del formulario
        servicio: document.querySelector('#servicio-seleccionado').value,
        cantidad: parseInt(document.querySelector('#cantidad-producto').value),
        
        // El precio lo leemos del HTML y eliminamos el símbolo '$' y el '.' para manejarlo como número
        precioUnitario: parseFloat(document.querySelector('#precio-producto').textContent.replace('$', '').replace('.', '')), 
    }

    // --- 3. Validación Mínima ---
    if (productoInfo.servicio === "") {
        alert('Por favor, selecciona un servicio antes de agregar al carrito.');
        return; // Detiene la ejecución si no hay servicio seleccionado
    }
    if (isNaN(productoInfo.cantidad) || productoInfo.cantidad < 1) {
        alert('Por favor, ingresa una cantidad válida.');
        return; 
    }

    // Añade el costo total al objeto
    productoInfo.subTotal = productoInfo.precioUnitario * productoInfo.cantidad;

    // --- 4. Guardar en localStorage ---
    guardarProducto(productoInfo);
    
    // Opcional: Notificar al usuario
    alert(`Se agregaron ${productoInfo.cantidad} unidades de ${productoInfo.nombre} (${productoInfo.servicio}) al carrito.`);
}


// --- 5. Lógica para manejar el Local Storage ---
function guardarProducto(nuevoProducto) {
    let carrito = obtenerCarritoLocalStorage();

    // Revisa si el producto (por ID y Servicio) ya existe en el carrito
    const existe = carrito.some(producto => 
        producto.id === nuevoProducto.id && producto.servicio === nuevoProducto.servicio
    );

    if (existe) {
        // Si existe, actualiza la cantidad y el subTotal
        carrito = carrito.map(producto => {
            if (producto.id === nuevoProducto.id && producto.servicio === nuevoProducto.servicio) {
                // Suma la nueva cantidad a la existente
                producto.cantidad += nuevoProducto.cantidad;
                // Recalcula el subTotal
                producto.subTotal = producto.cantidad * producto.precioUnitario; 
            }
            return producto;
        });
    } else {
        // Si no existe, lo agrega al arreglo del carrito
        carrito.push(nuevoProducto);
    }
    
    // Sincroniza el array actualizado con Local Storage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}


// Función que lee lo que hay en Local Storage y lo convierte a un Array de JS
function obtenerCarritoLocalStorage() {
    return localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito')) : [];
}

// Función de ejemplo para ver el carrito
console.log(obtenerCarritoLocalStorage());

// Agrega esta función al archivo carrito.js (o donde tengas tu JavaScript)

// Función auxiliar para obtener el carrito (la definimos en la respuesta anterior, si ya la tienes no la repitas)
function obtenerCarritoLocalStorage() {
    return localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito')) : [];
}

// Función que se ejecuta al cargar la página y después de agregar un producto
function actualizarContadorCarrito() {
    const carrito = obtenerCarritoLocalStorage();
    const contadorBoton = document.querySelector('#ver-carrito');
    
    // Calcula la suma de la cantidad de todos los productos
    const totalItems = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    
    if (contadorBoton) {
        contadorBoton.textContent = `Ver Carrito (${totalItems})`;
    }
}

// Llama a esta función al inicio para que el contador esté actualizado
// Debe ser llamada al final del archivo JS o después de cargar el DOM
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito); 


// Función principal para mostrar el contenido del carrito
function mostrarContenidoCarrito() {
    const carrito = obtenerCarritoLocalStorage();
    const listaCarrito = document.querySelector('#lista-carrito');
    const resumenDiv = document.querySelector('#resumen-carrito');
    const totalAPagarSpan = document.querySelector('#carrito-total');
    let totalPagar = 0;
    
    // 1. Limpiar el contenido previo
    listaCarrito.innerHTML = ''; 

    if (carrito.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'El carrito está vacío. ¡Añade tu primer servicio!';
        listaCarrito.appendChild(mensaje);
        totalAPagarSpan.textContent = '$0';
    } else {
        // 2. Recorrer el carrito y construir la lista
        carrito.forEach(producto => {
            const { nombre, servicio, cantidad, subTotal } = producto;
            
            // Calcula el total general
            totalPagar += subTotal;

            const listItem = document.createElement('li');
            
            // Formatea el subtotal para que se vea como moneda
            const subTotalFormateado = `$${subTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

            listItem.innerHTML = `
                **${nombre}** (${servicio})
                <br>
                Cantidad: ${cantidad} | Subtotal: ${subTotalFormateado}
            `;
            listaCarrito.appendChild(listItem);
        });

        // 3. Mostrar el total a pagar
        const totalFormateado = `$${totalPagar.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        totalAPagarSpan.textContent = totalFormateado;
    }
    
    // 4. Mostrar el contenedor del resumen
    resumenDiv.style.display = 'block';
}

// IMPORTANTE: Después de agregar un producto (en la función agregarAlCarrito)
// debes asegurarte de llamar a actualizarContadorCarrito() para que el número del botón cambie.

// Modificación a la función 'agregarAlCarrito' de la respuesta anterior:
// function agregarAlCarrito(e) {
//     // ... (tu código anterior de obtener y validar datos)
//     // ...
//     guardarProducto(productoInfo);
    
//     // **Añade esta línea aquí:**
//     actualizarContadorCarrito(); 
    
//     alert(`Se agregaron ${productoInfo.cantidad} unidades...`);
// }