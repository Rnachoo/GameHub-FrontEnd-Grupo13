document.addEventListener("DOMContentLoaded", function () {
    const listaCategorias = document.getElementById(
        "lista-categorias-inicio"
    );

    const listaProductosDestacados = document.getElementById(
        "lista-productos-destacados"
    );

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

        const diferencia =
            producto.precio - producto.precioDescuento;

        return Math.round(
            (diferencia / producto.precio) * 100
        );
    }

    // Función para crear la tarjeta HTML de una categoría
    function crearTarjetaCategoria(categoria) {
        const productoCategoria = PRODUCTOS.find(
            function (producto) {
                return producto.categoria === categoria.id;
            }
        );

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("categoria-destacada");

        tarjeta.innerHTML = `
            <div class="contenido-categoria">
                <div>
                    <h3>${categoria.nombre}</h3>
                    <p>${categoria.descripcion}</p>
                </div>

                <a
                    href="catalogo.html"
                    class="enlace-categoria"
                    aria-label="Ver productos de ${categoria.nombre}"
                >
                    Ver productos
                    <span aria-hidden="true">→</span>
                </a>
            </div>

            <div class="imagen-categoria">
                <img
                    src="${productoCategoria.imagenes[0]}"
                    alt="${productoCategoria.nombre}"
                    loading="lazy"
                >
            </div>
        `;

        return tarjeta;
    }

    // Función para mostrar las categorías populares
    function mostrarCategorias() {
        const categoriasPopulares = [
            "notebooks",
            "consolas",
            "tarjetas-graficas",
            "perifericos"
        ];

        categoriasPopulares.forEach(function (idCategoria) {
            const categoria = CATEGORIAS.find(
                function (categoriaActual) {
                    return categoriaActual.id === idCategoria;
                }
            );

            if (!categoria) {
                return;
            }

            const tarjeta = crearTarjetaCategoria(categoria);
            listaCategorias.appendChild(tarjeta);
        });
    }

    // Función para crear la tarjeta HTML de un producto
    function crearTarjetaProducto(producto) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta", "tarjeta-producto");

        const precioActual = obtenerPrecioActual(producto);
        const porcentajeDescuento =
            calcularPorcentajeDescuento(producto);

        tarjeta.innerHTML = `
            <a
                href="producto.html?id=${producto.id}"
                class="enlace-imagen-producto"
                aria-label="Ver detalle de ${producto.nombre}"
            >
                <img
                    src="${producto.imagenes[0]}"
                    alt="${producto.nombre}"
                    class="imagen-tarjeta-producto"
                    loading="lazy"
                >

                ${
                    porcentajeDescuento > 0
                        ? `
                            <span class="etiqueta-descuento">
                                -${porcentajeDescuento}%
                            </span>
                        `
                        : ""
                }
            </a>

            <div class="contenido-tarjeta-producto">
                <p class="marca-producto">
                    ${producto.marca}
                </p>

                <h3>
                    <a href="producto.html?id=${producto.id}">
                        ${producto.nombre}
                    </a>
                </h3>

                <p class="stock-producto">
                    ${producto.stock} unidades disponibles
                </p>

                <div class="precios-producto">
                    ${
                        producto.precioDescuento !== null
                            ? `
                                <span class="precio-anterior">
                                    ${formatoPrecio.format(
                                        producto.precio
                                    )}
                                </span>
                            `
                            : ""
                    }

                    <span class="precio-actual">
                        ${formatoPrecio.format(precioActual)}
                    </span>
                </div>

                <div class="acciones-producto">
                    <a
                        href="producto.html?id=${producto.id}"
                        class="boton-secundario"
                    >
                        Ver producto
                    </a>
                </div>
            </div>
        `;

        return tarjeta;
    }

    // Función para mostrar los productos destacados
    function mostrarProductosDestacados() {
        const productosDestacados = PRODUCTOS.filter(
            function (producto) {
                return producto.destacado === true;
            }
        );

        productosDestacados.forEach(function (producto) {
            const tarjeta = crearTarjetaProducto(producto);
            listaProductosDestacados.appendChild(tarjeta);
        });
    }

    // Carga inicial de la página
    mostrarCategorias();
    mostrarProductosDestacados();
});