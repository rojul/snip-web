import Api from '@/Api';

export default class Language {
  constructor(l) {
    Object.assign(this, l);
  }

  static async loadLanguage(id) {
    const l = await Api.getLanguage(id);
    l.command = l.command || '';
    return new Language(l);
  }
}
