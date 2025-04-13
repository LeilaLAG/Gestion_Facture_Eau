import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import GetEmployers from "../hooks/GetUsers";
import Loading from "../costumComponents/Loading";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import ErrorMsg from "../costumComponents/ErrorMsg";
import Tooltip from "./Tooltip";

export default function Employees() {
  const employers = GetEmployers();

  const [privilegesCheck, setPrivilegesCheck] = useState([]);
  const [crudAccessCheck, setCrudAccessCheck] = useState([]);

  useEffect(() => {
    if (employers !== "loading") {
      let uniqueEmps = Array.from(
        new Map(employers.map((emp) => [emp._id, emp])).values()
      );

      setPrivilegesCheck(
        uniqueEmps.map((emp) => ({
          clients: emp.privileges.clients,
          compteurs: emp.privileges.compteurs,
          factures: emp.privileges.factures,
          revenus: emp.privileges.revenus,
          charges: emp.privileges.charges,
          caisse: emp.privileges.caisse,
          empID: emp._id,
        }))
      );

      setCrudAccessCheck(
        uniqueEmps.map((emp) => ({
          clients: emp.crudAccess?.clients || {
            add: false,
            mod: false,
            dlt: false,
          },
          compteurs: emp.crudAccess?.compteurs || {
            add: false,
            mod: false,
            dlt: false,
          },
          factures: emp.crudAccess?.factures || {
            add: false,
            mod: false,
            dlt: false,
          },
          revenus: emp.crudAccess?.revenus || {
            add: false,
            mod: false,
            dlt: false,
          },
          charges: emp.crudAccess?.charges || {
            add: false,
            mod: false,
            dlt: false,
          },
          empID: emp._id,
        }))
      );
    }
  }, [employers]);

  function handleChangePrivileges(e, index) {
    const { checked, name } = e.target;

    setPrivilegesCheck((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: checked,
      };
      return updated;
    });
  }

  const handleChangeCrudAccess = (e, index, category) => {
    const { value, checked } = e.target;

    setCrudAccessCheck((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [category]: { ...item[category], [value]: checked },
            }
          : item
      )
    );
  };

  function grantPrivileges(e) {
    e.preventDefault();

    axios
      .put(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/updateEmployeePrivileges/`,
        { privileges: privilegesCheck, crudAccess: crudAccessCheck },
        { withCredentials: true }
      )
      .then((res) => {
        Swal.fire({
          title: `<img src="/Assets/confirm.gif" alt="confirm" width="50" />`,
          text: "Confirmer les changements ?",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: "Oui",
          cancelButtonText: "Non",
          padding: "10px",
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.reload()
          }
        });
      })
      .catch((err) => toast.error(err.response.data.error));
  }

  function deleteEmployee(e, emp) {
    e.preventDefault();

    Swal.fire({
      title: `<img src="/Assets/trash.gif" alt="delete" width="50" />`,
      text: `Etes vous sure de supprimer l'employer ${emp.fullName}`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteUser/${emp._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            window.location.reload();
          })
          .catch((err) =>
            toast.error("Un problem est servenue lors de la suppresion!")
          );
      }
    });
  }
  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <div className="centerDiv w-100">
          {employers === "loading" ? (
            <Loading />
          ) : (
            <div className="w-100">
              <h3 className="fw-bold mb-4">Liste des employers:</h3>
              {employers.length > 0 && (
                <div className="mb-2">
                  <form method="put" onSubmit={(e) => grantPrivileges(e)}>
                    <button
                      className="btn btn-success p-3 pb-1 pt-1 fw-bold"
                      style={{ fontSize: "13px" }}
                      title="Enregistrer"
                    >
                      Sauvegarder les changements
                    </button>
                  </form>
                </div>
              )}
              <table
                className="table table-bordered text-center w-100"
                style={{ verticalAlign: "middle" }}
              >
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Role</th>
                    <th></th>
                    <th>Clients</th>
                    <th>Compteurs</th>
                    <th>Factures</th>
                    <th>Revenus</th>
                    <th>Charges</th>
                    <th>Caisse</th>
                    <th colSpan={3}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.length <= 0 ? (
                    <tr className="border border-0">
                      <td colSpan={10} className="border border-0 pt-4">
                        <ErrorMsg
                          msg={"Vous n'avez aucun employé"}
                          errorIconWidth={20}
                          coleur={"red"}
                          boldness="bold"
                          imgPath="Assets/empty.png"
                        />
                      </td>
                    </tr>
                  ) : (
                    employers.map(
                      (emp, i) =>
                        privilegesCheck[i] && (
                          <tr key={i} style={{ textTransform: "capitalize" }}>
                            <td>{emp.fullName}</td>
                            <td>{emp.role}</td>
                            <td style={{verticalAlign:'sub'}}>
                              <div
                                className="border border-1 centerDiv gap-2 bg-body-secondary"
                              >
                                Accée
                                <Tooltip text="Gérer l'accée aux rubriques pour les employers">
                                  <i className="bi bi-universal-access-circle"></i>
                                </Tooltip>
                              </div>
                              <div
                                className="border border-1 centerDiv gap-3 mt-2 bg-light"
                              >
                                  operations
                                  <Tooltip text="Gérer l'accée aux operations ( ajout, modification, suppresion ) pour les employers">
                                    <i className="bi bi-bezier"></i>
                                  </Tooltip>
                              </div>
                            </td>

                            <td>
                              <div className="border border-1 bg-body-secondary">
                                <input
                                  type="checkbox"
                                  name="clients"
                                  checked={privilegesCheck[i].clients}
                                  value={"clients"}
                                  onChange={(e) => handleChangePrivileges(e, i)}
                                />
                              </div>
                              <div className="border border-1 centerDiv gap-3 mt-2 bg-light">
                                <div>
                                  <input
                                    type="checkbox"
                                    name="add-clients"
                                    value="add"
                                    checked={crudAccessCheck[i].clients.add}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "clients")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-plus-circle"
                                      title="Ajout"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="mod-clients"
                                    value="mod"
                                    checked={crudAccessCheck[i].clients.mod}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "clients")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-pen"
                                      title="Modification"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="dlt-clients"
                                    value="dlt"
                                    checked={crudAccessCheck[i].clients.dlt}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "clients")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-trash3-fill"
                                      title="Suppression"
                                    ></i>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="border border-1 bg-body-secondary">
                                <input
                                  type="checkbox"
                                  name="compteurs"
                                  checked={privilegesCheck[i].compteurs}
                                  value={"compteurs"}
                                  onChange={(e) => handleChangePrivileges(e, i)}
                                />
                              </div>
                              <div className="border border-1 centerDiv gap-3 mt-2 bg-light">
                                <div>
                                  <input
                                    type="checkbox"
                                    name="add-compteurs"
                                    value="add"
                                    checked={crudAccessCheck[i].compteurs.add}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "compteurs")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-plus-circle"
                                      title="Ajout"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="mod-compteurs"
                                    value="mod"
                                    checked={crudAccessCheck[i].compteurs.mod}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "compteurs")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-pen"
                                      title="Modification"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="dlt-compteurs"
                                    value="dlt"
                                    checked={crudAccessCheck[i].compteurs.dlt}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "compteurs")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-trash3-fill"
                                      title="Suppression"
                                    ></i>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="border border-1 bg-body-secondary">
                                <input
                                  type="checkbox"
                                  name="factures"
                                  checked={privilegesCheck[i].factures}
                                  value={"factures"}
                                  onChange={(e) => handleChangePrivileges(e, i)}
                                />
                              </div>
                              <div className="border border-1 centerDiv gap-3 mt-2 bg-light">
                                <div>
                                  <input
                                    type="checkbox"
                                    name="add-factures"
                                    value="add"
                                    checked={crudAccessCheck[i].factures.add}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "factures")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-plus-circle"
                                      title="Ajout"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="mod-factures"
                                    value="mod"
                                    checked={crudAccessCheck[i].factures.mod}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "factures")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-pen"
                                      title="Modification"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="dlt-factures"
                                    value="dlt"
                                    checked={crudAccessCheck[i].factures.dlt}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "factures")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-trash3-fill"
                                      title="Suppression"
                                    ></i>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="border border-1 bg-body-secondary">
                                <input
                                  type="checkbox"
                                  name="revenus"
                                  checked={privilegesCheck[i].revenus}
                                  value={"revenus"}
                                  onChange={(e) => handleChangePrivileges(e, i)}
                                />
                              </div>
                              <div className="border border-1 centerDiv gap-3 mt-2 bg-light">
                                <div>
                                  <input
                                    type="checkbox"
                                    name="add-revenus"
                                    value="add"
                                    checked={crudAccessCheck[i].revenus.add}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "revenus")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-plus-circle"
                                      title="Ajout"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="mod-revenus"
                                    value="mod"
                                    checked={crudAccessCheck[i].revenus.mod}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "revenus")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-pen"
                                      title="Modification"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="dlt-revenus"
                                    value="dlt"
                                    checked={crudAccessCheck[i].revenus.dlt}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "revenus")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-trash3-fill"
                                      title="Suppression"
                                    ></i>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="border border-1 bg-body-secondary">
                                <input
                                  type="checkbox"
                                  name="charges"
                                  checked={privilegesCheck[i].charges}
                                  value={"charges"}
                                  onChange={(e) => handleChangePrivileges(e, i)}
                                />
                              </div>
                              <div className="border border-1 centerDiv gap-3 mt-2 bg-light">
                                <div>
                                  <input
                                    type="checkbox"
                                    name="add-charges"
                                    value="add"
                                    checked={crudAccessCheck[i].charges.add}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "charges")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-plus-circle"
                                      title="Ajout"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="mod-charges"
                                    value="mod"
                                    checked={crudAccessCheck[i].charges.mod}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "charges")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-pen"
                                      title="Modification"
                                    ></i>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="checkbox"
                                    name="dlt-charges"
                                    value="dlt"
                                    checked={crudAccessCheck[i].charges.dlt}
                                    onChange={(e) =>
                                      handleChangeCrudAccess(e, i, "charges")
                                    }
                                  />
                                  <div>
                                    <i
                                      className="bi bi-trash3-fill"
                                      title="Suppression"
                                    ></i>
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            <td style={{verticalAlign:"sub"}}>
                              <div className="border border-1 bg-body-secondary">
                                <input
                                  type="checkbox"
                                  name="caisse"
                                  checked={privilegesCheck[i].caisse}
                                  value={"caisse"}
                                  onChange={(e) => handleChangePrivileges(e, i)}
                                />
                              </div>
                            </td>

                            <td>
                              <form
                                method="put"
                                action={`/users/update-user/${emp._id}`}
                              >
                                <button
                                  className="btn btn-primary"
                                  title="Modifier employer"
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                              </form>
                            </td>

                            <td>
                              <form onSubmit={(e) => deleteEmployee(e, emp)}>
                                <button
                                  className="btn btn-danger"
                                  title="Supprimer employer"
                                >
                                  <i
                                    className="bi bi-trash3-fill"
                                    title="Suppression"
                                  ></i>
                                </button>
                              </form>
                            </td>
                          </tr>
                        )
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Main>
    </div>
  );
}
