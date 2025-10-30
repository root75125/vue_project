# Vue に関してメモ

## "style scoped"について

### 特徴

- 1.スコープの限定
  - スタイルが現在のコンポーネント内でのみ適用される
  - 他のコンポーネントに影響を与えない
- 2.自動的な属性付与
  - Vue.js が各コンポーネントに一意の属性(例:data-v-123456)を自動付与
  - CSS セレクタにこの属性が追加される
- 3.グローバル汚染の防止

  - グローバルな CSS の競合を完全に回避
  - 予測可能なステイル適用

  ### stype scoped を使用した場合

  App.vue

  ```
  .logo {
  height: 6em;
  padding: 1.5em;
  background-color: blue;
  }
  ```

  HelloWorld.vue

  ```
  .logo {
  background-color: red;
  color: white;
  padding: 10px;
  border-radius: 5px;
  }
  ```

  結果、App.vue と HelloWorld.vue の両方の CSS が適用される。
  ※style scoped を使用しなければ CSS の競合が発生した後から適用された
  スタイル(App.vue)が反映される。

## メモとして作成する項目を箇条書き

- form タグの@submit は@submit.prevent にしないとリロードされる仕様になっている事
- モディファイア
- 配列の登録及び削除方法

  - 登録

    - ```
        tweets.value = [
        ...tweets.value,
        {
          id: Math.random().toString(),
          description: tweet.value.description,
        },
      ];
      ```

    ```

    ```

  - 削除
    - ```
      tweets.value = tweets.value.filter((tweet) => tweet.id !== id);
      ```
  - includes(SPA 検索)

## 調査事項箇条書き

- computed でキャッシュが有効に働く時はどんな時か
- computed と watch の違い
- v-for が ul で使用できない理由を調査
- v-if と v-show の違い
- import type { Tweet } from "./types/tweet";の type とは何か
- Options API+setup 関数の props の書き方を調査

```
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
```

- Composition API + script setup の書き方(現代的な書き方)を調査

```
<script setup lang="ts">
const props = defineProps<{
 setupBooks: Array;
}>();

console.log(props.setupBooks[0]);

const emitTest = () => {
 emits("custom-event", "この値");
};

const emits = defineEmits<{
 (e: "custom-event", value: string): void;
}>();
</script>
```

- type の使い方
- import する時に type を使うのはなぜか
- attribute という概念はなんだったか
- 組み込み関数とは何か
