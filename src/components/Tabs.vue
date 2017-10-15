<template>
  <div class="root">
    <div class="bar">
      <div class="tabs">
        <div
          v-for="t in tabs.filter(t => t.isLeft())"
          :key="t.id"
          :class="{ active: value === t.id }"
          @click="click(t)"
        >{{ t.name }}</div>
        <div class="space"></div>
        <div
          v-for="t in tabs.filter(t => t.isRight())"
          :key="t.id"
          :class="{ active: value === t.id }"
          @click="click(t)"
        >{{ t.name }}</div>
      </div>
      <div class="buttons">
        <div
          v-for="(t, i) in tabs.filter(t => t.isButton())"
          :key="t.id"
          @click="click(t)"
        >{{ t.name }}</div>
      </div>
    </div>
    <div class="content">
      <div :style="{ height: `${splitVal}%` }">
        <slot></slot>
      </div>
      <div :style="{ height: `${100 - splitVal}%` }" v-show="splitVal !== 100">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  props: {
    value: {
      required: true,
    },
  },
  data() {
    return {
      tabs: this.$children,
      split: 70,
    };
  },
  methods: {
    click(tab) {
      if (tab.$listeners.click) {
        tab.$emit('click');
        return;
      }
      this.$emit('input', tab.id);
    },
  },
  computed: {
    splitVal() {
      const tab = this.tabs.find(t => t.id === this.value);
      if (!tab) {
        return undefined;
      }
      return tab.fullheight ? 100 : this.split;
    },
  },
  watch: {
    tabs() {
      if (this.tabs.find(t => t.id === this.value)) {
        return;
      }
      const tab = this.tabs.find(t => t.isLeft());
      if (tab) {
        this.click(tab);
      }
    },
    value() {
      this.tabs.forEach((t) => {
        t.setActive(t.id === this.value || t.isBottom());
      });
    },
  },
};
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
}

.bar {
  display: flex;
  background: #607d8b;
  color: #fff;
  text-align: center;
  height: 3.5rem;
  /* flex-wrap: wrap; */
}

.tabs, .buttons {
  display: flex;
  overflow: auto;
}

.tabs {
  background: #eceff1;
  color: #263238;
  min-width: 50%;
  flex: 1;
}

.space {
  flex: 1;
}

.buttons > *,
.tabs > *:not(.space) {
  padding: 0 1rem;
  display: flex;
  align-items: center;
  white-space: pre;
  transition: background .2s, color .2s;
  cursor: pointer;
}

.tabs > *.active {
  background: #fff;
}

.tabs > *:hover:not(.active):not(.space) {
  background: #cfd8dc;
}

.buttons > *:hover {
  color: #cfd8dc;
}

.content {
  flex: 1;
}

.content > div {
  overflow: auto;
}
</style>
