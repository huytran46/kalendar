import React, { PropsWithChildren } from "react";
import "./Block.scss";

const Block: React.FC<PropsWithChildren<{ className?: string }>> = (props) => {
  return (
    <span className={`kalendar-block ${props.className ?? ""}`}>
      {props.children}
    </span>
  );
};

export default Block;
