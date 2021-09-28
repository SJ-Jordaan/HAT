import { performance } from 'perf_hooks';
import { RawState } from '../../constants';
import { roundToTwo } from '../../helpers';
import { Logger } from '../Logger';

import { DotFileProcessor } from './DotFileProcessor';
import { InfoFileProcessor } from './InfoFileProcessor';

export class StateAggregator {
  private infoProcessor: InfoFileProcessor;
  private dotProcessor: DotFileProcessor;

  public constructor(infoFile: string, dotFile: string) {
    this.infoProcessor = new InfoFileProcessor(infoFile);
    this.dotProcessor = new DotFileProcessor(dotFile);
  }

  public async extract(log: Logger): Promise<RawState[]> {
    const t0 = performance.now();
    log.debug('Beginning state extraction from input files...');

    const states = await this.infoProcessor.parseAllStates();
    const transitions = await this.dotProcessor.parseAllTransitions();
    const merged: RawState[] = [];

    for (let i = 0; i < states.length; i++) {
      merged.push({
        name: states[i].name,
        demand: states[i].demand,
        paths: [],
      });
    }

    for (let i = 0; i < transitions.length; i++) {
      for (let j = 0; j < merged.length; j++) {
        if (merged[j].name === transitions[i].name) {
          merged[j].paths.push({
            next: transitions[i].next,
            actions: transitions[i].actions,
          });
        }
      }
    }
    const t1 = performance.now();
    log.analyse(`took ${roundToTwo(t1 - t0)} ms`);

    return merged;
  }
}
