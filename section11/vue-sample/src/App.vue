<script setup lang="ts">
// import HelloWorld2 from "./components/HelloWorld2.vue";
import HelloWorld from "./components/HelloWorld.vue";
import Payment from "./components/Payment.vue";
import Persons from "./components/Persons/Persons.vue";
import PersonsP from "./components/Persons/PersonsP.vue";
import ParentP from "./components/propsandemit/ParentP.vue";
import PracticeFunction from "./components/test/practice_function.vue";
import PracticeFunctionP from "./components/test/practice_functionP.vue";
</script>

<template>
  <!-- <div> -->
  <!-- <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a> -->
  <!-- <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a> -->
  <!-- </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!-- <Payment /> -->
  <!-- <HelloWorld /> -->
  <PersonsP />
</template>

<style scoped>
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
