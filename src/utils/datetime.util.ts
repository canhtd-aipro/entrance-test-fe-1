import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import minMax from 'dayjs/plugin/minMax';
import weekday from 'dayjs/plugin/weekday';

export const datetime = dayjs;
export type DateTime = Dayjs;
datetime.extend(weekday);
datetime.extend(localeData);
datetime.extend(isBetween);
datetime.extend(isSameOrAfter);
datetime.extend(isSameOrBefore);
datetime.extend(minMax);
