import Api from '@/Api';

export default class Language {
  constructor(l) {
    Object.assign(this, l);
  }

  static async loadLanguage(id) {
    const l = await Api.getLanguage(id);
    return new Language(l);
  }
}
