import { FileProcessor } from './FileProcessor';
import { RegexValidator } from './RegexValidator';

type State = {
  // name of the state
  name: string;
  /**
   * demand of agents
   * ______________
   * | a1, a2, a3 |
   * | [2, 3, 0]  |
   * --------------
   */
  demand: number[];
};
/*
  - aside: use regex for string comparisons

  If the line has `-- State x --` then save x as state name
  If the line has 
    `Agent y` where y !== Environment
    Then save the next line as the agent's remaining demand
  
*/

export class InfoFileProcessor {
  private processor: FileProcessor;
  private states: State[] = [];

  public constructor(filename: string) {
    this.processor = new FileProcessor(filename);
  }

  public async parseAllStates(): Promise<State[]> {
    let readInDemand = false;
    let name = '';
    let demand: number[] = [];

    await this.processor.execute((line: string) => {
      if (RegexValidator.isEmptyLine(line)) {
        this.states.push({ name, demand });
        demand = [];
      }

      if (RegexValidator.isStateName(line)) {
        const stateName = RegexValidator.extractNumericalValue(line);
        name = stateName;
      }

      if (readInDemand) {
        readInDemand = false;
        const agentDemand = RegexValidator.extractNumericalValue(line);
        demand.push(Number(agentDemand));
      }

      if (RegexValidator.isAgentName(line)) {
        readInDemand = true;
      }
    });

    return this.states;
  }
}
