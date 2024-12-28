import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import GetClients from "../hooks/GetClients";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from 'sweetalert2'

export default function Clients() {

  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
  
  let clientsData = GetClients();

  //To enable realtime deletion simulating websockets
  const [clients , setClients] = useState([])
  useEffect(()=>{
    setClients(clientsData)
  } , [clientsData])

  function handleDeleteClient(e , clientToDlt){
    e.preventDefault()

    function removeDeletedClient(){
      setClients((prv)=>prv.filter(client=>client._id !== clientToDlt._id))
    }

    Swal.fire({
      title: `<i class="bi bi-trash3-fill"></i>`,
      // icon: "info",
      text : `Etes vous sure de supprimer le client ${clientToDlt.nameClient}`,
      showCancelButton: true,
      confirmButtonColor : "#d33",
      confirmButtonText : "Oui, supprimer",
      cancelButtonText : "Annuler",
      padding : "10px"
    }).then(res=>{
      if(res.isConfirmed){
        axios.delete(`http://localhost:8000/api/deleteClient/${clientToDlt._id}` , {withCredentials : true})
        .then(res=>{toast.success("Le client a été supprimer") ; removeDeletedClient()})
        .catch(err=>toast.error("Un problem est servenue lors de la suppresion!"))
      }
    })
    
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <h1>Liste des clients</h1>
        {clients === "loading" ? (
          <div className="d-flex justify-content-center w-100">
            <Loading />
          </div>
        ) : (
          <table
            className="table table-bordered text-center w-100"
            style={{ verticalAlign: "middle" }}
          >
            <thead>
              <tr>
                <th>Numero</th>
                <th>Nom</th>
                <th>CIN</th>
                <th>Date de naissance</th>
                <th>Telephone</th>
                <th>Date d'enregistrement</th>
                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length <= 0 ? (
                <tr className="border border-0">
                  <td colSpan={8} className="border border-0 pt-4">
                    <ErrorMsg
                      msg={"Aucun data"}
                      errorIconWidth={20}
                      coleur={"red"}
                      boldness="bold"
                      imgPath="Assets/empty.png"
                    />
                  </td>
                </tr>
              ) : (
                clients.map((client, i) =>
                  client.error ? (
                    <tr key={i} className="border border-0">
                      <td colSpan={8} className="border border-0 pt-4">
                        <ErrorMsg
                          msg={client.error}
                          errorIconWidth={20}
                          coleur={"red"}
                          boldness="bold"
                          imgPath="Assets/error.png"
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={i}>
                      <td>{client.numClient}</td>
                      <td>{client.nameClient}</td>
                      <td>{client.cin}</td>
                      <td>
                        {new Date(client.birthDate).toLocaleDateString("en", DateConfig)}
                      </td>
                      <td>{client.tele}</td>
                      <td>
                        {new Date(client.dateRegisterClient).toLocaleDateString("en", DateConfig)}
                      </td>
                      <td>
                        <button className="btn btn-primary" >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      </td>
                      <td>
                        <form onSubmit={e=>handleDeleteClient(e , client)}>
                          <button className="btn btn-danger">
                            <i class="bi bi-trash3-fill"></i>
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        )}
      </Main>
    </div>
  );
}
