<script setup lang="ts">
import { ref, computed } from "vue";

const inputtingName = ref<string>("");
const inputtingAge = ref<number>(0);

const emit = defineEmits(["register1"]);

const register = () => {
  const person = {
    id: Math.random(),
    name: inputtingName.value,
    age: inputtingAge.value,
  };
  console.log("person:" + person.name);
  emit("register1", person);
};
</script>
<template>
  <div>
    <span>name:</span>
    <input type="text" v-model="inputtingName" />
  </div>
  <div>
    <span>age:</span>
    <input type="number" v-model="inputtingAge" />
  </div>
  <button @click="register">regist</button>
</template>
<style scoped></style>
