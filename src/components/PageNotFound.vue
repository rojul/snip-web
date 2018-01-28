<template>
  <div>
    <Toolbar title="Page Not Found"></Toolbar>
    <div class="content">Page Not Found</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PageNotFound extends Vue {
}
</script>

<style scoped>
.content {
  padding: 2rem;
}
</style>
