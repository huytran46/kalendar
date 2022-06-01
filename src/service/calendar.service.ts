import dayjs from "dayjs";
import DayUtil from "../shared/lib/day";
import NumberUtil from "../shared/lib/number";

const MINUTES_PER_HOUR = 60;

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

  // console.log("=============================================");

  // console.log("_minute:", _minute);

  // console.log("_minuteRowIndex:", _minuteRowIndex);

  // const isRare = _minute % _minutesPerRow === 0;

  // console.log("isRare:", isRare);

  // console.log("reult:", _hourRowIndex + _minuteRowIndex + 1);

  // console.log("=============================================");

  return _hourRowIndex + _minuteRowIndex + 1;
}

function _parseDateToGridColumn(
  _date: dayjs.Dayjs,
  originDate: dayjs.Dayjs,
  daysPerColumn: number,
  isEndColumn: boolean,
  maxShowDates = 7
): number {
  const startDate = _date.startOf("date");
  const startOriginDate = originDate.startOf("date");
  const dayOffset = startDate.diff(startOriginDate, "days");

  if (dayOffset < 0 || dayOffset > maxShowDates) {
    return 0;
  }

  let _columnIndex = dayOffset * daysPerColumn + 1; // 1 for itself

  if (isEndColumn) {
    _columnIndex += 1;
  }

  return _columnIndex;
}

function parseUnixEpochToGridCoordinates(
  unix: number,
  isEndColumn = false,
  originHour = 9,
  minutesPerRow = 1,
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
    isEndColumn,
    maxShowDates
  );

  return {
    row: _rowIndex,
    column: _columnIndex,
  };
}

export default {
  parseUnixEpochToGridCoordinates,
};
