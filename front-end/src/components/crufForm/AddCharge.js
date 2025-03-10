import React from "react";
import GetUsers from "../../hooks/GetUsers";

export default function AddCharge({ onChangeInfo }) {
  const employers = GetUsers();
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Designation</label>
        <input
          type="text"
          name="designation"
          className="form-control"
          placeholder="Saisir la designation de charge"
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
      <div className="mb-3">
        <label className="d-block">Date Paiment</label>
        <input
          type="date"
          name="datePaiment"
          placeholder="Saisir la date de paiment"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Choisir le responsable</label>
        <select
          type="date"
          name="responsable"
          className="form-control"
          onChange={onChangeInfo}
        >
          <option value=""></option>
          {employers !== "loading" &&
            employers.map((emp, i) => (
              <option key={i} value={emp.fullName}>
                {emp.fullName}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
