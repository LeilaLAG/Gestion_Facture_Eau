import React from 'react'
import Menu from './Menu'
import Main from './Main'

export default function Clients() {
  return (
    <div className='d-flex h-100'>
        <Menu/>
        <Main>
            <h1>Liste des clients</h1>
            <table className='table table-bordered text-center w-100' style={{verticalAlign : "middle"}}>
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
                    <tr>
                        <td>1</td>
                        <td>Anas</td>
                        <td>EE352473</td>
                        <td>02/04/1990</td>
                        <td>065343563</td>
                        <td>20/12/2024</td>
                        <td>
                            <span className='btn btn-primary'>Modifier</span>
                        </td>
                        <td>
                            <span className='btn btn-danger'>Supprimer</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Main>
    </div>
  )
}
