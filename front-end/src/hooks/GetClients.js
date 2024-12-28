import { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '../Auth/ProtectedRoute';

export default function GetClients() {

    const [clients , setClients] = useState(null);
    const [loading , setLoading] = useState(true);

    const {user} = useUser()

    useEffect(()=>{
        async function fetchClientsData(){
            await axios.get(`http://localhost:8000/api/clients/${user.companyId}/` , {withCredentials : true})
            .then(res=>{setClients(res.data.Clients) ; setLoading(false)})
            .catch(err=>{setLoading(false) ; setClients([{error : "Un problem est servenue!"}])})
        }

        fetchClientsData()

    } , [user.companyId])
  return loading ? "loading" : clients
}
