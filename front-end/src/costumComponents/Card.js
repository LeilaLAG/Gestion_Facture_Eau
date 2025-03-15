import React from "react";

export default function Card({
  text,
  icon,
  title,
  textSize,
  textWeight,
  cardWidth,
}) {
  return (
    <div className="card rounded p-3 shadow m-1" style={{ width: cardWidth }}>
      <div className="d-flex align-items-center gap-2">
        <img src={icon} alt="card Icon" width={25} />
        <span className="fw-bold fs-5">{title}</span>
      </div>
      <div>
        <p
          className="m-2"
          style={{ fontSize: textSize, fontWeight: textWeight }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
