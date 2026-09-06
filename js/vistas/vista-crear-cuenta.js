(function() {
 
    const MAPA_CAMPOS = {
        nombre: "nombre-cuenta",
        correo: "correo-cuenta",
        contrasena: "contrasena-cuenta",
        confirmarContrasena: "confirmar-contrasena-cuenta"
    };
 
    document.addEventListener("DOMContentLoaded", inicializarFormularioCrearCuenta);
 
    // Función para inicializar el formulario de crear cuenta
    function inicializarFormularioCrearCuenta() {
        const formulario = document.getElementById("formulario-crear-cuenta");
        if (!formulario) {
            return;
        }
        formulario.addEventListener("submit", manejarEnvioCrearCuenta);
    }
 
    // Función para manejar el envío del formulario de crear cuenta
    function manejarEnvioCrearCuenta(evento) {
        evento.preventDefault();
 
        const datos = obtenerDatosFormulario();
        const resultado = validarFormularioCrearCuenta(datos);
 
        limpiarErrores();
 
        if (!resultado.valido) {
            mostrarErrores(resultado.errores);
            return;
        }
 
        mostrarCuentaCreada();
    }
 
    // Función para obtener los datos ingresados en el formulario
    function obtenerDatosFormulario() {
        return {
            nombre: document.getElementById("nombre-cuenta").value.trim(),
            correo: document.getElementById("correo-cuenta").value.trim(),
            contrasena: document.getElementById("contrasena-cuenta").value,
            confirmarContrasena: document.getElementById("confirmar-contrasena-cuenta").value
        };
    }
 
    // Función para mostrar los mensajes de error junto a cada campo
    function mostrarErrores(errores) {
        for (const campo in errores) {
            const idCampo = MAPA_CAMPOS[campo];
            const elementoError = document.getElementById("error-" + idCampo);
            if (elementoError) {
                elementoError.textContent = errores[campo];
            }
        }
    }
 
    // Función para limpiar los mensajes de error antes de validar de nuevo
    function limpiarErrores() {
        const mensajesError = document.querySelectorAll("#formulario-crear-cuenta .mensaje-error");
        for (let i = 0; i < mensajesError.length; i++) {
            mensajesError[i].textContent = "";
        }
    }

    // Función para simular la creación de la cuenta
    function mostrarCuentaCreada() {
        const formulario = document.getElementById("formulario-crear-cuenta");
        const mensajeExito = document.getElementById("mensaje-exito-cuenta");

        formulario.reset();
        mensajeExito.textContent = "Cuenta creada correctamente. Redirigiendo al inicio...";
        mensajeExito.hidden = false;

        setTimeout(function() {
            window.location.href = "index.html";
        }, 3000);
    }

})();