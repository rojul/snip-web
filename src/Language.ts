import Api from './Api';

export default class Language {
  id: string;
  name: string;
  extension: string;
  command: string;
  notRunnable: boolean;
  helloWorld: any;

  constructor(obj: any) {
    this.id = obj.id;
    this.name = obj.name;
    this.extension = obj.extension;
    this.command = obj.command || '';
    this.notRunnable = !!obj.notRunnable;
    this.helloWorld = obj.helloWorld;
  }

  static async loadLanguage(id: string) {
    const l = await Api.getLanguage(id);
    return new Language(l);
  }
}
