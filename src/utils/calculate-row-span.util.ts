export const mapKeyToIds = <T extends { id: number }>(data: T[], key: keyof T): Map<any, number[]> => {
  const map = new Map<any, number[]>();
  data.forEach((item) => {
    const groupKey = item[key];
    if (!map.has(groupKey)) {
      map.set(groupKey, []);
    }
    map.get(groupKey)!.push(item.id);
  });
  return map;
};
