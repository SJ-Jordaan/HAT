export const findByMatchingProperties = (set: any, properties: any): any => {
  return set.filter((entry: any) => {
    return Object.keys(properties).every((key: any) => {
      return entry[key] === properties[key];
    });
  });
};
