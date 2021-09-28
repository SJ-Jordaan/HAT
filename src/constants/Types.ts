export enum GOAL_TYPES {
  ONCE_OFF_ORDERED_GOAL = 'ONCE_OFF_ORDERED_GOAL',
  ONCE_OFF_SIMULTANEOUS_GOAL = 'ONCE_OFF_SIMULTANEOUS_GOAL',
}

export type Path = {
  next: string;
  actions: string[];
};

export type RawState = {
  name: string;
  demand: number[];
  paths: Path[];
};

export type Transition = {
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

export type State = {
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

export type Input = {
  coalition: string[];
  goalType: string;
  dotFileName: string;
  infoFileName: string;
};

export type Payload = {
  name: string;
  demand: number[];
  paths: Path[];
};
