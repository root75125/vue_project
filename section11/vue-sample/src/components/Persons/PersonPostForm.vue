<script setup lang="ts">
import { ref } from "vue";

const inputtingName = ref<string>("");
const inputtingaAge = ref<number>(0);
1;

const emit = defineEmits(["regist-emit"]);
const regist = () => {
  const person = {
    id: Math.random(),
    name: inputtingName,
    age: inputtingaAge,
  };
  emit("regist-emit", person);
};
</script>
<template>
  <input type="text" v-model="inputtingName" />
  <input type="number" v-model="inputtingaAge" />
  <button @click="regist">regist</button>
</template>
<style scoped></style>
