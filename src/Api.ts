import ndjson from './ndjson';

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
    const response = await this._fetch('run', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return ndjson(response.body).getReader();
  }

  static async _fetch(input, init): Promise<any> {
    const response = await fetch(apiUrl + input, init)
      .catch(err => this._throwWithMsg(err, 'Network Error')) as Response;

    if (!response.ok) {
      // @ts-ignore
      this._throwWithMsg(...await response.json()
        .then(data => [data, data.error || response.statusText])
        .catch(() => [response, response.statusText]));
    }
    return response;
  }

  static async _fetchJSON(input, init) {
    const response = await this._fetch(input, init);
    return response.json()
      .catch(err => this._throwWithMsg(err, 'Invalid Response'));
  }

  static async _getJSON(url) {
    return this._fetchJSON(url, {});
  }

  static async _postJSON(url, obj) {
    return this._fetchJSON(url, {
      method: 'POST',
      body: JSON.stringify(obj),
    });
  }

  static _throwWithMsg(err, msg) {
    err.errorMsg = msg;
    throw err;
  }
}
