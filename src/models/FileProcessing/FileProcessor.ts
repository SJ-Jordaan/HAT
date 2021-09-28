/* eslint-disable @typescript-eslint/ban-types */
import fs from 'fs';
import readline from 'readline';

export class FileProcessor {
  private file: string;

  public constructor(filename: string) {
    this.file = filename;
  }

  public async execute(func: Function): Promise<void> {
    const fileStream = fs.createReadStream(this.file);
    const lines = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of lines) {
      func(line);
    }
  }
}
