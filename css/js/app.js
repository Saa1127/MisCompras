/* =====================================================
   BASE DE DATOS LOCAL
===================================================== */

let compras = JSON.parse(
    localStorage.getItem("compras")
) || [];

let transferencias = JSON.parse(
    localStorage.getItem("transferencias")
) || [];

let notas = JSON.parse(
    localStorage.getItem("notas")
) || [];


/* =====================================================
   GUARDAR INFORMACIÓN
===================================================== */

function guardarDatos() {

    localStorage.setItem(
        "compras",
        JSON.stringify(compras)
    );

    localStorage.setItem(
        "transferencias",
        JSON.stringify(transferencias)
    );

    localStorage.setItem(
        "notas",
        JSON.stringify(notas)
    );

}


/* =====================================================
   FORMATO DE DINERO
===================================================== */

function dinero(valor) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(Number(valor) || 0);

}


/* =====================================================
   CAMBIAR SECCIÓN
===================================================== */

function mostrarSeccion(seccion) {

    document.querySelectorAll(".seccion")
        .forEach(elemento => {

            elemento.classList.remove("activa");

        });


    document.querySelectorAll(".tab")
        .forEach(elemento => {

            elemento.classList.remove("active");

        });


    const seleccionada =
        document.getElementById(seccion);

    if (seleccionada) {

        seleccionada.classList.add("activa");

    }


    const botones =
        document.querySelectorAll(".tab");

    const nombres = [
        "compras",
        "transferencias",
        "anotaciones",
        "resumen"
    ];

    const posicion =
        nombres.indexOf(seccion);

    if (posicion >= 0) {

        botones[posicion]
            .classList.add("active");

    }

}


/* =====================================================
   MODALES
===================================================== */

function abrirModalCompra() {

    document
        .getElementById("modalCompra")
        .classList.add("show");

}

function abrirModalTransferencia() {

    document
        .getElementById("modalTransferencia")
        .classList.add("show");

}

function abrirModalNota() {

    document
        .getElementById("modalNota")
        .classList.add("show");

}


function cerrarModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}


/* =====================================================
   AGREGAR COMPRA
===================================================== */

document
    .getElementById("formCompra")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const compra = {

                id: Date.now(),

                producto:
                    document
                    .getElementById("producto")
                    .value
                    .trim(),

                categoria:
                    document
                    .getElementById("categoria")
                    .value,

                dia:
                    document
                    .getElementById("dia")
                    .value,

                ubicacion:
                    document
                    .getElementById("ubicacion")
                    .value
                    .trim(),

                precio:
                    Number(
                        document
                        .getElementById("precio")
                        .value
                    ) || 0,

                fecha:
                    document
                    .getElementById("fecha")
                    .value,

                nota:
                    document
                    .getElementById("notaCompra")
                    .value
                    .trim(),

                realizada: false

            };


            compras.push(compra);

            guardarDatos();

            this.reset();

            cerrarModal("modalCompra");

            mostrarCompras();

            actualizarTodo();

        }
    );


/* =====================================================
   MOSTRAR COMPRAS
===================================================== */

function mostrarCompras() {

    const lista =
        document.getElementById("listaCompras");

    lista.innerHTML = "";


    const filtroDia =
        document.getElementById("filtroDia")
        .value;

    const filtroUbicacion =
        document.getElementById("filtroUbicacion")
        .value;

    const filtroEstado =
        document.getElementById("filtroEstado")
        .value;


    let filtradas = compras.filter(compra => {

        const diaCorrecto =
            filtroDia === "todos" ||
            compra.dia === filtroDia;


        const ubicacionCorrecta =
            filtroUbicacion === "todos" ||
            compra.ubicacion === filtroUbicacion;


        let estadoCorrecto = true;


        if (filtroEstado === "pendiente") {

            estadoCorrecto =
                !compra.realizada;

        }


        if (filtroEstado === "realizada") {

            estadoCorrecto =
                compra.realizada;

        }


        return (
            diaCorrecto &&
            ubicacionCorrecta &&
            estadoCorrecto
        );

    });


    if (filtradas.length === 0) {

        lista.innerHTML = `
            <div class="card">
                <p>No hay compras para mostrar.</p>
            </div>
        `;

        actualizarUbicaciones();

        return;
    }


    filtradas.forEach(compra => {

        const elemento =
            document.createElement("div");

        elemento.className =
            `compra ${compra.realizada ? "realizada" : ""}`;


        const precioHTML =
            compra.precio > 0

            ? `<div class="precio">
                    ${dinero(compra.precio)}
               </div>`

            : `<div class="precio sin-precio">
                    Sin precio
               </div>`;


        elemento.innerHTML = `

            <div
                class="check ${compra.realizada ? "activo" : ""}"
                onclick="marcarCompra(${compra.id})"
            >
                ${compra.realizada ? "✓" : ""}
            </div>


            <div>

                <div class="producto-nombre">
                    ${escapeHTML(compra.producto)}
                </div>


                <div class="info-compra">

                    <span class="etiqueta">
                        ${escapeHTML(compra.categoria)}
                    </span>

                    <span class="etiqueta">
                        📅 ${nombreDia(compra.dia)}
                    </span>

                    <span class="etiqueta">
                        📍 ${escapeHTML(compra.ubicacion)}
                    </span>

                </div>


                ${
                    compra.nota
                    ?
                    `<small>
                        ${escapeHTML(compra.nota)}
                    </small>`
                    :
                    ""
                }

            </div>


            ${precioHTML}


            <div class="acciones">

                <button
                    class="btn-icon"
                    onclick="editarPrecio(${compra.id})"
                    title="Cambiar precio"
                >
                    💰
                </button>

                <button
                    class="btn-icon"
                    onclick="eliminarCompra(${compra.id})"
                    title="Eliminar"
                >
                    🗑️
                </button>

            </div>

        `;


        lista.appendChild(elemento);

    });


    actualizarUbicaciones();

}


/* =====================================================
   MARCAR COMPRA
===================================================== */

function marcarCompra(id) {

    const compra =
        compras.find(
            elemento => elemento.id === id
        );


    if (!compra) return;


    compra.realizada =
        !compra.realizada;


    guardarDatos();

    mostrarCompras();

    actualizarTodo();

}


/* =====================================================
   EDITAR PRECIO
===================================================== */

function editarPrecio(id) {

    const compra =
        compras.find(
            elemento => elemento.id === id
        );


    if (!compra) return;


    const nuevoPrecio =
        prompt(
            `Precio de ${compra.producto}:`,
            compra.precio || ""
        );


    if (nuevoPrecio === null) return;


    const numero =
        Number(
            nuevoPrecio.replace(/\D/g, "")
        );


    if (isNaN(numero)) {

        alert("Introduce un precio válido.");

        return;
    }


    compra.precio = numero;


    guardarDatos();

    mostrarCompras();

    actualizarTodo();

}


/* =====================================================
   ELIMINAR COMPRA
===================================================== */

function eliminarCompra(id) {

    const compra =
        compras.find(
            elemento => elemento.id === id
        );


    if (!compra) return;


    const confirmar =
        confirm(
            `¿Eliminar "${compra.producto}"?`
        );


    if (!confirmar) return;


    compras =
        compras.filter(
            elemento => elemento.id !== id
        );


    guardarDatos();

    mostrarCompras();

    actualizarTodo();

}


/* =====================================================
   UBICACIONES
===================================================== */

function actualizarUbicaciones() {

    const select =
        document.getElementById(
            "filtroUbicacion"
        );


    const actual =
        select.value;


    const ubicaciones = [
        ...new Set(
            compras
                .map(compra => compra.ubicacion)
                .filter(Boolean)
        )
    ];


    select.innerHTML =
        `<option value="todos">
            Todas las ubicaciones
        </option>`;


    ubicaciones.forEach(ubicacion => {

        const option =
            document.createElement("option");

        option.value = ubicacion;

        option.textContent =
            "📍 " + ubicacion;

        select.appendChild(option);

    });


    if (
        ubicaciones.includes(actual)
    ) {

        select.value = actual;

    }

}


/* =====================================================
   TRANSFERENCIAS
===================================================== */

document
    .getElementById("formTransferencia")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const transferencia = {

                id: Date.now(),

                tipo:
                    document
                    .getElementById(
                        "tipoTransferencia"
                    ).value,

                concepto:
                    document
                    .getElementById(
                        "conceptoTransferencia"
                    ).value
                    .trim(),

                persona:
                    document
                    .getElementById(
                        "personaTransferencia"
                    ).value
                    .trim(),

                monto:
                    Number(
                        document
                        .getElementById(
                            "montoTransferencia"
                        ).value
                    ) || 0,

                fecha:
                    document
                    .getElementById(
                        "fechaTransferencia"
                    ).value

            };


            transferencias.push(
                transferencia
            );


            guardarDatos();

            this.reset();

            cerrarModal(
                "modalTransferencia"
            );

            mostrarTransferencias();

            actualizarTodo();

        }
    );


function mostrarTransferencias() {

    const lista =
        document.getElementById(
            "listaTransferencias"
        );


    lista.innerHTML = "";


    if (transferencias.length === 0) {

        lista.innerHTML = `
            <div class="card">
                <p>No tienes transferencias registradas.</p>
            </div>
        `;

        return;

    }


    const ordenadas =
        [...transferencias]
        .sort(
            (a,b) => b.id - a.id
        );


    ordenadas.forEach(transferencia => {

        const elemento =
            document.createElement("div");


        elemento.className =
            `transferencia ${transferencia.tipo}`;


        const signo =
            transferencia.tipo === "enviada"
            ? "-"
            : "+";


        const icono =
            transferencia.tipo === "enviada"
            ? "📤"
            : "📥";


        elemento.innerHTML = `

            <div class="transferencia-info">

                <strong>
                    ${icono}
                    ${escapeHTML(
                        transferencia.concepto
                    )}
                </strong>

                <small>
                    ${escapeHTML(
                        transferencia.persona || "Sin persona"
                    )}

                    ${
                        transferencia.fecha
                        ? " · " + transferencia.fecha
                        : ""
                    }

                </small>

            </div>


            <div>

                <span class="monto">

                    ${signo}
                    ${dinero(transferencia.monto)}

                </span>


                <button
                    class="btn-icon"
                    onclick="eliminarTransferencia(${transferencia.id})"
                >
                    🗑️
                </button>

            </div>

        `;


        lista.appendChild(elemento);

    });

}


function eliminarTransferencia(id) {

    if (
        !confirm(
            "¿Eliminar esta transferencia?"
        )
    ) return;


    transferencias =
        transferencias.filter(
            elemento => elemento.id !== id
        );


    guardarDatos();

    mostrarTransferencias();

    actualizarTodo();

}


/* =====================================================
   ANOTACIONES
===================================================== */

document
    .getElementById("formNota")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nota = {

                id: Date.now(),

                titulo:
                    document
                    .getElementById(
                        "tituloNota"
                    ).value
                    .trim(),

                texto:
                    document
                    .getElementById(
                        "textoNota"
                    ).value
                    .trim(),

                fecha:
                    new Date()
                    .toLocaleDateString(
                        "es-CO"
                    )

            };


            notas.push(nota);


            guardarDatos();

            this.reset();

            cerrarModal("modalNota");

            mostrarNotas();

        }
    );


function mostrarNotas() {

    const lista =
        document.getElementById(
            "listaNotas"
        );


    lista.innerHTML = "";


    if (notas.length === 0) {

        lista.innerHTML = `
            <div class="card">
                <p>No tienes anotaciones.</p>
            </div>
        `;

        return;

    }


    [...notas]
        .reverse()
        .forEach(nota => {

            const elemento =
                document.createElement("div");


            elemento.className =
                "nota";


            elemento.innerHTML = `

                <div class="nota-header">

                    <h3>
                        ${escapeHTML(
                            nota.titulo
                        )}
                    </h3>

                    <button
                        class="btn-icon"
                        onclick="eliminarNota(${nota.id})"
                    >
                        🗑️
                    </button>

                </div>


                <p>
                    ${escapeHTML(
                        nota.texto
                    )}
                </p>


                <small>
                    ${nota.fecha}
                </small>

            `;


            lista.appendChild(elemento);

        });

}


function eliminarNota(id) {

    if (
        !confirm(
            "¿Eliminar esta anotación?"
        )
    ) return;


    notas =
        notas.filter(
            elemento => elemento.id !== id
        );


    guardarDatos();

    mostrarNotas();

}


/* =====================================================
   ACTUALIZAR RESUMEN
===================================================== */

function actualizarResumen() {

    const gastoCompras =
        compras.reduce(
            (total, compra) =>
                total + Number(compra.precio || 0),
            0
        );


    const enviado =
        transferencias
        .filter(
            transferencia =>
                transferencia.tipo === "enviada"
        )
        .reduce(
            (total, transferencia) =>
                total +
                Number(
                    transferencia.monto || 0
                ),
            0
        );


    const recibido =
        transferencias
        .filter(
            transferencia =>
                transferencia.tipo === "recibida"
        )
        .reduce(
            (total, transferencia) =>
                total +
                Number(
                    transferencia.monto || 0
                ),
            0
        );


    const gastoTotal =
        gastoCompras + enviado;


    const balance =
        recibido - gastoTotal;


    document.getElementById(
        "gastoTotal"
    ).textContent =
        dinero(gastoCompras);


    document.getElementById(
        "totalEnviado"
    ).textContent =
        dinero(enviado);


    document.getElementById(
        "totalRecibido"
    ).textContent =
        dinero(recibido);


    document.getElementById(
        "resumenCompras"
    ).textContent =
        dinero(gastoCompras);


    document.getElementById(
        "resumenEnviado"
    ).textContent =
        dinero(enviado);


    document.getElementById(
        "resumenRecibido"
    ).textContent =
        dinero(recibido);


    document.getElementById(
        "resumenBalance"
    ).textContent =
        dinero(balance);


    document.getElementById(
        "saldo"
    ).textContent =
        dinero(balance);


    calcularGastoHoy();

    calcularGastosPorDia();

}


/* =====================================================
   GASTO DEL DÍA
===================================================== */

function calcularGastoHoy() {

    const hoy =
        new Date()
        .toISOString()
        .split("T")[0];


    const gasto =
        compras
        .filter(
            compra =>
                compra.fecha === hoy
        )
        .reduce(
            (total, compra) =>
                total +
                Number(compra.precio || 0),
            0
        );


    document.getElementById(
        "gastoHoy"
    ).textContent =
        dinero(gasto);

}


/* =====================================================
   GASTO POR DÍA
===================================================== */

function calcularGastosPorDia() {

    const dias = [

        ["lunes", "Lunes"],
        ["martes", "Martes"],
        ["miercoles", "Miércoles"],
        ["jueves", "Jueves"],
        ["viernes", "Viernes"],
        ["sabado", "Sábado"],
        ["domingo", "Domingo"]

    ];


    const contenedor =
        document.getElementById(
            "gastosPorDia"
        );


    contenedor.innerHTML = "";


    dias.forEach(dia => {

        const total =
            compras
            .filter(
                compra =>
                    compra.dia === dia[0]
            )
            .reduce(
                (suma, compra) =>
                    suma +
                    Number(
                        compra.precio || 0
                    ),
                0
            );


        contenedor.innerHTML += `

            <div class="dia-resumen">

                <span>
                    ${dia[1]}
                </span>

                <strong>
                    ${dinero(total)}
                </strong>

            </div>

        `;

    });

}


/* =====================================================
   NOMBRE DEL DÍA
===================================================== */

function nombreDia(dia) {

    const dias = {

        lunes: "Lunes",
        martes: "Martes",
        miercoles: "Miércoles",
        jueves: "Jueves",
        viernes: "Viernes",
        sabado: "Sábado",
        domingo: "Domingo"

    };


    return dias[dia] || dia;

}


/* =====================================================
   SEGURIDAD HTML
===================================================== */

function escapeHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   ACTUALIZAR TODO
===================================================== */

function actualizarTodo() {

    mostrarCompras();

    mostrarTransferencias();

    mostrarNotas();

    actualizarResumen();

}


/* =====================================================
   INICIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const hoy =
            new Date()
            .toISOString()
            .split("T")[0];


        document.getElementById(
            "fecha"
        ).value = hoy;


        document.getElementById(
            "fechaTransferencia"
        ).value = hoy;


        actualizarTodo();

    }
);