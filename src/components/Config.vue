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
      ></input>
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

<script>
import Snippet from '@/Snippet';
import Language from '@/Language';
import LanguageList from '@/components/LanguageList';

export default {
  name: 'config',
  components: {
    LanguageList,
  },
  props: {
    snippet: {
      type: Snippet,
      required: true,
    },
  },
  data() {
    return {
      view: undefined,
    };
  },
  methods: {
    commandInput(val) {
      this.$emit('commandInput', val);
    },
    async changeLanguage(id) {
      const l = await Language.loadLanguage(id).catch((err) => {
        console.log('Error:', err);
      });
      if (!l) {
        return;
      }
      this.$emit('languageChange', l);
    },
  },
};
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
