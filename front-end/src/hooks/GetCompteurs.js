import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function GetCompteurs() {
  const [compteurs, setCompteurs] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    async function fetchCompteursData() {
      await axios
        .get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/compteurs/${user.companyId}/`, {
          withCredentials: true,
        })
        .then((res) => {
          setCompteurs(res.data.compteurs);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setCompteurs([{ error: "Un problem est servenue!" }]);
        });
    }

    fetchCompteursData();
  }, [user.companyId]);
  return loading ? "loading" : compteurs;
}
