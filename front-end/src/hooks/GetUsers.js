import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function GetEmployers() {
  const [Employers, setEmployers] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    async function fetchEmployersData() {
      await axios
        .get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/users/${user.companyId}/`, {
          withCredentials: true,
        })
        .then((res) => {
          setEmployers(res.data.users);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setEmployers([{ error: err.response.data.error }]);
        });
    }

    fetchEmployersData();
  }, [user.companyId]);
  return loading ? "loading" : Employers;
}
