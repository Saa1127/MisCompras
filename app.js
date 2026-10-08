// ==========================================
// MIS COMPRAS
// JAVASCRIPT
// ==========================================


// DÍAS

const DAYS = [

    {
        id: 0,
        name: "Domingo",
        short: "DOM"
    },

    {
        id: 1,
        name: "Lunes",
        short: "LUN"
    },

    {
        id: 2,
        name: "Martes",
        short: "MAR"
    },

    {
        id: 3,
        name: "Miércoles",
        short: "MIÉ"
    },

    {
        id: 4,
        name: "Jueves",
        short: "JUE"
    },

    {
        id: 5,
        name: "Viernes",
        short: "VIE"
    },

    {
        id: 6,
        name: "Sábado",
        short: "SÁB"
    }

];


// CATEGORÍAS

const CATEGORIES = [

    "Alimentos",
    "Mercado",
    "Frutas y verduras",
    "Carnes y pescados",
    "Panadería",
    "Bebidas",
    "Limpieza",
    "Higiene personal",
    "Farmacia",
    "Ropa y calzado",
    "Hogar",
    "Electrónica",
    "Tecnología",
    "Automóvil",
    "Combustible",
    "Mascotas",
    "Estudio",
    "Restaurantes",
    "Entretenimiento",
    "Regalos",
    "Servicios",
    "Viajes",
    "Otros"

];


// GUARDAR INFORMACIÓN

const STORAGE_KEY =
    "mis_compras_app";


// DATOS

let data =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || {

        budget: 1000000,

        purchases: []

    };


// FILTROS

let selectedDay =
    new Date().getDay();

let selectedCategory =
    "all";

let selectedLocation =
    "all";


// ELEMENTOS

const daysContainer =
    document.getElementById("days");

const shoppingList =
    document.getElementById("shoppingList");

const history =
    document.getElementById("history");

const modal =
    document.getElementById("modal");


// FORMATEAR DINERO

function money(value) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(value || 0);

}


// GUARDAR

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


// ESCAPAR HTML

function escapeHTML(text) {

    return String(text || "")
        .replace(/[&<>"']/g, function(character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return entities[character];

        });

}


// CREAR DÍAS

function createDays() {

    daysContainer.innerHTML = "";

    DAYS.forEach(day => {

        const button =
            document.createElement("button");

        button.className =
            "day-button";

        if (day.id === selectedDay) {

            button.classList.add("active");

        }

        button.innerHTML = `

            <small>
                ${day.short}
            </small>

            <strong>
                ${day.name.substring(0,3)}
            </strong>

        `;

        button.onclick = function() {

            selectedDay =
                day.id;

            render();

        };

        daysContainer.appendChild(button);

    });

}


// CREAR CATEGORÍAS

function createCategories() {

    const select =
        document.getElementById(
            "category"
        );

    const filter =
        document.getElementById(
            "categoryFilter"
        );


    select.innerHTML = "";

    CATEGORIES.forEach(category => {

        select.innerHTML += `

            <option value="${category}">
                ${category}
            </option>

        `;

    });


    filter.innerHTML = `

        <option value="all">
            Todas las categorías
        </option>

    `;


    CATEGORIES.forEach(category => {

        filter.innerHTML += `

            <option value="${category}">
                ${category}
            </option>

        `;

    });


    filter.onchange = function() {

        selectedCategory =
            this.value;

        render();

    };

}


// CREAR DÍAS DEL FORMULARIO

function createFormDays() {

    const select =
        document.getElementById("day");

    select.innerHTML = "";

    DAYS.forEach(day => {

        select.innerHTML += `

            <option value="${day.id}">
                ${day.name}
            </option>

        `;

    });

    select.value =
        selectedDay;

}


// UBICACIONES

function createLocations() {

    const select =
        document.getElementById(
            "locationFilter"
        );

    const locations = [

        ...new Set(

            data.purchases
                .map(item => item.location)
                .filter(Boolean)

        )

    ];


    select.innerHTML = `

        <option value="all">
            Todas las ubicaciones
        </option>

    `;


    locations.forEach(location => {

        select.innerHTML += `

            <option value="${escapeHTML(location)}">
                ${escapeHTML(location)}
            </option>

        `;

    });


    select.value =
        selectedLocation;


    select.onchange = function() {

        selectedLocation =
            this.value;

        render();

    };

}


// OBTENER COMPRAS FILTRADAS

function getFilteredPurchases() {

    return data.purchases.filter(item => {

        return (

            item.day === selectedDay &&

            (
                selectedCategory === "all" ||
                item.category === selectedCategory
            ) &&

            (
                selectedLocation === "all" ||
                item.location === selectedLocation
            )

        );

    });

}


// CREAR TARJETA

function createPurchaseHTML(item) {

    return `

        <article
            class="purchase
            ${item.completed ? "completed" : ""}"
        >

            <button
                class="check"
                onclick="togglePurchase('${item.id}')"
            >

                ${item.completed ? "✓" : ""}

            </button>


            <div>

                <div class="product">

                    ${escapeHTML(item.name)}

                </div>


                <div class="details">

                    ${escapeHTML(item.category)}

                    ·

                    ${escapeHTML(item.location)}

                    ${
                        item.note
                        ?
                        " · " +
                        escapeHTML(item.note)
                        :
                        ""
                    }

                </div>

            </div>


            <div>

                <div class="price">

                    ${money(item.price)}

                </div>


                <button
                    class="delete"
                    onclick="deletePurchase('${item.id}')"
                >

                    ✕

                </button>

            </div>

        </article>

    `;

}


// MOSTRAR COMPRAS

function renderPurchases() {

    const purchases =
        getFilteredPurchases();


    if (purchases.length === 0) {

        shoppingList.innerHTML = `

            <div class="empty">

                No tienes compras para este día.

                <br><br>

                Pulsa
                <b>＋ Agregar</b>
                para crear una.

            </div>

        `;

        return;

    }


    shoppingList.innerHTML =
        purchases
            .map(createPurchaseHTML)
            .join("");

}


// MARCAR COMO REALIZADA

function togglePurchase(id) {

    const purchase =
        data.purchases.find(
            item => item.id === id
        );


    if (!purchase) return;


    purchase.completed =
        !purchase.completed;


    saveData();

    render();

}


// ELIMINAR COMPRA

function deletePurchase(id) {

    const confirmation =
        confirm(
            "¿Deseas eliminar esta compra?"
        );


    if (!confirmation) return;


    data.purchases =
        data.purchases.filter(
            item => item.id !== id
        );


    saveData();

    render();

}


// HISTORIAL

function renderHistory() {

    if (data.purchases.length === 0) {

        history.innerHTML = `

            <div class="history">

                <span>
                    No hay anotaciones todavía.
                </span>

            </div>

        `;

        return;

    }


    history.innerHTML =
        data.purchases
            .slice()
            .reverse()
            .map(item => {

                return `

                    <div class="history">

                        <div>

                            <strong>
                                ${escapeHTML(item.name)}
                            </strong>

                            <small>

                                ${DAYS[item.day].name}

                                ·

                                ${escapeHTML(item.category)}

                                ·

                                ${escapeHTML(item.location)}

                            </small>

                        </div>

                        <strong>

                            ${money(item.price)}

                        </strong>

                    </div>

                `;

            })
            .join("");

}


// ESTADÍSTICAS

function renderStats() {

    const today =
        new Date().getDay();


    const todayPurchases =
        data.purchases.filter(
            item => item.day === today
        );


    const todayTotal =
        todayPurchases.reduce(
            (total, item) =>
                total + item.price,
            0
        );


    const todayPending =
        todayPurchases.filter(
            item => !item.completed
        ).length;


    const totalWeek =
        data.purchases.reduce(
            (total, item) =>
                total + item.price,
            0
        );


    const completedTotal =
        data.purchases
            .filter(item => item.completed)
            .reduce(
                (total, item) =>
                    total + item.price,
                0
            );


    const pendingTotal =
        data.purchases
            .filter(item => !item.completed)
            .reduce(
                (total, item) =>
                    total + item.price,
                0
            );


    document.getElementById(
        "todayTotal"
    ).textContent =
        money(todayTotal);


    document.getElementById(
        "todayPending"
    ).textContent =
        `${todayPending} compras pendientes`;


    document.getElementById(
        "weekTotal"
    ).textContent =
        money(totalWeek);


    document.getElementById(
        "completedTotal"
    ).textContent =
        money(completedTotal);


    document.getElementById(
        "pendingTotal"
    ).textContent =
        money(pendingTotal);


    document.getElementById(
        "summarySpent"
    ).textContent =
        money(completedTotal);


    document.getElementById(
        "average"
    ).textContent =
        money(completedTotal / 7);


    document.getElementById(
        "budget"
    ).textContent =
        money(data.budget);


    const percentage =
        todayPurchases.length === 0
        ?
        0
        :
        Math.round(

            todayPurchases.filter(
                item => item.completed
            ).length
            /
            todayPurchases.length
            *
            100

        );


    document.getElementById(
        "percentage"
    ).textContent =
        percentage + "%";


    document.querySelector(
        ".progress-circle"
    ).style.background = `

        conic-gradient(
            var(--green)
            ${percentage * 3.6}deg,

            #444
            0deg
        )

    `;


    document.getElementById(
        "progressBar"
    ).style.width =
        Math.min(
            100,
            completedTotal /
            (data.budget || 1) *
            100
        ) + "%";

}


// AGREGAR COMPRA

document.getElementById(
    "purchaseForm"
).addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const purchase = {

            id:
                Date.now().toString(),

            name:
                document.getElementById(
                    "name"
                ).value.trim(),

            category:
                document.getElementById(
                    "category"
                ).value,

            day:
                Number(
                    document.getElementById(
                        "day"
                    ).value
                ),

            price:
                Number(
                    document.getElementById(
                        "price"
                    ).value
                ) || 0,

            location:
                document.getElementById(
                    "location"
                ).value.trim()
                ||
                "Sin ubicación",

            note:
                document.getElementById(
                    "note"
                ).value.trim(),

            completed:
                false

        };


        data.purchases.push(
            purchase
        );


        saveData();

        this.reset();

        closeModal();

        render();

    }
);


// ABRIR MODAL

document.getElementById(
    "addButton"
).onclick = function() {

    document.getElementById(
        "day"
    ).value =
        selectedDay;

    modal.classList.remove(
        "hidden"
    );

};


// CERRAR MODAL

function closeModal() {

    modal.classList.add(
        "hidden"
    );

}


document.getElementById(
    "closeModal"
).onclick =
    closeModal;


document.querySelector(
    ".modal-background"
).onclick =
    closeModal;


// BORRAR TODO

document.getElementById(
    "deleteAll"
).onclick = function() {

    if (
        data.purchases.length === 0
    ) return;


    if (
        confirm(
            "¿Eliminar todas las compras?"
        )
    ) {

        data.purchases = [];

        saveData();

        render();

    }

};


// RENDER PRINCIPAL

function render() {

    createDays();

    createLocations();

    renderPurchases();

    renderHistory();

    renderStats();

}


// INICIAR APP

createCategories();

createFormDays();

render();