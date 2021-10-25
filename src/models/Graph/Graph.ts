/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { performance } from 'perf_hooks';

import { Payload } from '../../constants';
import { roundToTwo } from '../../helpers';
import { Goal } from '../GDPG/Goal';
import { Logger } from '../Logger';
import { State } from './State';

export class Graph {
  private states: Map<string, State>;

  constructor() {
    this.states = new Map();
  }

  public addTransition(sourceName: string, destinationName: string): State[] {
    const source = this.getState(sourceName);
    const destination = this.getState(destinationName);

    source!.addAdjacent(destination!);

    return [source, destination];
  }

  public addState(payload: Payload): State {
    if (this.states.has(payload.name)) {
      return this.states.get(payload.name)!;
    }

    const state = new State(payload);
    this.states.set(payload.name, state);
    return state!;
  }

  public getState(name: string): State {
    return this.states.get(name)!;
  }

  public removeState(name: string): boolean {
    const current = this.states.get(name)!;

    if (current) {
      for (const state of this.states.values()) {
        state.removeAdjacent(current);
      }
    }

    return this.states.delete(name);
  }

  public removeTransition(sourceName: string, destinationName: string): State[] {
    const source = this.states.get(sourceName);
    const destination = this.states.get(destinationName);

    if (source && destination) {
      source.removeAdjacent(destination);
    }

    return [source!, destination!];
  }

  public *dfs(first: State, log: Logger): Generator<State> {
    log.debug('Beginning Depth first search...');
    const t0 = performance.now();
    // LOGGING ABOVE

    const visited = new Set<State>();
    const stack = [first];

    while (stack.length !== 0) {
      const node = stack.pop();
      if (node && !visited.has(node)) {
        yield node;

        visited.add(node);
        node.getAdjacents().forEach((adj) => stack.push(adj));
      }
    }
    const t1 = performance.now();

    log.analyse(`took ${roundToTwo(t1 - t0)} ms`);
  }

  public *dfsPathFinder(first: State, log: Logger, goal: Goal): Generator<State[]> {
    log.analyse('Beginning regular depth first search...');
    const t0 = performance.now();
    // LOGGING ABOVE
    const path: State[] = [];
    const visited = new Set<State>();
    const stack = [first];
    let nodesTraversed = 0;

    while (stack.length !== 0) {
      const node = stack.pop()!;
      if (visited.has(node)) {
        path.pop();
        continue;
      }
      nodesTraversed++;
      path.push(node);

      visited.add(node);
      log.debug(`State ${node.getPayload().name} is added to the path`);

      if (goal.isFound(node)) {
          log.debug(
          `State ${node.getPayload().name} is a goal state with demand ${
            node.getPayload().demand
          }`,
        );
        const t1 = performance.now();
        log.analyse(`took ${roundToTwo(t1 - t0)} ms`);
        log.analyse(`${nodesTraversed} nodes traversed`);
        yield path;
      }
      
      stack.push(node);
      node.getAdjacents().forEach((adj, index) => {
        if (!stack.includes(adj) && !visited.has(adj)) {
          log.debug(`Adjacent ${index} is ${adj.getPayload().name}`);
          stack.push(adj);
        }
      });
    }
  }

  public *dfsPathFinderWithHeuristics(first: State, log: Logger, goal: Goal): Generator<State[]> {
    log.analyse('Beginning heuristic search...');
    const t0 = performance.now();
    // LOGGING ABOVE

    const path: State[] = [];
    const visited = new Set<State>();
    const stack = [first];
    let nodesTraversed = 0;

    while (stack.length !== 0) {
      log.debug(`First in stack is ${stack[0].getPayload().name}`);
      const node = stack.pop();
      log.debug(`State ${node!.getPayload().name!} is going to be checked`);

      if (node && !visited.has(node) && goal.isTowards(node)) {
        log.debug(`State ${node.getPayload().name} is added to the path`);
        nodesTraversed++;
        path.push(node);

        if (goal.isFound(node)) {
          log.debug(
            `State ${node.getPayload().name} is a goal state with demand ${
              node.getPayload().demand
            }`,
          );
          const t1 = performance.now();
          log.analyse(`took ${roundToTwo(t1 - t0)} ms`);
          log.analyse(`${nodesTraversed} nodes traversed`);
          yield path;
        }

        visited.add(node);
        node.getAdjacents().forEach((adj, index) => {
          if (!stack.includes(adj) && !visited.has(adj)) {
            log.debug(`Adjacent ${index} is ${adj.getPayload().name}`);
            return stack.push(adj);
          }
        });
      }
    }
  }
}
