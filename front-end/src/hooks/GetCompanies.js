import axios from "axios";
import { useEffect, useState } from "react";

export default function GetCompanies() {
    
    const [allCompanies , setAllCompanies] = useState([])

    useEffect(()=>{
        async function fetchCompaniesData(){
            await axios.get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/companies/`)
            .then(res=>setAllCompanies(res.data.companies))
            // .catch(err=>setAllCompanies(err.data.error))
        }

        fetchCompaniesData()
    } , [])

    return allCompanies;
}
