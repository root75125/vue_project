<!--No1:親(App.vue)で設定した値を(Children.vue)に移動した際に孫(compoenents/GrandChildren.vue)で表示出来るかを確認  -->
<template>
  <div>GrandChildren(孫)</div>
  <div>{{ userName }}</div>
</template>

<script>
import { inject } from "vue";
export default {
  setup() {
    const message = inject("message");
    console.log(message);
    return { message };
  },
  // inject: ["userName"], 動画視聴で学んだ方法
};
</script>

<style lang="scss" scoped></style>
