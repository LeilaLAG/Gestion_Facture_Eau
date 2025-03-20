import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../Auth/ProtectedRoute";
import Menu from "./Menu";
import Main from "./Main";
import Card from "../costumComponents/Card";
import BarChart from "../costumComponents/Chart";

export default function Caisse() {
  const { user } = useUser();
  const [revenu, setRevenu] = useState(0);
  const [charge, setCharge] = useState(0);
  const [facture, setFacture] = useState(0);
  const [unpaidFacture, setUnpaidFacture] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth()+1);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/caisse/${user.companyId}?month=${month}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setRevenu(res.data.totalRevenu);
        setCharge(res.data.totalCharge);
        setFacture(res.data.totalFactures);
        setUnpaidFacture(res.data.totaleUnpaidFactureStats)
      })
      .catch((err) => console.log("error fetching stats"));
  }, [user , month]);

  return (
    <div className="d-flex h-100">
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">La caisse :</h3>
        <form className="m-1 d-flex align-items-center gap-2 mb-3">
          <label className="fw-bold">Filtrer les données par mois </label>
          <div>
            <input type="number" className="p-2 pt-0 pb-0" max={12} min={1} name="month" onChange={e=>setMonth(e.target.value)} placeholder={`${month}`} /> 
            <span> / {new Date().getFullYear()}</span>
          </div>
        </form>
        <div className="d-flex flex-wrap">
          <Card
            text={revenu + " Dh"}
            title={"Total des revenus"}
            icon={"/Assets/revenus.png"}
            textSize="20px"
          />
          <Card
            text={charge + " Dh"}
            title={"Total des charges"}
            icon={"/Assets/charges.png"}
            textSize="20px"
          />
          <Card
            text={facture + " Dh"}
            title={"Total des factures payées"}
            icon={"/Assets/factures.png"}
            textSize="20px"
          />
          <Card
            text={unpaidFacture + " Dh"}
            title={"Total des factures non payées"}
            icon={"/Assets/factures.png"}
            textSize="20px"
          />
          <Card
            text={((facture + revenu) - charge) < 0 ? ((facture + revenu) - charge)*-1 + " Dh" : ((facture + revenu) - charge) + " Dh"}
            rnedementStatus = {((facture + revenu) - charge)}
            title={"Rendement"}
            icon={"/Assets/rendement.png"}
            textSize="20px"
            textWeight={600}
            couleur={((facture + revenu) - charge) > 0 ? "green" : "red"}
          />
        </div>
        <div className="d-flex flex-wrap mt-4">
          <div style={{minWidth:"50%"}}>
            <BarChart caisse={[revenu , charge , facture , unpaidFacture ]} page={"caisse"}/>
          </div>
        </div>
      </Main>
    </div>
  );
}
