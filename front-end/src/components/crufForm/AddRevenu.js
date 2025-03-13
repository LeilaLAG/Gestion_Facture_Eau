import React from "react";

export default function AddRevenu({ onChangeInfo }) {
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Designation</label>
        <input
          type="text"
          name="designation"
          className="form-control"
          placeholder="Saisir la designation de revenu"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Montant</label>
        <input
          type="number"
          name="montant"
          className="form-control"
          placeholder="Saisir le montant en Dh"
          onChange={onChangeInfo}
        />
      </div>
    </div>
  );
}
