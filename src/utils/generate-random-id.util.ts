let current = -1;

export const generatePseudoId = (): number => {
  return current--;
};
