import { FileProcessor } from './FileProcessor';
import { RegexValidator } from '../RegexValidator';
import { Transition } from '../../constants';

export class DotFileProcessor {
  private processor: FileProcessor;
  private transitions: Transition[] = [];

  public constructor(filename: string) {
    this.processor = new FileProcessor(filename);
  }

  public async parseAllTransitions(): Promise<Transition[]> {
    await this.processor.execute((line: string) => {
      if (RegexValidator.isTransition(line)) {
        const [[name, next], actions] = RegexValidator.extractTransition(line);
        this.transitions.push({
          name,
          next,
          actions,
        });
      }
    });

    return this.transitions;
  }
}
