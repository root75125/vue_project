<!-- <!-- Tweetアプリ(分解版) -->
<script setup lang="ts">
import { ref } from "vue";
import type { Tweet } from "./types/tweet.ts";
const tweet = ref<Tweet>({
  id: "",
  description: "",
});
const emits = defineEmits<{
  (e: "submit1", value: string): void;
}>();
const onSubmit1 = (value: string) => {
  emits("submit1", value);
  tweet.value = {
    id: "",
    description: "",
  };
};
</script>
<template>
  <div>
    <form
      @submit.prevent="() => onSubmit1(tweet.description)"
      class="tweet-form"
    >
      <textarea v-model="tweet.description"></textarea>
      <button type="submit">Tweet</button>
    </form>
  </div>
</template>
<style></style>
