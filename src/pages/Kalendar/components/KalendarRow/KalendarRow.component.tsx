import React, { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Block from "../../../../shared/components/Block";
import "./KalendarRow.scss";

interface IKalendarRowProps {
  numberOfColumns: number;
  hour: number;
  minute?: number;
  isLastRow?: boolean;
}

const FifteenMinutesRow: React.FC<IKalendarRowProps> = (props) => {
  const hour = useMemo(
    () => (props.hour < 10 ? `0${props.hour}` : props.hour),
    [props.hour]
  );

  const minute = useMemo(
    () => (props.minute < 10 ? `0${props.minute}` : props.minute),
    [props.minute]
  );

  const ampm = useMemo(() => (props.hour > 12 ? "PM" : "AM"), [props.hour]);

  function renderOtherBlocks() {
    const blocks: JSX.Element[] = [];
    for (let i = 0; i < props.numberOfColumns - 1; i++) {
      blocks.push(<Block key={uuidv4()} isLast={props.isLastRow} />);
    }
    return blocks;
  }

  return (
    <>
      <Block
        key={uuidv4()}
        className={`kalendar-block__time ${
          props.minute ? "kalendar-block__minute" : ""
        }`}
        isLast={props.isLastRow}
      >
        <span className="kalendar-time-text">
          {!props.minute ? (
            <b>
              {hour}:00&nbsp;{ampm}
            </b>
          ) : props.minute % 5 === 0 ? (
            <>
              {hour}:{minute}
              &nbsp;{ampm}
            </>
          ) : null}
        </span>
      </Block>
      {renderOtherBlocks()}
    </>
  );
};

export default FifteenMinutesRow;
