import React from "react";
import Tooltip from "../components/Tooltip";

export default function Card({
  text,
  icon,
  title,
  textSize,
  textWeight,
  cardWidth,
  rnedementStatus,
  couleur
}) {
  return (
    <div className="card rounded p-3 shadow m-1" style={{ mawWidth: "50%" }}>
      <div className="d-flex align-items-center gap-2">
        <img width={20} src={icon} alt="card Icon" />
        <span className="fw-bold fs-5" style={{textTransform:"capitalize"}}>{title}</span>
      </div>
      <div>
        <div
          className="m-2 d-flex gap-2"
          style={{ fontSize: textSize, fontWeight: textWeight }}
        >
          <span style={{color : couleur}}>
            {text}
          </span>
          <Tooltip text={rnedementStatus < 0 ? "Un déficit de rendement monsuel" : rnedementStatus > 0 ? "Une bénéfice de rendement mensuel" : rnedementStatus === 0 && "Aucun déficit ou bénéfice"}>
            {
              rnedementStatus < 0 ? <img style={{verticalAlign:"top"}} width={20} src="/Assets/loss.png" alt="loss"/> : rnedementStatus > 0 ? <img style={{verticalAlign:"top"}} width={20} src="/Assets/profit.png" alt="profit"/> : rnedementStatus === 0 && <img style={{verticalAlign:"top"}} width={20} src="/Assets/noprofit.png" alt="no profit"/>
            }
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
