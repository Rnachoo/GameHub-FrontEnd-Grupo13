(function() {
    const CLAVE_CARRITO = "gamehub_carrito";
    const CLAVE_CUPON = "gamehub_cupon";


    // Función para obtener el carrito desde el almacenamiento local
    function obtenerCarrito() {
        const datos = localStorage.getItem(CLAVE_CARRITO);
        if (!datos){
            return [];
        }
        try{
            return JSON.parse(datos);
        } catch (error) {
            console.error("No se pudo obtener el carrito:", error);
            return [];
        }
    }


    // Función para guardar el carrito en el almacenamiento local
    function guardarCarrito(carrito) {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    }
    
    //Función para vaciar el carrito
    function vaciarCarrito() {
        const carritoVacio = [];
        guardarCarrito(carritoVacio);
        return carritoVacio;
    }

    //Función para guardar un cupon aplicado
    function guardarCuponAplicado(cupon) {
        if(cupon){
            localStorage.setItem(CLAVE_CUPON, JSON.stringify(cupon));
        } else {
            localStorage.removeItem(CLAVE_CUPON);
        }
    }


    // Función para obtener el cupón aplicado desde el almacenamiento local
    function obtenerCuponAplicado() {
        const datos = localStorage.getItem(CLAVE_CUPON);
        if (!datos) {
            return null;
        }
        return JSON.parse(datos);
    }

    //Funcion para calcular el subtotal del carrito
    function calcularSubtotal(carrito) {
        let subtotal = 0;
        for(let i = 0; i < carrito.length; i++) {
            subtotal += carrito[i].precioUnitario * carrito[i].cantidad;
        }
        return subtotal;
    }

    //Función para agergar al carrito un producto, si ya existe se suma la cantidad
    function agregarAlCarrito(carrito, producto, cantidad) {
      const precioAplicable = producto.precioDescuento ?? producto.precio;
      const carritoActualizado = [];
      let yaExiste = false;
      for(let i = 0; i < carrito.length; i++) {
        const item = carrito[i];
        if(item.productoId === producto.id) {
            yaExiste = true;
            carritoActualizado.push({
                productoId: item.productoId,
                nombre: item.nombre,
                precioUnitario: item.precioUnitario,
                cantidad: item.cantidad + cantidad
            });
        } else {
            carritoActualizado.push(item);
            }
        }
        if(!yaExiste) {
            carritoActualizado.push({
                productoId: producto.id,
                nombre: producto.nombre,
                precioUnitario: precioAplicable,
                cantidad: cantidad
            });
        }
        return carritoActualizado;
    }
    
    //Función para validar el stock de un producto antes de agregarlo al carrito
    function validarStock(producto, cantidadDeseada) {
        if(!Number.isInteger(cantidadDeseada) || cantidadDeseada <= 0){
            return false;
        }
        return cantidadDeseada <= producto.stock;
    }
 
    //Función para aplicar un cupón al subtotal del carrito
    function aplicarCupon(subtotal, cupon) {
        let descuento = subtotal * (cupon.porcentajeDescuento / 100);
        if((descuento > cupon.tope)){
            descuento = cupon.tope;
        }
        if(descuento > subtotal){
            descuento = subtotal;
        }
        return descuento;
    }

    //Función para validar un cupon vigente
    function cuponVigente(cupon, fecha) {
        if(fecha === undefined){
            fecha = new Date();
        }
        const fechaInicio = new Date(cupon.fechaInicio);
        const fechaFin = new Date(cupon.fechaFin);
        return fecha >= fechaInicio && fecha <= fechaFin;
    }


    //Función para calcular el total del carrito 
    function calcularTotal(subtotal, descuento) {
        const total = subtotal - descuento;
        if(total<0){
            return 0;
        }
        return total;
    }

    //Función para quitar elementos del carrito
    function quitarDelCarrito(carrito, productoId) {
        const carritoActualizado = [];
        for(let i = 0; i < carrito.length; i++) {
            if(carrito[i].productoId !== productoId) {
                carritoActualizado.push(carrito[i]);
            }
        }
        return carritoActualizado;
    }

    //Función para actualuizar la cantidad de un producto en el carrito
    function actualizarCantidad(carrito, productoId, nuevaCantidad) {
        const carritoActualizado = [];
        for(let i = 0; i < carrito.length; i++) {
            const item = carrito[i];
            if(item.productoId === productoId) {
                carritoActualizado.push({
                    productoId: item.productoId,
                    nombre: item.nombre,
                    precioUnitario: item.precioUnitario,
                    cantidad: nuevaCantidad
                });
            } else {
                carritoActualizado.push(item);
            }
        }
        return carritoActualizado;
    }

    //Función para calcular Totales
    function calcularTotales(carrito, cupon) {
        const subtotal = calcularSubtotal(carrito);
        let descuento = 0;
        if(cupon && cuponVigente(cupon)) {
            descuento = aplicarCupon(subtotal, cupon);
        }
        const total = calcularTotal(subtotal, descuento);
        return {
            subtotal: subtotal,
            descuento: descuento,
            total: total
        };
    }

    //Función para contar unidades del carrito
    function contarUnidades(carrito) {
        let totalUnidades = 0;
        for(let i = 0; i < carrito.length; i++) {
            totalUnidades += carrito[i].cantidad;
        }
        return totalUnidades;
    }

    //Funcion para catualizar el contador del carrito
    function actualizarContadorCarrito() {
        const elementoContador = document.getElementById("contador-carrito");
        if (!elementoContador) {
            return;
        }
        const carrito = obtenerCarrito();
        elementoContador.textContent = contarUnidades(carrito);
    }


    window.obtenerCarrito = obtenerCarrito;
    window.guardarCarrito = guardarCarrito;
    window.vaciarCarrito = vaciarCarrito;
    window.guardarCuponAplicado = guardarCuponAplicado;
    window.obtenerCuponAplicado = obtenerCuponAplicado;
    window.calcularSubtotal = calcularSubtotal;
    window.agregarAlCarrito = agregarAlCarrito;
    window.validarStock = validarStock;
    window.aplicarCupon = aplicarCupon;
    window.cuponVigente = cuponVigente;
    window.calcularTotal = calcularTotal;
    window.quitarDelCarrito = quitarDelCarrito;
    window.actualizarCantidad = actualizarCantidad;
    window.calcularTotales = calcularTotales;
    window.contarUnidades = contarUnidades;
    window.actualizarContadorCarrito = actualizarContadorCarrito;

    document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

})();