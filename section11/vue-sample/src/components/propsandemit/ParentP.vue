<script setup lang="ts">
import ChildP from "./ChildP.vue";
import { ref, type Ref } from "vue";

export type Parent = {
  Id: number;
  Name: string;
};

const parent1: Ref<Parent[]> = ref([
  { Id: 1, Name: "test1" },
  { Id: 2, Name: "test2" },
]);

export type Age = number;

const ageValue: Age = 25;

const getKey = (key1: number) => {
  console.log("key1:", key1);
};
</script>
<template>
  parent
  <ChildP :parent2="parent1" :age-test="ageValue" @register1="getKey" />
</template>
<style scoped></style>
