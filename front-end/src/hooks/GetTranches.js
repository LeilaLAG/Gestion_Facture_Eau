import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function GetTranches() {
  const [Tranches, setTranches] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    async function fetchTranchesData() {
      await axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/tranches/${user.companyId}/`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setTranches(res.data.tranches);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setTranches([{ error: err.response.data.error }]);
        });
    }

    fetchTranchesData();
  }, [user.companyId]);
  return loading ? "loading" : Tranches;
}
