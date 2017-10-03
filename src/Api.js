const apiUrl = '/api/';

export default class Api {
  static async getLanguages() {
    return this._getJSON('languages');
  }

  static async getLanguage(id) {
    return this._getJSON(`languages/${id}`);
  }

  static async getSnippet(id) {
    return this._getJSON(`snippets/${id}`);
  }

  static async createSnippet(payload) {
    return this._postJSON('snippets', payload);
  }

  static async runSnippet(payload) {
    return this._postJSON('run', payload);
  }

  static async _fetchJSON(...params) {
    const response = await fetch(...params);
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }

  static async _getJSON(url) {
    return this._fetchJSON(apiUrl + url);
  }

  static async _postJSON(url, obj) {
    return this._fetchJSON(apiUrl + url, {
      method: 'POST',
      body: JSON.stringify(obj),
    });
  }
}
