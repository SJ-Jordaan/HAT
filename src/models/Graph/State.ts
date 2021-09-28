import { Payload } from '../../constants';

export class State {
  private adjacents: State[] = [];
  private payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
    this.adjacents = []; // adjacency list
  }

  public addAdjacent(node: State): void {
    this.adjacents.push(node);
  }

  public removeAdjacent(node: State): State | null {
    const index = this.adjacents.indexOf(node);
    if (index > -1) {
      this.adjacents.splice(index, 1);
      return node;
    }
    return null;
  }

  public getAdjacents(): State[] {
    return this.adjacents;
  }

  public isAdjacent(node: State): boolean {
    return this.adjacents.indexOf(node) > -1;
  }

  public getPayload(): Payload {
    return this.payload;
  }
}
