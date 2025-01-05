import React from "react";

export default function ModCompteur({ onChangeModInfo, dataToMod , clients }) {
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
        <label className="d-block">Point de depart</label>
        <input
          type="number"
          name="startPoint"
          className="form-control"
          placeholder="Saisir le point de depart"
          value={dataToMod.startPoint}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Date D'utilisation</label>
        <input
          type="date"
          name="useDate"
          className="form-control"
          placeholder="Choisir la date d'utilisation"
          value={convertDate(dataToMod.useDate)}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Credit</label>
        <input
          type="number"
          name="credit"
          className="form-control"
          value={dataToMod.credit}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Client</label>
        <select
          name="numClient"
          className="form-control"
          onChange={onChangeModInfo}
        >
          <option>Choisir un client</option>

          {clients.length <= 0 ? (
            <option>
              Aucun client
            </option>
          ) : (
            clients !== "loading" &&
            clients.map((client, i) =>
              client.error ? (
                <option key={i}>
                  Un erreur est servenu
                </option>
              ) : (
                <option
                  key={client.numClient}
                  value={client.numClient}
                  selected={
                    client.numClient === dataToMod.numClient ? true : false
                  }
                >
                  {client.nameClient}
                </option>
              )
            )
          )}
        </select>
      </div>
    </div>
  );
}
