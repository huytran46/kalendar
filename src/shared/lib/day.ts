import "dayjs/locale/vi"; // Vietnamese locale
import dayjs from "dayjs";
import customFormatPlugin from "dayjs/plugin/customParseFormat";
import { TWorkingDay } from "../model/Calendar";

dayjs.extend(customFormatPlugin);
dayjs.locale("vi");

const FORMAT = "YYYY-MM-DD HH:mm";

type _Date = dayjs.Dayjs;
type _Hour = number;
type _Minute = number;

function getNextSevenWorkingDays(numberOfDays = 7): TWorkingDay[] {
  const dates: TWorkingDay[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const _clone = dayjs().clone().add(i, "day");
    const _weekday = _clone.get("day");
    const _date = _clone.get("date");
    dates.push([_weekday, _date]);
  }

  return dates;
}

function parseUnixToDateTime(unix: number): [_Date, _Hour, _Minute] {
  const _unixDay = dayjs.unix(unix);
  return [_unixDay, _unixDay.get("hour"), _unixDay.get("minute")];
}

function parseSelectedDateTimeToUnix(formatDateTime: string): number {
  return dayjs(formatDateTime, FORMAT).unix();
}

function getToday(): dayjs.Dayjs {
  return dayjs();
}

function parseUnixToHourMinuteString(_unix: number): string {
  return dayjs.unix(_unix).format("HH:mm");
}

function parseHourMinuteDateToUnix(
  _hour: number,
  _minute: number,
  _date: number
): number {
  const _dayJS = dayjs()
    .set("hour", _hour)
    .set("minute", _minute)
    .set("date", _date);
  return _dayJS.unix();
}

export default {
  getToday,
  parseUnixToDateTime,
  getNextSevenWorkingDays,
  parseHourMinuteDateToUnix,
  parseSelectedDateTimeToUnix,
  parseUnixToHourMinuteString,
};
