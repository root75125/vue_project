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
  <div class="form-container">
    <div class="input-container">
      <div class="input-column">
        <span>name:</span>
        <input class="input-name" v-model="inputtingName" />
        <div class="input-column">
          <span>age1:</span>
          <input class="input" v-model="inputtingAge" type="number" />
        </div>
      </div>
    </div>
    <button @click="register">register</button>
  </div>
</template>
<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* .input-column {
  width: 200px;
  display: flex;
} */
</style>
