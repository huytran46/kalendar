import React from "react";

import "./Kalendar.scss";

interface IRowProps {
  hour: number;
  minute?: number;
}

const Row: React.FC<IRowProps> = (props) => {
  return (
    <>
      <span
        className={`kalendar-block kalendar-block__time ${
          props.minute ? "kalendar-block__minute" : ""
        }`}
      >
        {props.minute ? (
          <>
            {props.hour}:{props.minute ?? "00"}&nbsp;PM
          </>
        ) : (
          <b>
            {props.hour}:{props.minute ?? "00"}&nbsp;PM
          </b>
        )}
      </span>
      <span className="kalendar-block"></span>
      <span className="kalendar-block"></span>
      <span className="kalendar-block"></span>
      <span className="kalendar-block"></span>
      <span className="kalendar-block"></span>
      <span className="kalendar-block"></span>
      <span className="kalendar-block"></span>
    </>
  );
};

const Kalendar: React.FC<{}> = () => {
  return (
    <div className="kalendar">
      {/* HEADER */}
      <span className="kalendar-block kalendar-block__blank"></span>
      <span className="kalendar-block kalendar-block__date">Sunday</span>
      <span className="kalendar-block kalendar-block__date">Monday</span>
      <span className="kalendar-block kalendar-block__date">Tuesday</span>
      <span className="kalendar-block kalendar-block__date">Wednesday</span>
      <span className="kalendar-block kalendar-block__date">Thursday</span>
      <span className="kalendar-block kalendar-block__date">Friday</span>
      <span className="kalendar-block kalendar-block__date">Saturday</span>

      {/* BODY */}
      <Row hour={5} />
      <Row hour={5} minute={15} />
      <Row hour={6} />
      <Row hour={7} />
    </div>
  );
};

export default Kalendar;
