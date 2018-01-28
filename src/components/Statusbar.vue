<template>
  <footer>
    <div
      v-for="(s, i) in status"
      :key="i"
      :class="{ space: s.space }"
    >{{ s.text }}</div>
  </footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Statusbar extends Vue {
  @Prop(Array)
  status: Array<{ text: string } | { space: boolean }>;
}
</script>

<style scoped>
footer {
  background: #cfd8dc;
  color: #263238;
  display: flex;
  font-size: .85rem;
  height: 1.5rem;
  padding: 0 0 .125rem 0;
}

.space {
  flex: 1;
}

footer > *:not(.space) {
  padding: 0 .5rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
</style>
