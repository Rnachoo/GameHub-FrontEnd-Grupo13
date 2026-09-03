(function (){


    const formatoPeso = new Intl.NumberFormat('es-CL',{
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    //Función para renderizar el carrito con los elementos correspondientes
    function renderizarCarrito(){
        const carrito = obtenerCarrito();
        const carritoVacio = document.getElementById('carrito-vacio');
        const carritoContenido = document.getElementById('carrito-contenido');

        if(carrito.length === 0){
            carritoVacio.hidden = false;
            carritoContenido.hidden = true;
            return;
        }

        carritoVacio.hidden = true;
        carritoContenido.hidden = false;

        pintarLineas(carrito);
        pintarTotales(carrito);
    }

    function pintarLineas(carrito) {
        const tbody = document.getElementById('lineas-carrito');
        tbody.innerHTML = '';

        carrito.forEach((item) => {
        const fila = document.createElement('tr');

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = item.nombre;

        const celdaPrecio = document.createElement('td');
        celdaPrecio.textContent = formatoPeso.format(item.precioUnitario);

        const celdaCantidad = document.createElement('td');
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.className = 'input-cantidad';
        inputCantidad.min = '1';
        inputCantidad.value = item.cantidad;
        inputCantidad.setAttribute('aria-label', 'Cantidad de ' + item.nombre);
        inputCantidad.addEventListener('change', () => {
            manejarCambioCantidad(item.productoId, inputCantidad);
        });
        celdaCantidad.appendChild(inputCantidad);

        const celdaSubtotal = document.createElement('td');
        celdaSubtotal.textContent = formatoPeso.format(item.precioUnitario * item.cantidad);

        const celdaAcciones = document.createElement('td');
        const botonQuitar = document.createElement('button');
        botonQuitar.type = 'button';
        botonQuitar.className = 'boton-secundario';
        botonQuitar.textContent = 'Quitar';
        botonQuitar.addEventListener('click', () => {
            const carritoActualizado = quitarDelCarrito(obtenerCarrito(), item.productoId);
            guardarCarrito(carritoActualizado);
            actualizarContadorCarrito();
            renderizarCarrito();
        });
        celdaAcciones.appendChild(botonQuitar);

        fila.append(celdaNombre, celdaPrecio, celdaCantidad, celdaSubtotal, celdaAcciones);
        tbody.appendChild(fila);
        });
    }

    function manejarCambioCantidad(productoId, inputCantidad) {
        const nuevaCantidad = Number(inputCantidad.value);
        const producto = PRODUCTOS.find((p) => p.id === productoId);

        if (!producto) {
            inputCantidad.setCustomValidity('Producto no encontrado.');
            inputCantidad.reportValidity();
            return;
        }

        if (!validarStock(producto, nuevaCantidad)) {
            inputCantidad.setCustomValidity(
                'Cantidad inválida: máximo ' + producto.stock + ' unidades.'
            );
            inputCantidad.reportValidity();
            return;
        }

        inputCantidad.setCustomValidity('');
        const carritoActualizado = actualizarCantidad(obtenerCarrito(), productoId, nuevaCantidad);
        guardarCarrito(carritoActualizado);
        actualizarContadorCarrito();
        renderizarCarrito();
    }


    function pintarTotales(carrito) {
        const cupon = obtenerCuponAplicado();
        const totales = calcularTotales(carrito, cupon);

        document.getElementById('subtotal-carrito').textContent = formatoPeso.format(totales.subtotal);
        document.getElementById('descuento-carrito').textContent = formatoPeso.format(totales.descuento);
        document.getElementById('total-carrito').textContent = formatoPeso.format(totales.total);
    }


    function inicializarBotonVaciar() {
        const boton = document.getElementById('boton-vaciar-carrito');
        boton.addEventListener('click', () => {
            if (!confirm('¿Vaciar todo el carrito?')) return;
            vaciarCarrito();
            guardarCuponAplicado(null);
            document.getElementById('codigo-cupon').value = '';
            actualizarContadorCarrito();
            renderizarCarrito();
        });
    }

    function inicializarFormularioCupon() {
        const formulario = document.getElementById('formulario-cupon');
        const inputCodigo = document.getElementById('codigo-cupon');
        const mensajeError = document.getElementById('error-cupon');

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const cupon = buscarCupon(inputCodigo.value);

            if (!cupon) {
                mensajeError.textContent = 'Ese cupón no existe.';
                return;
            }

            if (!cuponVigente(cupon)) {
                mensajeError.textContent = 'Ese cupón está vencido.';
                return;
            }

            mensajeError.textContent = '';
            guardarCuponAplicado(cupon);
            renderizarCarrito();
        });
    }

    function precargarCupon() {
        const cupon = obtenerCuponAplicado();
        if (cupon) {
        document.getElementById('codigo-cupon').value = cupon.codigo;
        }
    }

    function iniciar() {
        inicializarBotonVaciar();
        inicializarFormularioCupon();
        precargarCupon();
        renderizarCarrito();
    }

    document.addEventListener('DOMContentLoaded', iniciar);


})();