<template>
  <div class="grid">
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
        <Tab type="bottom" name="Output" id="output" slot="bottom" v-if="!snippet.language.notRunnable">
          <RunOutput :output="output"></RunOutput>
        </Tab>
        <Tab type="button" id="create" name="+" @click="createFile"></Tab>
        <Tab type="button" id="edit" name="✎" @click="renameFile"></Tab>
        <Tab type="button" id="delete" name="×" @click="removeFile"></Tab>
        <Tab type="button" id="run" name="Run" @click="run" :show="!snippet.language.notRunnable"></Tab>
        <Tab type="button" id="clone" name="Clone" @click="cloneSnippet" v-if="$route.name === 'SnippetRun'"></Tab>
        <Tab type="button" id="save" name="Save" @click="saveSnippet" v-else></Tab>
        <Tab type="button" id="config" name="⚙" fullheight>
          <Config
            v-if="selectedTab === 'config'"
            :snippet="snippet"
            @commandInput="snippet.command = $event"
            @languageChange="changeLanguage"
          ></Config>
        </Tab>
      </template>
    </Tabs>
    <Statusbar class="grid-statusbar" :status="status"></Statusbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Language from '../Language';
import { IRunResultEvent, RunResult } from '../RunResult';
import Snippet from '../Snippet';
import Config from './Config.vue';
import RunOutput from './RunOutput.vue';
import Statusbar from './Statusbar.vue';
import Tab from './Tab.vue';
import Tabs from './Tabs.vue';
import TextareaEditor from './TextareaEditor.vue';

@Component({
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
      selectedTab: undefined,
      errorMsg: undefined,
    };
  },
})
export default class Run extends Vue {
  state?: string = 'loading';
  snippet?: Snippet;
  output = RunResult.helpInfo();
  selectedTab: number | string;
  errorMsg?: string;

  async created() {
    this.state = 'loading';
    this.errorMsg = undefined;
    let p;
    if (this.$route.name === 'SnippetRun') {
      p = Snippet.loadSnippet(this.$route.params.id);
    } else {
      p = Snippet.loadLanguage(this.$route.params.id);
    }
    p.then(s => {
      this.state = undefined;
      this.snippet = s;
    }).catch(err => {
      this.state = 'error';
      const type = this.$route.name === 'SnippetRun' ? 'snippet' : 'language';
      this.handleError(err, `Can't load ${type}`);
    });
  }

  mounted() {
    document.addEventListener('keydown', this.onKeydown);
    document.body.style.overflow = 'hidden';
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown);
    document.body.style.overflow = '';
  }

  get status() {
    const space = { space: true };
    if (this.state === 'loading') {
      return [{ text: 'Loading...' }];
    }
    if (this.state) {
      return [];
    }
    return [space, { text: this.snippet!.language.name }];
  }

  get title() {
    if (!this.snippet) {
      return undefined;
    }
    return `${this.snippet.language.name} Snippet`;
  }

  changeLanguage(l: Language) {
    this.snippet!.language = l;
    if (this.$route.name === 'LanguageRun') {
      this.$router.replace({ name: 'LanguageRun', params: { id: this.snippet!.language.id } });
    }
  }

  saveSnippet() {
    this.errorMsg = undefined;
    this.snippet!.save().then(() => {
      this.$router.replace({ name: 'SnippetRun', params: { id: this.snippet!.id! } });
    }).catch(err => {
      this.handleError(err, 'Can\'t save snippet');
    });
  }

  cloneSnippet() {
    this.errorMsg = undefined;
    this.snippet!.clone();
    this.$router.push({ name: 'LanguageRun', params: { id: this.snippet!.language.id } });
  }

  renameFile() {
    this.errorMsg = undefined;
    const file = this.snippet!.files.find(f => f.uid === this.selectedTab);
    if (!file) {
      return;
    }
    const nn = prompt(`Rename ${file.name}:`, file.name);
    if (typeof nn === 'string' && nn !== '') {
      file.name = nn;
    }
  }

  removeFile() {
    this.errorMsg = undefined;
    const selectedTab = this.snippet!.removeFile(this.selectedTab as number);
    if (!selectedTab) {
      return;
    }
    this.selectedTab = selectedTab;
  }

  createFile() {
    this.errorMsg = undefined;
    const uid = this.snippet!.createFile();
    if (!uid) {
      return;
    }
    this.$nextTick(() => {
      this.selectedTab = uid;
    });
  }

  canRun() {
    return !this.output.isRunning && !this.snippet!.language.notRunnable;
  }

  async run() {
    if (!this.canRun()) {
      return;
    }
    this.errorMsg = undefined;
    this.output = RunResult.startRunning();
    let reader: ReadableStreamReader;
    try {
      reader = await this.snippet!.run();
    } catch (e) {
      this.output.setError('Can\'t run snippet', e);
      return;
    }
    for (;;) {
      let obj: { done: boolean, value: IRunResultEvent & RunResult };
      try {
        obj = await reader.read();
      } catch (e) {
        this.output.setError('Can\'t run snippet', e);
        return;
      }
      if (obj.done) {
        this.output.stopRunning();
        return;
      }
      if (obj.value.type) {
        this.output.events.push(obj.value);
      } else {
        this.output.events.push(...(obj.value.events || []));
        this.output.error = obj.value.error;
        this.output.exitCode = obj.value.exitCode;
      }
    }
  }

  handleError(err: any, msg: string) {
    this.errorMsg = msg;
    if (err.message) {
      this.errorMsg += `: ${err.message}`;
    }
    console.log(`${this.errorMsg}:`, err);
  }

  onKeydown(e: KeyboardEvent) {
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
  }
}
</script>

<style scoped>
.grid {
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
