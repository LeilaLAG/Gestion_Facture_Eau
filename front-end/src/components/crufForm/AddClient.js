import React from 'react'

export default function AddClient({onChangeInfo}) {
  return (
    <div className="mt-2">
      <div className="mb-3">
        <label className="d-block">Nom complet</label>
        <input
          type="text"
          name="nameClient"
          className="form-control"
          placeholder="Saisir le nom complet du client"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">CIN</label>
        <input
          type="text"
          name="cin"
          className="form-control"
          placeholder="Saisir le CIN du client"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Date de naissance</label>
        <input
          type="date"
          name="birthDate"
          className="form-control"
          onChange={onChangeInfo}
        />
      </div>
      <div className="mb-3">
        <label className="d-block">Telephone</label>
        <input
          type="text"
          name="tele"
          className="form-control"
          placeholder="Saisir le numero de telephone du client"
          onChange={onChangeInfo}
        />
      </div>
    </div>
  )
}
