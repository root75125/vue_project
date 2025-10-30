<script setup lang="ts">
import type { Parentv, Age } from "./Parent.vue";

type PropsTest1 = {
  parents2: Parentv[];
  ageTest: Age;
};

const key = 1;

const emit1 = defineEmits(["register1"]);

// type PropsTest2 = {};

defineProps<PropsTest1>();
const register = () => {
  emit1("register1", key);
};
// defineProps<PropsTest2>();
</script>
<template>
  child
  {{ parents2 }}
  {{ ageTest }}
  <button @click="register">send</button>
</template>
<style scoped></style>
