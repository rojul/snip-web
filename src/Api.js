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
    const response = await fetch(...params)
      .catch(err => this._throwWithMsg(err, 'Network Error'));
    if (!response.ok) {
      this._throwWithMsg(...await response.json()
        .then(data => [data, data.error || response.statusText])
        .catch(() => [response, response.statusText]));
    }
    return response.json()
      .catch(err => this._throwWithMsg(err, 'Invalid Response'));
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

  static _throwWithMsg(err, msg) {
    /* eslint-disable no-param-reassign */
    err.errorMsg = msg;
    throw err;
  }
}
