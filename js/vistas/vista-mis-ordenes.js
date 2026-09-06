(function() {
    
    document.addEventListener("DOMContentLoaded", inicializarMisOrdenes);

    // Formateador de moneda (estándar chileno)
    function formatearDinero(valor) {
        return "$" + valor.toLocaleString("es-CL");
    }

    function inicializarMisOrdenes() {
        const contenedorOrdenes = document.getElementById("contenedor-ordenes");
        const mensajeVacio = document.getElementById("mensaje-sin-ordenes");
        
        if (!contenedorOrdenes || !mensajeVacio) return;

        // Leemos las órdenes desde el LocalStorage
        const historial = JSON.parse(localStorage.getItem("gamehub_ordenes")) || [];

        // Si no hay compras previas, mostramos el estado vacío
        if (historial.length === 0) {
            mensajeVacio.hidden = false;
            return;
        }

        // Si hay compras, recorremos el array y construimos las tarjetas
        for (let i = 0; i < historial.length; i++) {
            const orden = historial[i];
            
            // Contenedor principal de la tarjeta
            const articulo = document.createElement("article");
            articulo.className = "tarjeta-orden";

            // Cabecera (ID, Fecha, Estado)
            const cabecera = document.createElement("div");
            cabecera.className = "cabecera-orden";

            const datosCabecera = document.createElement("div");
            datosCabecera.className = "datos-orden";
            const titulo = document.createElement("h3");
            titulo.textContent = "Orden " + orden.id;
            const fecha = document.createElement("p");
            fecha.className = "fecha-orden";
            fecha.textContent = "Realizada el " + orden.fecha;
            
            datosCabecera.appendChild(titulo);
            datosCabecera.appendChild(fecha);

            const estado = document.createElement("span");
            estado.className = "estado-orden " + orden.claseEstado;
            estado.textContent = orden.estado;

            cabecera.appendChild(datosCabecera);
            cabecera.appendChild(estado);

            // Cuerpo (Lista de productos y Total)
            const cuerpo = document.createElement("div");
            cuerpo.className = "cuerpo-orden";

            const listaProductos = document.createElement("ul");
            listaProductos.className = "productos-orden";

            for (let j = 0; j < orden.productos.length; j++) {
                const item = orden.productos[j];
                const li = document.createElement("li");
                li.textContent = item.cantidad + "x " + item.nombre;
                listaProductos.appendChild(li);
            }

            const contenedorTotal = document.createElement("div");
            contenedorTotal.className = "total-orden";
            const labelTotal = document.createElement("span");
            labelTotal.textContent = "Total de la orden";
            const valorTotal = document.createElement("strong");
            valorTotal.textContent = formatearDinero(orden.total);

            contenedorTotal.appendChild(labelTotal);
            contenedorTotal.appendChild(valorTotal);

            cuerpo.appendChild(listaProductos);
            cuerpo.appendChild(contenedorTotal);

            // Armar la tarjeta final
            articulo.appendChild(cabecera);
            articulo.appendChild(cuerpo);
            

            contenedorOrdenes.prepend(articulo);
        }
    }

})();