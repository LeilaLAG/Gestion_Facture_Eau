import React from "react";
import GetCompteurs from "../../hooks/GetCompteurs";

function ModFacture({ onChangeModInfo, dataToMod }) {
  const compteurs = GetCompteurs();

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
        <label className="d-block">Date Facture</label>
        <input
          type="date"
          name="dateFacture"
          className="form-control"
          placeholder="Saisir la date de facture"
          value={convertDate(dataToMod.dateFacture)}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Num Compteur</label>
        <select
          name="numCompteur"
          className="form-control"
          onChange={onChangeModInfo}
        >
          <option>Choisir un compteur</option>
          {compteurs.length <= 0 ? (
            <option>aucun compteur</option>
          ) : (
            compteurs !== "loading" &&
            compteurs.map((comp, i) =>
              comp.error ? (
                <option key={i}>Un erreur est servenu</option>
              ) : comp.numCompteur === dataToMod.numCompteur ? (
                <option key={i} value={comp.numCompteur} selected>
                  {comp.numCompteur}
                </option>
              ) : (
                <option key={i} value={comp.numCompteur}>
                  {comp.numCompteur}
                </option>
              )
            )
          )}
        </select>
      </div>
      <div className="mb-3">
        <label className="d-block">Valeur Compteur Prélevé</label>
        <input
          type="number"
          name="valeurCompteurPreleve"
          className="form-control"
          value={dataToMod.valeurCompteurPreleve}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Situation Paiment</label>
        <input
          type="text"
          name="painementStatus"
          className="form-control"
          value={dataToMod.painementStatus}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Date Paiment</label>
        <input
          type="date"
          name="datePainement"
          className="form-control"
          value={convertDate(dataToMod.datePainement)}
          onChange={onChangeModInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Total Facture</label>
        <input
          type="number"
          name="totalFacture"
          className="form-control"
          value={dataToMod.totalFacture}
          onChange={onChangeModInfo}
        />
      </div>
    </div>
  );
}

export default ModFacture;
