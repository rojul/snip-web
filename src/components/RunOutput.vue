<template>
  <div>
    <pre
      v-for="(o, i) in os"
      :key="i"
      :class="o.class"
    >{{ o.text }}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { RunResult } from '../RunResult';

@Component
export default class RunOutput extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  output: RunResult;

  get os() {
    const os: Array<{ text: string, class?: string }> = [];
    const spacer = () => {
      if (os.length !== 0) {
        os.push({ text: '\n' });
      }
    };
    if (!this.output) {
      return;
    }
    if (this.output.events) {
      os.push(...this.output.events.map(e => ({
        text: e.message,
        class: e.type,
      })));
    }
    if (this.output.error) {
      spacer();
      os.push({
        text: this.output.error,
        class: 'error',
      });
    }
    if (this.output.exitCode !== undefined) {
      spacer();
      const s = this.output.exitCode !== 0 ? ` with code ${this.output.exitCode}` : '';
      os.push({
        text: `Program exited${s}`,
        class: 'info',
      });
    }
    if (this.output.info) {
      spacer();
      os.push({
        text: this.output.info,
        class: 'info',
      });
    }
    return os;
  }
}
</script>

<style scoped>
div {
  padding: 1rem;
  font-size: inherit;
}

pre {
  display: inline;
  margin: 0;
}

.stderr, .error {
  color: #b71c1c;
}

.info {
  color: #78909c;
}

.error, .info, .space {
  display: block;
}
</style>
