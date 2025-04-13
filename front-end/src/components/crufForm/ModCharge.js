import React from "react";
import GetUsers from "../../hooks/GetUsers";

export default function ModCharge({ onChangeModInfo, dataToMod }) {
  const employers = GetUsers();
  function convertDate(inputdate) {
    const date = new Date(inputdate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Designation</label>
        <input
          type="text"
          name="designation"
          className="form-control"
          placeholder="Saisir la designation de charge"
          value={dataToMod.designation}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Montant</label>
        <input
          type="number"
          name="montant"
          className="form-control"
          placeholder="Saisir le montant en Dh"
          value={dataToMod.montant}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Date Paiment</label>
        <input
          type="date"
          name="datePaiment"
          placeholder="Saisir la date de paiment"
          className="form-control"
          value={convertDate(dataToMod.datePaiment)}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Choisir le responsable</label>
        <select
          type="date"
          name="responsable"
          className="form-control"
          value={dataToMod.responsable}
          onChange={onChangeModInfo}
        >
          <option value="">Choisir un responsable</option>
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
