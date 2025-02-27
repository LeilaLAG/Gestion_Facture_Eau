import React from "react";
import GetCompteurs from "../../hooks/GetCompteurs";

function AddFacture({ onChangeInfo, client }) {
  const compteurs = GetCompteurs();
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return (
    <div className="mt-2">
      <div className="mb-3">
        <span style={{ color: "red" }}>
          *Remarque: La date doit être du mois {mois[new Date().getMonth()]}
        </span>
        <label className="d-block">Date de consomation</label>
        <input
          type="date"
          name="dateFacture"
          className="form-control"
          placeholder="Saisir la date de facture"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Numéro de compteur</label>
        <select
          name="numCompteur"
          className="form-control"
          onChange={onChangeInfo}
        >
          <option>Choisir le compteur</option>
          {compteurs !== "loading" &&
            (compteurs.filter((c) => c.numClient === parseInt(client)).length <=
            0 ? (
              <option>Aucun compteur</option>
            ) : (
              compteurs
                .filter((comp) => comp.numClient === parseInt(client))
                .map((comp, i) =>
                  comp.error ? (
                    <option key={i}>Un erreur est servenu!</option>
                  ) : (
                    <option key={i} value={comp.numCompteur}>
                      N°-{comp.numCompteur}
                    </option>
                  )
                )
            ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="d-block">Valeur de compteur prélevé</label>
        <input
          type="number"
          placeholder="0 par defaut"
          name="valeurCompteurPreleve"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
    </div>
  );
}

export default AddFacture;
