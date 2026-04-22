import { fromGengou, GengouList } from 'kanjidate';
import { datetime } from './datetime.util';

export const convertJapaneseEraDate = (input: string) => {
  // Build pattern: 明治|大正|昭和|平成|令和
  const gengouPattern = GengouList.map((e) => e.kanji).join('|');

  // Important: escape \d inside template string → \\d
  const regex = new RegExp(`^(${gengouPattern})(\\d+)年(\\d+)月(\\d+)日$`);

  const match = input.match(regex);
  if (!match) return;

  const [, gengou, nenStr, month, day] = match;

  const year = fromGengou(gengou, Number(nenStr));

  const date = datetime(`${year}-${month}-${day}`).startOf('day');
  return date;
};
