import React from "react";
// import GetCompteurs from "../../hooks/GetCompteurs";

function ModFacture({ onChangeModInfo, dataToMod }) {
  // const compteurs = GetCompteurs();

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
          // onChange={onChangeModInfo}
          readOnly
        />
      </div>
      {/* <div className="mb-3">
        <label className="d-block">Valeur Compteur Prélevé</label>
        <input
          type="number"
          name="valeurCompteurPreleve"
          className="form-control"
          value={dataToMod.valeurCompteurPreleve}
          onChange={onChangeModInfo}
        />
      </div> */}
      <div className="mb-3">
        <label className="d-block">Situation Paiment</label>
        <select
          name="painementStatus"
          className="form-control"
          onChange={onChangeModInfo}
        >
          <option value="Non payée" selected={dataToMod.painementStatus === "Non payée" ? true : false}>Non payée</option>
          <option value="Payée" selected={dataToMod.painementStatus === "Payée" ? true : false}>Payée</option>
        </select>
      </div>
      {/* <div className="mb-3">
        <label className="d-block">Date Paiment</label>
        <input
          type="date"
          name="datePainement"
          className="form-control"
          value={dataToMod.datePainement ? convertDate(dataToMod.datePainement) : ""}
          onChange={onChangeModInfo}
        />
      </div> */}
    </div>
  );
}

export default ModFacture;
