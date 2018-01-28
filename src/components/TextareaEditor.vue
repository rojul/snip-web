<template>
  <textarea
    :value="value"
    @input="update($event.target.value)"
    autocomplete="off"
    spellcheck="false"
  ></textarea>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextareaEditor extends Vue {
  @Prop({ type: String, required: true })
  value: string;

  update(value: string) {
    this.$emit('input', value);
  }
}
</script>

<style scoped>
textarea {
  outline: none;
  resize: none;
  border: none;
  padding: 1rem;
  font-family: monospace;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: block;
  font-size: inherit;
}
</style>
