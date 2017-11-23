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

<script>
import LanguageList from '@/components/LanguageList';

export default {
  name: 'home',
  components: {
    LanguageList,
  },
  data() {
    return {};
  },
};
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
