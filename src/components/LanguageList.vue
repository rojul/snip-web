<template>
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
        ref="search"
      >
      <router-link
        class="button"
        tabindex="0"
        v-for="l in languages"
        :key="l.id"
        :to="$listeners.click ? '' : `/languages/${l.id}`"
        :tag="$listeners.click ? 'div' : 'a'"
        @click.native="onLanguagesClick(l)"
        @keyup.enter.native="onLanguagesClick(l)"
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Api from '../Api';

interface ILanguage {
  id: string;
  name: string;
  extension: string;
}

@Component({
  data() {
    return {
      errorMsg: undefined,
    };
  },
})
export default class LanguageList extends Vue {
  rawLanguages: ILanguage[] = [];
  searchValue = '';
  state?: string = 'loading';
  errorMsg?: string;

  $refs: {
    search: HTMLElement,
  };

  created() {
    this.loadLanguages();
  }

  mounted() {
    this.$refs.search.focus();
  }

  get languages() {
    const t = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const v = t(this.searchValue);
    return this.rawLanguages.filter(l =>
      [l.id, l.name, l.extension].some(e => t(e).includes(v)));
  }

  onSearchEnter() {
    if (this.languages.length < 1 || this.rawLanguages.length === this.languages.length) {
      return;
    }
    if (this.$listeners.click) {
      this.onLanguagesClick(this.languages[0]);
      return;
    }
    this.$router.push(`/languages/${this.languages[0].id}`);
  }

  loadLanguages() {
    this.errorMsg = undefined;
    this.state = 'loading';
    this.rawLanguages = [];
    Api.getLanguages().then(res => {
      this.state = undefined;
      this.rawLanguages = res.languages;
    }).catch(err => {
      this.state = 'error';
      this.handleError(err, 'Can\'t load languages');
    });
  }

  handleError(err: any, msg: string) {
    this.errorMsg = msg;
    if (err.message) {
      this.errorMsg += `: ${err.message}`;
    }
    console.log(`${this.errorMsg}:`, err);
  }

  onLanguagesClick(l: ILanguage) {
    this.$emit('click', l.id);
  }
}
</script>

<style scoped>

input {
  border: none;
  min-width: 0;
  font-size: 1rem;
  font-family: inherit;
}

.grid {
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
  cursor: pointer;

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
