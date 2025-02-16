export default function FilterData({ page, onChangeFilter, onSubmitFilter }) {
  return (
    <div className="accordion-item border border-4 rounded">
      <h2 className="accordion-header">
        <button
          className="accordion-button fw-bold p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <img src="/Assets/filterIcon.png" alt="" width={20} />
          <span className="m-3 mt-0 mb-0">Filtrer les données {page}s</span>
        </button>
      </h2>
      <div
        id="collapseOne"
        className="accordion-collapse collapse show"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body p-2 mt-2" style={{overflowX : "scroll"}}>
          <div className="">
            <form
              className="d-flex align-items-center gap-3"
              onSubmit={onSubmitFilter}
            >
              <img src="/Assets/filter.png" alt="filter" width={20} />
              <hr width={20} />
              {page === "client" ? (
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    style={{ fontSize: "15px", padding: "2px 5px" }}
                    placeholder="CIN de client"
                    name="cin"
                    onChange={onChangeFilter}
                  />
                  <input
                    type="text"
                    style={{ fontSize: "15px", padding: "2px 5px" }}
                    placeholder="Telephone de client"
                    name="tele"
                    onChange={onChangeFilter}
                  />
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    style={{ fontSize: "15px", padding: "2px 5px" }}
                    placeholder="Nom de client"
                    name="nameClient"
                    onChange={onChangeFilter}
                  />
                </div>
              )}
              <button
                className="btn btn-primary p-3 pb-1 pt-1 fw-bold"
                style={{ fontSize: "15px" }}
              >
                Filtrer
              </button>
            </form>
            {page === "facture" && (
              <form className="d-flex align-items-center gap-3 mt-2">
                <img src="/Assets/calendar.png" alt="filter" width={20} />
                <hr width={20} />
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    style={{ fontSize: "15px", padding: "2px 5px" }}
                    placeholder={`Année (par defaut ${new Date().getFullYear()})`}
                    name="year"
                    onChange={onChangeFilter}
                  />
                  <input
                    type="text"
                    style={{ fontSize: "15px", padding: "2px 5px" }}
                    placeholder={`Mois (par defaut ${
                      new Date().getMonth() + 1
                    })`}
                    name="month"
                    onChange={onChangeFilter}
                  />
                </div>
                <button
                  className="btn btn-danger p-3 pb-1 pt-1 fw-bold"
                  style={{ fontSize: "15px" }}
                  onClick={()=>window.location.reload()}
                >
                  Initialiser
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
