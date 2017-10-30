<template>
  <div class="root">
    <div class="bar">
      <div class="tabs">
        <div
          v-for="t in tabs.filter(t => t.isLeft() && t.show)"
          :key="t.id"
          :class="{ active: value === t.id }"
          @click="click(t)"
        >{{ t.name }}</div>
        <div class="space"></div>
        <div
          v-for="t in tabs.filter(t => t.isRight() && t.show)"
          :key="t.id"
          :class="{ active: value === t.id }"
          @click="click(t)"
        >{{ t.name }}</div>
      </div>
      <div class="buttons">
        <div
          v-for="(t, i) in tabs.filter(t => t.isButton() && t.show)"
          :key="t.id"
          @click="click(t)"
        >{{ t.name }}</div>
      </div>
    </div>
    <div
      class="content"
      :class="{ dragging: dragging }"
      ref="content"
      @mousemove="dragMove"
      @mouseup="dragEnd"
      @mouseleave="dragEnd"
      @touchmove="dragMove"
      @touchend="dragEnd"
      @touchcancel="dragEnd"
    >
      <div :style="{ height: `${splitVal || 100}%` }">
        <slot></slot>
      </div>
      <div
        class="bottom"
        :style="{ height: `${100 - splitVal}%` }"
        v-show="splitVal"
      >
        <slot name="bottom"></slot>
      </div>
      <div
        class="dragger"
        @mousedown.prevent="dragStart"
        @touchstart.prevent="dragStart"
        :style="{ top: `calc(${splitVal}% - 6px)` }"
        v-show="splitVal"
      ></div>
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
      dragging: false,
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
    dragStart(e) {
      e.preventDefault();
      this.dragging = true;
      this.startY = e.pageY || e.touches[0].pageY;
      this.startSplit = this.split;
    },
    dragMove(e) {
      if (!this.dragging) {
        return;
      }
      e.preventDefault();
      const dy = (e.pageY || e.touches[0].pageY) - this.startY;
      const totalHeight = this.$refs.content.offsetHeight;
      let split = this.startSplit + ((dy / totalHeight) * 100);
      split = Math.floor((split) * 1e4) / 1e4;
      this.split = Math.min(Math.max(split, 10), 90);
    },
    dragEnd() {
      this.dragging = false;
    },
  },
  computed: {
    splitVal() {
      const tab = this.tabs.find(t => t.id === this.value);
      if (!tab || tab.fullheight || !this.$slots.bottom) {
        return undefined;
      }
      return this.split;
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
  position: relative;
}

.content > div {
  overflow: auto;
  position: absolute;
  width: 100%;
}

.dragging, .dragger {
  cursor: row-resize;
}

.dragger {
  background: #cfd8dc;
  height: 12px;
  padding: 5.5px 0;
  background-clip: content-box;
}

.bottom {
  bottom: 0;
}
</style>
