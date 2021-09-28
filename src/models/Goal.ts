import { GOAL_TYPES } from '../constants/goalTypes';
import { findByMatchingProperties } from '../helpers/arrayFunctions';

export class Goal {
  private type: string;
  private checkedPaths: string[][];

  constructor(type: string) {
    this.type = type;
    this.checkedPaths = [];
  }

  public isGoalState(
    state: string,
    states: any[],
    coalition: number[],
    path: string[],
    debug: boolean,
  ): boolean | string {
    const stringifiedPath = path.join(',');
    debug && console.log(`    Checking path ${stringifiedPath}`);

    // let alreadyTravelled = false;

    // for (const checkedPath of this.checkedPaths) {
    //   if (stringifiedPath === checkedPath.join(',')) {
    //     alreadyTravelled = true;
    //   }
    // }

    // if (alreadyTravelled) {
    //   console.log('Path has already been traversed');
    //   return 'found';
    // }

    switch (this.type) {
      case GOAL_TYPES.ONCE_OFF_SIMULTANEOUS_GOAL:
        return this.checkOnceOffOrderedGoal(state, states, coalition);

      default:
        return false;
    }
  }

  public printAllPaths(): void {
    for (const path of this.checkedPaths) {
      console.log(`Path with length ${path.length - 1}`);
      console.log(path.join(','));
    }
  }

  private checkOnceOffOrderedGoal(state: string, states: any[], coalition: number[]): boolean {
    const stateObject = findByMatchingProperties(states, { name: state })[0];

    let valid = true;
    for (const agent of coalition) {
      if (stateObject.demand[agent - 1] !== 0) {
        valid = false;
      }
    }

    return valid;
  }

  public addPath(path: string[]): void {
    this.checkedPaths.push(path);
  }
}
