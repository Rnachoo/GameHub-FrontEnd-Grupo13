(function() {

    //Obtener el ID del producto desde la URL
    function obtenerIdDesdeUrl() {
        const parametros = new URLSearchParams(window.location.search);
        return Number(parametros.get('id'));
    }

    //Función parar buscar un producto por su ID
    function buscarProducto(idProducto) {
        return PRODUCTOS.find((producto) => producto.id === idProducto);
    }

    const formatoPeso = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    //Funciónes para pintar elementos del producto en la página
    function pintarInformacionProducto(producto) {
        document.title= "GameHub - " + producto.nombre;
        document.getElementById('nombre-producto').textContent = producto.nombre;
        document.getElementById('descripcion-producto').textContent = producto.descripcion;
        pintarPrecio(producto);
        pintarCaracteristicas(producto);
        pintarDisponibilidad(producto);
    }

    function pintarPrecio(producto) {
        const elementoActual = document.getElementById('precio-producto-actual');
        const elementoAnterior = document.getElementById('precio-producto-anterior');
        const tieneDescuentoVigente = producto.precioDescuento != null && producto.precioDescuento < producto.precio;
        if(tieneDescuentoVigente) {
            elementoAnterior.textContent = formatoPeso.format(producto.precio);
            elementoAnterior.hidden = false;
            elementoActual.textContent = formatoPeso.format(producto.precioDescuento);
            elementoActual.classList.add('precio-descuento');
        } else {
            elementoAnterior.hidden = true;
            elementoActual.textContent = formatoPeso.format(producto.precio);
            elementoActual.classList.remove('precio-descuento');
        }
    }

    function pintarCaracteristicas(producto) {
        const lista = document.getElementById('caracteristicas-producto');
        lista.innerHTML = '';
        producto.especificaciones.forEach((caracteristica) => {
            const li = document.createElement('li');
            li.textContent = caracteristica;
            lista.appendChild(li);
        });
    }

    function pintarDisponibilidad(producto) {
        const elementoDisponibilidad = document.getElementById('disponibilidad-producto');
        elementoDisponibilidad.textContent = producto.stock > 0 ? producto.stock + ' disponibles' : 'Agotado';
    }
    
    function pintarGaleria(producto) {
        const imagenPrincipal = document.getElementById('imagen-principal');
        imagenPrincipal.src = producto.imagenes[0];
        imagenPrincipal.alt = producto.nombre;
        
        const contenedorMiniaturas = document.getElementById('miniaturas-producto');
        contenedorMiniaturas.innerHTML = '';

        if(producto.imagenes.length <= 1) return;

        producto.imagenes.forEach((urlImagen, indice) => {
            const miniatura = document.createElement('img');
            miniatura.src = urlImagen;
            miniatura.alt = producto.nombre + ' - Imagen ' + (indice + 1);
            miniatura.addEventListener('click', () => {
                imagenPrincipal.src = urlImagen;
            });
            contenedorMiniaturas.appendChild(miniatura);
        });
    }


    function pintarResenas(idProducto) {
        const resenasDelProducto = ordenarResenasPorFecha(obtenerResenasPorProducto(idProducto));
        const promedio = calcularPromedioResenas(resenasDelProducto);
        document.getElementById('promedio-resenas').textContent = promedio.toFixed(1);
        document.getElementById('total-resenas').textContent = resenasDelProducto.length;
        
        const lista = document.getElementById('lista-resenas');
        lista.innerHTML='';

        if(resenasDelProducto.length === 0){
            const mensaje = document.createElement('li');
            mensaje.textContent = "Este producto aun no ha sido reseñado.";
            lista.appendChild(mensaje);
            return;
        }

        resenasDelProducto.forEach((resena) => {
        const item = document.createElement('li');
        item.className = 'tarjeta resena';
    
        const estrellas = '★'.repeat(resena.calificacion) + '☆'.repeat(5 - resena.calificacion);
    
        const autor = document.createElement('p');
        autor.className = 'resena-autor';
        autor.textContent = resena.autor + " — " + estrellas;
    
        const comentario = document.createElement('p');
        comentario.textContent = resena.comentario;
    
        const fecha = document.createElement('p');
        fecha.className = 'resena-fecha';
        fecha.textContent = new Date(resena.fecha).toLocaleDateString('es-CL');
    
        item.append(autor, comentario, fecha);
        lista.appendChild(item);
        });
    }

    function inicializarFormulario(producto) {
        const formulario = document.getElementById('formulario-agregar-carrito');
        const inputCantidad = document.getElementById('cantidad-producto');
        const mensajeError = document.getElementById('error-cantidad');
        const boton = formulario.querySelector('button[type=submit]');
    
        if (producto.stock === 0) {
        inputCantidad.disabled = true;
        boton.disabled = true;
        boton.textContent = 'Sin stock';
        return;
    }
 
    inputCantidad.max = producto.stock;
 
    function mostrarError(texto) {
      mensajeError.textContent = texto;
      inputCantidad.setAttribute('aria-invalid', 'true');
    }
 
    function limpiarError() {
      mensajeError.textContent = '';
      inputCantidad.removeAttribute('aria-invalid');
    }
 
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
 
      const cantidad = Number(inputCantidad.value);
 
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarError('Ingresa una cantidad válida (un número entero mayor a 0).');
        return;
      }

      if (!validarStock(producto, cantidad)) {
        mostrarError('Solo quedan ' + producto.stock + ' unidades disponibles.');
        return;
      }
 
      limpiarError();
 
      const carritoActual = obtenerCarrito();
      const carritoActualizado = agregarAlCarrito(carritoActual, producto, cantidad);
      guardarCarrito(carritoActualizado);
      actualizarContadorCarrito();

      const textoOriginal = boton.textContent;
      boton.textContent = '¡Agregado!';
      setTimeout(() => { boton.textContent = textoOriginal; }, 1500);
    });
  }
 
 
  function iniciar() {
    const idProducto = obtenerIdDesdeUrl();
    const producto = buscarProducto(idProducto);
 
    if (!producto) {
      document.getElementById("detalle-producto").innerHTML =
        "<p>No encontramos ese producto. Vuelve al <a href='catalogo.html'>catálogo</a>.</p>";
      document.querySelector(".resenas-producto").hidden = true;
      return;
    }
 
    pintarInformacionProducto(producto);
    pintarGaleria(producto);
    pintarResenas(producto.id);
    inicializarFormulario(producto);
  }
 
  document.addEventListener("DOMContentLoaded", iniciar);
    


})();