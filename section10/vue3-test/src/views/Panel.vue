<!-- src/views/Panel.vue -->
<template>
  <v-expansion-panels v-model="panelModel" class="mb-4">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <span class="text-h6">{{ title }}</span>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <slot></slot>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    defaultCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const panelModel = ref(props.defaultCollapsed ? null : 0);

    return {
      panelModel,
    };
  },
};
</script>

<style scoped>
/* Vuetifyのクラスを使用するため、カスタムCSSは最小限に */
</style>
