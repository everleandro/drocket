<template>
<section>
           <!-- Grid más complejo -->
     <EForm>
      <ETextfield v-model="state.localValue" outlined label="Nombre" :rules="[(val) => val.length >= 3 || 'El nombre debe tener al menos 3 caracteres']" :error="state.fieldsChildError[0]" @update:modelValue="(val) => {
        state.localValue = val;
        state.fieldsChildError[0] = val.length < 3;
      }" />
     </EForm>
     <EButton @click="state.localValue = ''" text>Limpiar</EButton>
    </section>
</template>

<script setup>

import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import EForm from "../../src/components/form/form.vue";
import ETextfield from "../../src/components/form/textfield/index.vue";
import ECol from "../../src/components/grid/col.vue";
import ERow from "../../src/components/grid/row.vue";
import iconFactory from "../../src/utils/icons";
import { reactive } from "vue";

const state = reactive({
    localValue: "",
    fieldsChildError: [false]
});


</script>

<style scoped>
</style>
