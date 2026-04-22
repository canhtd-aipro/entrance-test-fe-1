export const normalizeFullWithNumber = <T extends string | null | undefined>(value: T): T => {
  return value?.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0)) as T;
};
