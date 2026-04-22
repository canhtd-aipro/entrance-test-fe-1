export const mapKeyToIds = <T extends { id: number }>(
  data: T[],
  key: keyof T,
  deleteIds?: Set<string | number>,
): Record<string, number[]> => {
  const result: Record<string, number[]> = {};

  data.forEach((item) => {
    if (deleteIds?.has(item.id)) return;

    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item.id);
  });

  return result;
};
