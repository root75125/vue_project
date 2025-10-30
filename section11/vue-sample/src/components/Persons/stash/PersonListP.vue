<script setup lang="ts">
import type { Person } from "./Persons.vue";
type Props = {
  persons: Person[];
};
defineProps<Props>();
const emit = defineEmits(["delete1"]);

const delete1 = (id: number) => {
  if (confirm("Delete")) {
    emit("delete1", id);
  }
};
</script>
<template>
  <li v-for="person in persons" :key="person.id">
    <span>{{ person.name }}</span>
    <span>age:{{ person.age }}</span>
    <button @click="delete1(person.id)"><span>delete</span></button>
  </li>
</template>
<style scoped></style>
