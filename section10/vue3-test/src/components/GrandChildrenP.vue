<template>
  <div>孫</div>
  {{ message }}
</template>

<script>
import { inject } from "vue";
export default {
  setup() {
    const message = inject("message");
    return {
      message,
    };
  },
};
</script>

<style lang="scss" scoped></style>
