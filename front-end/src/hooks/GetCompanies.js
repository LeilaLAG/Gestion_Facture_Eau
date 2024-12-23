import axios from "axios";
import { useEffect, useState } from "react";

export default function GetCompanies() {
    
    const [allCompanies , setAllCompanies] = useState([])

    useEffect(()=>{
        async function fetchCompaniesData(){
            await axios.get("http://localhost:8000/api/companies/")
            .then(res=>setAllCompanies(res.data.companies))
        }

        fetchCompaniesData()
    } , [])

    return allCompanies;
}
