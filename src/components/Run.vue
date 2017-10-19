<template>
  <div class="root">
    <Toolbar class="grid-toolbar" :title="title"></Toolbar>
    <div class="grid-error" v-if="errorMsg">{{ errorMsg }}</div>
    <Tabs class="grid-tabs" v-model="selectedTab">
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
        <Tab type="bottom" name="Output" id="output" slot="bottom">
          <RunOutput :output="output"></RunOutput>
        </Tab>
        <Tab type="button" id="create" name="+" @click="createFile"></Tab>
        <Tab type="button" id="edit" name="✎" @click="renameFile"></Tab>
        <Tab type="button" id="delete" name="×" @click="removeFile"></Tab>
        <Tab type="button" id="run" name="Run" @click="run"></Tab>
        <Tab type="button" id="clone" name="Clone" @click="cloneSnippet" v-if="$route.name === 'SnippetRun'"></Tab>
        <Tab type="button" id="save" name="Save" @click="saveSnippet" v-else></Tab>
        <Tab type="button" id="config" name="⚙" fullheight>
          <Config
            v-if="selectedTab === 'config'"
            :snippet="snippet"
            @commandInput="snippet.command = $event"
          ></Config>
        </Tab>
      </template>
    </Tabs>
    <Statusbar class="grid-statusbar" :status="status"></Statusbar>
  </div>
</template>

<script>
import Config from '@/components/Config';
import RunOutput from '@/components/RunOutput';
import Statusbar from '@/components/Statusbar';
import Tab from '@/components/Tab';
import Tabs from '@/components/Tabs';
import TextareaEditor from '@/components/TextareaEditor';
import Snippet from '@/Snippet';

export default {
  name: 'run',
  components: {
    Config,
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
      isRunning: false,
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
    title() {
      if (!this.snippet) {
        return undefined;
      }
      return `${this.snippet.language.name} Snippet`;
    },
  },
  methods: {
    saveSnippet() {
      this.errorMsg = undefined;
      this.snippet.save().then(() => {
        this.$router.push({ name: 'SnippetRun', params: { id: this.snippet.id } });
      }).catch((err) => {
        this.handleError(err, 'Can\'t save snippet');
      });
    },
    cloneSnippet() {
      this.errorMsg = undefined;
      this.snippet.clone();
      this.$router.push({ name: 'LanguageRun', params: { id: this.snippet.language.id } });
    },
    renameFile() {
      this.errorMsg = undefined;
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
      this.errorMsg = undefined;
      const selectedTab = this.snippet.removeFile(this.selectedTab);
      if (!selectedTab) {
        return;
      }
      this.selectedTab = selectedTab;
    },
    createFile() {
      this.errorMsg = undefined;
      const uid = this.snippet.createFile();
      if (!uid) {
        return;
      }
      this.$nextTick(() => {
        this.selectedTab = uid;
      });
    },
    canRun() {
      return !this.isRunning;
    },
    run() {
      if (!this.canRun()) {
        return;
      }
      this.isRunning = true;
      this.errorMsg = undefined;
      this.output = { info: 'Running...' };
      this.snippet.run().then((output) => {
        this.output = output;
        this.isRunning = false;
      });
    },
    handleError(err, msg) {
      this.errorMsg = msg;
      if (err.errorMsg) {
        this.errorMsg += `: ${err.errorMsg}`;
      }
      console.log(`${this.errorMsg}:`, err);
    },
    onKeydown(e) {
      if (!e.ctrlKey && !e.metaKey) {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        this.run();
      }
      if (e.key === 's') {
        e.preventDefault();
        this.saveSnippet();
      }
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
      const type = this.$route.name === 'SnippetRun' ? 'snippet' : 'language';
      this.handleError(err, `Can't load ${type}`);
    });
  },
  mounted() {
    document.addEventListener('keydown', this.onKeydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown);
  },
};
</script>

<style scoped>
.root {
  display: grid;
  height: 100%;
  grid-template: "toolbar  " auto
                 "error    " auto
                 "tabs     " 1fr
                 "statusbar" auto
                 / 100%;
}

.grid-toolbar {
  grid-area: toolbar;
}

.grid-tabs {
  grid-area: tabs;
}

.grid-statusbar {
  grid-area: statusbar;
}

.grid-error {
  grid-area: error;
  height: 3.5rem;
  background: #f44336;
  color: #fff;
  padding: 0 1rem;
  display: flex;
  align-items: center;
}
</style>
