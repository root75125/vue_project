<!-- Tweetアプリ(このコンポーネントのみで動作) -->
<script setup lang="ts">
import { ref } from "vue";
type Tweet = {
  id: string;
  description: string;
};

const tweets = ref<Tweet[]>([
  {
    id: "1",
    description: "Hello!",
  },
  {
    id: "2",
    description: "Example",
  },
]);
const tweet = ref<Tweet>({
  id: "",
  description: "",
});

const search = ref("");
const onSubmit = () => {
  console.log("submit");
  tweets.value = [
    ...tweets.value,
    {
      id: Math.random().toString(),
      description: tweet.value.description,
    },
  ];
  tweet.value = {
    id: "",
    description: "",
  };

  console.log(tweets.value);
};
const onDelete = (id: string) => {
  tweets.value = tweets.value.filter((tweet) => tweet.id !== id);
  //   tweets.value.length = 0;
  // tweets.value.splice(0);
  //   tweets.value = [];

  console.log(tweets.value);
};
</script>
<template>
  <h1>Twitter</h1>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="tweet.description" />
    <button type="submit">Tweet</button>
  </form>
  <!-- <form @sbmit.prevent="allDelete">
    <button type="submit">all delete</button>
  </form> -->
  <input type="text" v-model="search" />
  <ul>
    <li v-for="tweet in tweets">
      <div v-if="tweet.description.includes(search)">
        <span>{{ tweet.description }}</span>
        <button @click="onDelete(tweet.id)">delete</button>
      </div>
    </li>
    <!-- <li>Twee2</li>
    <li>Twee3</li> -->
  </ul>
</template>
<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-top: 1rem;
}
</style>
