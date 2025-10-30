<script setup lang="ts">
import PersonPostForm from "./PersonPostForm.vue";
import PersonList from "./PersonList.vue";
import { ref, type Ref } from "vue";

export type Person = {
  id: number;
  name: string;
  age: number;
};
const persons: Ref<Person[]> = ref([
  { id: 0, name: "John", age: 24 },
  { id: 1, name: "Mike", age: 27 },
]);

const registerPerson = (person: Person) => {
  persons.value.push(person);
};
const delete2 = (id: number) => {
  persons.value = persons.value.filter((p) => p.id !== id);
};
</script>
<template>
  <h1>Title</h1>
  <div class="container">
    <PersonPostForm @register1="registerPerson" />
    <div class="list-container">
      <ul>
        <PersonList :persons="persons" @delete1="delete2" />
      </ul>
    </div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
