import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../Auth/ProtectedRoute";
import Menu from "./Menu";
import Main from "./Main";
import Card from "../costumComponents/Card";

export default function Caisse() {
  const { user } = useUser();
  const [revenu, setRevenu] = useState(0);
  const [charge, setCharge] = useState(0);
  const [facture, setFacture] = useState(0);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/caisse/${user.companyId}/`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setRevenu(res.data.totalRevenu);
        setCharge(res.data.totalCharge);
        setFacture(res.data.totalFactures);
      })
      .catch((err) => console.log("error fetching stats"));
  }, [user]);

  return (
    <div className="d-flex h-100">
      <Menu />
      <Main>
        <Card text={revenu+" Dh"} title={"Total des revenus :"} icon={"/Assets/revenus.png"} textWeight="bold" textSize="20px" cardWidth="60%" />
        <Card text={charge+" Dh"} title={"Total des charges :"} icon={"/Assets/charges.png"} textWeight="bold" textSize="20px" />
        <Card text={facture+" Dh"} title={"Total des factures :"} icon={"/Assets/factures.png"} textWeight="bold" textSize="20px" />
      </Main>
    </div>
  );
}
