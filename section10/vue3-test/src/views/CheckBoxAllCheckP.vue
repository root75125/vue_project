<template>
  <div>
    <div>
      <input type="checkbox" :checked="isAllChecked" @click="toggleAll" />
      <label>全て選択</label>
    </div>
    <div v-for="item in items" :key="item">
      <input type="checkbox" v-model="item.checked" />
      <label>{{ item.name }}</label>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
export default {
  setup() {
    const items = ref([
      { id: 1, name: "test1", checked: "true" },
      { id: 2, name: "test2", checked: "true" },
      { id: 3, name: "test3", checked: "true" },
    ]);

    const isAllChecked = computed(() => {
      return items.value.every((item) => item.checked);
    });

    const toggleAll = (event) => {
      const checked = event.target.checked;
      items.value.forEach((item) => {
        item.checked = checked;
      });
    };
    return {
      items,
      isAllChecked,
      toggleAll,
    };
  },
};
</script>

<style lang="scss" scoped></style>
