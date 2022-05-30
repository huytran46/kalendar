import React, { CSSProperties } from "react";
import KalendarEvent from "./components/KalendarEvent";
import "./Kalendar.scss";

interface IStaffScheduleEvent {
  date: [number, number];
  time: [number, number];
  hexColor: string;
  eventLabel: string;
}

const _915_1015: IStaffScheduleEvent = {
  date: [1, 1],
  time: [2, 6],
  hexColor: "#5F7367",
  eventLabel: "Eat",
};

const _1015_1115: IStaffScheduleEvent = {
  date: [1, 1],
  time: [5, 8],
  hexColor: "#F4989C",
  eventLabel: "Work",
};

const scheduleEvents = [_915_1015, _1015_1115];

interface IKalendarVirtualMapProps extends CSSProperties {}

const KalendarVirtualMap: React.FC<IKalendarVirtualMapProps> = (
  styleAsProps
) => {
  return (
    <div className="kalendar-virtual-map" style={styleAsProps}>
      {scheduleEvents.map((e) => (
        <KalendarEvent
          key={e.hexColor}
          eventHexColor={e.hexColor}
          column={e.date}
          row={e.time}
          alignSelf="stretch"
        />
      ))}
    </div>
  );
};

export default KalendarVirtualMap;
