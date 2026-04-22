export const convertSquareMeterToTsubo = (squareMeters?: number | null): number => {
  const TSUBO_PER_SQUARE_METER = 1 / 3.305785;
  if (squareMeters) {
    return Math.round(squareMeters * TSUBO_PER_SQUARE_METER * 100) / 100;
  }
  return 0;
};
