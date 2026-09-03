document.addEventListener("DOMContentLoaded", function () {
    const PRODUCTOS_POR_CARGA = 6;

    const listaProductos = document.getElementById("lista-productos");
    const cantidadResultados = document.getElementById("cantidad-resultados");
    const botonCargarMas = document.getElementById("boton-cargar-mas");
    const formularioFiltros = document.getElementById("formulario-filtros");
    const busquedaProducto = document.getElementById("busqueda-producto");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const filtroMarca = document.getElementById("filtro-marca");
    const precioMinimo = document.getElementById("precio-minimo");
    const precioMaximo = document.getElementById("precio-maximo");
    const soloConStock = document.getElementById("solo-con-stock");
    const ordenProductos = document.getElementById("orden-productos");
    const errorPrecios = document.getElementById("error-precios");
    const mensajeSinResultados = document.getElementById("mensaje-sin-resultados");
    const botonLimpiarFiltros = document.getElementById("boton-limpiar-filtros");
    const botonLimpiarVacio = document.getElementById("boton-limpiar-vacio");

    let cantidadVisible = PRODUCTOS_POR_CARGA;
    let productosFiltrados = [...PRODUCTOS];

    const formatoPrecio = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    });

    // Función para obtener el precio final de un producto
    function obtenerPrecioActual(producto) {
        if (producto.precioDescuento !== null) {
            return producto.precioDescuento;
        }

        return producto.precio;
    }

    // Función para calcular el porcentaje de descuento
    function calcularPorcentajeDescuento(producto) {
        if (producto.precioDescuento === null) {
            return 0;
        }

        const diferencia = producto.precio - producto.precioDescuento;
        return Math.round((diferencia / producto.precio) * 100);
    }

    // Función para cargar las categorías y marcas en los filtros
    function cargarOpcionesDeFiltros() {
        CATEGORIAS.forEach(function (categoria) {
            const opcion = document.createElement("option");
            opcion.value = categoria.id;
            opcion.textContent = categoria.nombre;
            filtroCategoria.appendChild(opcion);
        });

        const marcas = [...new Set(PRODUCTOS.map(function (producto) {
            return producto.marca;
        }))].sort(function (marcaA, marcaB) {
            return marcaA.localeCompare(marcaB, "es");
        });

        marcas.forEach(function (marca) {
            const opcion = document.createElement("option");
            opcion.value = marca;
            opcion.textContent = marca;
            filtroMarca.appendChild(opcion);
        });
    }

    // Función para comprobar que el precio mínimo no supere al máximo
    function validarRangoDePrecios() {
        const minimo = precioMinimo.value === "" ? 0 : Number(precioMinimo.value);
        const maximo = precioMaximo.value === "" ? Infinity : Number(precioMaximo.value);

        errorPrecios.textContent = "";
        precioMinimo.removeAttribute("aria-invalid");
        precioMaximo.removeAttribute("aria-invalid");

        if (minimo > maximo) {
            errorPrecios.textContent = "El precio mínimo no puede ser mayor que el máximo.";
            precioMinimo.setAttribute("aria-invalid", "true");
            precioMaximo.setAttribute("aria-invalid", "true");
            return false;
        }

        return true;
    }

    // Función para filtrar los productos según las opciones seleccionadas
    function filtrarProductos() {
        const textoBuscado = busquedaProducto.value.trim().toLowerCase();
        const categoriaSeleccionada = filtroCategoria.value;
        const marcaSeleccionada = filtroMarca.value;
        const minimo = precioMinimo.value === "" ? 0 : Number(precioMinimo.value);
        const maximo = precioMaximo.value === "" ? Infinity : Number(precioMaximo.value);

        return PRODUCTOS.filter(function (producto) {
            const nombreYMarca = (producto.nombre + " " + producto.marca).toLowerCase();
            const precioActual = obtenerPrecioActual(producto);

            const coincideBusqueda = textoBuscado === "" || nombreYMarca.includes(textoBuscado);
            const coincideCategoria = categoriaSeleccionada === "" || producto.categoria === categoriaSeleccionada;
            const coincideMarca = marcaSeleccionada === "" || producto.marca === marcaSeleccionada;
            const coincidePrecio = precioActual >= minimo && precioActual <= maximo;
            const coincideStock = !soloConStock.checked || producto.stock > 0;

            return coincideBusqueda && coincideCategoria && coincideMarca && coincidePrecio && coincideStock;
        });
    }

    // Función para ordenar los productos
    function ordenarProductos(productos) {
        const productosOrdenados = [...productos];

        if (ordenProductos.value === "precio-ascendente") {
            productosOrdenados.sort(function (productoA, productoB) {
                return obtenerPrecioActual(productoA) - obtenerPrecioActual(productoB);
            });
        } else if (ordenProductos.value === "precio-descendente") {
            productosOrdenados.sort(function (productoA, productoB) {
                return obtenerPrecioActual(productoB) - obtenerPrecioActual(productoA);
            });
        } else if (ordenProductos.value === "nombre-ascendente") {
            productosOrdenados.sort(function (productoA, productoB) {
                return productoA.nombre.localeCompare(productoB.nombre, "es");
            });
        } else if (ordenProductos.value === "nombre-descendente") {
            productosOrdenados.sort(function (productoA, productoB) {
                return productoB.nombre.localeCompare(productoA.nombre, "es");
            });
        } else {
            productosOrdenados.sort(function (productoA, productoB) {
                return Number(productoB.destacado) - Number(productoA.destacado);
            });
        }

        return productosOrdenados;
    }

    // Función para obtener la cantidad de un producto guardada en el carrito
    function obtenerCantidadEnCarrito(idProducto) {
        const carrito = obtenerCarrito();
        const lineaExistente = carrito.find(function (linea) {
            return linea.productoId === idProducto;
        });

        return lineaExistente ? lineaExistente.cantidad : 0;
    }

    // Función para crear la tarjeta HTML de un producto
    function crearTarjetaProducto(producto) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta", "tarjeta-producto");

        const precioActual = obtenerPrecioActual(producto);
        const porcentajeDescuento = calcularPorcentajeDescuento(producto);
        const cantidadEnCarrito = obtenerCantidadEnCarrito(producto.id);
        const alcanzoStockMaximo = cantidadEnCarrito >= producto.stock;

        let textoStock = producto.stock + " unidades disponibles";
        let textoBoton = "Agregar al carrito";

        if (producto.stock === 0) {
            textoStock = "Producto sin stock";
            textoBoton = "Sin stock";
        } else if (alcanzoStockMaximo) {
            textoStock = "Ya agregaste el stock máximo";
            textoBoton = "Stock máximo alcanzado";
        }

        const botonDeshabilitado = producto.stock === 0 || alcanzoStockMaximo;

        tarjeta.innerHTML = `
            <a href="producto.html?id=${producto.id}" class="enlace-imagen-producto" aria-label="Ver detalle de ${producto.nombre}">
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}" class="imagen-tarjeta-producto" loading="lazy">
                ${porcentajeDescuento > 0 ? `<span class="etiqueta-descuento">-${porcentajeDescuento}%</span>` : ""}
            </a>

            <div class="contenido-tarjeta-producto">
                <p class="marca-producto">${producto.marca}</p>

                <h3>
                    <a href="producto.html?id=${producto.id}">${producto.nombre}</a>
                </h3>

                <p class="stock-producto">${textoStock}</p>

                <div class="precios-producto">
                    ${producto.precioDescuento !== null ? `<span class="precio-anterior">${formatoPrecio.format(producto.precio)}</span>` : ""}
                    <span class="precio-actual">${formatoPrecio.format(precioActual)}</span>
                </div>

                <div class="acciones-producto">
                    <a href="producto.html?id=${producto.id}" class="boton-secundario">Ver producto</a>

                    <button type="button" class="boton-primario boton-agregar-producto" data-producto-id="${producto.id}" ${botonDeshabilitado ? "disabled" : ""}>
                        ${textoBoton}
                    </button>
                </div>
            </div>
        `;

        return tarjeta;
    }

    // Función para mostrar las tarjetas de productos en el catálogo
    function mostrarProductos() {
        const productosVisibles = productosFiltrados.slice(0, cantidadVisible);

        listaProductos.replaceChildren();

        productosVisibles.forEach(function (producto) {
            const tarjeta = crearTarjetaProducto(producto);
            listaProductos.appendChild(tarjeta);
        });

        cantidadResultados.textContent = productosFiltrados.length;
        botonCargarMas.hidden = cantidadVisible >= productosFiltrados.length;
        mensajeSinResultados.hidden = productosFiltrados.length !== 0;
    }

    // Función para aplicar los filtros y actualizar los productos
    function aplicarFiltros() {
        if (!validarRangoDePrecios()) {
            return;
        }

        productosFiltrados = ordenarProductos(filtrarProductos());
        cantidadVisible = PRODUCTOS_POR_CARGA;
        mostrarProductos();
    }

    // Función para limpiar los filtros y mostrar todos los productos
    function limpiarFiltros() {
        formularioFiltros.reset();
        ordenProductos.value = "destacados";
        errorPrecios.textContent = "";
        precioMinimo.removeAttribute("aria-invalid");
        precioMaximo.removeAttribute("aria-invalid");
        productosFiltrados = ordenarProductos([...PRODUCTOS]);
        cantidadVisible = PRODUCTOS_POR_CARGA;
        mostrarProductos();
    }

    // Función para agregar una unidad del producto al carrito
    function agregarProductoDesdeCatalogo(idProducto) {
        const producto = PRODUCTOS.find(function (productoActual) {
            return productoActual.id === idProducto;
        });

        if (!producto || producto.stock === 0) {
            return;
        }

        const carritoActual = obtenerCarrito();
        const lineaExistente = carritoActual.find(function (linea) {
            return linea.productoId === producto.id;
        });
        const cantidadActual = lineaExistente ? lineaExistente.cantidad : 0;
        const cantidadNueva = cantidadActual + 1;

        if (!validarStock(producto, cantidadNueva)) {
            return;
        }

        const productoConPrecioActual = {
            ...producto,
            precio: obtenerPrecioActual(producto)
        };

        const carritoActualizado = agregarAlCarrito(
            carritoActual,
            productoConPrecioActual,
            1
        );

        guardarCarrito(carritoActualizado);
        actualizarContadorCarrito();
        mostrarProductos();
    }

    // Eventos del catálogo
    listaProductos.addEventListener("click", function (evento) {
        const botonAgregar = evento.target.closest(".boton-agregar-producto");

        if (!botonAgregar) {
            return;
        }

        const idProducto = Number(botonAgregar.dataset.productoId);
        agregarProductoDesdeCatalogo(idProducto);
    });

    botonCargarMas.addEventListener("click", function () {
        cantidadVisible += PRODUCTOS_POR_CARGA;
        mostrarProductos();
    });

    formularioFiltros.addEventListener("submit", function (evento) {
        evento.preventDefault();
        aplicarFiltros();
    });

    ordenProductos.addEventListener("change", aplicarFiltros);
    botonLimpiarFiltros.addEventListener("click", limpiarFiltros);
    botonLimpiarVacio.addEventListener("click", limpiarFiltros);

    // Carga inicial del catálogo
    cargarOpcionesDeFiltros();
    productosFiltrados = ordenarProductos([...PRODUCTOS]);
    mostrarProductos();
});
