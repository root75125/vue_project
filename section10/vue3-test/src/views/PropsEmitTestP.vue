<template>
  <div>props</div>
  {{ setupBooks }}
  <ul>
    <li v-for="book in setupBooks" :key="book">{{ book.title }}</li>
  </ul>
  <button @click="emitTest">click</button>
</template>

<script>
export default {
  props: {
    setupBooks: Array,
  },
  setup(props, context) {
    console.log(props.setupBooks[0]);
    const emitTest = () => {
      context.emit("custom-event", "この値");
    };
    return {
      emitTest,
    };
  },
};
</script>

<style lang="scss" scoped></style>
