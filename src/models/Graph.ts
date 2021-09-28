import { Traverser } from './Traverser';
import { performance } from 'perf_hooks';

export class Graph {
  private adjacencyList: Map<string, string[]>;

  public constructor() {
    this.adjacencyList = new Map<string, string[]>();
  }

  public addNode = (state: string): void => {
    this.adjacencyList.set(state, []);
  };

  public addEdge = (origin: string, destination: string): void => {
    if (!origin || !destination) {
      return;
    }
    this.adjacencyList.get(origin)?.push(destination);
  };

  public getAdjacencyList(): Map<string, string[]> {
    return this.adjacencyList;
  }

  private isNotVisited(state: string, path: string[]): boolean {
    for (let i = 0; i < path.length; i++) {
      if (path[i] === state) {
        return false;
      }
    }
    return true;
  }

  public bfs(start: string, end: string): string[][] {
    const allPathsToGoal: string[][] = [];
    let path = [start];
    const queue = [path];

    while (queue.length > 0) {
      path = queue.shift() ?? [];
      const state = path[path.length - 1];

      if (state === end) {
        allPathsToGoal.push(path);
      }

      const destinations = this.adjacencyList.get(state) ?? [];
      for (let i = 0; i < destinations.length; i++) {
        if (this.isNotVisited(destinations[i], path)) {
          const newPath = [...path, destinations[i]];
          queue.push(newPath);
        }
      }
    }

    return allPathsToGoal;
  }

  // public bfsWithFunc(start: string, traverser: Traverser): string[][] {
  //   console.log('Finding all paths to goal states');
  //   const t0 = performance.now();

  //   const allPathsToGoal: string[][] = [];
  //   let path = [start];
  //   const queue = [path];
  //   let numberOfPaths = 0;

  //   while (queue.length > 0) {
  //     numberOfPaths++;
  //     if (numberOfPaths % 10000 === 0) {
  //       console.log(`Checked ${numberOfPaths} paths`);
  //       const t1 = performance.now();
  //       console.log(`  took ${t1 - t0} milliseconds`);
  //     }
  //     path = queue.shift() ?? [];
  //     const state = path[path.length - 1];

  //     if (traverser.isGoalState(state)) {
  //       allPathsToGoal.push(path);
  //     }

  //     const destinations = this.adjacencyList.get(state) ?? [];
  //     for (let i = 0; i < destinations.length; i++) {
  //       if (this.isNotVisited(destinations[i], path)) {
  //         const newPath = [...path, destinations[i]];
  //         queue.push(newPath);
  //       }
  //     }
  //   }

  //   return allPathsToGoal;
  // }

  // public dfs(
  //   start: string,
  //   traverser: Traverser,
  //   visited = new Set<string>(),
  //   path = new Set<string>(),
  // ): Set<string> | undefined {
  //   console.log(` Landed on state ${start} with path ${[...path].join(',')}`);

  //   visited.add(start);

  //   const destinations = this.adjacencyList.get(start);
  //   console.log(`  Possible destinations are: ${destinations}`);

  //   for (const destination of destinations!) {
  //     console.log(`   Choosing destination: ${destination}`);

  //     path.add(destination);

  //     if (traverser.isGoalState(destination, path)) {
  //       const goalPath = path;
  //       path = new Set<string>();
  //       return goalPath;
  //     }

  //     if (!visited.has(destination)) {
  //       return this.dfs(destination, traverser, visited, path);
  //     }
  //   }

  //   return;
  // }

  public v1HeuristicSearch(start: string, traverser: Traverser): string[] | undefined {
    console.log('');
    /* Performance logging */ console.log('Attempting to find a new path to a goal state');
    /* Performance logging */ const t0 = performance.now();
    const stack = [start];
    const visited: string[] = [];
    const path: string[] = [];

    while (stack.length !== 0) {
      const state = stack.pop() ?? '';
      if (!visited.includes(state)) {
        path.push(state);
        visited.push(state);
      }
      const isGoalState = traverser.isGoalState(state, path, false);
      if (isGoalState) {
        /* Performance logging */ const t1 = performance.now();
        /* Performance logging */ console.log(`  Found new path in ${t1 - t0} milliseconds`);
        return path;
      }

      const destinations = this.adjacencyList.get(state) ?? [];
      const foundBetterPath = false;
      let backTrack = true;
      for (const destination of destinations) {
        if (!visited.includes(destination) && !stack.includes(destination)) {
          // Handle heuristic check before pushing
          if (traverser.isBetterPath(state, destination)) {
            backTrack = false;
            stack.push(destination);
          }
        }
      }
      if (backTrack) {
        path.pop();
      }
    }
    return;
  }

  public iterDFS(start: string, traverser: Traverser, debug: boolean): string[] | undefined {
    debug &&
      console.log(
        '------------------------------------------- DEBUGGING -------------------------------------------',
      );
    /* Performance logging */ console.log('Attempting to find a new path to a goal state');
    /* Performance logging */ const t0 = performance.now();
    const stack = [start];
    const visited: string[] = [];
    const path: string[] = [];

    while (stack.length !== 0) {
      debug &&
        console.log(
          '\n------------------------------------------- Current Information -------------------------------------------',
        );
      /* Debug logging */ debug && console.log(`-STACK is currently ${stack.join(',')}`);
      /* Debug logging */ debug && console.log(`-VISITED is currently ${visited.join(',')}`);

      const state = stack.pop() ?? '';

      /* Debug logging */ debug &&
        console.log(` Landed on state ${state} with path ${path.join(',')}`);

      if (!visited.includes(state)) {
        path.push(state);
        visited.push(state);
      }
      const isGoalState = traverser.isGoalState(state, path, debug);
      if (isGoalState === 'found') {
        path.pop();
        visited.pop();
      } else if (isGoalState) {
        /* Performance logging */ const t1 = performance.now();
        /* Performance logging */ console.log(`  Found new path in ${t1 - t0} milliseconds`);
        debug &&
          console.log(
            '------------------------------------------- STOPPED -------------------------------------------',
          );
        return path;
      }

      const destinations = this.adjacencyList.get(state) ?? [];
      debug && console.log(`  Possible destinations are: ${destinations}`);
      let backTrack = true;
      for (const destination of destinations) {
        if (!visited.includes(destination) && !stack.includes(destination)) {
          backTrack = false;
          stack.push(destination);
        }
      }
      if (backTrack) {
        path.pop();
      }
    }
    /* Performance logging */ const t1 = performance.now();
    /* Performance logging */ console.log(
      `  Could not find new path, took ${t1 - t0} milliseconds`,
    );
    debug &&
      console.log(
        '------------------------------------------- STOPPED -------------------------------------------',
      );
    return;
  }
}
