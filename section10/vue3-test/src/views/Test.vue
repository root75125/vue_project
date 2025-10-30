<template>
  <div class="list-container">
    <h2>データ一覧</h2>

    <!-- データ一覧 -->
    <div class="data-list">
      <table>
        <thead>
          <tr>
            <th>入金</th>
            <th>請求</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div
                v-for="payment in payments"
                :key="payment.id"
                class="list-item"
                :class="{
                  'partial-payment': payment.isPartialPayment,
                  clickable: payment.isPartialPayment,
                }"
                @click="handlePaymentClick(payment)"
              >
                <div class="item-info">
                  <h3>{{ payment.name }}</h3>
                  <span class="price"
                    >¥{{ payment.amount.toLocaleString() }}</span
                  >
                  <div
                    v-if="payment.isPartialPayment"
                    class="partial-indicator"
                  >
                    部分入金
                  </div>
                </div>
                <div class="item-actions"></div>
              </div>
            </td>
            <td>
              <!--ここから請求-->
              <div
                v-for="claim in displayedClaims"
                :key="claim.id"
                class="list-item"
              >
                <div v-if="claim.availableForMatching">
                  <div class="item-info">
                    <h3>{{ claim.name }}</h3>
                    <span class="price"
                      >¥{{ claim.amount.toLocaleString() }}</span
                    >
                    <div v-if="claim.isMatched" class="matched-indicator">
                      入金済み
                    </div>
                  </div>
                </div>
                <!-- 未消し込みの一覧 -->
                <div
                  v-else-if="
                    claim.isProcessed == false &&
                    claim.availableForMatching == false
                  "
                >
                  <div>
                    一致するデータがありません。<br />
                    手動で請求データを選択してください。
                  </div>
                </div>
              </div>
              <!-- ここまで請求 -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    // サンプルデータ
    // 入金データに照合状態を追加
    const payments = ref([
      {
        id: 1,
        name: "入金A",
        amount: 1000,
        isPartialPayment: false,
        matchedClaimId: 4,
        matchingStatus: "matched", // 'matched', 'suggested', 'unmatched'
        isProcessed: false, // 消込み処理済みフラグ
      },
      {
        id: 2,
        name: "一部入金B",
        amount: 2000,
        isPartialPayment: true,
        matchedClaimId: 5,
        matchingStatus: "suggested",
        isProcessed: false,
      },
      {
        id: 3,
        name: "入金C",
        amount: 3000,
        isPartialPayment: false,
        matchedClaimId: null, // 未マッチ
        matchingStatus: "unmatched",
        isProcessed: false,
      },
    ]);

    // 請求データに消込み状態を追加
    const claims = ref([
      {
        id: 4,
        name: "請求A",
        amount: 1000,
        isMatched: false,
        isProcessed: false, // 消込み処理済みフラグ
        availableForMatching: true, // 手動消込み可能フラグ
      },
      {
        id: 5,
        name: "請求B",
        amount: 3000,
        isMatched: false,
        isProcessed: false,
        availableForMatching: false,
      },
      {
        id: 6,
        name: "請求C",
        amount: 3000,
        isMatched: false,
        isProcessed: false,
        availableForMatching: true,
      },
    ]);

    // 表示する請求データを計算
    const displayedClaims = computed(() => {
      return claims.value.map((claim) => ({
        ...claim,
        isMatched: payments.value.some(
          (payment) =>
            payment.matchedClaimId === claim.id && !payment.isPartialPayment
        ),
      }));
    });

    // 入金クリック処理
    const handlePaymentClick = (payment) => {
      if (payment.isPartialPayment) {
        // 部分入金の場合、対応する請求データをマッチ状態にする
        const claimIndex = claims.value.findIndex(
          (claim) => claim.id === payment.matchedClaimId
        );
        if (claimIndex > -1) {
          claims.value[claimIndex].isMatched = true;

          // アラートで詳細を表示
          const matchedClaim = claims.value[claimIndex];
          alert(
            `部分入金がクリックされました！\n\n入金: ${
              payment.name
            } - ¥${payment.amount.toLocaleString()}\n請求: ${
              matchedClaim.name
            } - ¥${matchedClaim.amount.toLocaleString()}\n\n請求データが入金済みとして表示されます。`
          );
        }
      } else {
        // 通常の入金の場合
        alert(
          `入金: ${
            payment.name
          } - ¥${payment.amount.toLocaleString()}\n\nこの入金は既に請求データとマッチしています。`
        );
      }
    };

    return {
      payments,
      claims,
      displayedClaims,
      handlePaymentClick,
    };
  },
};
</script>

<style scoped>
.list-container {
  padding: 20px;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  vertical-align: top;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

.list-item:last-child {
  margin-bottom: 0;
}

.list-item.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-item.clickable:hover {
  background-color: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list-item.partial-payment {
  background-color: #fff3cd;
  border-color: #ffc107;
}

.item-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.item-info p {
  margin: 0 0 5px 0;
  color: #666;
}

.price {
  font-weight: bold;
  color: #27ae60;
}

.partial-indicator {
  display: inline-block;
  padding: 2px 8px;
  background-color: #ffc107;
  color: #856404;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
}

.matched-indicator {
  display: inline-block;
  padding: 2px 8px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.item-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.item-actions button:first-child {
  background-color: #007bff;
  color: white;
}

.item-actions button:last-child {
  background-color: #dc3545;
  color: white;
}
</style>
