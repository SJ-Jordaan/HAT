import { GOAL_TYPES } from '../../constants';
import { State } from '../Graph/State';
import { Logger } from '../Logger';

export class Goal {
  private coalition: number[];
  private type: string;
  private currentDemand: number[];
  private log: Logger;

  public constructor(coalition: number[], type: string, log: Logger) {
    this.coalition = coalition;
    this.type = type;
    this.currentDemand = [];
    this.log = log;
  }

  public isFound(state: State): boolean {
    this.log.debug('Entering isFound');
    switch (this.type) {
      case GOAL_TYPES.ONCE_OFF_ORDERED_GOAL:
        this.log.debug('\tOnce off ordered goal selected');
        return this.isFoundOOOG();
      case GOAL_TYPES.ONCE_OFF_SIMULTANEOUS_GOAL:
        this.log.debug('\tOnce off simultaneous goal selected');
        return this.isFoundOOSG(state);
      default:
        this.log.debug('\tDefault hit - SHOULD NOT HAPPEN');
        return false;
    }
  }

  public isTowards(state: State): boolean {
    this.log.debug('Entering isTowards');
    if (this.currentDemand.length === 0) {
      this.log.debug('\t\tSetting currentDemand, should be first state only');
      this.currentDemand = state.getPayload().demand;
      return true;
    }

    switch (this.type) {
      case GOAL_TYPES.ONCE_OFF_ORDERED_GOAL:
        this.log.debug('\tOnce off ordered goal selected');
        return this.isTowardsOOOG(state);
      case GOAL_TYPES.ONCE_OFF_SIMULTANEOUS_GOAL:
        this.log.debug('\tOnce off simultaneous goal selected');
        return this.isTowardsOOSG(state);
      default:
        this.log.debug('\tDefault hit - SHOULD NOT HAPPEN');
        return false;
    }
  }

  private isFoundOOOG(): boolean {
    this.log.debug('\t\tEntering isFoundOOOG');
    this.log.debug(
      `\t\tShould return ${this.coalition.length === 0} because all agents have reached demand 0`,
    );
    return this.coalition.length === 0;
  }

  private isFoundOOSG(state: State): boolean {
    this.log.debug('\t\tEntering isFoundOOSG');
    const demand = state.getPayload().demand;

    for (let i = 0; i < this.coalition.length; i++) {
      const agent = this.coalition[i] - 1;

      if (demand[agent] !== 0) {
        this.log.debug(
          `\t\t\tShould return false because agent a${agent} has demand ${demand[agent]} in state ${
            state.getPayload().name
          }`,
        );
        return false;
      }
    }

    this.log.debug(
      `\t\t\tShould return true because all agents have 0 demand in ${state.getPayload().name}`,
    );
    return true;
  }

  private isTowardsOOOG(state: State): boolean {
    this.log.debug('\t\tEntering isTowardsOOOG');
    const demand = state.getPayload().demand;
    const agent = this.coalition[0] - 1;

    if (demand[agent] < this.currentDemand[agent]) {
      this.currentDemand = demand;

      this.log.debug(
        '\t\t\tShould return true because agent a' +
          agent +
          ' has ' +
          demand[agent] +
          ' vs ' +
          this.currentDemand[agent] +
          ' in state ' +
          state.getPayload().name,
      );

      if (demand[agent] === 0) {
        this.coalition.shift();
      }

      return true;
    }

    this.log.debug(
      '\t\t\tShould return false because agent a' +
        (agent + 1) +
        ' has ' +
        demand[agent] +
        ' vs ' +
        this.currentDemand[agent] +
        ' in state ' +
        state.getPayload().name,
    );
    return false;
  }

  private isTowardsOOSG(state: State): boolean {
    this.log.debug('\t\tEntering isTowardsOOOG');
    const demand = state.getPayload().demand;

    for (let i = 0; i < this.currentDemand.length; i++) {
      if (demand[i] < this.currentDemand[i] && this.coalition.includes(i + 1)) {
        this.currentDemand = demand;

        this.log.debug(
          '\t\t\tShould return true because agent a' +
            this.coalition[0] +
            ' has ' +
            demand[this.coalition[0] - 1] +
            ' vs ' +
            this.currentDemand[this.coalition[0] - 1] +
            ' in state ' +
            state.getPayload().name,
        );
        return true;
      }
    }

    this.log.debug(
      '\t\t\tShould return false because agent a' +
        this.coalition[0] +
        ' has ' +
        demand[this.coalition[0] - 1] +
        ' vs ' +
        this.currentDemand[this.coalition[0] - 1] +
        ' in state ' +
        state.getPayload().name,
    );
    return false;
  }
}
