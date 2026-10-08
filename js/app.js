// ========================================
// MIS COMPRAS
// Aplicación de compras semanales
// ========================================


// Días de la semana

const nombresDias = {

    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado",
    domingo: "Domingo"

};


// Iconos por categoría

const iconos = {

    mercado: "🛒",
    comida: "🍔",
    transporte: "🚗",
    hogar: "🏠",
    farmacia: "💊",
    ropa: "👕",
    tecnologia: "📱",
    otros: "📦"

};


// ========================================
// DATOS
// ========================================

let compras = JSON.parse(
    localStorage.getItem("misCompras")
) || [

    {
        id: 1,
        producto: "Mercado semanal",
        categoria: "mercado",
        valor: 85000,
        descripcion: "Comprar alimentos para la semana",
        lugar: "Supermercado",
        ubicacion: "Cali",
        dia: "lunes",
        recordatorio: true,
        completado: false
    },

    {
        id: 2,
        producto: "Gasolina",
        categoria: "transporte",
        valor: 70000,
        descripcion: "Tanque del vehículo",
        lugar: "Estación de servicio",
        ubicacion: "Cali",
        dia: "miercoles",
        recordatorio: true,
        completado: false
    },

    {
        id: 3,
        producto: "Almuerzo",
        categoria: "comida",
        valor: 18000,
        descripcion: "Almuerzo del día",
        lugar: "Restaurante",
        ubicacion: "Cali",
        dia: "viernes",
        recordatorio: false,
        completado: true
    }

];


// Día seleccionado

let diaSeleccionado = "lunes";


// ========================================
// ELEMENTOS HTML
// ========================================

const listaCompras =
    document.getElementById("listaCompras");

const sinCompras =
    document.getElementById("sinCompras");

const nombreDia =
    document.getElementById("nombreDia");

const totalDia =
    document.getElementById("totalDia");

const cantidadCompras =
    document.getElementById("cantidadCompras");

const modal =
    document.getElementById("modal");

const formCompra =
    document.getElementById("formCompra");


// ========================================
// GUARDAR DATOS
// ========================================

function guardarDatos() {

    localStorage.setItem(
        "misCompras",
        JSON.stringify(compras)
    );

}


// ========================================
// FORMATO DE DINERO
// ========================================

function formatoPesos(valor) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(valor);

}


// ========================================
// MOSTRAR COMPRAS
// ========================================

function mostrarCompras() {

    listaCompras.innerHTML = "";

    const comprasDelDia = compras.filter(
        compra => compra.dia === diaSeleccionado
    );


    nombreDia.textContent =
        nombresDias[diaSeleccionado];


    cantidadCompras.textContent =
        comprasDelDia.length;


    const total = comprasDelDia.reduce(
        (suma, compra) =>
            suma + Number(compra.valor),
        0
    );


    totalDia.textContent =
        formatoPesos(total);


    if (comprasDelDia.length === 0) {

        sinCompras.style.display = "block";

        return;

    }


    sinCompras.style.display = "none";


    comprasDelDia.forEach(compra => {

        const elemento =
            document.createElement("div");

        elemento.className = "compra";


        elemento.innerHTML = `

            <div class="icono-compra">

                ${iconos[compra.categoria] || "📦"}

            </div>


            <div class="info-compra">

                <h3>
                    ${compra.producto}
                </h3>

                <p>
                    ${compra.descripcion || "Sin descripción"}
                </p>

                <p>
                    📍 ${compra.lugar || "Sin lugar"}
                </p>

                <p>
                    📌 ${compra.ubicacion || "Sin ubicación"}
                </p>

                <div class="precio">
                    ${formatoPesos(compra.valor)}
                </div>


                <span class="
                    estado
                    ${compra.completado ? "completado" : ""}
                ">

                    ${
                        compra.completado
                        ? "✓ Comprado"
                        : "Pendiente"
                    }

                </span>

            </div>


            <button
                class="
                    btn-check
                    ${compra.completado ? "completado" : ""}
                "
                onclick="cambiarEstado(${compra.id})"
            >

                ${compra.completado ? "✓" : ""}

            </button>

        `;


        listaCompras.appendChild(elemento);

    });

}


// ========================================
// CAMBIAR ESTADO
// ========================================

function cambiarEstado(id) {

    const compra =
        compras.find(
            compra => compra.id === id
        );


    if (!compra) return;


    compra.completado =
        !compra.completado;


    guardarDatos();

    mostrarCompras();

}


// ========================================
// SELECCIONAR DÍA
// ========================================

document.querySelectorAll(".dia")
.forEach(boton => {

    boton.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".dia")
                .forEach(btn =>
                    btn.classList.remove("activo")
                );


            boton.classList.add("activo");


            diaSeleccionado =
                boton.dataset.dia;


            mostrarCompras();

        }
    );

});


// ========================================
// ABRIR MODAL
// ========================================

function abrirFormulario() {

    modal.classList.add("visible");

    document.getElementById("diaCompra").value =
        diaSeleccionado;

}


// ========================================
// CERRAR MODAL
// ========================================

document
    .getElementById("cerrarModal")
    .addEventListener(
        "click",
        () => {

            modal.classList.remove("visible");

        }
    );


// Botón +

document
    .getElementById("btnAgregar")
    .addEventListener(
        "click",
        abrirFormulario
    );


// ========================================
// GUARDAR NUEVA COMPRA
// ========================================

formCompra.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const nuevaCompra = {

            id: Date.now(),

            producto:
                document.getElementById("producto").value,

            categoria:
                document.getElementById("categoria").value,

            valor:
                Number(
                    document.getElementById("valor").value
                ),

            descripcion:
                document.getElementById("descripcion").value,

            lugar:
                document.getElementById("lugar").value,

            ubicacion:
                document.getElementById("ubicacion").value,

            dia:
                document.getElementById("diaCompra").value,

            recordatorio:
                document.getElementById("recordatorio").checked,

            completado: false

        };


        compras.push(nuevaCompra);


        guardarDatos();


        formCompra.reset();


        modal.classList.remove("visible");


        diaSeleccionado =
            nuevaCompra.dia;


        document
            .querySelectorAll(".dia")
            .forEach(btn => {

                btn.classList.remove("activo");

                if (
                    btn.dataset.dia ===
                    diaSeleccionado
                ) {

                    btn.classList.add("activo");

                }

            });


        mostrarCompras();

    }
);


// ========================================
// UBICACIÓN
// ========================================

document
    .getElementById("btnUbicacion")
    .addEventListener(
        "click",
        () => {

            if (!navigator.geolocation) {

                alert(
                    "Tu navegador no permite obtener la ubicación."
                );

                return;

            }


            navigator.geolocation.getCurrentPosition(

                position => {

                    const lat =
                        position.coords.latitude;

                    const lon =
                        position.coords.longitude;


                    document.getElementById(
                        "ubicacion"
                    ).value =
                        `${lat}, ${lon}`;

                },

                error => {

                    alert(
                        "No fue posible obtener tu ubicación."
                    );

                }

            );

        }
    );


// ========================================
// CERRAR MODAL AL TOCAR AFUERA
// ========================================

modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            modal.classList.remove("visible");

        }

    }
);


// ========================================
// INICIAR APLICACIÓN
// ========================================

mostrarCompras();

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registrado correctamente");
            })
            .catch(error => {
                console.error(
                    "Error registrando Service Worker:",
                    error
                );
            });

    });

}