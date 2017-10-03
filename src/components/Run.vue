<template>
  <div class="root">
    <Toolbar></Toolbar>
    <Tabs v-model="selectedTab">
      <template v-if="!state">
        <Tab
          v-for="f in snippet.files"
          :key="f.uid"
          :name="f.name"
          :id="f.uid"
        >
          <TextareaEditor v-model="f.content"></TextareaEditor>
        </Tab>
        <Tab type="right" name="Input" id="stdin">
          <TextareaEditor v-model="snippet.stdin"></TextareaEditor>
        </Tab>
        <Tab type="right" name="Output" id="output">
          <RunOutput :output="output"></RunOutput>
        </Tab>
        <Tab type="button" id="create" name="+" @click="createFile"></Tab>
        <Tab type="button" id="edit" name="✎" @click="renameFile"></Tab>
        <Tab type="button" id="delete" name="×" @click="removeFile"></Tab>
        <Tab type="button" id="run" name="Run" @click="run"></Tab>
        <Tab type="button" id="clone" name="Clone" @click="cloneSnippet" v-if="$route.name === 'SnippetRun'"></Tab>
        <Tab type="button" id="save" name="Save" @click="createSnippet" v-else></Tab>
        <Tab type="button" id="config" name="⚙">
          <div class="config">
            <div>Command:</div>
            <div>
              <input v-model="snippet.command"></input>
              <button
                @click="snippet.command = snippet.language.command"
                :disabled="snippet.command === snippet.language.command"
              >×</button>
            </div>
            <pre>{{ snippet }}</pre>
            <pre>{{ snippet.getRep() }}</pre>
          </div>
        </Tab>
      </template>
    </Tabs>
    <Statusbar :status="status"></Statusbar>
  </div>
</template>

<script>
import RunOutput from '@/components/RunOutput';
import Statusbar from '@/components/Statusbar';
import Tab from '@/components/Tab';
import Tabs from '@/components/Tabs';
import TextareaEditor from '@/components/TextareaEditor';
import Snippet from '@/Snippet';

export default {
  name: 'run',
  components: {
    RunOutput,
    Statusbar,
    Tab,
    Tabs,
    TextareaEditor,
  },
  data() {
    return {
      snippet: undefined,
      output: undefined,
      selectedTab: undefined,
      state: 'loading',
      errorMsg: undefined,
    };
  },
  computed: {
    status() {
      const space = { space: true };
      if (this.state === 'loading') {
        return [{ text: 'Loading...' }];
      }
      if (this.state) {
        return [];
      }
      return [space, { text: this.snippet.language.name }];
    },
  },
  methods: {
    createSnippet() {
      this.errorMsg = undefined;
      this.snippet.save().then(() => {
        this.$router.push({ name: 'SnippetRun', params: { id: this.snippet.id } });
      }).catch((err) => {
        this.handleError('Can\'t save snippet', err);
      });
    },
    cloneSnippet() {
      this.snippet.clone();
      this.$router.push({ name: 'LanguageRun', params: { id: this.snippet.language.id } });
    },
    renameFile() {
      const file = this.snippet.files.find(f => f.uid === this.selectedTab);
      if (!file) {
        return;
      }
      /* eslint-disable no-alert */
      const nn = prompt(`Rename ${file.name}:`, file.name);
      if (typeof nn === 'string' && nn !== '') {
        file.name = nn;
      }
    },
    removeFile() {
      const selectedTab = this.snippet.removeFile(this.selectedTab);
      if (!selectedTab) {
        return;
      }
      this.selectedTab = selectedTab;
    },
    createFile() {
      const uid = this.snippet.createFile();
      if (!uid) {
        return;
      }
      this.$nextTick(() => {
        this.selectedTab = uid;
      });
    },
    run() {
      this.errorMsg = undefined;
      this.selectedTab = 'output';
      this.output = { info: 'Running...' };
      this.snippet.run().then((output) => {
        this.output = output;
      });
    },
    handleError(msg, err) {
      this.errorMsg = msg;
      console.log(`${this.errorMsg}:`, err);
    },
  },
  async created() {
    this.state = 'loading';
    this.errorMsg = undefined;
    let p;
    if (this.$route.name === 'SnippetRun') {
      p = Snippet.loadSnippet(this.$route.params.id);
    } else {
      p = Snippet.loadLanguage(this.$route.params.id);
    }
    p.then((s) => {
      this.state = undefined;
      this.snippet = s;
    }).catch((err) => {
      this.state = 'error';
      this.handleError('Can\'t load snippet', err);
    });
  },
};
</script>

<style scoped>
.root {
  display: grid;
  height: 100%;
  grid-template: "toolbar  " auto
                 "tabs     " 1fr
                 "statusbar" auto
                 / 100%;
}

.config {
  padding: 1rem;
}
</style>
