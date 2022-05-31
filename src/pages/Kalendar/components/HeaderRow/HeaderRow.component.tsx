import React from "react";
import Block from "../../../../shared/components/Block";
import { TWorkingDay } from "../../../../shared/model/Calendar";

import "./HeaderRow.scss";

interface IHeaderRowProps {
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

const HeaderRow: React.FC<IHeaderRowProps> = (props) => {
  return (
    <>
      <Block className="kalendar-block__header kalendar-block__blank" />
      {props.workingDays.map(([weekday, date], idx) => (
        <Block key={idx} className="kalendar-block__header">
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
