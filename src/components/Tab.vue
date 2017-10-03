<template>
  <div class="tab" v-show="active">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tab',
  props: {
    type: {
      type: String,
    },
    id: {
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      active: false,
    };
  },
  methods: {
    isLeft() {
      return !this.type;
    },
    isRight() {
      return this.type === 'right';
    },
    isButton() {
      return this.type === 'button';
    },
    setActive(v) {
      this.active = v;
    },
  },
};
</script>

<style scoped>
.tab {
  height: 100%;
}
</style>
