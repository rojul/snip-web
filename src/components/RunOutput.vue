<template>
  <div>
    <pre
      v-for="o in os"
      :class="o.class"
    >{{ o.text }}</pre>
  </div>
</template>

<script>
export default {
  name: 'run-output',
  props: {
    output: {
      type: Object,
      required: true,
      default: () => ({ info: 'Press "Run" to run the code' }),
    },
  },
  computed: {
    os() {
      const os = [];
      const spacer = () => {
        if (os.length !== 0) {
          os.push({ text: '\n' });
        }
      };
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
    },
  },
};
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
