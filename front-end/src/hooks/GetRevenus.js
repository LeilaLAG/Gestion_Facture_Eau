import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function GetRevenus(year , month) {
  const [Revenus, setRevenus] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    async function fetchRevenusData() {
      await axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/revenus/${user.companyId}?year=${year}&month=${month}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setRevenus(res.data.revenus);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setRevenus([{ error: err.response.data.error }]);
        });
    }

    fetchRevenusData();
  }, [user.companyId , year , month]);
  return loading ? "loading" : Revenus;
}
