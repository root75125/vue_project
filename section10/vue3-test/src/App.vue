<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/children">Children</router-link> |
    <router-link to="/composition-test">Composition</router-link> |
    <router-link to="/props-emit-test">PropsEmit</router-link> |
    <router-link to="/function-test">Function</router-link> |
  </nav>
  <router-view :setupBooks="setupBooks" @custom-event="parentMethod" />
</template>
<script>
import { reactive, provide } from "vue";
export default {
  setup() {
    provide(/* key */ "message", /* value */ "hello!");
    const setupBooks = reactive([
      {
        title: "setupタイトル1",
        author: "setup著者1",
      },
      {
        title: "setupタイトル2",
        author: "setup著者2",
      },
    ]);
    return {
      setupBooks,
    };
  },
  methods: {
    parentMethod(e) {
      console.log(e);
    },
  },
  // provide() { //動画視聴で学んだ方法
  //   return {
  //     userName: "親で設定した値",
  //   };
  // },
};
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
