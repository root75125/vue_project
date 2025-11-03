<script setup lang="ts">
import PersonListP from "./PersonListP.vue";
import PersonPostFormP from "./PersonPostFormP.vue";
import { ref, type Ref } from "vue";

export type Person = {
  id: number;
  name: string;
  age: number;
};

const persons: Ref<Person[]> = ref([
  { id: 1, name: "test1", age: 1 },
  { id: 2, name: "test2", age: 2 },
]);

const regist = (person: Person) => {
  persons.value.push(person);
};

const deleteT = (id: number) => {
  persons.value = persons.value.filter((p) => {
    return p.id !== id;
  });
};
</script>
<template>
  <PersonPostFormP @regist-emit="regist" />
  <PersonListP :persons="persons" @delete-emit="deleteT" />
</template>
<style scoped></style>
