<template>
    <section class="snackbar-page">
        <header class="snackbar-page__header">
            <p class="snackbar-page__eyebrow">Components</p>
            <h2 class="snackbar-page__title">Snackbar Examples</h2>
            <p class="snackbar-page__lead">
                <code>useSnackbar()</code> encola mensajes sobre el <code>ESnackbarContainer</code> montado una vez
                en <code>Layout.vue</code>. Cada variante resuelve <code>color</code> igual que <code>ECard</code>/
                <code>EChip</code>.
            </p>
        </header>

        <article class="snackbar-demo">
            <h3>Variantes basicas</h3>
            <p class="snackbar-demo__caption">Cada boton dispara un mensaje con auto-dismiss (4s por defecto).</p>

            <EButtonGroup divided>
                <EButton color="success" @click="snackbar.success('Cambios guardados correctamente')">Success</EButton>
                <EButton color="error" @click="snackbar.error('No se pudo completar la accion')">Error</EButton>
                <EButton color="warning" @click="snackbar.warning('Revisa los campos antes de continuar')">Warning
                </EButton>
                <EButton color="secondary" @click="snackbar.info('Hay una nueva version disponible')">Info</EButton>
            </EButtonGroup>
        </article>

        <article class="snackbar-demo">
            <h3>Titulo, icono y accion</h3>
            <p class="snackbar-demo__caption">
                <code>show()</code> extiende las props de <code>ECard</code>, asi que acepta <code>title</code>,
                <code>prependIcon</code> y una <code>action</code> con boton propio; al hacer click en la accion el
                mensaje se descarta automaticamente.
            </p>

            <EButton color="primary" @click="showWithAction">Eliminar factura</EButton>
            <p class="snackbar-demo__caption">Ultima accion: <strong>{{ lastAction }}</strong></p>
        </article>

        <article class="snackbar-demo">
            <h3>Message en el slot default y cierre en prepend</h3>
            <p class="snackbar-demo__caption">
                <code>message</code> se renderiza dentro del slot default de <code>ECard</code> (en vez del prop
                <code>description</code>), y <code>closeSlot: 'prepend'</code> mueve el boton de cierre al inicio.
            </p>

            <EButton @click="showWithMessageSlot">Mensaje en slot default</EButton>
        </article>

        <article class="snackbar-demo">
            <h3>Persistente y posicion por mensaje</h3>
            <p class="snackbar-demo__caption">
                <code>timeout: false</code> desactiva el auto-dismiss (se cierra con el boton). <code>position</code>
                sobreescribe la posicion global solo para ese mensaje.
            </p>

            <EButtonGroup divided>
                <EButton @click="showPersistent">Persistente (bottom-end)</EButton>
                <EButton @click="showTopStart">Posicion top-start</EButton>
            </EButtonGroup>
        </article>

        <article class="snackbar-demo">
            <h3>Limite de cola visible</h3>
            <p class="snackbar-demo__caption">
                <code>maxVisible</code> (config global de <code>install()</code>) limita cuantos se muestran a la
                vez; el resto aparece a medida que se cierran los anteriores.
            </p>

            <EButton @click="showBurst">Disparar 6 mensajes</EButton>
        </article>

        <article class="snackbar-demo">
            <h3>Limpiar</h3>
            <p class="snackbar-demo__caption">Cierra todos los mensajes activos, en cualquier posicion.</p>

            <EButton text color="secondary" @click="snackbar.clear()">Cerrar todos</EButton>
        </article>
    </section>
</template>

<script setup>
import { ref } from "vue";
import { useSnackbar } from "../../src";
import iconFactory from "./icons.ts";

const snackbar = useSnackbar();
const lastAction = ref("ninguna");

const showWithAction = () => {
    snackbar.show({
        title: "Factura eliminada",
        description: "INV-3021 se movio a la papelera.",
        color: "success",
        prependHeaderIcon: iconFactory.trash,
        timeout: false,
        action: {
            label: "Deshacer",
            tonal:false,
            onClick: () => {
                lastAction.value = "deshacer INV-3021";
            },
        },
    });
};

const showPersistent = () => {
    snackbar.show({
        title: "Sincronizando",
        description: "Esto puede tardar unos minutos.",
        timeout: false,
    });
};

const showTopStart = () => {
    snackbar.show({
        description: "Mensaje anclado en top-start",
        position: "top-start",
    });
};

const showWithMessageSlot = () => {
    snackbar.show({
        title: "Nuevo comentario",
        message: "Ana Gomez comento en la factura INV-3021.",
        closeSlot: "prepend",
    });
};

const showBurst = () => {
    ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis"].forEach((label, index) => {
        snackbar.show({ message: `Mensaje ${label}`, timeout: 3000 + index * 1000 });
    });
};
</script>

<style scoped>
.snackbar-page {
    display: grid;
    gap: 20px;
}

.snackbar-page__header {
    display: grid;
    gap: 6px;
}

.snackbar-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.snackbar-page__title {
    margin: 0;
}

.snackbar-page__lead {
    margin: 0;
    opacity: 0.84;
}

.snackbar-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.snackbar-demo h3 {
    margin: 0;
}

.snackbar-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}
</style>
