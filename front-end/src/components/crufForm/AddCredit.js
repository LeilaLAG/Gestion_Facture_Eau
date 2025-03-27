import React from "react";
import GetCompteurs from "../../hooks/GetCompteurs";

export default function AddCredit({ onChangeInfo }) {
  const comps = GetCompteurs();
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Num Compteur</label>
        <select
          name="numCompteur"
          className="form-control"
          onChange={onChangeInfo}
        >
          <option value=""></option>
          {comps !== "loading" &&
            comps.map((c, i) => (
              <option key={i} value={c.numCompteur}>
                {c.numCompteur}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="d-block">Montant Paye</label>
        <input
          type="number"
          name="montantPaye"
          className="form-control"
          placeholder="Saisir le montant paye en Dh"
          onChange={onChangeInfo}
        />
      </div>
    </div>
  );
}
