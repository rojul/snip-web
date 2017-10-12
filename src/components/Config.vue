<template>
  <div class="root">
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
    <pre>{{ snippet }}</pre>
    <pre>{{ snippet.getRep() }}</pre>
  </div>
</template>

<script>
import Snippet from '@/Snippet';

export default {
  name: 'config',
  props: {
    snippet: {
      type: Snippet,
      required: true,
    },
  },
  methods: {
    commandInput(val) {
      this.$emit('commandInput', val);
    },
  },
};
</script>

<style scoped>
.root {
  padding: 1rem;
}
</style>
