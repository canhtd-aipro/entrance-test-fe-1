export const normalizeDigits = (value?: string) => {
  if (!value) return null;
  const digits = value.normalize('NFKC').replace(/[^0-9]/gi, '');

  return digits ?? null;
};
