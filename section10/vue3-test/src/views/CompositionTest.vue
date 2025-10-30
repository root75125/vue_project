<!-- No2:reactive系の項目を確認 -->
<template>
  <div>
    <p>{{ name }}</p>
    <p>{{ age }}</p>

    <p>{{ book.title }}</p>
    <p>{{ book.author[0] }}</p>
    <button @click="btnClick">クリック</button>
    <p>compted:{{ totalPrice }}</p>
    <!-- <div>watch:<input v-model="search" /></div> -->
    <div>watchEffect:<input v-model="searchEffect" /></div>
  </div>
</template>

<script>
import { ref, reactive, computed, watchEffect, onMounted } from "vue";
export default {
  setup() {
    const name = ref("test");
    const age = ref(30);
    console.log("name", name);
    console.log("name ref", name.value);
    const book = reactive({
      title: "タイトル",
      author: ["大谷", "斉藤"],
    });

    const item = reactive({
      price: 100,
      number: 1,
    });
    const totalPrice = computed(() => {
      return item.price * item.number;
    });
    const btnClick = (e) => {
      console.log(book.title);
      console.log(e);
    };
    //--以下はwatch系の確認 しかし、searchEffectがあるので不要かと思う
    // const search = ref("");
    // watch(search, (newValue, preValue) => {
    //   console.log(`watch:${search.value}`);
    //   console.log(`new:${newValue}`);
    //   console.log(`prev:${preValue}`);
    // });
    //-- 以上
    const searchEffect = ref("");
    watchEffect(() => {
      console.log(`searchEffect:${searchEffect.value}`);
    });
    onMounted(() => {
      console.log("onMounted");
    });

    console.log("setup");
    return {
      name,
      age,
      book,
      btnClick,
      item,
      totalPrice,
      // search,
      searchEffect,
    };
  },
};
</script>

<style lang="scss" scoped></style>
