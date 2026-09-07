```
Integrantes: Ignacio Paredes, Marthin Celedon, Facundo Benítez.
```

<img width="120" height="120" alt="Logotipo GameHub" src="images/logo.png">

GameHub Store es el FrontEnd de una tienda gamer online. Construida con HTML5, CSS3 y JavaScript vanilla, sin frameworks ni conexión a backend — los datos de catálogo, categorías, cupones, reseñas y órdenes se cargan desde arreglos JavaScript simulados. (Por el momento).

* **HTML5** — estructura semántica de las 6 vistas obligatorias
* **CSS3** — hoja de estilos externa única, variables de color y Flexbox/Grid
* **JavaScript ES6+** — renderizado por manipulación del DOM, sin librerías

Nuestro sitio está compuesto por 7 vistas navegables, interconectadas por un menú común, las cuales están enumeradas a continuación:

| Vista | Descripción |
|---|---|
| Inicio | Banner, categorías, productos destacados y video embebido |
| Catálogo | Filtros, orden por precio/nombre y paginación |
| Producto | Detalle, galería, reseñas y selector de cantidad |
| Carrito | Líneas editables, cupón y totales, persistente vía `localStorage` |
| Checkout | Datos de despacho, pago simulado y confirmación con número de orden |
| Mis órdenes | Historial de compras con estado y detalle de productos |
| Crear cuenta | Registro simulado, se conecta al backend real en EP3 |

## Requisitos previos

- Navegador web actualizado (Chrome, Firefox, Edge)

## Cómo ejecutar

1. Clona el repositorio
2. Abre `index.html` con Live Preview (extensión de VS Code) o directamente en el navegador
3. Navega entre las vistas desde el menú superior

Vitrina oscura — grises azulados y celeste, pensada para catálogos largos con poca luz.

| Fondo | Superficie | Primario | Acento | Texto | Error |
|---|---|---|---|---|---|
| `#171A21` | `#1B2838` | `#66C0F4` | `#ACD550` | `#C7D5E0` | `#FF6B6B` |


## Estructura de carpetas

```
gamehub-store-frontend/
├── index.html
├── catalogo.html
├── producto.html
├── carrito.html
├── checkout.html
├── mis-ordenes.html
├── crear-cuenta.html
├── css/
│   └── estilos.css
├── js/
│   ├── datos/
│   │   ├── datos-productos.js
│   │   ├── datos-categorias.js
│   │   ├── datos-cupones.js
│   │   ├── datos-resenas.js
│   │   └── datos-ordenes.js
│   ├── vistas/
│   │   ├── vista-inicio.js
│   │   ├── vista-catalogo.js
│   │   ├── vista-producto.js
│   │   ├── vista-carrito.js
│   │   ├── vista-checkout.js
│   │   ├── vista-mis-ordenes.js
│   │   └── vista-crear-cuenta.js
│   ├── carrito.js
│   └── validaciones.js
├── images/
└── README.md
```
