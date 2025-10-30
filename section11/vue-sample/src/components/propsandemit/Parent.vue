<script setup lang="ts">
import Child from "./Child.vue";
import { ref, type Ref } from "vue";
export type Parentv = {
  id: number;
  name: string;
};
const parents1: Ref<Parentv[]> = ref([
  { id: 1, name: "test" },
  { id: 2, name: "test2" },
]);
export type Age = number;
const ageValue: Age = 25;
const getKey = (key1: number) => {
  console.log("key:", key1);
};
</script>
<template>
  parent
  <div>
    <Child :parents2="parents1" :age-test="ageValue" @register1="getKey" />
  </div>
</template>
<style scoped></style>
