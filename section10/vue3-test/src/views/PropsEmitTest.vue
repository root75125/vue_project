<!-- No4:PropsとEmitの確認 -->
<template>
  <div>PaopsEmitTest</div>
  <div>{{ setupBooks }}</div>
  <ul>
    <li v-for="book in setupBooks" :key="book.title">
      {{ book.title }}
    </li>
  </ul>

  <button @click="emitTest">emitTest</button>
</template>

<script>
export default {
  props: {
    setupBooks: Array,
  },
  setup(props, context) {
    console.log(props.setupBooks[0]);

    const emitTest = () => {
      context.emit("custom-event", "子の値");
    };
    return {
      emitTest,
    };
  },
};
</script>

<style lang="scss" scoped></style>
