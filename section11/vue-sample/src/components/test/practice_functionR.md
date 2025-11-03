# practice_function.vue で使用されている関数について解説

## filter()について

### filter()の内部構造

```
filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
```

### predicate (述語関数)とは

predicate は、条件を判定する関数。
各要素が条件を満たすか(true/false)を返す。

#### 基本的な概念

- 英語で「述語」の意味
- プログラミングでは「条件判定を行う関数」を意味する
- filter,some,every などで使用される

##### 具体例

```
// predicate関数の例
const isEven = function(num) {
  return num % 2 === 0;  // 偶数かどうかを判定
};

const numbers = [1, 2, 3, 4, 5];
numbers.filter(isEven);  // [2, 4] ← 偶数だけを返す
```

##### 補足解説

filter メソッド内では以下の処理が実行される。

1. 1->isEven(1)->false->除外
2. 2->isEven(2)->true->含める
3. 3->isEven(3)->false->除外
4. 4->isEven(4)->true->含める
5. 5->isEven(5)->false->除外

つまり以下のような事が実行されている。

```
const numbers = [1, 2, 3, 4, 5];
numbers.filter(isEven);

// filterメソッドは内部的に以下のような処理を行います

// 1つ目の要素
const result1 = isEven(1);  // ← filterが自動的に呼び出す
// result1 = false → 除外

// 2つ目の要素
const result2 = isEven(2);  // ← filterが自動的に呼び出す
// result2 = true → 含める

// 3つ目の要素
const result3 = isEven(3);  // ← filterが自動的に呼び出す
// result3 = false → 除外

// 4つ目の要素
const result4 = isEven(4);  // ← filterが自動的に呼び出す
// result4 = true → 含める

// 5つ目の要素
const result5 = isEven(5);  // ← filterが自動的に呼び出す
// result5 = false → 除外

// 結果: [2, 4]
```

### filter メソッドの実装イメージ

```
// filterメソッドの簡易的な実装イメージ
Array.prototype.filter = function(predicate) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    const element = this[i];

    // ここでpredicate関数を呼び出す！
    const shouldInclude = predicate(element, i, this);

    if (shouldInclude) {
      result.push(element);
    }
  }

  return result;
};
```

#### 実際の使用例との対応

```
const numbers = [1, 2, 3, 4, 5];

// ユーザーが書くコード
numbers.filter(isEven);

// filterメソッド内部での処理
// predicate = isEven として受け取る
// predicate(1) → isEven(1) → false
// predicate(2) → isEven(2) → true
// predicate(3) → isEven(3) → false
// predicate(4) → isEven(4) → true
// predicate(5) → isEven(5) → false
```

### filter()に関数ではなく配列の 1 要素を与える時の構造を解説(/numbers.value.filter((n)=>n%2===0)の場合/)

```
numbers.value.filter((n) => n % 2 === 0);

// filterメソッド内部での処理（イメージ）
for (let i = 0; i < numbers.value.length; i++) {
  const element = numbers.value[i];  // 1, 2, 3, 4, 5

  // ここで関数を呼び出す(ここのresultはboolean値になる)
  const result = predicate(element, i, numbers.value);
  //            ↑
  //            element（各要素）が第1引数として渡される
  // 補足
  // predicate=「(n)=>n%2===0」である。
  // つまり、numbers(配列)の最初のvalueが1の場合、
  // 1%2=1,1===0=falseになるのでresult=falseである
}
```
