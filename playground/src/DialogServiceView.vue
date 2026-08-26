<template>
    <section class="dialog-page">
        <header class="dialog-page__header">
            <p class="dialog-page__eyebrow">Components</p>
            <h2 class="dialog-page__title">Dialog Service Examples</h2>
            <p class="dialog-page__lead">
                <code>useDialog()</code> expone <code>alert()</code>, <code>confirm()</code> y <code>prompt()</code>,
                cada una devuelve una <code>Promise</code>. Solo hay un dialogo activo a la vez; el contenido se
                arma con <code>ECard</code> (title/description/footer) dentro de <code>EDialog</code>.
            </p>
        </header>

        <article class="dialog-demo">
            <h3>Alert</h3>
            <p class="dialog-demo__caption">Resuelve la promesa (sin valor) cuando el usuario confirma.</p>

            <EButton @click="runAlert">Mostrar alert</EButton>
        </article>

        <article class="dialog-demo">
            <h3>Confirm</h3>
            <p class="dialog-demo__caption">
                Resuelve <code>true</code>/<code>false</code> segun el boton que haga click el usuario.
            </p>

            <EButton color="error" @click="runConfirm">Eliminar factura</EButton>
            <p class="dialog-demo__caption">Resultado: <strong>{{ confirmResult }}</strong></p>
        </article>

        <article class="dialog-demo">
            <h3>Prompt</h3>
            <p class="dialog-demo__caption">
                Resuelve el texto ingresado, o <code>null</code> si el usuario cancela.
            </p>

            <EButton color="primary" @click="runPrompt">Renombrar proyecto</EButton>
            <p class="dialog-demo__caption">Resultado: <strong>{{ promptResult }}</strong></p>
        </article>

        <article class="dialog-demo">
            <h3>Encolado</h3>
            <p class="dialog-demo__caption">
                Solo se muestra un dialogo a la vez; el resto espera en cola y aparece al resolver el anterior.
            </p>

            <EButton @click="runQueued">Disparar 3 confirms</EButton>
            <p class="dialog-demo__caption">Resultados: <strong>{{ queuedResults }}</strong></p>
        </article>
    </section>
</template>

<script setup>
import { ref } from "vue";
import { useDialog } from "../../src";

const dialog = useDialog();
const confirmResult = ref("ninguno");
const promptResult = ref("ninguno");
const queuedResults = ref("ninguno");

const runAlert = async () => {
    await dialog.alert({ title: "Cambios guardados", message: "Tu factura fue actualizada correctamente." });
};

const runConfirm = async () => {
    const result = await dialog.confirm({
        title: "Eliminar factura",
        message: "Esta accion no se puede deshacer.",
        confirmButton: { label: "Eliminar", color: "error" },
    });
    confirmResult.value = String(result);
};

const runPrompt = async () => {
    const result = await dialog.prompt({
        title: "Renombrar proyecto",
        message: "Ingresa el nuevo nombre.",
        placeholder: "Nombre del proyecto",
        defaultValue: "Incoming Dashboard",
    });
    promptResult.value = result === null ? "cancelado" : result;
};

const runQueued = async () => {
    const results = await Promise.all([
        dialog.confirm("Primero"),
        dialog.confirm("Segundo"),
        dialog.confirm("Tercero"),
    ]);
    queuedResults.value = results.join(", ");
};
</script>

<style scoped>
.dialog-page {
    display: grid;
    gap: 20px;
}

.dialog-page__header {
    display: grid;
    gap: 6px;
}

.dialog-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.dialog-page__title {
    margin: 0;
}

.dialog-page__lead {
    margin: 0;
    opacity: 0.84;
}

.dialog-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.dialog-demo h3 {
    margin: 0;
}

.dialog-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}
</style>
