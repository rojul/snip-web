<template>
  <div>
    <Toolbar>
      <router-link to="/about">About</router-link>
    </Toolbar>
    <div class="main">
      <LanguageList></LanguageList>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import LanguageList from './LanguageList.vue';

@Component({
  components: {
    LanguageList,
  },
})
export default class Home extends Vue {
}
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  width: 100%;
}

.main {
  padding: calc(2rem + 3.5rem) 2rem 2rem;
}
</style>
