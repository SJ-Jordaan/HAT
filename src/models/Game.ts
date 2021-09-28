import { performance } from 'perf_hooks';

import { Input, Payload, RawState } from '../constants';
import { roundToTwo, agentToIndex, findByMatchingProperties } from '../helpers';
import { InputProcessor, StateAggregator } from './FileProcessing';
import { Goal } from './GDPG/Goal';
import { Graph } from './Graph/Graph';
import { State } from './Graph/State';
import { Logger } from './Logger';

export class Game {
  private log: Logger;
  private graph: Graph;
  private input: Input;

  public constructor(debug = false, analyse = false) {
    this.log = new Logger(debug, analyse);
    this.input = { coalition: [], goalType: '', dotFileName: '', infoFileName: '' };
    this.graph = new Graph();
  }

  public async readInput(): Promise<void> {
    const t0 = performance.now();
    this.log.debug('Reading input.txt...\n');
    // LOGGING ABOVE

    const inputProcessor = new InputProcessor('input.txt');
    this.input = await inputProcessor.parse();

    // LOGGING BELOW
    this.log.debug(this.input);
    const t1 = performance.now();
    this.log.analyse(`took ${roundToTwo(t1 - t0)} ms`);
  }

  public setupGraph(states: RawState[]): void {
    for (const state of states) {
      const payload: Payload = {
        name: state.name,
        demand: state.demand,
        paths: state.paths,
      };
      this.graph.addState(payload);
    }

    for (const state of states) {
      for (const path of state.paths) {
        this.graph.addTransition(state.name, path.next);
      }
    }
  }

  public dfsStrategyWithHeuristics(): State[][] {
    const first = this.graph.getState('0');

    const strategy: State[][] = [];
    const goal = new Goal(agentToIndex(this.input.coalition), this.input.goalType, this.log);

    for (const path of this.graph.dfsPathFinderWithHeuristics(first!, this.log, goal)) {
      this.log.analyse(
        `Path length: ${path.length - 1} leads to goal state ${
          path[path.length - 1].getPayload().name
        }`,
      );
      strategy.push(path);
      for (let i = 0; i < path.length; i++) {
        this.log.analyse(`${i + 1}. State ${path[i].getPayload().name}`);

        if (i !== path.length - 1) {
          const actions = findByMatchingProperties(path[i].getPayload().paths, {
            next: path[i + 1].getPayload().name,
          })[0].actions;

          this.log.analyse(` Actions ${actions.join(',')}`);
        }
      }
      break;
    }

    return strategy;
  }

  public dfsStrategy(): State[][] {
    const first = this.graph.getState('0');

    const strategy: State[][] = [];
    const goal = new Goal(agentToIndex(this.input.coalition), this.input.goalType, this.log);

    for (const path of this.graph.dfsPathFinder(first!, this.log, goal)) {
      this.log.analyse(
        `Path length: ${path.length - 1} leads to goal state ${
          path[path.length - 1].getPayload().name
        }`,
      );

      strategy.push(path);

      for (let i = 0; i < path.length; i++) {
        this.log.analyse(`${i + 1}. State ${path[i].getPayload().name}`);

        if (i !== path.length - 1) {
          const actions = findByMatchingProperties(path[i].getPayload().paths, {
            next: path[i + 1].getPayload().name,
          })[0]?.actions;

          this.log.analyse(` Actions ${actions?.join(',')}`);
        }
      }
      break;
    }

    return strategy;
  }

  public async run(): Promise<void> {
    this.log.debug(
      '------------------------------------------- DEBUGGING -------------------------------------------',
    );
    // LOGGING ABOVE

    await this.readInput();
    const stateAggregator = new StateAggregator(this.input.infoFileName, this.input.dotFileName);
    const states = await stateAggregator.extract(this.log);
    this.setupGraph(states);

    // TODO: Update the dfs
    // this.dfsStrategy();
    this.dfsStrategyWithHeuristics();
  }
}
