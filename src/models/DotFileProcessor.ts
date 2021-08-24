import { FileProcessor } from './FileProcessor';
import { RegexValidator } from './RegexValidator';

type Transition = {
  // name of the current state
  name: string;
  // name of the next state
  next: string;
  /**
   * actions of agents except environment
   * ________________________
   * |    a1,    a2,   a3   |
   * | [req_r4, idle, idle] |
   * ------------------------
   */
  actions: string[];
};
/*
  If the line has `curr -> next` 
    then save curr, next, and 
    actions omitting any actions that are none (The environment)  
*/

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
