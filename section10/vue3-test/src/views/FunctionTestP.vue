<template>
  <div>{{ item.name }}</div>
  <div>{{ item.price }}</div>
  <div>{{ totalPrice }}</div>
  <div>数量</div>
  <div><button @click="decrement">-</button></div>
  <div><button @click="increment">+</button></div>
</template>

<script>
import { reactive, computed } from "vue";
const useCounter = (item) => {
  const increment = () => {
    item.amount++;
  };
  const decrement = () => {
    item.amount--;
  };
  const totalPrice = computed(() => {
    return item.price * item.amount;
  });
  return { increment, decrement, totalPrice };
};
export default {
  setup() {
    const item = reactive({
      name: "test",
      price: 100,
      amount: 0,
    });
    const { increment, decrement, totalPrice } = useCounter(item);
    return {
      item,
      increment,
      decrement,
      totalPrice,
    };
  },
};
</script>

<style lang="scss" scoped></style>
