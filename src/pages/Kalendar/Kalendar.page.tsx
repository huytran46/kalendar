import React, { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import KalendarRow from "./components/KalendarRow";
import HeaderRow from "./components/KalendarHeaderRow";
import KalendarRenderLayer from "./KalendarRenderLayer.component";
import DayUtil from "../../shared/lib/day";
import "./Kalendar.scss";
import { useGlobalSetting } from "../../context/Setting.context";

const NUMBER_OF_COLUMNS = 7 + 1;
// const ROW_HEIGHT_PX = 80;
const COLUMN_WIDTH_PX = 240;

function renderScheduleRows(
  numberOfColumns: number,
  minutesPerRow = 15,
  startHour = 9,
  endHour = 18
): JSX.Element[] {
  const calendarRows: JSX.Element[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let i = 0; i < 60; i += minutesPerRow) {
      calendarRows.push(
        <KalendarRow
          key={uuidv4()}
          hour={hour}
          minute={i === 0 ? undefined : i}
          numberOfColumns={numberOfColumns}
          isLastRow={hour === 18 && !(i + minutesPerRow < 60)}
        />
      );
    }
  }
  return calendarRows;
}

const virtualGridStyle = {
  gridTemplateColumns: "160px repeat(7, 240px)",
  gridTemplateRows: "80px 40px repeat(599, calc(40px / 15))",
};

const Kalendar: React.FC = () => {
  const settingContext = useGlobalSetting();

  const workingDays = useMemo(() => DayUtil.getNextSevenWorkingDays(), []);

  const calendarRows = useMemo(
    () => renderScheduleRows(NUMBER_OF_COLUMNS, settingContext.minutesPerRow),
    [settingContext.minutesPerRow]
  );

  const rowHeightConfig = useMemo(
    () => settingContext.rowHeightInPx,
    [settingContext.rowHeightInPx]
  );

  const numberOfRows = useMemo(() => calendarRows.length + 1, [calendarRows]);

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `160px repeat(${
        NUMBER_OF_COLUMNS - 1
      }, ${COLUMN_WIDTH_PX}px)`,
      gridTemplateRows: `80px repeat(${
        numberOfRows - 1
      }, ${rowHeightConfig}px)`,
    }),
    [numberOfRows, rowHeightConfig]
  );

  const virtualGridStyle = useMemo(
    () => ({
      gridTemplateColumns: "160px repeat(7, 240px)",
      gridTemplateRows: `80px ${rowHeightConfig}px repeat(599, calc(${rowHeightConfig}px / ${settingContext.minutesPerRow}))`,
    }),
    [rowHeightConfig, settingContext.minutesPerRow]
  );

  return (
    <div className="kalendar" style={gridStyle}>
      {/* HEADER */}
      <HeaderRow workingDays={workingDays} />

      {/* BODY */}
      {calendarRows}

      <KalendarRenderLayer {...virtualGridStyle} />
    </div>
  );
};

export default Kalendar;
