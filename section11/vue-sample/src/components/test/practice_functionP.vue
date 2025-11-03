<script setup lang="ts">
import { ref } from "vue";
const numbers = ref([1, 2, 3, 4, 5]);
const persons = ref([
  { id: 1, name: "test1", age: 1 },
  { id: 2, name: "test2", age: 2 },
  { id: 3, name: "test3", age: 3 },
]);

const inputtingaValue1 = ref<number>(0);
const inputtingValue2 = ref<number>(0);
const total = ref<number>(0);

function addRegular(a: number, b: number) {
  total.value = a + b;
}

const addArrow = (a: number, b: number) => {
  total.value = a + b;
};

function deleteRegular(v: number) {
  numbers.value = numbers.value.filter(function (n) {
    return n !== v;
  });
}

const deleteArrow = (id: number) => {
  persons.value = persons.value.filter((p) => {
    return p.id !== id;
  });
};
</script>
<template>
  <div>
    <input type="number" v-model="inputtingaValue1" />
    <input type="number" v-model="inputtingValue2" />

    <button @click="addRegular(inputtingaValue1,inputtingValue2)">addReg</button>
    <button @click="addArrow(inputtingaValue1,inputtingValue2)">addArr</button>
    <div>
      {{ total }}
    </div>
  </div>
  <hr></hr>
  <div>
    {{ numbers }}
  </div>
  <div>
    {{ persons }}
  </div>
  <button @click="deleteRegular(1)">reg</button>
  <button @click="deleteArrow(1)">arr</button>
</template>
<style scoped></style>
