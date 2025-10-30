サイドパネル方式 v2 サイドパネル方式(実際に動いたもの)

<template>
  <v-app>
    <div class="container">
      <v-card elevation="2">
        <v-card-title class="bg-primary text-white">
          <span class="text-h5">入金・請求データ照合</span>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            variant="outlined"
            @click="executeAutoMatching"
            prepend-icon="mdi-auto-fix"
          >
            自動照合実行
          </v-btn>
        </v-card-title>

        <!-- 統計情報 -->
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-card color="green-lighten-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-h4 text-green">
                    {{ getStatusCount("auto_matched") }}
                  </div>
                  <div class="text-caption">自動照合済み</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card color="blue-lighten-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-h4 text-blue">
                    {{ getStatusCount("manual_matched") }}
                  </div>
                  <div class="text-caption">手動照合済み</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card color="orange-lighten-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-h4 text-orange">
                    {{ getStatusCount("suggested") }}
                  </div>
                  <div class="text-caption">要確認1</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card color="red-lighten-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-h4 text-red">
                    {{ getStatusCount("unmatched") }}
                  </div>
                  <div class="text-caption">未照合</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-data-table
          :headers="paymentHeaders"
          :items="payments"
          :items-per-page="50"
          class="custom-table"
          density="compact"
          :loading="loading"
          @click:row="toggleClaimSelection"
        >
          <template v-slot:[`item.name`]="{ item }">
            <div class="text-h6">{{ item.name }}</div>
            <div class="text-caption text-grey">{{ item.date }}</div>
          </template>
          <template v-slot:[`item.amount`]="{ item }">
            <div class="text-subtitle-1">
              ¥{{ item.amount.toLocaleString() }}
            </div>
            <div v-if="item.isPartialPayment" class="text-caption text-orange">
              一部入金
            </div>
          </template>
          <template v-slot:[`item.claimData`]="{ item }">
            <v-card
              v-if="getMatchedClaim(item)"
              :color="getClaimCardColor(item.matchingStatus)"
              variant="outlined"
              class="ma-1"
            >
              <v-card-text>
                <div class="text-h6">
                  {{ getMatchedClaim(item).name }}
                </div>
                <div class="text-subtitle-1">
                  ¥{{ getMatchedClaim(item).amount.toLocaleString() }}
                </div>
                <v-btn
                  color="primary"
                  size="small"
                  @click.stop="openClaimSelector(item)"
                  class="mt-1"
                >
                  変更
                </v-btn>
              </v-card-text>
            </v-card>
            <div v-else class="claim-data-cell">
              <div
                v-if="!isClaimSelectionExpanded(item.id)"
                class="unmatched-claim-placeholder"
              >
                <v-icon color="grey">mdi-file-document-outline</v-icon>
                <div class="text-caption text-grey mt-1">未対応</div>
                <div class="text-caption text-grey">
                  行をクリックして請求データを選択
                </div>
              </div>

              <!-- 展開された請求データ選択エリア -->
              <v-card
                v-if="isClaimSelectionExpanded(item.id)"
                color="grey-lighten-2"
                variant="outlined"
                class="ma-1 claim-selection-card"
              >
                <v-card-text>
                  <!-- ヘッダー -->
                  <div class="d-flex justify-space-between align-center mb-3">
                    <div>
                      <div class="text-h6">未消込請求データ選択</div>
                      <div class="text-caption text-grey">
                        マッチング可能な未処理請求データのみ表示
                      </div>
                    </div>
                    <v-btn
                      icon="mdi-close"
                      size="small"
                      @click.stop="closeClaimSelection(item.id)"
                    />
                  </div>

                  <!-- 検索・フィルタエリア -->
                  <div class="claim-search-area mb-3">
                    <v-text-field
                      :model-value="getClaimSearchQuery(item.id)"
                      label="請求名で検索"
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      size="small"
                      clearable
                      @input="
                        updateClaimSearchQuery(item.id, $event.target.value)
                      "
                    />
                    <v-row class="mt-1">
                      <v-col cols="6">
                        <v-select
                          :model-value="getClaimAmountRange(item.id)"
                          :items="amountRanges"
                          label="金額範囲"
                          variant="outlined"
                          density="compact"
                          size="small"
                          clearable
                          @update:model-value="
                            (value) => updateClaimAmountRange(item.id, value)
                          "
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          :model-value="getClaimStatus(item.id)"
                          :items="statusOptions"
                          label="ステータス"
                          variant="outlined"
                          density="compact"
                          size="small"
                          clearable
                          @update:model-value="
                            (value) => updateClaimStatus(item.id, value)
                          "
                        />
                      </v-col>
                    </v-row>
                  </div>

                  <!-- フィルタされた請求データリスト -->
                  <div class="claim-list-area">
                    <div class="text-caption text-grey mb-2">
                      該当件数: {{ getFilteredClaimsForPayment(item).length }}件
                    </div>
                    <div
                      class="claim-list"
                      style="max-height: 200px; overflow-y: auto"
                    >
                      <v-list density="compact">
                        <v-list-item
                          v-for="claim in getFilteredClaimsForPayment(
                            item
                          ).slice(0, 10)"
                          :key="claim.id"
                          @click="selectClaimDirectly(item, claim.id)"
                          class="claim-item"
                          :class="{
                            selected: getClaimSelection(item.id) === claim.id,
                          }"
                        >
                          <template v-slot:prepend>
                            <v-icon size="small">mdi-file-document</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">
                            {{ claim.name }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="text-caption">
                            ¥{{ claim.amount.toLocaleString() }} |
                            {{ claim.customerCode }} | {{ claim.status }}
                          </v-list-item-subtitle>
                          <template v-slot:append>
                            <v-btn
                              color="primary"
                              size="x-small"
                              @click.stop="selectClaimDirectly(item, claim.id)"
                            >
                              選択
                            </v-btn>
                          </template>
                        </v-list-item>
                      </v-list>
                      <div
                        v-if="getFilteredClaimsForPayment(item).length > 10"
                        class="text-center mt-2"
                      >
                        <v-btn
                          color="primary"
                          size="small"
                          @click.stop="openClaimSelector(item)"
                        >
                          もっと見る ({{
                            getFilteredClaimsForPayment(item).length - 10
                          }}件)
                        </v-btn>
                      </div>
                      <div
                        v-if="getFilteredClaimsForPayment(item).length === 0"
                        class="text-center text-grey pa-2"
                      >
                        <v-icon size="small">mdi-file-document-outline</v-icon>
                        <div class="text-caption">
                          該当する請求データがありません
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </template>
          <template v-slot:[`item.matchingStatus`]="{ item }">
            <v-chip
              :color="getStatusColor(item.matchingStatus)"
              size="small"
              class="ma-1"
            >
              {{ getStatusText(item.matchingStatus) }}
            </v-chip>
            <div
              v-if="item.matchingStatus === 'suggested'"
              class="text-caption text-orange"
            >
              要確認
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- サイドパネル -->
      <v-navigation-drawer
        v-model="sidePanelOpen"
        temporary
        location="right"
        width="800"
      >
        <v-card-title class="bg-primary text-white">
          <div>
            <span class="text-h6">未消込請求データ選択</span>
            <div class="text-caption">
              マッチング可能な未処理請求データのみ表示
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeSidePanel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- 選択中の入金データ表示 -->
          <div class="mb-3" v-if="selectedPaymentForClaimSelection">
            <strong>選択中の入金:</strong><br />
            {{ selectedPaymentForClaimSelection.name }} - ¥{{
              selectedPaymentForClaimSelection.amount?.toLocaleString()
            }}
          </div>

          <v-divider class="mb-3"></v-divider>

          <!-- 検索・フィルタエリア -->
          <div class="claim-search-area mb-3">
            <v-row class="mb-3">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="globalClaimSearchQuery"
                  label="請求名で検索"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="globalCustomerCodeQuery"
                  label="顧客コードで検索"
                  prepend-inner-icon="mdi-account-search"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
            </v-row>

            <v-row class="mb-3">
              <v-col cols="12" md="4">
                <v-select
                  label="金額範囲"
                  :items="amountRanges"
                  v-model="globalSelectedAmountRange"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  label="ステータス"
                  :items="statusOptions"
                  v-model="globalSelectedStatus"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="globalAmountQuery"
                  label="金額で検索（例: 10000）"
                  prepend-inner-icon="mdi-currency-jpy"
                  variant="outlined"
                  density="compact"
                  type="number"
                  clearable
                />
              </v-col>
            </v-row>
          </div>

          <v-divider class="mb-3"></v-divider>

          <!-- データテーブル -->
          <v-data-table
            :headers="claimHeaders"
            :items="globalFilteredClaims"
            :items-per-page="20"
            :search="globalCombinedSearchQuery"
            :loading="loading"
            @click:row="selectClaimFromGlobalTable"
            class="claim-table"
            density="compact"
            :sort-by="[{ key: 'amount', order: 'desc' }]"
          >
            <template v-slot:[`item.amount`]="{ item }">
              ¥{{ item.amount.toLocaleString() }}
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ item.date }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-chip :color="getStatusChipColor(item.status)" size="small">
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                color="primary"
                size="small"
                @click.stop="selectClaimFromGlobalTable(item)"
              >
                選択
              </v-btn>
            </template>
          </v-data-table>

          <div
            v-if="globalFilteredClaims.length === 0"
            class="text-center text-grey pa-4"
          >
            <v-icon size="48" color="grey">mdi-file-document-outline</v-icon>
            <div class="mt-2">該当する請求データがありません</div>
          </div>
        </v-card-text>
      </v-navigation-drawer>

      <!-- 請求データ選択ダイアログ -->
      <v-dialog v-model="showClaimSelectorDialog" max-width="600px">
        <v-card>
          <v-card-title class="bg-primary text-white">
            <div>
              <span class="text-h6">未消込請求データ選択</span>
              <div class="text-caption">
                マッチング可能な未処理請求データのみ表示
              </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeClaimSelectorDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <div class="mb-3">
              <strong>選択中の入金:</strong><br />
              {{ selectedPayment?.name }} - ¥{{
                selectedPayment?.amount?.toLocaleString()
              }}
            </div>

            <v-divider class="mb-3"></v-divider>

            <!-- 検索機能 -->
            <v-row class="mb-3">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  label="請求名で検索"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="customerCodeQuery"
                  label="顧客コードで検索"
                  prepend-inner-icon="mdi-account-search"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
            </v-row>

            <!-- フィルタ機能 -->
            <v-row class="mb-3">
              <v-col cols="12" md="4">
                <v-select
                  label="金額範囲"
                  :items="amountRanges"
                  v-model="selectedAmountRange"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  label="ステータス"
                  :items="statusOptions"
                  v-model="selectedStatus"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="amountQuery"
                  label="金額で検索（例: 10000）"
                  prepend-inner-icon="mdi-currency-jpy"
                  variant="outlined"
                  density="compact"
                  type="number"
                  clearable
                />
              </v-col>
            </v-row>

            <v-divider class="mb-3"></v-divider>

            <!-- データテーブル -->
            <v-data-table
              :headers="claimHeaders"
              :items="filteredClaims"
              :items-per-page="20"
              :search="combinedSearchQuery"
              :loading="loading"
              @click:row="selectClaimFromDialog"
              class="claim-table"
              density="compact"
              :sort-by="[{ key: 'amount', order: 'desc' }]"
              show-select
              v-model="selectedClaims"
            >
              <template v-slot:[`item.amount`]="{ item }">
                ¥{{ item.amount.toLocaleString() }}
              </template>
              <template v-slot:[`item.date`]="{ item }">
                {{ item.date }}
              </template>
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getStatusChipColor(item.status)" size="small">
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  color="primary"
                  size="small"
                  @click.stop="selectClaimFromDialog(item)"
                >
                  選択
                </v-btn>
              </template>
            </v-data-table>

            <div
              v-if="filteredClaims.length === 0"
              class="text-center text-grey pa-4"
            >
              <v-icon size="48" color="grey">mdi-file-document-outline</v-icon>
              <div class="mt-2">該当する請求データがありません</div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- 確認ダイアログ -->
      <v-dialog v-model="showConfirmDialog" max-width="400px">
        <v-card>
          <v-card-title>消込み確認</v-card-title>
          <v-card-text>
            <p>以下の消込みを実行しますか？</p>
            <div class="mt-2">
              <strong>入金:</strong> {{ selectedPayment?.name }} - ¥{{
                selectedPayment?.amount?.toLocaleString()
              }}
            </div>
            <div>
              <strong>請求:</strong> {{ selectedClaim?.name }} - ¥{{
                selectedClaim?.amount?.toLocaleString()
              }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="showConfirmDialog = false"
              >キャンセル</v-btn
            >
            <v-btn color="primary" @click="executeMatching">実行</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>
<script>
import { ref, computed } from "vue";

export default {
  setup() {
    // ダイアログ状態
    const showClaimSelectorDialog = ref(false);
    const showConfirmDialog = ref(false);
    const loading = ref(false);
    const sidePanelOpen = ref(false);

    // 検索・フィルタ状態
    const searchQuery = ref("");
    const customerCodeQuery = ref("");
    const amountQuery = ref(null);
    const selectedAmountRange = ref(null);
    const selectedStatus = ref(null);
    const selectedClaims = ref([]);

    // 各行の請求データ検索状態を管理
    const claimSearchStates = ref(new Map());
    const claimSelections = ref(new Map());
    const expandedClaimSelections = ref(new Set());

    // 列全体の請求データ選択状態を管理
    const selectedPaymentId = ref(null);
    const selectedPaymentForClaimSelection = ref(null);

    // 列全体の検索・フィルタ状態
    const globalClaimSearchQuery = ref("");
    const globalCustomerCodeQuery = ref("");
    const globalAmountQuery = ref(null);
    const globalSelectedAmountRange = ref(null);
    const globalSelectedStatus = ref(null);

    // 選択中のデータ
    const selectedPayment = ref(null);
    const selectedClaim = ref(null);

    // 入金データ（大量データのサンプル）
    const generatePayments = () => {
      const paymentData = [];
      const companies = [
        "株式会社A",
        "株式会社B",
        "株式会社C",
        "株式会社D",
        "株式会社E",
        "株式会社F",
        "株式会社G",
        "株式会社H",
        "株式会社I",
        "株式会社J",
      ];
      const statuses = [
        "auto_matched",
        "manual_matched",
        "suggested",
        "unmatched",
      ];

      for (let i = 1; i <= 1000; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000; // 1000円〜51000円
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const matchedClaimId =
          status === "unmatched" ? null : Math.floor(Math.random() * 2000) + 1;

        paymentData.push({
          id: i,
          name: `${company} 入金${i}`,
          amount: amount,
          isPartialPayment: Math.random() < 0.1, // 10%の確率で一部入金
          matchedClaimId: matchedClaimId,
          matchingStatus: status,
          isProcessed: false,
          date: new Date(
            2024,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
        });
      }
      return paymentData;
    };

    const payments = ref(generatePayments());

    // 請求データ（大量データのサンプル）
    const generateClaims = () => {
      const claimData = [];
      const companies = [
        "株式会社A",
        "株式会社B",
        "株式会社C",
        "株式会社D",
        "株式会社E",
        "株式会社F",
        "株式会社G",
        "株式会社H",
        "株式会社I",
        "株式会社J",
      ];
      const statuses = ["未処理", "処理中", "完了"];

      for (let i = 1; i <= 2000; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000; // 1000円〜51000円
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // 未消込請求データの条件を明確にする
        const isMatched = Math.random() < 0.3; // 30%の確率でマッチ済み
        const isProcessed = Math.random() < 0.2; // 20%の確率で処理済み
        const availableForMatching = !isMatched && !isProcessed; // マッチ済みでも処理済みでもない場合のみマッチング可能

        claimData.push({
          id: i,
          name: `${company} 請求${i}`,
          amount: amount,
          isMatched: isMatched,
          isProcessed: isProcessed,
          availableForMatching: availableForMatching,
          status: status,
          date: new Date(
            2024,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
          customerCode: `CUST${String(i).padStart(6, "0")}`,
        });
      }
      return claimData;
    };

    const claims = ref(generateClaims());

    // 入金データテーブルヘッダー
    const paymentHeaders = ref([
      { title: "ID", key: "id", sortable: true, width: "80px" },
      { title: "入金データ", key: "name", sortable: true },
      { title: "金額", key: "amount", sortable: true, width: "150px" },
      { title: "請求データ", key: "claimData", sortable: false },
      {
        title: "照合ステータス",
        key: "matchingStatus",
        sortable: true,
        width: "150px",
      },
    ]);

    // 請求データテーブルヘッダー
    const claimHeaders = ref([
      { title: "ID", key: "id", sortable: true, width: "80px" },
      { title: "請求名", key: "name", sortable: true },
      {
        title: "顧客コード",
        key: "customerCode",
        sortable: true,
        width: "120px",
      },
      { title: "金額", key: "amount", sortable: true, width: "120px" },
      { title: "日付", key: "date", sortable: true, width: "120px" },
      { title: "ステータス", key: "status", sortable: true, width: "100px" },
      { title: "操作", key: "actions", sortable: false, width: "100px" },
    ]);

    // フィルタオプション
    const amountRanges = ref([
      { title: "1,000円未満", value: "under_1000" },
      { title: "1,000円〜10,000円", value: "1000_10000" },
      { title: "10,000円〜30,000円", value: "10000_30000" },
      { title: "30,000円〜50,000円", value: "30000_50000" },
      { title: "50,000円以上", value: "over_50000" },
    ]);

    const statusOptions = ref([
      { title: "未処理", value: "未処理" },
      { title: "処理中", value: "処理中" },
      { title: "完了", value: "完了" },
    ]);

    // 未消込請求データのみを取得（マッチング可能で未処理の請求データ）
    const availableClaims = computed(() => {
      return claims.value.filter(
        (claim) =>
          claim.availableForMatching && !claim.isProcessed && !claim.isMatched
      );
    });

    // 複合検索クエリ
    const combinedSearchQuery = computed(() => {
      let query = searchQuery.value;
      if (customerCodeQuery.value) {
        query += ` ${customerCodeQuery.value}`;
      }
      if (amountQuery.value) {
        query += ` ${amountQuery.value}`;
      }
      return query;
    });

    // フィルタされた請求データを取得（パフォーマンス最適化）
    const filteredClaims = computed(() => {
      let filtered = availableClaims.value;

      // 金額範囲でフィルタ
      if (selectedAmountRange.value) {
        filtered = filtered.filter((claim) => {
          switch (selectedAmountRange.value) {
            case "under_1000":
              return claim.amount < 1000;
            case "1000_10000":
              return claim.amount >= 1000 && claim.amount <= 10000;
            case "10000_30000":
              return claim.amount >= 10000 && claim.amount <= 30000;
            case "30000_50000":
              return claim.amount >= 30000 && claim.amount <= 50000;
            case "over_50000":
              return claim.amount > 50000;
            default:
              return true;
          }
        });
      }

      // ステータスでフィルタ
      if (selectedStatus.value) {
        filtered = filtered.filter(
          (claim) => claim.status === selectedStatus.value
        );
      }

      // 金額でフィルタ（完全一致）
      if (amountQuery.value) {
        filtered = filtered.filter(
          (claim) => claim.amount === parseInt(amountQuery.value)
        );
      }

      return filtered;
    });

    // 対応する請求データを取得
    const getMatchedClaim = (payment) => {
      if (!payment.matchedClaimId) return null;
      return claims.value.find((claim) => claim.id === payment.matchedClaimId);
    };

    // 請求データ選択ダイアログを開く
    const openClaimSelector = (payment) => {
      selectedPayment.value = payment;
      showClaimSelectorDialog.value = true;
      // フィルタをリセット
      searchQuery.value = "";
      customerCodeQuery.value = "";
      amountQuery.value = null;
      selectedAmountRange.value = null;
      selectedStatus.value = null;
      selectedClaims.value = [];
    };

    // 請求データ選択ダイアログを閉じる
    const closeClaimSelectorDialog = () => {
      showClaimSelectorDialog.value = false;
      selectedPayment.value = null;
      selectedClaim.value = null;
    };

    // ダイアログから請求データを選択
    const selectClaimFromDialog = (claim) => {
      selectedClaim.value = claim;
      showClaimSelectorDialog.value = false;
      showConfirmDialog.value = true;
    };

    // 直接請求データを選択（ドロップダウンから）
    const selectClaimDirectly = (payment, claimId) => {
      const claim = claims.value.find((c) => c.id === claimId);
      if (claim) {
        selectedPayment.value = payment;
        selectedClaim.value = claim;
        showConfirmDialog.value = true;
      }
    };

    // 自動照合を実行
    const executeAutoMatching = () => {
      const unmatchedPayments = payments.value.filter(
        (p) => p.matchingStatus === "unmatched"
      );

      unmatchedPayments.forEach((payment) => {
        // 金額が完全一致する請求データを検索
        const matchingClaim = availableClaims.value.find(
          (claim) =>
            claim.amount === payment.amount &&
            !claim.isMatched &&
            !claim.isProcessed
        );

        if (matchingClaim) {
          // 自動照合を実行
          payment.matchedClaimId = matchingClaim.id;
          payment.matchingStatus = "auto_matched";
          payment.isProcessed = true;

          matchingClaim.isMatched = true;
          matchingClaim.isProcessed = true;
        }
      });

      alert(
        `自動照合が完了しました。${unmatchedPayments.length}件の入金データを処理しました。`
      );
    };

    // 消込みを実行
    const executeMatching = () => {
      if (selectedPayment.value && selectedClaim.value) {
        // 入金データを更新
        selectedPayment.value.matchedClaimId = selectedClaim.value.id;
        selectedPayment.value.matchingStatus = "manual_matched"; // 手動照合として設定
        selectedPayment.value.isProcessed = true;

        // 請求データを更新
        selectedClaim.value.isMatched = true;
        selectedClaim.value.isProcessed = true;

        // ダイアログを閉じる
        showConfirmDialog.value = false;
        selectedPayment.value = null;
        selectedClaim.value = null;

        // 成功メッセージ
        alert("消込みが完了しました！");
      }
    };

    // カードの色を取得する関数群
    const getPaymentCardColor = (status) => {
      switch (status) {
        case "auto_matched":
          return "green-lighten-4";
        case "manual_matched":
          return "blue-lighten-4";
        case "suggested":
          return "orange-lighten-4";
        case "unmatched":
          return "red-lighten-4";
        default:
          return "grey-lighten-4";
      }
    };

    const getClaimCardColor = (status) => {
      switch (status) {
        case "auto_matched":
          return "green-lighten-4";
        case "manual_matched":
          return "blue-lighten-4";
        case "suggested":
          return "orange-lighten-4";
        default:
          return "grey-lighten-4";
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "auto_matched":
          return "green";
        case "manual_matched":
          return "blue";
        case "suggested":
          return "orange";
        case "unmatched":
          return "red";
        default:
          return "grey";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "auto_matched":
          return "完全一致(自動)";
        case "manual_matched":
          return "完全一致(手動)";
        case "suggested":
          return "サジェスト";
        case "unmatched":
          return "不一致";
        default:
          return "未設定";
      }
    };

    // ステータスチップの色を取得
    const getStatusChipColor = (status) => {
      switch (status) {
        case "未処理":
          return "orange";
        case "処理中":
          return "blue";
        case "完了":
          return "green";
        default:
          return "grey";
      }
    };

    // 各行の請求データ検索状態を取得・更新
    const getClaimSearchQuery = (paymentId) => {
      return claimSearchStates.value.get(paymentId)?.searchQuery || "";
    };

    const updateClaimSearchQuery = (paymentId, value) => {
      if (!claimSearchStates.value.has(paymentId)) {
        claimSearchStates.value.set(paymentId, {
          searchQuery: "",
          amountRange: null,
          status: null,
        });
      }
      const state = claimSearchStates.value.get(paymentId);
      state.searchQuery = value;
    };

    const getClaimAmountRange = (paymentId) => {
      return claimSearchStates.value.get(paymentId)?.amountRange || null;
    };

    const updateClaimAmountRange = (paymentId, value) => {
      if (!claimSearchStates.value.has(paymentId)) {
        claimSearchStates.value.set(paymentId, {
          searchQuery: "",
          amountRange: null,
          status: null,
        });
      }
      const state = claimSearchStates.value.get(paymentId);
      state.amountRange = value;
    };

    const getClaimStatus = (paymentId) => {
      return claimSearchStates.value.get(paymentId)?.status || null;
    };

    const updateClaimStatus = (paymentId, value) => {
      if (!claimSearchStates.value.has(paymentId)) {
        claimSearchStates.value.set(paymentId, {
          searchQuery: "",
          amountRange: null,
          status: null,
        });
      }
      const state = claimSearchStates.value.get(paymentId);
      state.status = value;
    };

    const getClaimSelection = (paymentId) => {
      return claimSelections.value.get(paymentId) || null;
    };

    // 各行のフィルタされた請求データを取得
    const getFilteredClaimsForPayment = (payment) => {
      const state = claimSearchStates.value.get(payment.id) || {
        searchQuery: "",
        amountRange: null,
        status: null,
      };

      let filtered = availableClaims.value;

      // 検索クエリでフィルタ
      if (state.searchQuery) {
        filtered = filtered.filter(
          (claim) =>
            claim.name
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            claim.customerCode
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase())
        );
      }

      // 金額範囲でフィルタ
      if (state.amountRange) {
        filtered = filtered.filter((claim) => {
          switch (state.amountRange) {
            case "under_1000":
              return claim.amount < 1000;
            case "1000_10000":
              return claim.amount >= 1000 && claim.amount <= 10000;
            case "10000_30000":
              return claim.amount >= 10000 && claim.amount <= 30000;
            case "30000_50000":
              return claim.amount >= 30000 && claim.amount <= 50000;
            case "over_50000":
              return claim.amount > 50000;
            default:
              return true;
          }
        });
      }

      // ステータスでフィルタ
      if (state.status) {
        filtered = filtered.filter((claim) => claim.status === state.status);
      }

      return filtered;
    };

    // 請求データ選択の展開・折りたたみ機能
    const toggleClaimSelection = (event, { item }) => {
      // 不一致の入金データのみ処理
      if (item.matchingStatus === "unmatched") {
        const paymentId = item.id;
        if (sidePanelOpen.value && selectedPaymentId.value === paymentId) {
          // 既に同じ行が選択されている場合は閉じる
          closeSidePanel();
        } else {
          // サイドパネルを開く
          openSidePanel(item);
        }
      }
    };

    // サイドパネルを開く
    const openSidePanel = (payment) => {
      selectedPaymentId.value = payment.id;
      selectedPaymentForClaimSelection.value = payment;
      sidePanelOpen.value = true;

      // グローバル検索状態をリセット
      globalClaimSearchQuery.value = "";
      globalCustomerCodeQuery.value = "";
      globalAmountQuery.value = null;
      globalSelectedAmountRange.value = null;
      globalSelectedStatus.value = null;
    };

    // サイドパネルを閉じる
    const closeSidePanel = () => {
      sidePanelOpen.value = false;
      selectedPaymentId.value = null;
      selectedPaymentForClaimSelection.value = null;
    };

    const isClaimSelectionExpanded = (paymentId) => {
      return expandedClaimSelections.value.has(paymentId);
    };

    const closeClaimSelection = () => {
      closeSidePanel();
    };

    // 列全体の複合検索クエリ
    const globalCombinedSearchQuery = computed(() => {
      let query = globalClaimSearchQuery.value;
      if (globalCustomerCodeQuery.value) {
        query += ` ${globalCustomerCodeQuery.value}`;
      }
      if (globalAmountQuery.value) {
        query += ` ${globalAmountQuery.value}`;
      }
      return query;
    });

    // 列全体のフィルタされた請求データを取得
    const globalFilteredClaims = computed(() => {
      let filtered = availableClaims.value;

      // 金額範囲でフィルタ
      if (globalSelectedAmountRange.value) {
        filtered = filtered.filter((claim) => {
          switch (globalSelectedAmountRange.value) {
            case "under_1000":
              return claim.amount < 1000;
            case "1000_10000":
              return claim.amount >= 1000 && claim.amount <= 10000;
            case "10000_30000":
              return claim.amount >= 10000 && claim.amount <= 30000;
            case "30000_50000":
              return claim.amount >= 30000 && claim.amount <= 50000;
            case "over_50000":
              return claim.amount > 50000;
            default:
              return true;
          }
        });
      }

      // ステータスでフィルタ
      if (globalSelectedStatus.value) {
        filtered = filtered.filter(
          (claim) => claim.status === globalSelectedStatus.value
        );
      }

      // 金額でフィルタ（完全一致）
      if (globalAmountQuery.value) {
        filtered = filtered.filter(
          (claim) => claim.amount === parseInt(globalAmountQuery.value)
        );
      }

      return filtered;
    });

    // 列全体のテーブルから請求データを選択
    const selectClaimFromGlobalTable = (claim) => {
      if (selectedPaymentForClaimSelection.value) {
        selectedPayment.value = selectedPaymentForClaimSelection.value;
        selectedClaim.value = claim;
        showConfirmDialog.value = true;
      }
    };

    // ステータス別の件数を取得
    const getStatusCount = (status) => {
      return payments.value.filter(
        (payment) => payment.matchingStatus === status
      ).length;
    };

    return {
      showClaimSelectorDialog,
      showConfirmDialog,
      loading,
      sidePanelOpen,
      searchQuery,
      customerCodeQuery,
      amountQuery,
      selectedAmountRange,
      selectedStatus,
      selectedClaims,
      claimSearchStates,
      claimSelections,
      expandedClaimSelections,
      selectedPaymentId,
      selectedPaymentForClaimSelection,
      globalClaimSearchQuery,
      globalCustomerCodeQuery,
      globalAmountQuery,
      globalSelectedAmountRange,
      globalSelectedStatus,
      globalCombinedSearchQuery,
      globalFilteredClaims,
      selectedPayment,
      selectedClaim,
      payments,
      claims,
      availableClaims,
      filteredClaims,
      combinedSearchQuery,
      paymentHeaders,
      claimHeaders,
      amountRanges,
      statusOptions,
      getMatchedClaim,
      openClaimSelector,
      closeClaimSelectorDialog,
      selectClaimFromDialog,
      selectClaimDirectly,
      executeAutoMatching,
      executeMatching,
      getPaymentCardColor,
      getClaimCardColor,
      getStatusColor,
      getStatusText,
      getStatusChipColor,
      getClaimSearchQuery,
      updateClaimSearchQuery,
      getClaimAmountRange,
      updateClaimAmountRange,
      getClaimStatus,
      updateClaimStatus,
      getClaimSelection,
      getFilteredClaimsForPayment,
      toggleClaimSelection,
      openSidePanel,
      closeSidePanel,
      isClaimSelectionExpanded,
      closeClaimSelection,
      selectClaimFromGlobalTable,
      getStatusCount,
    };
  },
};
</script>

<style scoped>
.custom-table {
  width: 100%;
}

.table-row:hover {
  background-color: #f5f5f5;
}

.container {
  padding: 20px;
}

.claim-table {
  cursor: pointer;
}

.claim-table tbody tr:hover {
  background-color: #f5f5f5;
}

.claim-selection-card {
  min-width: 400px;
  max-width: 500px;
}

.claim-search-area {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.claim-list-area {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.claim-list {
  border-radius: 8px;
}

.claim-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.claim-item:hover {
  background-color: #f5f5f5;
}

.claim-item.selected {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.claim-item .v-list-item-title {
  font-weight: 500;
}

.claim-item .v-list-item-subtitle {
  color: #666;
  font-size: 0.75rem;
}

.claim-data-cell {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unmatched-claim-placeholder {
  text-align: center;
  padding: 16px;
  color: #666;
}

.unmatched-claim-placeholder .v-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.custom-table .v-data-table__tr {
  cursor: pointer;
}

.custom-table .v-data-table__tr:hover {
  background-color: #f5f5f5;
}
</style>
