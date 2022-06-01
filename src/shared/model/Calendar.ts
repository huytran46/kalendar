type _WeekDay = number;
type _Date = number;

export type TWorkingDay = [_WeekDay, _Date];

export interface IGridCoordinate {
  row: [number, number];
  column: [number, number];
}
