import React, { PropsWithChildren } from "react";
import "./Block.scss";

const Block: React.FC<
  PropsWithChildren<{ className?: string; isLast?: boolean }>
> = (props) => {
  return (
    <span
      className={`kalendar-block ${props.className ?? ""} ${
        props.isLast ? "kalendar-block__last" : ""
      }`}
    >
      {props.children}
    </span>
  );
};

export default Block;
