import React, { CSSProperties } from "react";
import "./KalendarEvent.scss";

interface IEventBlockProps extends CSSProperties {
  eventHexColor: string;
  row: [number, number];
  column: [number, number];
}

const ROW_OFFSET = 2;
const COL_OFFSET = 1;

const KalendarEvent: React.FC<IEventBlockProps> = ({
  row,
  column,
  eventHexColor,
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
        color: `${eventHexColor}`,
        outlineColor: eventHexColor,
        backgroundColor: `${eventHexColor}4E`,
      }}
    >
      Event {eventHexColor}
    </span>
  );
};

export default KalendarEvent;
