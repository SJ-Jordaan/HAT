import { Colour } from '../constants';

export class Logger {
  private _debug: boolean;
  private _analyse: boolean;

  public constructor(debug = false, analyse = false) {
    this._debug = debug;
    this._analyse = analyse;
  }

  public debug(message: unknown): void {
    if (this._debug) {
      if (typeof message !== 'object') {
        console.log(`${Colour.FgGreen}%s${Colour.Reset}`, message);
        return;
      }
      console.log(`${Colour.FgGreen}%s${Colour.Reset}`, JSON.stringify(message, null, 2));
    }
  }

  public analyse(message: unknown): void {
    if (this._analyse) {
      console.log(`${Colour.FgCyan}%s${Colour.Reset}`, message);
    }
  }

  public setDebug(debug: boolean): void {
    this._debug = debug;
  }

  public setAnalyse(analyse: boolean): void {
    this._analyse = analyse;
  }
}
