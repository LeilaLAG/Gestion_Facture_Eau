export default function FilterData({ page, onChangeFilter, onSubmitFilter }) {
  return (
    <div className="accordion-item border border-4">
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
          <span className="m-3 mt-0 mb-0">Filtrer les données clients</span>
        </button>
      </h2>
      <div
        id="collapseOne"
        className="accordion-collapse collapse show"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body pt-4 pb-4">
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
                    placeholder="Filtrer par CIN"
                    name="cin"
                    onChange={onChangeFilter}
                  />
                  <input
                    type="text"
                    style={{ fontSize: "15px", padding: "2px 5px" }}
                    placeholder="Filtrer par Telephone"
                    name="tele"
                    onChange={onChangeFilter}
                  />
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="number"
                    style={{ fontSize: "15px", padding: "2px 5px" }}
                    placeholder="Filtrer par N°"
                    name="numCompteur"
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
            {/* <div className="d-flex align-items-center gap-3 mt-2">
              <img src="/Assets/sort.png" alt="filter" width={20} />
              <hr width={20} />
              <input type="text" />
              <input type="text" />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
