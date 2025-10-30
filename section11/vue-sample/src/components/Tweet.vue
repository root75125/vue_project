<!-- <!-- Tweetアプリ(分解版) -->
<script setup lang="ts">
import type { Tweet } from "./types/tweet.ts";
const props = defineProps<{
  tweet: Tweet;
}>();
const emits = defineEmits<{
  (e: "onDelete1", value: string): void;
}>();
const onDelete1 = (value: string) => {
  emits("onDelete1", value);
};
// const emit = defineEmits<{
//   id: string;
// }>();
// const onDelete = (id: string) => {
// tweets.value = tweets.value.filter((tweet) => tweet.id !== id);
// };
</script>
<template>
  <div class="tweet">
    <span>{{ tweet.description }}</span>
    <button @click="onDelete1(tweet.id)">Delete</button>
  </div>
</template>
<style scoped></style>
