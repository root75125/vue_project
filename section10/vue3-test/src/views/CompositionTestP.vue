<template>
  <div>compo</div>
  {{ name }}
  {{ age }}
  {{ book }}
  <button @click="btnClick">click</button>
  {{ item }}
  {{ totalprice }}
  <div><input v-model="searchEffect" /></div>
</template>

<script>
import { ref, reactive, computed, watchEffect } from "vue";
export default {
  setup() {
    const name = ref("test");
    const age = ref(20);
    const book = reactive({
      title: "title1",
      author: "author1",
    });
    const btnClick = () => {
      console.log(book.title);
    };
    const item = reactive({
      price: 100,
      amount: 1,
    });
    const totalprice = computed(() => {
      return item.price * item.amount;
    });
    const searchEffect = ref("");
    watchEffect(() => {
      console.log(`searchEffect:${searchEffect.value}`);
    });
    return {
      name,
      age,
      book,
      btnClick,
      item,
      totalprice,
      searchEffect,
    };
  },
};
</script>

<style lang="scss" scoped></style>
