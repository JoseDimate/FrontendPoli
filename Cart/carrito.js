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
// console.log(obtenerCarritoLocalStorage());