import React from "react";

export default function ModTranche({ onChangeModInfo, dataToMod }) {
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Nom Tranche</label>
        <input
          type="text"
          name="nameTranche"
          className="form-control"
          placeholder="Saisir le nom d tranche"
          value={dataToMod.nameTranche}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Prix</label>
        <input
          type="text"
          name="prix"
          className="form-control"
          placeholder="Saisir le prix"
          value={dataToMod.prix}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Tonnage Maximal</label>
        <input
          type="number"
          name="maxTonnage"
          className="form-control"
          value={dataToMod.maxTonnage}
          onChange={onChangeModInfo}
        />
      </div>
      {/* <div className="mb-3">
        <label className="d-block">Activé</label>
        <div className="form-check form-check-inline">
          <label className="form-check-label">Yes</label>
          <input
            type="radio"
            name="isActive"
            className="form-check-input"
            value={true}
            onChange={onChangeModInfo}
          />
        </div>
        <div className="form-check form-check-inline">
          <label className="form-check-label">No</label>
          <input
            type="radio"
            name="isActive"
            className="form-check-input"
            value={false}
            onChange={onChangeModInfo}
          />
        </div>
      </div> */}
    </div>
  );
}
