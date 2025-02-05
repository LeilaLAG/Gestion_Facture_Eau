import React from "react";

export default function AddCompteur({ onChangeInfo, clients, numClient }) {
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Point de depart</label>
        <input
          type="number"
          name="startPoint"
          className="form-control"
          placeholder="Saisir le point de depart (0 par defaut)"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Date d'utilisation</label>
        <input
          type="date"
          name="useDate"
          className="form-control"
          placeholder="Choisir la date d'utilisation"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Credit</label>
        <input
          type="number"
          name="credit"
          placeholder="0 par defaut"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Client</label>
        <select
          name="numClient"
          className="form-control"
          onChange={onChangeInfo}
        >
          <option>Choisir le client</option>
          {clients.length <= 0 ? (
            <option>Aucun client</option>
          ) : (
            clients !== "loading" &&
            clients.map((client, i) =>
              client.error ? (
                <option key={i}>Un erreur est servenu</option>
              ) : client.numClient === numClient ? (
                <option key={i} value={client.numClient} selected>
                  {client.nameClient}
                </option>
              ) : (
                <option key={i} value={client.numClient}>
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
