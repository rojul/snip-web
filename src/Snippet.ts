import Api from './Api';
import File from './File';
import Language from './Language';

export default class Snippet {
  id?: string;
  language: Language;
  files: File[];
  stdin: string;
  created?: number;
  modified?: number;
  private rawCommand?: string;

  constructor(l: Language, s: any) {
    this.language = l;
    this.files = s.files.map((f: any) => new File(f));
    this.command = s.command;
    this.stdin = s.stdin || '';
    this.assignSnippetProps(s);
  }

  get command() {
    return this.rawCommand !== undefined ? this.rawCommand : this.language.command;
  }

  set command(v) {
    this.rawCommand = v === this.language.command ? undefined : v;
  }

  private assignSnippetProps(s: any) {
    this.id = s.id;
    this.created = s.created;
    this.modified = s.modified;
  }

  createFile() {
    if (this.files.length >= 20) {
      return undefined;
    }
    const file = new File({ name: this.getUnusedFilename() });
    this.files.push(file);
    return file.uid;
  }

  removeFile(uid: number) {
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
    const t = (j: number) => `untitled${j + 1}.${this.language.extension}`;
    for (let i = 0; ; i += 1) {
      const n = this.files.find(f => f.name === t(i));
      if (!n) {
        return t(i);
      }
    }
  }

  getRep() {
    const rmDefaults = (val: string | undefined) => val === '' ? undefined : val;
    return {
      id: this.id,
      language: this.language.id,
      files: this.files.map(file => ({
        name: file.name,
        content: rmDefaults(file.content),
      })),
      command: rmDefaults(this.rawCommand),
      stdin: rmDefaults(this.stdin),
    };
  }

  async save() {
    if (this.id) {
      throw new Error('Updating a snippet is currently not possible');
    }
    const snippet = await Api.createSnippet(this.getRep());
    return this.assignSnippetProps(snippet);
  }

  async clone() {
    this.id = undefined;
    this.created = undefined;
    this.modified = undefined;
  }

  async run() {
    return Api.runSnippet(this.getRep());
  }

  static async loadSnippet(id: string) {
    const s = await Api.getSnippet(id);
    const l = await Language.loadLanguage(s.language);
    return new Snippet(l, s);
  }

  static async loadLanguage(id: string) {
    const l = await Language.loadLanguage(id);
    return new Snippet(l, l.helloWorld);
  }
}
