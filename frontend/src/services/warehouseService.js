import { useEffect, useState } from "react";
import warehouseService from "../../services/warehouseService";

const demoWarehouses = [
  {
    id: 1,
    name: "Main Warehouse",
    code: "WH-MAIN",
    location: "Pune",
    status: "Active",
  },
  {
    id: 2,
    name: "Secondary Warehouse",
    code: "WH-SEC",
    location: "Mumbai",
    status: "Active",
  },
];

function Warehouse() {
  const [warehouses, setWarehouses] = useState(
    demoWarehouses
  );

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
  });

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setLoading(true);

    try {
      const response =
        await warehouseService.getAll();

      console.log(
        "Warehouse response:",
        response.data
      );

      const data =
        response.data?.data ||
        response.data;

      if (Array.isArray(data)) {
        setWarehouses(data);
      }
    } catch (error) {
      console.log(
        "Backend not available. Using demo warehouse data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWarehouse = {
      name: formData.name,
      code: formData.code,
      location: formData.location,
    };

    try {
      const response =
        await warehouseService.create(
          newWarehouse
        );

      console.log(
        "Create warehouse response:",
        response.data
      );

      await loadWarehouses();

    } catch (error) {
      console.log(
        "Backend unavailable. Adding warehouse locally."
      );

      setWarehouses([
        ...warehouses,
        {
          id: Date.now(),
          ...newWarehouse,
          status: "Active",
        },
      ]);
    }

    setFormData({
      name: "",
      code: "",
      location: "",
    });

    setShowModal(false);
  };

  const activeWarehouses =
    warehouses.filter(
      (warehouse) =>
        warehouse.status === "Active"
    ).length;

  const locations = new Set(
    warehouses.map(
      (warehouse) => warehouse.location
    )
  ).size;

  return (
    <div className="warehouse-page">

      <div className="page-header">

        <div>
          <h1>Warehouse</h1>

          <p>
            Manage your warehouses and locations
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          + Add Warehouse
        </button>

      </div>


      <div className="warehouse-stats">

        <div className="warehouse-stat-card">
          <span>
            Total Warehouses
          </span>

          <strong>
            {warehouses.length}
          </strong>
        </div>


        <div className="warehouse-stat-card">
          <span>
            Active Warehouses
          </span>

          <strong>
            {activeWarehouses}
          </strong>
        </div>


        <div className="warehouse-stat-card">
          <span>
            Locations
          </span>

          <strong>
            {locations}
          </strong>
        </div>

      </div>


      <div className="warehouse-card">

        <div className="section-header">

          <div>
            <h2>
              All Warehouses
            </h2>

            <p>
              View and manage warehouse information
            </p>
          </div>

        </div>


        {loading ? (
          <div className="ui-loader-container">
            <div className="ui-loader"></div>

            <span>
              Loading warehouses...
            </span>
          </div>
        ) : (

          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Code</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {warehouses.length === 0 ? (

                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No warehouses found.
                    </td>
                  </tr>

                ) : (

                  warehouses.map(
                    (warehouse) => (

                      <tr
                        key={warehouse.id}
                      >

                        <td>
                          <strong>
                            {warehouse.name}
                          </strong>
                        </td>

                        <td>
                          {warehouse.code}
                        </td>

                        <td>
                          {warehouse.location}
                        </td>

                        <td>
                          <span className="status-badge status-completed">
                            {warehouse.status ||
                              "Active"}
                          </span>
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


      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>
                  Add Warehouse
                </h2>

                <p>
                  Enter the warehouse details
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="warehouse-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>
                  Warehouse Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter warehouse name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Warehouse Code
                </label>

                <input
                  type="text"
                  name="code"
                  placeholder="Example: WH-PUNE"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Add Warehouse
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Warehouse;