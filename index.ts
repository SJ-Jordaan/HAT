// import { GOAL_TYPES } from './src/constants/goalTypes';
// import { StateAggregator } from './src/models/StateAggregator';
// import { Traverser } from './src/models/Traverser';

import { Game } from './src/models/Game';

// const init = async () => {
// const stateAggregator = new StateAggregator('input/e2/formula4.info', 'input/e2/formula4.dot');
// const states = await stateAggregator.extract();

// const traverser = new Traverser();
// traverser
//   .defineCoalition([1, 3])
//   .defineGoalType(GOAL_TYPES.ONCE_OFF_SIMULTANEOUS_GOAL)
//   .build(states);

// let foundPath: boolean;
// let numberOfPathsFound = 0;
// do {
//   foundPath = traverser.getOneStrategy(false);
//   if (foundPath) {
//     numberOfPathsFound++;
//   }
// } while (foundPath);
// console.log(`${numberOfPathsFound} paths found`);

/**
 * REMEMBER TO UPDATE COALITION AND GOAL TYPE
 */

// traverser.getPathWithHeuristic();
// traverser.getOneStrategy(false);
// traverser.printAllGoalPaths();
// };
const game = new Game(false, true);
game.run();
// init();
