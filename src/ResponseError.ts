export default class ResponseError extends Error {
  response: Response;
  data: any;

  constructor(response: Response, data: any) {
    super(data.error || response.statusText);
    this.response = response;
    this.data = data;
  }
}
