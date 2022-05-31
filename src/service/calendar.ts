import dayjs from "dayjs";
import DayUtil from "../shared/lib/day";
import NumberUtil from "../shared/lib/number";

const MINUTES_PER_HOUR = 60;

function parseTimeDigitToTime(
  _timedigit: number,
  startWorkingTime = 900,
  endWorkingTime = 1800
): string {
  if (_timedigit > endWorkingTime) return "18:00";
  if (_timedigit <= startWorkingTime) return "09:00";

  // extract
  let _hour = Math.floor(_timedigit / 100);
  let _minute = Math.round(_timedigit % 100);

  // auto heal
  _minute = Math.max(0, Math.min(59, _minute));
  _hour = Math.max(0, Math.min(24, _hour));

  // auto append zero if needed
  const _hourStr = _hour < 10 ? `0${_hour}` : `${_hour}`;
  const _minuteStr = _minute < 10 ? `0${_minute}` : `${_minute}`;

  return `${_hourStr}:${_minuteStr}`;
}

function isValidDateStringFormat(inputDate: string): boolean {
  return /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\s[0-9]{2}\:[0-9]{2}$/g.test(inputDate);
}

function _parseTimeToGridRow(
  _hour: number,
  _minute: number,
  originHour = 9,
  minutesPerRow = 15
): number {
  const _originHour = NumberUtil.forceMaxMin(originHour, 24, 0);

  const _minutesPerRow = NumberUtil.forceMaxMin(minutesPerRow, 59, 1);

  const hoursOffset = _hour - _originHour;

  if (hoursOffset < 0) {
    return 0;
  }

  const numberOfRowsInOneHour = Math.round(MINUTES_PER_HOUR / _minutesPerRow);

  const _hourRowIndex = hoursOffset * numberOfRowsInOneHour;

  const _minuteRowIndex =
    (_minute - (_minute % _minutesPerRow)) / _minutesPerRow;

  return _hourRowIndex + _minuteRowIndex + 1;
}

function _parseDateToGridColumn(
  _date: dayjs.Dayjs,
  originDate: dayjs.Dayjs,
  daysPerColumn: number,
  maxShowDates = 7
): number {
  const dayOffset = originDate.diff(_date, "day");

  if (dayOffset < 0 || dayOffset > maxShowDates) {
    return 0;
  }

  const _columnIndex = dayOffset * daysPerColumn + 1; // 1 for itself

  return _columnIndex;
}

function parseUnixEpochToGridCoordinates(
  unix: number,
  originHour = 9,
  minutesPerRow = 15,
  originDateObj = DayUtil.getToday(),
  daysPerColumn = 1,
  maxShowDates = 7
): { row: number; column: number } {
  const [_dateObj, _hour, _minute] = DayUtil.parseUnixToDateTime(unix);

  const _rowIndex = _parseTimeToGridRow(
    _hour,
    _minute,
    originHour,
    minutesPerRow
  );

  const _columnIndex = _parseDateToGridColumn(
    _dateObj,
    originDateObj,
    daysPerColumn,
    maxShowDates
  );

  return {
    row: _rowIndex,
    column: _columnIndex,
  };
}

export default {
  parseTimeDigitToTime,
  isValidDateStringFormat,
  parseUnixEpochToGridCoordinates,
};
