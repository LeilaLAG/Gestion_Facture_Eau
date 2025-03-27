import React from "react";

export default function ModCredit({ onChangeModInfo, dataToMod }) {
  // const comps = GetCompteurs();
  return (
    <div className="mt-2">
      {/* <div className="mb-3">
        <label className="d-block">Num Compteur</label>
        <select
          name="numCompteur"
          className="form-control"
          onChange={onChangeModInfo}
        >
          <option value=""></option>
          {comps !== "loading" &&
            comps.map((c, i) => (
              <option
                key={i}
                value={c.numCompteur}
                selected={c.numCompteur === dataToMod.numCompteur}
              >
                {c.numCompteur}
              </option>
            ))}
        </select>
      </div> */}
      <div className="mb-3">
        <label className="d-block">Montant Paye</label>
        <input
          type="number"
          name="montantPaye"
          className="form-control"
          placeholder="Saisir le montant paye en Dh"
          value={dataToMod.montantPaye}
          onChange={onChangeModInfo}
        />
      </div>
    </div>
  );
}
