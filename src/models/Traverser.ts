/* eslint-disable @typescript-eslint/no-explicit-any */
import { GOAL_TYPES } from '../constants/goalTypes';
import { findByMatchingProperties } from '../helpers/arrayFunctions';
import { Graph } from './Graph';
import { performance } from 'perf_hooks';

// TODO: Define State type/class
/*
[
  {
    name: '0',
    demand: [ 2, 2, 1, 1, 2 ],
    paths: [ [Object], [Object] ]
  },
  { name: '1', demand: [ 1, 1, 1, 0, 1 ], paths: [ [Object] ] },
  {
    name: '2',
    demand: [ 1, 1, 1, 0, 1 ],
    paths: [ [Object], [Object] ]
  },
  { name: '3', demand: [ 1, 1, 1, 1, 1 ], paths: [ [Object] ] },
  { name: '4', demand: [ 0, 0, 0, 0, 1 ], paths: [] }
]

paths
{
  next: '1',
  actions: [ 'none', 'req_r1', 'req_r3', 'idle', 'req_r7', 'req_r8' ]
}
{
  next: '4',
  actions: [ 'none', 'req_r1', 'req_r3', 'idle', 'req_r5', 'req_r6' ]
}
{
  next: '2',
  actions: [ 'none', 'req_r1', 'req_r3', 'idle', 'req_r5', 'req_r8' ]
}
{
  next: '3',
  actions: [ 'none', 'req_r1', 'req_r3', 'idle', 'idle', 'req_r8' ]
}
{
  next: '1',
  actions: [ 'none', 'req_r1', 'req_r3', 'idle', 'idle', 'req_r8' ]
}
{
  next: '4',
  actions: [ 'none', 'req_r1', 'req_r3', 'idle', 'req_r5', 'req_r6' ]
}
*/

export class Traverser {
  private graph: Graph;
  private states: any[];
  private goalType: string;
  private goalStates: any[];
  private coalition: number[];

  public constructor() {
    this.coalition = [];
    this.goalType = '';
    this.graph = new Graph();
    this.goalStates = [];
    this.states = [];
  }

  public build(states: any[]): Traverser {
    console.log(`Building graph...`);
    const t0 = performance.now();

    this.states = states;

    for (let i = 0; i < states.length; i++) {
      this.graph.addNode(states[i].name);
      for (let j = 0; j < states[i].paths.length; j++) {
        this.graph.addEdge(states[i].name, states[i].paths[j].next);
      }
    }
    const t1 = performance.now();
    console.log(`  took ${t1 - t0} milliseconds`);
    return this;
  }

  public defineGoalType(goalType: string): Traverser {
    console.log(`Defining goal type as ${goalType}`);
    const t0 = performance.now();

    this.goalType = goalType;

    const t1 = performance.now();
    console.log(`  took ${t1 - t0} milliseconds`);
    return this;
  }

  public defineCoalition(coalition: number[]): Traverser {
    console.log(`Defining coalition as ${coalition}`);
    const t0 = performance.now();

    this.coalition = coalition;

    const t1 = performance.now();
    console.log(`  took ${t1 - t0} milliseconds`);
    return this;
  }

  // public traverse(start: string, end: string) {
  //   this.graph.bfs(start, end);
  // }

  private checkOnceOffOrderedGoal(state: string): boolean {
    const stateObject = findByMatchingProperties(this.states, { name: state })[0];

    for (let i = 0; i < this.coalition.length; i++) {
      if (stateObject.demand[i] !== 0) {
        return false;
      }
    }

    return true;
  }

  public isGoalState(state: string): boolean {
    switch (this.goalType) {
      case GOAL_TYPES.ONCE_OFF_ORDERED_GOAL:
        return this.checkOnceOffOrderedGoal(state);

      default:
        return false;
    }
  }

  private getAgentStrategies(path: string[]): (string | number)[][] {
    const strategies: (string | number)[][] = this.coalition.map((agent) => [agent]);

    for (let i = 0; i < path.length - 1; i++) {
      const stateObject = findByMatchingProperties(this.states, { name: path[i] })[0];
      const actions = findByMatchingProperties(stateObject.paths, { next: path[i + 1] })[0].actions;
      for (let j = 0; j < strategies.length; j++) {
        strategies[j] = strategies[j].concat(actions[strategies[j][0]]);
      }
    }

    return strategies;
  }

  public getAllPathsToAllGoalStates(): void {
    console.log('Finding all paths to all goal states...');

    const t0 = performance.now();

    const allPathsToGoalStates = this.graph.bfsWithFunc('0', this);
    const strategies: any[] = [];

    for (let i = 0; i < allPathsToGoalStates.length; i++) {
      const path = allPathsToGoalStates[i];
      strategies.push({
        goalState: path[path.length - 1],
        actions: this.getAgentStrategies(path),
      });
    }

    const t1 = performance.now();
    console.log(`  took ${t1 - t0} milliseconds`);

    this.printStrategies(strategies);
  }

  private printStrategies(strategies: any[]): void {
    if (strategies.length === 0) {
      console.log('There are no strategies that reach a goal state');
    }

    for (let i = 0; i < strategies.length; i++) {
      const strategyToReachGoal = strategies[i];
      const goalState = strategyToReachGoal.goalState;
      const actions = strategyToReachGoal.actions;
      console.log(
        `To reach goal state ${goalState}, ${actions[0].length - 1} ${
          actions[0].length - 1 === 1 ? 'transition is' : 'transitions are'
        } taken`,
      );
      for (let agentIndex = 0; agentIndex < actions.length; agentIndex++) {
        const agentActions = actions[agentIndex];
        let agentString = `  Agent ${agentActions[0]}: `;
        for (let actionIndex = 1; actionIndex < agentActions.length; actionIndex++) {
          const action = agentActions[actionIndex];
          agentString += `${action}${actionIndex === agentActions.length - 1 ? '' : ' -> '}`;
        }
        console.log(agentString);
      }
    }
  }
}
