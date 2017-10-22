<template>
  <div>
    <Toolbar></Toolbar>
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
.main {
  padding: 2rem;
}
</style>
