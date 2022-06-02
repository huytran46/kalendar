import React from "react";
import { useDrop } from "react-dnd";
import { observer } from "mobx-react-lite";
import { EDraggableItemType } from "../../../../shared/enums";
import type { DragAndDropManagerClass } from "../../../../mobx/drag-n-drop-manager";

interface IKalendarBlockOverlayProps {
  dndManager: DragAndDropManagerClass;
  x: number;
  y: number;
}

const KalendarBlockOverlay: React.FC<IKalendarBlockOverlayProps> = observer(
  ({ dndManager, x, y }) => {
    const [{ isOver }, drop] = useDrop<
      { eventId: number },
      unknown,
      { isOver: boolean }
    >(
      () => ({
        accept: EDraggableItemType.KALENDAR_EVENT,
        drop: (item) => {
          dndManager.moveEventToBlock(item.eventId, x, y);
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        }),
      }),
      []
    );

    return (
      <div
        ref={drop}
        style={{
          display: "grid",
          placeItems: "center",
          fontSize: 2,
          gridArea: `${x}/${y}/${x + 1}/${y + 1}`,
          backgroundColor: isOver ? "coral" : "",
        }}
      />
    );
  }
);

export default KalendarBlockOverlay;
