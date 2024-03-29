import React, { CSSProperties, useEffect, useMemo } from "react";
import useAxios from "../../hooks/use-axios.hook";
import CalendarService from "../../service/calendar.service";
import KalendarEvent from "./components/KalendarEvent";
import { useGlobalSetting } from "../../context/Setting.context";
import DayUtil from "../../shared/lib/day";
import DragAndDropManager from "../../mobx/drag-n-drop-manager";
import type { IStaffEvent } from "../../shared/model/StaffEvent";
import KalendarBlockOverlay from "./components/KalendarBlockOverlay";
import "./Kalendar.scss";

const MAX_ROWS = 601; // assumpt each row = 1 minute

interface IKEventWithCoordinates {
  row: [number, number];
  col: [number, number];
  kalendarEvent: IStaffEvent;
}

function renderOverlay(i: number, x: number, y: number) {
  return (
    <KalendarBlockOverlay
      key={`${i}:${x}/${y}/${x + 1}/${y + 1}`}
      dndManager={DragAndDropManager}
      x={x}
      y={y}
    />
  );
}

function renderOverlayBlocks() {
  const overlayBlocks = [];
  for (let i = 2; i <= 601; i += 1) {
    for (let j = 2; j <= 8; j += 1) {
      overlayBlocks.push(renderOverlay(i, i, j));
    }
  }
  return overlayBlocks;
}

const KalendarRenderLayer: React.FC<CSSProperties> = (styleAsProps) => {
  const settingContext = useGlobalSetting();

  const { data, loading, execute } = useAxios<undefined, IStaffEvent[]>(
    "/events?staff_id=1",
    "GET",
    undefined,
    false
  );

  useEffect(() => {
    if (settingContext.viewingStaffId == null) return;
    execute(undefined, `/events?staff_id=${settingContext.viewingStaffId}`);
  }, [settingContext.viewingStaffId]);

  const coordinates = useMemo<IKEventWithCoordinates[]>(() => {
    if (!data?.length) return [];
    return data.map((kEvent) => {
      const { row: _startRow, column: _startColumn } =
        CalendarService.parseUnixEpochToGridCoordinates(kEvent.start_at);

      const { row: _endRow, column: _endColumn } =
        CalendarService.parseUnixEpochToGridCoordinates(kEvent.end_at, true);

      return {
        row: [_startRow, _endRow],
        col: [_startColumn, _endColumn],
        kalendarEvent: kEvent,
      };
    });
  }, [data]);

  const overlayBlocks = useMemo(() => renderOverlayBlocks(), []);

  if (loading) {
    return null;
  }

  return (
    <div className="kalendar kalendar-virtual-map" style={styleAsProps}>
      {overlayBlocks}
      {coordinates?.map((e) => {
        const { row, col, kalendarEvent } = e;

        const [_startRow, _endRow] = row;

        const [_startColumn, _endColumn] = col;

        if (_startColumn === _endColumn && _startColumn === 0) {
          return null;
        }

        if (_startColumn >= settingContext.daysToShow) {
          return null;
        }

        if (_startRow >= MAX_ROWS || _endRow >= MAX_ROWS) {
          return null;
        }

        return (
          <KalendarEvent
            dndManager={DragAndDropManager}
            key={kalendarEvent.id}
            eventId={kalendarEvent.id}
            eventHexColor={kalendarEvent.hex_color}
            column={col}
            row={row}
            label={kalendarEvent.name}
            timeString={`${DayUtil.parseUnixToHourMinuteString(
              kalendarEvent.start_at
            )} - ${DayUtil.parseUnixToHourMinuteString(kalendarEvent.end_at)}`}
            onChange={async () => {
              try {
                await execute(
                  undefined,
                  `/events?staff_id=${kalendarEvent.staff_id}`
                );
              } catch (error) {
                console.error(error);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default KalendarRenderLayer;
