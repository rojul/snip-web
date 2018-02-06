import Snippet from './Snippet';

export interface IRunResultEvent {
  message: string;
  type: string;
}

export class RunResult {
  isRunning = false;
  info?: string = 'Press "Run" to run the code';
  error?: string;
  exitCode?: number;
  events: IRunResultEvent[] = [];

  setError(msg: string, e: any) {
    console.log(`${msg}:`, e);
    this.error = msg + (e.message ? `: ${e.message}` : '');
    this.stopRunning();
  }

  stopRunning() {
    this.info = undefined;
    this.isRunning = false;
  }

  async runSnippet(snippet: Snippet) {
    this.isRunning = true;
    this.info = 'Running...';
    let reader: ReadableStreamReader;
    try {
      reader = await snippet.run();
    } catch (e) {
      this.setError('Can\'t run snippet', e);
      return;
    }
    while (true) {
      let obj: { done: boolean, value: IRunResultEvent & RunResult };
      try {
        obj = await reader.read();
      } catch (e) {
        this.setError('Can\'t run snippet', e);
        return;
      }
      if (obj.done) {
        this.stopRunning();
        return;
      }
      if (obj.value.type) {
        this.events.push(obj.value);
      } else {
        this.events.push(...(obj.value.events || []));
        this.error = obj.value.error;
        this.exitCode = obj.value.exitCode;
      }
    }
  }
}
