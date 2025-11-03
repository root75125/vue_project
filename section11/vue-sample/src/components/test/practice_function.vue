<script setup lang="ts">
import { ref } from "vue";

// テスト用データ
const numbers = ref([1, 2, 3, 4, 5]);
const persons = ref([
  { id: 1, name: "John", age: 25 },
  { id: 2, name: "Mike", age: 30 },
  { id: 3, name: "Alice", age: 28 },
]);

// ==========================================
// パターン1: 基本的な関数定義（最も重要）
// ==========================================

// 通常の関数
function addRegular(a: number, b: number): number {
  return a + b;
}

// アロー関数（よく使う）
const addArrow = (a: number, b: number): number => {
  return a + b;
};

// アロー関数（1行の場合、波括弧省略）
const addArrowShort = (a: number, b: number): number => a + b;

// ==========================================
// パターン2: 配列のfilter（現在のコードパターン）
// ==========================================

// 通常の関数
// 通常の関数（外側と内側の両方）
function deleteRegular(id: number) {
  persons.value = persons.value.filter(function (p) {
    return p.id !== id;
  });
}

// アロー関数（よく使う - 現在のコード）
const deleteArrow = (id: number) => {
  persons.value = persons.value.filter((p) => p.id !== id);
};

// ==========================================
// パターン3: 配列のmap（よく使う）
// ==========================================

// 通常の関数
const doubledRegular = numbers.value.map(function (num) {
  return num * 2;
});

// アロー関数（よく使う）
const doubledArrow = numbers.value.map((num) => num * 2);

// ==========================================
// パターン4: イベントハンドラー（よく使う）
// ==========================================

// 通常の関数
function handleClickRegular() {
  console.log("Clicked (regular)");
}

// アロー関数（よく使う）
const handleClickArrow = () => {
  console.log("Clicked (arrow)");
};

// ==========================================
// テスト用
// ==========================================

const testExamples = () => {
  console.log("=== パターン1: 基本的な関数 ===");
  console.log("Regular:", addRegular(5, 3));
  console.log("Arrow:", addArrow(5, 3));
  console.log("Arrow Short:", addArrowShort(5, 3));

  console.log("\n=== パターン2: filter（現在のコード） ===");
  console.log("Before delete:", persons.value);
  deleteArrow(1);
  console.log("After delete:", persons.value);

  console.log("\n=== パターン3: map ===");
  console.log("Regular doubled:", doubledRegular);
  console.log("Arrow doubled:", doubledArrow);
};
</script>

<template>
  <div class="container">
    <h1>アロー関数の重要パターン</h1>

    <!-- パターン1: 基本的な関数定義 -->
    <section class="section">
      <h2>1. 基本的な関数定義（最重要）</h2>
      <p>Regular: {{ addRegular(5, 3) }}</p>
      <p>Arrow: {{ addArrow(5, 3) }}</p>
      <p>Arrow Short: {{ addArrowShort(5, 3) }}</p>
    </section>

    <!-- パターン2: filter（現在のコードパターン） -->
    <section class="section">
      <h2>2. filter（現在のコードパターン）</h2>
      <p>Persons: {{ persons }}</p>
      <button @click="deleteArrow(1)">Arrow関数でID=1を削除</button>
    </section>

    <!-- パターン3: map -->
    <section class="section">
      <h2>3. map（よく使う）</h2>
      <p>元の配列: {{ numbers }}</p>
      <p>Arrow doubled: {{ doubledArrow }}</p>
    </section>

    <!-- パターン4: イベントハンドラー -->
    <section class="section">
      <h2>4. イベントハンドラー</h2>
      <button @click="handleClickRegular">Regular</button>
      <button @click="handleClickArrow">Arrow</button>
    </section>

    <!-- テスト -->
    <section class="section">
      <h2>5. コンソールで確認</h2>
      <button @click="testExamples">テスト実行（コンソール確認）</button>
    </section>
  </div>
</template>

<style scoped>
/* .container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  color: #42b983;
  text-align: center;
}

h2 {
  color: #35495e;
  font-size: 18px;
  margin-bottom: 10px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #35495e;
}

p {
  margin: 8px 0;
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 5px;
  border-radius: 4px;
} */
</style>
