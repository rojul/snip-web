import Api from '@/Api';

export default class Language {
  constructor(l) {
    Object.assign(this, l);
  }

  static async loadLanguage(id) {
    const l = await Api.getLanguage(id);
    l.command = l.command || '';
    l.helloWorld = l.helloWorld || '';
    return new Language(l);
  }
}
