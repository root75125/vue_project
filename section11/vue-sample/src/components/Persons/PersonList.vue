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
  <!-- <h1>personList</h1> -->
  <li v-for="person in persons" :key="person.id" class="person-list">
    <span>{{ person.name }}</span>
    <span>age:{{ person.age }}</span>
    <button
      style="background-color: white; color: black"
      @click="delete1(person.id)"
    >
      <span>delete</span>
    </button>
  </li>
</template>
<style scoped>
.person-list {
  list-style: none;
  margin-bottom: 12px;
  border-radius: 4px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  background-color: rgb(228, 201, 133);
  padding: 8px 20px;
  width: 300px;
}
</style>
