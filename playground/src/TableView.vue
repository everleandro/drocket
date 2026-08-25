<template>
    <section class="table-page">
        <header class="table-page__header">
            <p class="table-page__eyebrow">Components</p>
            <h2 class="table-page__title">Table Examples</h2>
            <p class="table-page__lead">
                ETable renderiza una tabla nativa con paginacion integrada. Define <code>headers</code> una vez y
                pasa <code>items</code>; cada celda puede sobreescribirse con un slot <code>item.&lt;key&gt;</code>.
            </p>
        </header>

        <article class="table-demo">
            <h3>Basico con paginacion</h3>
            <p class="table-demo__caption">
                Con mas filas que <code>itemsPerPage</code> aparecen los controles de paginacion.
            </p>

            <ETable :headers="headers" :items="invoices" :items-per-page="3" v-model:page="page" />
            <p class="table-demo__caption">Pagina actual: <strong>{{ page }}</strong></p>
        </article>

        <article class="table-demo">
            <h3>Elevacion y sin paginacion</h3>
            <p class="table-demo__caption">
                <code>elevation="none"</code> aplana la superficie; <code>hide-pagination</code> muestra todas las
                filas de una vez, util en vistas de detalle.
            </p>

            <EButtonGroup divided>
                <EButton v-for="level in elevations" :key="level" :color="elevation === level ? 'primary' : 'secondary'"
                    @click="elevation = level">
                    {{ level }}
                </EButton>
            </EButtonGroup>

            <ETable :headers="headers" :items="invoices" :elevation="elevation" hide-pagination />
        </article>

        <article class="table-demo">
            <h3>Celdas personalizadas</h3>
            <p class="table-demo__caption">
                El slot <code>item.status</code> reemplaza el texto plano por un <code>EChip</code>, y
                <code>item.amount</code> alinea el monto con estilo propio.
            </p>

            <ETable :headers="statusHeaders" :items="invoices" hide-pagination>
                <template #item.status="{ value }">
                    <EChip :color="statusColor[value]">{{ value }}</EChip>
                </template>
                <template #item.amount="{ value }">
                    <strong>{{ value }}</strong>
                </template>
            </ETable>
        </article>

        <article class="table-demo">
            <h3>Estado vacio</h3>
            <p class="table-demo__caption">Sin <code>items</code> se renderiza el slot <code>empty</code>.</p>

            <ETable :headers="headers" :items="[]" hide-pagination>
                <template #empty>No se encontraron facturas.</template>
            </ETable>
        </article>
    </section>
</template>

<script setup>
import { ref } from "vue";

const headers = [
    { key: "customer", label: "Cliente" },
    { key: "status", label: "Estado" },
    { key: "amount", label: "Monto", align: "end" },
];

const statusHeaders = [...headers];

const statusColor = {
    Activo: "success",
    Pendiente: "warning",
    Cancelado: "error",
};

const invoices = Array.from({ length: 7 }, (_, index) => {
    const base = [
        { customer: "Acme Corp", status: "Activo", amount: "$12,450" },
        { customer: "Globex", status: "Pendiente", amount: "$3,100" },
        { customer: "Initech", status: "Cancelado", amount: "$980" },
    ][index % 3];

    return { id: `INV-${3021 + index}`, ...base };
});

const elevations = ["none", "sm", "md", "lg"];
const elevation = ref("md");
const page = ref(1);
</script>

<style scoped>
.table-page {
    display: grid;
    gap: 20px;
}

.table-page__header {
    display: grid;
    gap: 6px;
}

.table-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.table-page__title {
    margin: 0;
}

.table-page__lead {
    margin: 0;
    opacity: 0.84;
}

.table-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.table-demo h3 {
    margin: 0;
}

.table-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}
</style>
