import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function GetFactures(year , month , printMonth) {
  const [Facture, setFacture] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    async function fetchFactureData() {
      await axios
        .get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/factures/${user.companyId}/?year=${year}&month=${month}&printMonth=${printMonth}`, {
          withCredentials: true,
        })
        .then((res) => {
          setFacture(res.data.factures);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setFacture([{ error:err }]);
        });
    }

    fetchFactureData();
  }, [user.companyId , year , month , printMonth]);
  return loading ? "loading" : Facture;
}
