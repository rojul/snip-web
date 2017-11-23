<template>
  <div>
    <Toolbar title="About"></Toolbar>
    <div class="content">
      <h1>About</h1>
      <p>Snip is an <a href="https://github.com/rojul/snip">open source</a> pastebin with runnable snippets.</p>
      <p>The code is send to a server, executed inside a Docker container with limited resources and the output is streamed back and displayed.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',
};
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  width: 100%;
}

.content {
  padding: calc(2rem + 3.5rem) 2rem 2rem;
}

.content > * {
  max-width: 37rem;
}

.content > *:first-child {
  margin-top: 0;
}

.content > *:last-child {
  margin-bottom: 0;
}

h1 {
  font-size: 1.5rem;
  font-weight: normal;
}

a {
  color: #546e7a;
  text-decoration: none;
}

a:focus, a:hover {
  text-decoration: underline;
}
</style>
