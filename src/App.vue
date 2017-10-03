<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
};
</script>

<style>
body {
  font-family: sans-serif;
  margin: 0;
  box-sizing: border-box;
  font-size: 16px;
}

*, *:before, *:after {
  box-sizing: inherit;
}

html, body, #app {
  height: 100%;
}
</style>
