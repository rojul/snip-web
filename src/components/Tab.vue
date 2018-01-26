<template>
  <div class="tab" v-show="show && active">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tab extends Vue {
  @Prop(String)
  type?: string;

  @Prop({ required: true })
  id;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  fullheight: boolean;

  @Prop({ type: Boolean, default: true })
  show: boolean;

  active = false;

  isLeft() {
    return !this.type;
  }

  isRight() {
    return this.type === 'right';
  }

  isBottom() {
    return this.type === 'bottom';
  }

  isButton() {
    return this.type === 'button';
  }

  setActive(v) {
    this.active = v;
  }
}
</script>

<style scoped>
.tab {
  height: 100%;
}
</style>
