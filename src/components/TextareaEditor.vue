<template>
  <textarea
    :value="value"
    @input="update($event.target.value)"
    autocomplete="off"
    spellcheck="false"
  ></textarea>
</template>

<script>
export default {
  name: 'textarea-editor',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    update(value) {
      this.$emit('input', value);
    },
  },
};
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
