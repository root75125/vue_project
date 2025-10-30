<template>
  <!-- すべて選択にチェックがつく→togglAllが作動して
   itemsの値が変更される→isAllCheckedのcompoutedが作動して
   itemsの中のitemを参照してtrue/falseの値をisAllChecked変数に格納する、
   その値が:checkedに入ってチェックが入るという事-->
  <div>
    <!-- 一括チェック用のチェックボックス -->
    <div>
      <input type="checkbox" :checked="isAllChecked" @change="toggleAll" />
      すべて選択
    </div>

    <!-- 個別のチェックボックス -->
    <div v-for="item in items" :key="item.id">
      <input type="checkbox" v-model="item.checked" />
      {{ item.name }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    // チェックボックスのデータ
    const items = ref([
      { id: 1, name: "項目1", checked: false },
      { id: 2, name: "項目2", checked: false },
      { id: 3, name: "項目3", checked: false },
    ]);

    // すべてのチェックボックスが選択されているかどうかを計算
    // <!-- // 全チェックボックスの選択状態を確認 // -->
    // <!-- every()の引数名は自由に設定可能（item, test, x など） -->
    const isAllChecked = computed(() => {
      return items.value.every((item) => item.checked);
    });

    // すべてのチェックボックスを一括で切り替え
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
