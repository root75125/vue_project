<!-- 家計簿アプリ -->
<script setup lang="ts">
import { ref, reactive, computed, watch, toRefs } from "vue";
// const itemName1 = ref<string>("Desk");
const item1 = reactive({
  name: "DESK",
  price: 40000,
});
// const itemName2 = "Bike";
const url1 = "https://www.amazon.co.jp/dp.B09QMBH5R7";

const buy = (itemName: string) => {
  alert(" sure to buy" + itemName);
};

const input = (event: any) => {
  console.log(event.target.value);
  item1.name = event.target.value;
};
const clear = () => {
  item1.name = "";
  item1.price = 0;
};
const budget = 50000;

const priceLabel = ref<string>(item1.price + "yen");
const { price } = toRefs(item1);
watch(price, () => {
  console.log("watch");
  //   const price.value = computed(() => {
  if (price.value > budget) {
    priceLabel.value = "too expensive";
    // return "too expensive";
  } else {
    priceLabel.value = price.value + "yen";
    // return price.value + "yen";
  }
});
// });
</script>

<template>
  <div class="container">
    <h1>Payment</h1>
    <input style="margin-bottom: 5px" type="text" v-model="item1.name" />
    <input type="text" v-model="item1.price" />
    <!-- <input type="text" @input="input" :value="item1.name" /> -->
    <h1>最近の支出</h1>
    <button @click="clear" style="background-color: red">clear</button>
    <div class="payment">
      <label>{{ item1.name }}</label>
      <label>{{ priceLabel }}</label>
      <!-- <label>{{ item1.price }}</label> -->
      <a :href="url1">bought at...</a>
      <button @click="buy(item1.name)">send</button>
    </div>
  </div>
</template>

<style scoped>
label {
  font-size: 20px;
  font-weight: bold;
  color: black;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.payment {
  display: flex;
  justify-content: space-between;
  height: 80px;
  width: 400px;
  background-color: aliceblue;
  align-items: center;
}
</style>
