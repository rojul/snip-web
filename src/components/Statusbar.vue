<template>
  <footer>
    <div
      v-for="s in status"
      :class="{ space: s.space }"
    >{{ s.text }}</div>
  </footer>
</template>

<script>
export default {
  name: 'statusbar',
  props: {
    status: Array,
  },
};
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
