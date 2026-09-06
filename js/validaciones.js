(function() {

    // Función para validar que un campo no esté vacío
    function validarCampoObligatorio(valor) {
        if(!valor || valor.trim() === "") {
            return { valido: false, mensaje: "Este campo es obligatorio" };
        }
        return { valido: true, mensaje: "" };
    }

    // Función para validar el formato de un correo electrónico
    function validarFormatoCorreo(correo) {
        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!patronCorreo.test(correo)) {
            return { valido: false, mensaje: "Ingresa un correo con formato válido" };
        }
        return { valido: true, mensaje: "" };
    }

    // Función para validar que un teléfono sea numérico y tenga el largo definido
    function validarTelefono(telefono, largoEsperado) {
        if(largoEsperado === undefined) {
            largoEsperado = 9;
        }
        const soloNumeros = /^[0-9]+$/;
        if(!soloNumeros.test(telefono) || telefono.length !== largoEsperado) {
            return { valido: false, mensaje: "El teléfono debe tener " + largoEsperado + " dígitos numéricos" };
        }
        return { valido: true, mensaje: "" };
    }

    // Función para validar la longitud mínima de una contraseña
    function validarLongitudContrasena(contrasena, minimo) {
        if(minimo === undefined) {
            minimo = 8;
        }
        if(contrasena.length < minimo) {
            return { valido: false, mensaje: "La contraseña debe tener al menos " + minimo + " caracteres" };
        }
        return { valido: true, mensaje: "" };
    }

    // Función para validar que dos contraseñas coincidan
    function validarCoincidenciaContrasenas(contrasena, confirmacion) {
        if(contrasena !== confirmacion) {
            return { valido: false, mensaje: "Las contraseñas no coinciden" };
        }
        return { valido: true, mensaje: "" };
    }

    // Función para validar el formulario completo de checkout
    function validarFormularioCheckout(datos) {
        const errores = {};

        const nombre = validarCampoObligatorio(datos.nombre);
        if(!nombre.valido) {
            errores.nombre = nombre.mensaje;
        }

        const correo = validarCampoObligatorio(datos.correo);
        if(!correo.valido) {
            errores.correo = correo.mensaje;
        } else {
            const formatoCorreo = validarFormatoCorreo(datos.correo);
            if(!formatoCorreo.valido) {
                errores.correo = formatoCorreo.mensaje;
            }
        }

        const telefono = validarCampoObligatorio(datos.telefono);
        if(!telefono.valido) {
            errores.telefono = telefono.mensaje;
        } else {
            const formatoTelefono = validarTelefono(datos.telefono);
            if(!formatoTelefono.valido) {
                errores.telefono = formatoTelefono.mensaje;
            }
        }

        const region = validarCampoObligatorio(datos.region);
        if(!region.valido) {
            errores.region = region.mensaje;
        }

        const comuna = validarCampoObligatorio(datos.comuna);
        if(!comuna.valido) {
            errores.comuna = comuna.mensaje;
        }

        const direccion = validarCampoObligatorio(datos.direccion);
        if(!direccion.valido) {
            errores.direccion = direccion.mensaje;
        }

        return {
            valido: Object.keys(errores).length === 0,
            errores: errores
        };
    }

    // Función para validar el formulario completo de crear cuenta
    function validarFormularioCrearCuenta(datos) {
        const errores = {};

        const nombre = validarCampoObligatorio(datos.nombre);
        if(!nombre.valido) {
            errores.nombre = nombre.mensaje;
        }

        const correo = validarCampoObligatorio(datos.correo);
        if(!correo.valido) {
            errores.correo = correo.mensaje;
        } else {
            const formatoCorreo = validarFormatoCorreo(datos.correo);
            if(!formatoCorreo.valido) {
                errores.correo = formatoCorreo.mensaje;
            }
        }

        const contrasena = validarCampoObligatorio(datos.contrasena);
        if(!contrasena.valido) {
            errores.contrasena = contrasena.mensaje;
        } else {
            const longitudContrasena = validarLongitudContrasena(datos.contrasena);
            if(!longitudContrasena.valido) {
                errores.contrasena = longitudContrasena.mensaje;
            }
        }

        const confirmacion = validarCoincidenciaContrasenas(datos.contrasena, datos.confirmarContrasena);
        if(!confirmacion.valido) {
            errores.confirmarContrasena = confirmacion.mensaje;
        }

        return {
            valido: Object.keys(errores).length === 0,
            errores: errores
        };
    }

    window.validarCampoObligatorio = validarCampoObligatorio;
    window.validarFormatoCorreo = validarFormatoCorreo;
    window.validarTelefono = validarTelefono;
    window.validarLongitudContrasena = validarLongitudContrasena;
    window.validarCoincidenciaContrasenas = validarCoincidenciaContrasenas;
    window.validarFormularioCheckout = validarFormularioCheckout;
    window.validarFormularioCrearCuenta = validarFormularioCrearCuenta;

})();