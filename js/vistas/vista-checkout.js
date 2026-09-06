(function() {

    const MAPA_CAMPOS = {
        nombre: "nombre-checkout",
        correo: "correo-checkout",
        telefono: "telefono-checkout",
        region: "region-checkout",
        comuna: "comuna-checkout",
        direccion: "direccion-checkout"
    };

    document.addEventListener("DOMContentLoaded", inicializarCheckout);

    function formatearDinero(valor) {
        return "$" + valor.toLocaleString("es-CL");
    }

    function inicializarCheckout() {
        renderizarResumen();

        const formulario = document.getElementById("formulario-checkout");
        if (!formulario) {
            return;
        }
        formulario.addEventListener("submit", manejarEnvioCheckout);
    }

    function renderizarResumen() {
        const carrito = window.obtenerCarrito();
        const cupon = window.obtenerCuponAplicado();
        const contenedorProductos = document.getElementById("contenedor-productos-checkout");

        if (carrito.length === 0) {
            contenedorProductos.innerHTML = "<p style='margin-bottom: 1rem;'>No hay productos en el carrito.</p>";
        } else {
            contenedorProductos.innerHTML = "";

            for (let i = 0; i < carrito.length; i++) {
                const item = carrito[i];
                const div = document.createElement("div");
                div.className = "item-resumen-checkout";

                const spanNombre = document.createElement("span");
                spanNombre.textContent = item.nombre + " x" + item.cantidad;

                const spanPrecio = document.createElement("span");
                spanPrecio.textContent = formatearDinero(item.precioUnitario * item.cantidad);

                div.appendChild(spanNombre);
                div.appendChild(spanPrecio);
                contenedorProductos.appendChild(div);
            }
        }

        const totales = window.calcularTotales(carrito, cupon);

        document.getElementById("subtotal-checkout").textContent = formatearDinero(totales.subtotal);

        if (totales.descuento > 0) {
            document.getElementById("descuento-checkout").textContent = "-" + formatearDinero(totales.descuento);
        } else {
            document.getElementById("descuento-checkout").textContent = "$0";
        }

        document.getElementById("total-checkout").textContent = formatearDinero(totales.total);
    }

    function manejarEnvioCheckout(evento) {
        evento.preventDefault();

        const carrito = window.obtenerCarrito();
        const mensajeExito = document.getElementById("mensaje-exito-checkout");

        if (carrito.length === 0) {
            mensajeExito.className = "mensaje-exito mensaje-exito-error";
            mensajeExito.textContent = "Agrega productos antes de pagar.";
            mensajeExito.hidden = false;
            return;
        }

        const datos = obtenerDatosFormulario();
        const resultado = window.validarFormularioCheckout(datos);

        limpiarErrores();

        if (!resultado.valido) {
            mostrarErrores(resultado.errores);
            return;
        }

        mostrarCompraExitosa();
    }

    function obtenerDatosFormulario() {
        return {
            nombre: document.getElementById("nombre-checkout").value.trim(),
            correo: document.getElementById("correo-checkout").value.trim(),
            telefono: document.getElementById("telefono-checkout").value.trim(),
            region: document.getElementById("region-checkout").value,
            comuna: document.getElementById("comuna-checkout").value.trim(),
            direccion: document.getElementById("direccion-checkout").value.trim()
        };
    }

    function mostrarErrores(errores) {
        for (const campo in errores) {
            const idCampo = MAPA_CAMPOS[campo];
            const elementoError = document.getElementById("error-" + idCampo);
            if (elementoError) {
                elementoError.textContent = errores[campo];
            }
        }
    }

    function limpiarErrores() {
        const mensajesError = document.querySelectorAll("#formulario-checkout .mensaje-error");
        for (let i = 0; i < mensajesError.length; i++) {
            mensajesError[i].textContent = "";
        }
    }

    function mostrarCompraExitosa() {
        const formulario = document.getElementById("formulario-checkout");
        const mensajeExito = document.getElementById("mensaje-exito-checkout");
        const carrito = window.obtenerCarrito();
        const cupon = window.obtenerCuponAplicado();

        const totales = window.calcularTotales(carrito, cupon);

        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toLocaleDateString("es-CL");

        const nuevaOrden = {
            id: "#" + Math.floor(Math.random() * 90000 + 10000),
            fecha: fechaFormateada,
            estado: "En camino",
            claseEstado: "estado-camino",
            total: totales.total,
            productos: []
        };

        for (let i = 0; i < carrito.length; i++) {
            nuevaOrden.productos.push({
                nombre: carrito[i].nombre,
                cantidad: carrito[i].cantidad
            });
        }

        const historialExistente = JSON.parse(localStorage.getItem("gamehub_ordenes")) || [];
        historialExistente.push(nuevaOrden);
        localStorage.setItem("gamehub_ordenes", JSON.stringify(historialExistente));

        formulario.reset();
        window.vaciarCarrito();
        window.actualizarContadorCarrito();
        renderizarResumen();

        mensajeExito.className = "mensaje-exito";
        mensajeExito.textContent = "¡Compra realizada con éxito! Tu número de orden es " + nuevaOrden.id + ". Serás redirigido al historial de órdenes...";
        mensajeExito.hidden = false;

        setTimeout(function() {
            window.location.href = "mis-ordenes.html";
        }, 3000);
    }

})();