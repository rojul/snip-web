<template>
  <div
    class="main"
    v-if="!view"
  >
    <div>Command:</div>
    <div>
      <input
        :value="snippet.command"
        @input="commandInput($event.target.value)"
        :placeholder="snippet.language.command"
        autocomplete="off"
        type="text"
        spellcheck="false"
      >
      <button
        @click="commandInput(snippet.language.command)"
        :disabled="snippet.command === snippet.language.command"
      >×</button>
    </div>
    <br>
    <div>Language:</div>
    <div>
      {{snippet.language.name}}
      <button @click="view = 'changeLanguage'">Change Language</button>
    </div>
    <div>
      <pre>{{ snippet }}</pre>
      <pre>{{ snippet.getRep() }}</pre>
    </div>
  </div>
  <div
    class="change-language"
    v-else-if="view === 'changeLanguage'"
  >
    <button class="close" @click="view = undefined">Close</button>
    <LanguageList
      @click="view = undefined; changeLanguage($event)"
    ></LanguageList>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Language from '../Language';
import Snippet from '../Snippet';
import LanguageList from './LanguageList.vue';

@Component({
  components: {
    LanguageList,
  },
  data() {
    return {
      view: undefined,
    };
  },
})
export default class Config extends Vue {
  @Prop({ type: Snippet, required: true })
  snippet: Snippet;

  view?: string;

  commandInput(val) {
    this.$emit('commandInput', val);
  }

  async changeLanguage(id) {
    const l = await Language.loadLanguage(id).catch(err => {
      console.log('Error:', err);
    });
    if (!l) {
      return;
    }
    this.$emit('languageChange', l);
  }
}
</script>

<style scoped>
.main {
  padding: 1rem;
}

.change-language {
  padding: 2rem;
}

.change-language .close {
  margin-bottom: 1rem;
}
</style>
