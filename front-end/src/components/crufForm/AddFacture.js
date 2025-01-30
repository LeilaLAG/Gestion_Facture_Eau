import React from "react";
import GetCompteurs from "../../hooks/GetCompteurs";

function AddFacture({ onChangeInfo }) {
  const compteurs = GetCompteurs();

  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Date Facture</label>
        <input
          type="date"
          name="dateFacture"
          className="form-control"
          placeholder="Saisir la date de facture"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Num Compteur</label>
        <select
          name="numCompteur"
          className="form-control"
          onChange={onChangeInfo}
        >
          <option>Choisir un compteur</option>
          {compteurs.length <= 0 ? (
            <option>aucun compteur</option>
          ) : (
            compteurs !== "loading" &&
            compteurs.map((comp, i) =>
              comp.error ? (
                <option key={i}>Un erreur est servenu</option>
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
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Situation Paiment</label>
        <input
          type="text"
          name="painementStatus"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Date Paiment</label>
        <input
          type="date"
          name="datePainement"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Total Facture</label>
        <input
          type="number"
          name="totalFacture"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
    </div>
  );
}

export default AddFacture;
