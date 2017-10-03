import Api from '@/Api';
import Language from '@/Language';

let uidCouter = 0;

export default class Snippet {
  constructor(l, s) {
    this.language = l;
    this.files = s.files;
    this.assignUids();
    this.command = s.command;
    this.stdin = s.stdin || '';
    this.assignSnippetProps(s);
  }

  get command() {
    return this._command !== undefined ? this._command : this.language.command;
  }

  set command(v) {
    this._command = v === this.language.command ? undefined : v;
  }

  assignSnippetProps(s) {
    this.id = s.id;
    this.created = s.created;
    this.modified = s.modified;
  }

  static getUid() {
    uidCouter += 1;
    return uidCouter;
  }

  assignUids() {
    this.files.forEach((f) => {
      if (!f.uid) {
        /* eslint-disable no-param-reassign */
        f.uid = Snippet.getUid();
      }
    });
  }

  createFile() {
    if (this.files.length >= 20) {
      return undefined;
    }
    const uid = Snippet.getUid();
    this.files.push({
      name: this.getUnusedFilename(),
      content: '',
      uid,
    });
    return uid;
  }

  removeFile(uid) {
    if (this.files.length < 2) {
      return undefined;
    }
    const i = this.files.findIndex(f => f.uid === uid);
    if (i < 0) {
      return undefined;
    }
    this.files.splice(i, 1);
    const ni = i < this.files.length ? i : i - 1;
    return this.files[ni].uid;
  }

  getUnusedFilename() {
    const t = j => `untitled${j + 1}.${this.language.extension}`;
    for (let i = 0; ; i += 1) {
      const n = this.files.find(f => f.name === t(i));
      if (!n) {
        return t(i);
      }
    }
  }

  getRep() {
    const rmDefaults = (val, ...def) => (['', ...def].includes(val) ? undefined : val);
    return {
      id: this.id,
      language: this.language.id,
      files: this.files.map(file => ({
        name: file.name,
        content: rmDefaults(file.content),
      })),
      command: rmDefaults(this._command),
      stdin: rmDefaults(this.stdin),
    };
  }

  async save() {
    return Api.createSnippet(this.getRep()).then((snippet) => {
      this.assignSnippetProps(snippet);
    });
  }

  async clone() {
    this.id = undefined;
    this.created = undefined;
    this.modified = undefined;
  }

  async run() {
    return Api.runSnippet(this.getRep()).catch((err) => {
      let error = 'Can\'t run snippet';
      if (err.statusText) {
        error += `: ${err.statusText}`;
      }
      console.log(`${error}:`, err);
      return { error };
    });
  }

  static async loadSnippet(id) {
    const s = await Api.getSnippet(id);
    const l = await Language.loadLanguage(s.language);
    return new Snippet(l, s);
  }

  static async loadLanguage(langName) {
    const l = await Language.loadLanguage(langName);
    return new Snippet(l, {
      files: [{
        name: `main.${l.extension}`,
        content: l.helloWorld,
      }],
    });
  }
}