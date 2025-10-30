<!--No1:親(App.vue)で設定した値を(Children.vue)に移動した際に孫(compoenents/GrandChildren.vue)で表示出来るかを確認  -->
<template>
  <div>Children(子)</div>
  <Grend-Children />
</template>

<script>
import GrendChildren from "@/components/GrandChildren";
export default {
  components: {
    GrendChildren,
  },
};
</script>

<style lang="scss" scoped></style>
