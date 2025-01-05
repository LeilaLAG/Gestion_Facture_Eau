import React from "react";

export default function ModClient({ onChangeModInfo, dataToMod }) {
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
        <label className="d-block">Nom complet</label>
        <input
          type="text"
          name="nameClient"
          className="form-control"
          placeholder="Saisir le nom complet du client"
          value={dataToMod.nameClient}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">CIN</label>
        <input
          type="text"
          name="cin"
          className="form-control"
          placeholder="Saisir le CIN du client"
          value={dataToMod.cin}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Date de naissance</label>
        <input
          type="date"
          name="birthDate"
          className="form-control"
          value={convertDate(dataToMod.birthDate)}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Telephone</label>
        <input
          type="text"
          name="tele"
          className="form-control"
          placeholder="Saisir le numero de telephone du client"
          value={dataToMod.tele}
          onChange={onChangeModInfo}
        />
      </div>
    </div>
  );
}
