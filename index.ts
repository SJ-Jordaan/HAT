import { GOAL_TYPES } from './src/constants/goalTypes';
import { StateAggregator } from './src/models/StateAggregator';
import { Traverser } from './src/models/Traverser';

const init = async () => {
  const stateAggregator = new StateAggregator('input/mock.info', 'input/mock.dot');
  const states = await stateAggregator.extract();

  const traverser = new Traverser();
  traverser
    .defineCoalition([1, 2, 3])
    .defineGoalType(GOAL_TYPES.ONCE_OFF_ORDERED_GOAL)
    .build(states)
    .getAllPathsToAllGoalStates();
};

init();
