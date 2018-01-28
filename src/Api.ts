import ndjson from './ndjson';
import ResponseError from './ResponseError';

const apiUrl = '/api/';

export default class Api {
  static async getLanguages() {
    return this.getJSON('languages');
  }

  static async getLanguage(id: string) {
    return this.getJSON(`languages/${id}`);
  }

  static async getSnippet(id: string) {
    return this.getJSON(`snippets/${id}`);
  }

  static async createSnippet(payload: object) {
    return this.postJSON('snippets', payload);
  }

  static async runSnippet(payload: object) {
    const response = await this.fetch('run', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return ndjson(response.body!).getReader();
  }

  private static async fetch(input: string, init: RequestInit) {
    let response: Response;
    try {
      response = await fetch(apiUrl + input, init);
    } catch (e) {
      e.originalError = e.message;
      e.message = 'Network Error';
      throw e;
    }

    if (!response.ok) {
      let err;
      try {
        const data = await response.json();
        err = new ResponseError(response, data);
      } catch (e) {
        err = new Error(response.statusText);
        err.name = 'InvalidResponse';
      }
      throw err;
    }
    return response;
  }

  private static async fetchJSON(input: string, init: RequestInit) {
    const response = await this.fetch(input, init);
    try {
      return response.json();
    } catch (e) {
      e.originalError = e.message;
      e.message = 'Invalid Response';
      e.response = response;
      throw e;
    }
  }

  private static async getJSON(url: string) {
    return this.fetchJSON(url, {});
  }

  private static async postJSON(url: string, obj: object) {
    return this.fetchJSON(url, {
      method: 'POST',
      body: JSON.stringify(obj),
    });
  }
}
