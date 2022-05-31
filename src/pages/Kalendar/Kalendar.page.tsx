import React, { useMemo } from "react";
import FifteenMinutesRow from "./components/FifteenMinutesRow";
import HeaderRow from "./components/HeaderRow";
import KalendarVirtualMap from "./KalendarVirtualMap.component";
import DayUtil from "../../shared/lib/day";
import "./Kalendar.scss";

function renderSchedule(): JSX.Element[] {
  const fifteenMinutesRows: JSX.Element[] = [];
  for (let hour = 9; hour < 19; hour++) {
    for (let i = 0; i < 60; i += 15) {
      fifteenMinutesRows.push(
        <FifteenMinutesRow
          key={i + hour}
          hour={hour}
          minute={i === 0 ? undefined : i}
        />
      );
    }
  }
  return fifteenMinutesRows;
}

const numberOfColumns = 7 + 1;

const Kalendar: React.FC = () => {
  const workingDays = useMemo(() => DayUtil.getNextSevenWorkingDays(), []);
  const timeRows = useMemo(() => renderSchedule(), []);
  const numberOfRows = useMemo(() => timeRows.length + 1, [timeRows]);

  return (
    <div
      className="kalendar"
      style={{
        gridTemplateColumns: `repeat(${numberOfColumns}, 240px)`,
        gridTemplateRows: `repeat(${numberOfRows}, 80px)`,
      }}
    >
      {/* HEADER */}
      <HeaderRow workingDays={workingDays} />

      {/* BODY */}
      {timeRows}

      <KalendarVirtualMap
        gridTemplateColumns={`repeat(${numberOfColumns}, 240px)`}
        gridTemplateRows={`repeat(${numberOfRows}, 80px)`}
      />
    </div>
  );
};

export default Kalendar;
