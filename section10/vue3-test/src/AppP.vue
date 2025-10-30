<template>
  <div>AppP</div>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <!-- ここから修正ポイント -->
    <router-link to="/children-p">childrenP</router-link> |
    <router-link to="/function-test-p">function-test-p</router-link> | |
    <router-link to="/props-test-p">props</router-link> |
    <router-link to="/check-box-all-check-p">checkboxAllCheckP</router-link>|
    <router-link to="/test">Test</router-link>|
    <router-link to="/test2">Test2</router-link>
    <!-- ここまで修正ポイント -->
  </nav>
  <!-- ここから修正ポイント -->
  <router-view />
  <!-- ここまで修正ポイント -->
</template>
<script>
// ここから修正ポイント
import { provide } from "vue";
export default {
  setup() {
    provide("message", "hello");
  },
};
// provide("userName", "test");
//ここまで修正ポイント
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
