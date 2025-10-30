<script setup lang="ts">
import type { Parent, Age } from "./ParentP.vue";

type testProp1 = {
  parent2: Parent[];
  ageTest: Age;
};

defineProps<testProp1>();

const emit1 = defineEmits(["register1"]);
const key = 1;

const register = () => {
  emit1("register1", key);
};
</script>
<template>
  child
  {{ parent2 }}
  {{ ageTest }}
  <button @click="register">send</button>
</template>
<style scoped></style>
