<script setup lang="ts">
import PersonPostFormP from "./PersonPostFormP.vue";
import PersonListP from "./PersonListP.vue";
import { ref, type Ref } from "vue";

export type Person = {
  id: number;
  name: string;
  age: number;
};

const persons: Ref<Person[]> = ref([
  { id: 0, name: "test1", age: 21 },
  { id: 1, name: "test2", age: 22 },
]);

const registerPerson = (person: Person) => {
  persons.value.push(person);
};

const delete2 = (id: number) => {
  persons.value = persons.value.filter((p) => p.id !== id);
};
</script>
<template>
  <PersonPostFormP @register1="registerPerson" />
  <PersonListP :persons="persons" @delete1="delete2" />
</template>
<style scoped></style>
