import { makeAutoObservable } from "mobx";

interface IDraggableEvent {
  eventId: number | null;
  toX: number | null;
  toY: number | null;
}

export class DragAndDropManagerClass {
  draggableEvent: IDraggableEvent | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  moveEventToBlock(_eventId: number, _toX: number, _toY: number) {
    this.draggableEvent = {
      eventId: _eventId,
      toX: _toX,
      toY: _toY,
    };
  }

  resetState() {
    this.draggableEvent = null;
  }
}

const singletonInstance = new DragAndDropManagerClass();

Object.freeze(singletonInstance);

export default singletonInstance;
