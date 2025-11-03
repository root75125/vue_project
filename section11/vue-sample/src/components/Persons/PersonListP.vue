<script setup lang="ts">
import { type Person } from "./PersonsP.vue";
type prop = {
  persons: Person[];
};

defineProps<prop>();
const emit = defineEmits(["delete-emit"]);
const deleteT = (id: number) => {
  emit("delete-emit", id);
};
</script>
<template>
  <li v-for="person in persons">
    {{ person.name }}
    {{ person.age }}
    <button @click="deleteT(person.id)">deleteT</button>
  </li>
</template>
<style scoped></style>
