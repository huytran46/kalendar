import React, { PropsWithChildren } from "react";
import Block from "../../../shared/components/Block";
import "./HeaderRow.scss";

const HeaderRow: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <>
      <Block className="kalendar-block__header kalendar-block__blank"></Block>
      <Block className="kalendar-block__header kalendar-block__date">
        Sunday
      </Block>
      <Block className="kalendar-block__header kalendar-block__date">
        Monday
      </Block>
      <Block className="kalendar-block__header kalendar-block__date">
        Tuesday
      </Block>
      <Block className="kalendar-block__header kalendar-block__date">
        Wednesday
      </Block>
      <Block className="kalendar-block__header kalendar-block__date">
        Thursday
      </Block>
      <Block className="kalendar-block__header kalendar-block__date">
        Friday
      </Block>
      <Block className="kalendar-block__header kalendar-block__date">
        Saturday
      </Block>
    </>
  );
};

export default HeaderRow;
