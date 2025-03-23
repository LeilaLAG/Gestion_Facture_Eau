import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function GetCharges(year , month) {
  const [charges, setCharges] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    async function fetchChargesData() {
      await axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/charges/${user.companyId}?year=${year}&month=${month}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setCharges(res.data.charges);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setCharges([{ error: err.response.data.error }]);
        });
    }

    fetchChargesData();
  }, [user.companyId ,year , month]);
  return loading ? "loading" : charges;
}
