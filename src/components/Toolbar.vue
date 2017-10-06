<template>
  <nav>
    <router-link to="/">Snip</router-link>
    <div class="space"></div>
  </nav>
</template>

<script>
export default {
  name: 'toolbar',
  props: {
    title: String,
  },
  data() {
    return {};
  },
  methods: {
    updateTitle() {
      document.title = `${this.title ? `${this.title} - ` : ''}Snip`;
    },
  },
  created() {
    this.updateTitle();
  },
  watch: {
    title() {
      this.updateTitle();
    },
  },
};
</script>

<style scoped>
nav a {
  text-decoration: none;
  color: inherit;
  border: none;
}

nav {
  background: #607d8b;
  color: #fff;
  display: flex;
  height: 3.5rem;
}

.space {
  flex: 1;
}

nav > *:not(.space) {
  padding: 0 1rem;
  display: flex;
  align-items: center;
  transition: color .2s;
}

nav > *:hover {
  color: #cfd8dc;
}
</style>
