import React from "react";
import Block from "../../../shared/components/Block";
import "./FifteenMinutesRow.scss";

interface IFifteenMinutesRowProps {
  hour: number;
  minute?: number;
}

const FifteenMinutesRow: React.FC<IFifteenMinutesRowProps> = (props) => {
  return (
    <>
      <Block
        className={`kalendar-block__time ${
          props.minute ? "kalendar-block__minute" : ""
        }`}
      >
        {props.minute ? (
          <>
            {props.hour}:{props.minute ?? "00"}&nbsp;AM
          </>
        ) : (
          <b>
            {props.hour}:{props.minute ?? "00"}&nbsp;AM
          </b>
        )}
      </Block>
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
    </>
  );
};

export default FifteenMinutesRow;
