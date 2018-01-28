export interface IRunResultEvent {
  message: string;
  type: string;
}

export class RunResult {
  isRunning: boolean;
  info?: string;
  error?: string;
  exitCode?: number;
  events: IRunResultEvent[];

  constructor(isRunning: boolean, info: string) {
    this.isRunning = isRunning;
    this.info = info;
    this.events = [];
  }

  setError(msg: string, e: any) {
    console.log(`${msg}:`, e);
    this.error = msg + (e.message ? `: ${e.message}` : '');
    this.stopRunning();
  }

  stopRunning() {
    this.info = undefined;
    this.isRunning = false;
  }

  static helpInfo() {
    return new RunResult(false, 'Press "Run" to run the code');
  }

  static startRunning() {
    return new RunResult(true, 'Running...');
  }
}
