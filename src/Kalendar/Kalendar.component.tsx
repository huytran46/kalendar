import React from "react";
import FifteenMinutesRow from "./components/FifteenMinutesRow";
import HeaderRow from "./components/HeaderRow";
import KalendarVirtualMap from "./KalendarVirtualMap.component";
import "./Kalendar.scss";

const Kalendar: React.FC = () => {
  function renderSchedule() {
    const fifteenMinutesRows: JSX.Element[] = [];
    for (let hour = 9; hour < 19; hour++) {
      for (let i = 0; i < 60; i += 15) {
        fifteenMinutesRows.push(
          <FifteenMinutesRow hour={hour} minute={i === 0 ? undefined : i} />
        );
      }
    }
    return fifteenMinutesRows;
  }

  const numberOfRows = renderSchedule().length + 1;
  const numberOfColumns = 7 + 1;

  return (
    <div
      className="kalendar"
      style={{
        gridTemplateColumns: `repeat(${numberOfColumns}, 240px)`,
        gridTemplateRows: `repeat(${numberOfRows}, 80px)`,
      }}
    >
      {/* HEADER */}
      <HeaderRow />

      {/* BODY */}
      {renderSchedule()}
      <KalendarVirtualMap
        gridTemplateColumns={`repeat(${numberOfColumns}, 240px)`}
        gridTemplateRows={`repeat(${numberOfRows}, 80px)`}
      />
    </div>
  );
};

export default Kalendar;
