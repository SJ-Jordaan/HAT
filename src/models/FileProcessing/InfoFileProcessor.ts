import { FileProcessor } from './FileProcessor';
import { RegexValidator } from '../RegexValidator';
import { State } from '../../constants';

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
