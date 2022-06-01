import React, { CSSProperties } from "react";
import type { IGridCoordinate } from "../../../../shared/model/Calendar";
import "./KalendarEvent.scss";

interface IEventBlockProps extends CSSProperties, IGridCoordinate {
  label: string;
  eventHexColor: string;
  timeString: string;
}

const ROW_OFFSET = 2;
const COL_OFFSET = 1;

const KalendarEvent: React.FC<IEventBlockProps> = ({
  row,
  column,
  eventHexColor,
  label,
  timeString,
  ...style
}) => {
  return (
    <span
      className="kalendar-event"
      style={{
        ...style,
        gridArea: `${row[0] + ROW_OFFSET}/${column[0] + COL_OFFSET}/${
          row[1] + ROW_OFFSET
        }/${column[1] + COL_OFFSET}`,
        color: "black",
        outlineColor: eventHexColor,
        backgroundColor: `${eventHexColor}6E`,
      }}
    >
      <small style={{ width: "100%" }}>
        {label}&nbsp;({timeString})
      </small>
    </span>
  );
};

export default KalendarEvent;
