import { RegexValidator } from '../models/RegexValidator';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const findByMatchingProperties = (set: any[], properties: any): any[] => {
  return set.filter((entry: any) => {
    return Object.keys(properties).every((key: any) => {
      return entry[key] === properties[key];
    });
  });
};

export const roundToTwo = (num: number): number => {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
};

export const agentToIndex = (coalition: string[]): number[] => {
  const newCoalition: number[] = [];

  for (let i = 0; i < coalition.length; i++) {
    newCoalition.push(+RegexValidator.extractNumericalValue(coalition[i]));
  }

  return newCoalition;
};
