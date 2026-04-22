export const formatId = (id: number, prefix: string) => {
  if (id < 0) {
    return '';
  }
  let s = String(id);
  if (s.length < 6) {
    s = s.padStart(6, '0');
  }
  return prefix + s;
};
