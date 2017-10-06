<template>
  <div>
    <Toolbar></Toolbar>
    <div class="grid">
      <div
        v-if="errorMsg"
        class="full-width error"
      >{{ errorMsg }}</div>
      <input
        class="full-width"
        placeholder="Search"
        autofocus
        autocomplete="off"
        type="text"
        spellcheck="false"
        maxlength="1000"
        v-model="searchValue"
        @keyup.enter="onSearchEnter"
      ></input>
      <router-link
        class="button"
        v-for="l in languages"
        :key="l.id"
        :to="`/languages/${l.id}`"
      >{{ l.name }}</router-link>
      <div
        v-if="state === 'loading'"
        class="full-width no-bg"
      >Loading...</div>
      <div
        v-else-if="!state && languages.length === 0"
        class="full-width no-bg"
      >No results found</div>
    </div>
  </div>
</template>

<script>
import Api from '@/Api';

export default {
  name: 'home',
  components: {},
  data() {
    return {
      rawLanguages: [],
      searchValue: '',
      state: 'loading',
      errorMsg: undefined,
    };
  },
  computed: {
    languages() {
      const t = s => s.replace(/\s+/g, '').toLowerCase();
      const s = t(this.searchValue);
      return this.rawLanguages.filter(l =>
        [l.id, l.name, l.extension].some(e => t(e).includes(s)));
    },
  },
  methods: {
    onSearchEnter() {
      if (this.languages.length < 1 || this.rawLanguages.length === this.languages.length) {
        return;
      }
      this.$router.push(`/languages/${this.languages[0].id}`);
    },
    loadLanguages() {
      this.errorMsg = undefined;
      this.state = 'loading';
      this.rawLanguages = [];
      Api.getLanguages().then((res) => {
        this.state = undefined;
        this.rawLanguages = res.languages;
      }).catch((err) => {
        this.state = 'error';
        this.handleError(err, 'Can\'t load languages');
      });
    },
    handleError(err, msg) {
      this.errorMsg = msg;
      if (err.errorMsg) {
        this.errorMsg += `: ${err.errorMsg}`;
      }
      console.log(`${this.errorMsg}:`, err);
    },
  },
  created() {
    this.loadLanguages();
  },
};
</script>

<style scoped>

input {
  border: none;
  min-width: 0;
  font-size: 1rem;
  font-family: inherit;
}

.grid {
  padding: 2rem;
  display: grid;
  grid-gap: .5rem;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
}

.full-width {
  grid-column: 1 / -1;
}

.grid > * {
  background: #eceff1;
  border-radius: .125rem;
  padding: 1rem;
  transition: background .2s;
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a {
  text-decoration: none;
  color: inherit;
  border: none;
}

.button:hover {
  background: #cfd8dc;
}

.no-bg {
  background: inherit;
}

.error {
  background: #f44336;
  color: #fff;
}
</style>
