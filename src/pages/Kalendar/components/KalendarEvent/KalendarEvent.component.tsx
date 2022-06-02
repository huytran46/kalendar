import React, {
  CSSProperties,
  useMemo,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import type { DragSourceMonitor } from "react-dnd";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { observer } from "mobx-react-lite";
import useAxios from "../../../../hooks/use-axios.hook";
import type { IStaffEvent } from "../../../../shared/model/StaffEvent";
import type { DragAndDropManagerClass } from "../../../../mobx/drag-n-drop-manager";
import { EDraggableItemType } from "../../../../shared/enums";
import CalendarService from "../../../../service/calendar.service";
import type { IGridCoordinate } from "../../../../shared/model/Calendar";
import "./KalendarEvent.scss";

interface IEventBlockProps extends IGridCoordinate {
  eventId: number;
  label: string;
  eventHexColor: string;
  timeString: string;
  dndManager: DragAndDropManagerClass;
  onChange: () => Promise<void>;
}

const ROW_OFFSET = 2;
const COL_OFFSET = 1;

function getStyles(
  gridAreaString: string,
  isDragging: boolean,
  isLoading: boolean
): CSSProperties {
  const transition = "grid-area 0.3s";

  return {
    gridArea: gridAreaString,
    transition: transition,
    WebkitTransition: transition,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging || isLoading ? 0.5 : 1,
    // height: isDragging ? 0 : "",
  };
}

const parseGridAreaString = (
  _x: number,
  _y: number,
  _endX: number,
  _endY: number
) => `${_x}/${_y}/${_endX}/${_endY}`;

const KalendarEvent: React.FC<IEventBlockProps> = observer((props) => {
  const {
    row,
    column,
    eventHexColor,
    label,
    timeString,
    dndManager,
    onChange,
  } = props;

  const [loading, setLoading] = useState(false);

  const _rowStart = useMemo(() => row[0] + ROW_OFFSET, [row]);

  const _rowEnd = useMemo(() => row[1] + ROW_OFFSET, [row]);

  const _columnStart = useMemo(() => column[0] + COL_OFFSET, [column]);

  const _columnEnd = useMemo(() => column[1] + COL_OFFSET, [column]);

  const _rowOffset = useMemo(() => _rowEnd - _rowStart, [_rowStart, _rowEnd]);

  const patchStaffEventApiHook = useAxios<Partial<IStaffEvent>, IStaffEvent>(
    "/events",
    "PATCH"
  );

  const [gridAreaString, setGridAreaString] = useState("");

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: EDraggableItemType.KALENDAR_EVENT,
      item: { eventId: props.eventId },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.eventId]
  );

  useLayoutEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
    setGridAreaString(
      parseGridAreaString(_rowStart, _columnStart, _rowEnd, _columnEnd)
    );
  }, [_rowStart, _columnStart, _rowEnd, _columnEnd]);

  useEffect(() => {
    if (!dndManager?.draggableEvent) return;
    if (dndManager?.draggableEvent?.eventId !== props.eventId) return;
    // change event's position
    const de = dndManager.draggableEvent;

    // console.log("de.toX:", de.toX);

    // console.log("de.toY:", de.toY);

    const endRow = de.toX + _rowOffset;

    // console.log("_rowOffset:", _rowOffset);

    // console.log("endRow:", endRow);

    const startUnix = CalendarService.revertCoordinatesToUnix(de.toX, de.toY);

    // console.log("startUnix:", startUnix);

    const endUnix = CalendarService.revertCoordinatesToUnix(endRow, de.toY);

    // console.log("endUnix:", endUnix);

    patchEventInfo(startUnix, endUnix, () => {
      setGridAreaString(parseGridAreaString(de.toX, de.toY, endRow, de.toY));
    });

    dndManager?.resetState();
  }, [dndManager?.draggableEvent, _rowOffset, props.eventId]);

  // console.log("test:", CalendarService.revertCoordinatesToUnix(123, 2));

  async function patchEventInfo(
    startUnixTimeStamp: number,
    endUnixTimeStamp: number,
    cb: () => void
  ) {
    try {
      setLoading(true);
      await patchStaffEventApiHook.execute(
        {
          start_at: startUnixTimeStamp,
          end_at: endUnixTimeStamp,
        },
        `/events/${props.eventId}`
      );
      await onChange();
      cb();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      ref={drag}
      className="kalendar-event"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        color: "black",
        outlineColor: eventHexColor,
        backgroundColor: `${eventHexColor}6E`,
        alignSelf: "stretch",
        ...getStyles(
          gridAreaString,
          isDragging,
          patchStaffEventApiHook.loading
        ),
      }}
    >
      <small
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {loading ? (
          <>Loading...</>
        ) : (
          <>
            {label}&nbsp;({timeString})
          </>
        )}
      </small>
    </div>
  );
});

export default KalendarEvent;
