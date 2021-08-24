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

  public bfsWithFunc(start: string, traverser: Traverser): string[][] {
    console.log('Finding all paths to goal states');
    const t0 = performance.now();

    const allPathsToGoal: string[][] = [];
    let path = [start];
    const queue = [path];
    let numberOfPaths = 0;

    while (queue.length > 0) {
      numberOfPaths++;
      if (numberOfPaths % 10000 === 0) {
        console.log(`Checked ${numberOfPaths} paths`);
        const t1 = performance.now();
        console.log(`  took ${t1 - t0} milliseconds`);
      }
      path = queue.shift() ?? [];
      const state = path[path.length - 1];

      if (traverser.isGoalState(state)) {
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
}
