import React from "react";
import { v4 as uuidv4 } from "uuid";
import Block from "../../../../shared/components/Block";
import { TWorkingDay } from "../../../../shared/model/Calendar";

import "./KalendarHeaderRow.scss";

interface IKalendarHeaderRowProps {
  workingDays: TWorkingDay[];
}

function parseToWeekdayString(weekday: number): string {
  switch (weekday) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Invalid day";
  }
}

const HeaderRow: React.FC<IKalendarHeaderRowProps> = (props) => {
  return (
    <>
      <Block className="kalendar-block__header kalendar-block__blank" />
      {props.workingDays.map(([weekday, date], idx) => (
        <Block
          key={uuidv4()}
          className={`kalendar-block__header ${
            idx === 0 ? "kalendar-block__header--today" : ""
          }`}
        >
          <span className="kalendar-block-header-date">{date}</span>
          <span className="kalendar-block-header-weekday">
            {parseToWeekdayString(weekday)}
          </span>
        </Block>
      ))}
    </>
  );
};

export default HeaderRow;
