import React from "react";

export default function AddTranche({ onChangeInfo }) {
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Nom Tranche</label>
        <input
          type="text"
          name="nameTranche"
          className="form-control"
          placeholder="Saisir le nom de tranche"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Prix</label>
        <input
          type="text"
          name="prix"
          className="form-control"
          placeholder="Saisir le prix"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Tonnage Maximal</label>
        <input
          type="number"
          name="maxTonnage"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
    </div>
  );
}
