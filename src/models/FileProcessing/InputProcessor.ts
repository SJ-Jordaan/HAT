import { Input } from '../../constants';
import { RegexValidator } from '../RegexValidator';
import { FileProcessor } from './FileProcessor';

export class InputProcessor {
  private processor: FileProcessor;

  constructor(name: string) {
    this.processor = new FileProcessor(name);
  }

  public async parse(): Promise<Input> {
    const input: Input = {
      coalition: [],
      goalType: '',
      dotFileName: '',
      infoFileName: '',
    };
    let effectiveLineNumber = 0;

    await this.processor.execute((line: string) => {
      if (RegexValidator.isComment(line) || RegexValidator.isEmptyLine(line)) {
        return;
      }

      switch (effectiveLineNumber) {
        case 0:
          input.coalition = line.split(',');
          effectiveLineNumber++;
          break;
        case 1:
          input.goalType = line;
          effectiveLineNumber++;
          break;
        case 2:
          input.dotFileName = line;
          effectiveLineNumber++;
          break;
        case 3:
          input.infoFileName = line;
          effectiveLineNumber++;
          break;
        default:
          break;
      }
    });
    return input;
  }
}
