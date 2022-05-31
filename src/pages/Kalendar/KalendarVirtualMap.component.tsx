import React, { CSSProperties } from "react";
import useAxios from "../../hooks/use-axios.hook";
import CalendarService from "../../service/calendar";
import KalendarEvent from "./components/KalendarEvent";
import type { IStaffEvent } from "../../shared/model/StaffEvent";
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
  const { data, loading } = useAxios<undefined, IStaffEvent[]>(
    "events?staff_id=1",
    "GET"
  );

  if (loading) {
    return null;
  }

  return (
    <div className="kalendar kalendar-virtual-map" style={styleAsProps}>
      {data?.map((e) => {
        const { row: _startRow, column: _startColumn } =
          CalendarService.parseUnixEpochToGridCoordinates(e.start_at);

        const { row: _endRow, column: _endColumn } =
          CalendarService.parseUnixEpochToGridCoordinates(e.end_at);

        const row: [number, number] = [_startRow, _endRow];

        const column: [number, number] = [_startColumn, _endColumn];

        return (
          <KalendarEvent
            key={e.id}
            eventHexColor={e.hex_color}
            column={column}
            row={row}
            label={e.name}
            alignSelf="stretch"
          />
        );
      })}
    </div>
  );
};

export default KalendarVirtualMap;
