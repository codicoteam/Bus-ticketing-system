import { useEffect, useState } from "react";
import axios from "axios";

const PAGE_SIZE = 5;
const ADMIN_ROLES = ["admin", "super_admin"];
const API_BASE = "https://busticketing-tq3o.onrender.com/api";

export default function Buses() {
  const user = JSON.parse(localStorage.getItem("adminUser")) || {};
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const [buses, setBuses] = useState([]);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState(null); // 'add' or 'edit' or null
  const [editingBus, setEditingBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBuses, setFilteredBuses] = useState([]);

  // Form fields
  const [form, setForm] = useState({
    busNumber: "",
    operator: "",
    model: "",
    capacity: 0,
    amenities: [],
    seats: [],
  });

  /* Fetch all buses */
  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/buses`);
      setBuses(res.data || []);
      setFilteredBuses(res.data || []);
      setLoading(false);
      setPage(1);
    } catch (e) {
      setError("Failed to load buses.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  /* Search buses */
  const searchBuses = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredBuses(buses);
      setPage(1);
      return;
    }
    const results = buses.filter(
      (bus) =>
        bus.busNumber.toLowerCase().includes(term) ||
        bus.operator.toLowerCase().includes(term) ||
        bus.model.toLowerCase().includes(term)
    );
    setFilteredBuses(results);
    setPage(1);
  };

  /* Modal handlers */
  const openAddModal = () => {
    setModalMode("add");
    setEditingBus(null);
    setForm({
      busNumber: "",
      operator: "",
      model: "",
      capacity: 0,
      amenities: [],
      seats: [],
    });
    setError("");
  };

  const openEditModal = (bus) => {
    setModalMode("edit");
    setEditingBus(bus);
    setForm({
      busNumber: bus.busNumber,
      operator: bus.operator,
      model: bus.model,
      capacity: bus.capacity,
      amenities: bus.amenities || [],
      seats: bus.seats || [],
    });
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingBus(null);
    setForm({
      busNumber: "",
      operator: "",
      model: "",
      capacity: 0,
      amenities: [],
      seats: [],
    });
    setError("");
  };

  /* Form validation */
  const validateForm = () => {
    if (!form.busNumber.trim()) {
      setError("Bus number is required.");
      return false;
    }
    if (!form.operator.trim()) {
      setError("Operator is required.");
      return false;
    }
    if (!form.model.trim()) {
      setError("Model is required.");
      return false;
    }
    if (form.capacity <= 0) {
      setError("Capacity must be greater than 0.");
      return false;
    }
    if (!Array.isArray(form.amenities)) {
      setError("Amenities must be an array.");
      return false;
    }
    if (!Array.isArray(form.seats)) {
      setError("Seats must be an array.");
      return false;
    }
    setError("");
    return true;
  };

  /* Add or update bus */
  const saveBus = async () => {
    if (!validateForm()) return;

    const payload = {
      busNumber: form.busNumber.trim(),
      operator: form.operator.trim(),
      model: form.model.trim(),
      capacity: form.capacity,
      amenities: form.amenities,
      seats: form.seats,
    };

    try {
      setLoading(true);
      if (modalMode === "add") {
        await axios.post(`${API_BASE}/buses`, payload);
      } else if (modalMode === "edit" && editingBus) {
        await axios.put(`${API_BASE}/buses/${editingBus._id || editingBus.id}`, payload);
      }
      await fetchBuses();
      closeModal();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save bus.");
    } finally {
      setLoading(false);
    }
  };

  /* Delete bus */
  const deleteBus = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/buses/${id}`);
      await fetchBuses();
    } catch (e) {
      setError("Failed to delete bus.");
    } finally {
      setLoading(false);
    }
  };

  /* Pagination */
  const totalPages = Math.ceil(filteredBuses.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentBuses = filteredBuses.slice(start, start + PAGE_SIZE);

  /* Helper: handle amenities input (comma separated) */
  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      amenities: value.split(",").map((a) => a.trim()).filter(Boolean),
    });
  };

  /* Helper: Add seat (simple interface) */
  const [seatNumberInput, setSeatNumberInput] = useState("");
  const [seatAvailableInput, setSeatAvailableInput] = useState(true);
  const [seatTypeInput, setSeatTypeInput] = useState("standard");

  const addSeat = () => {
    if (!seatNumberInput.trim()) {
      setError("Seat number is required.");
      return;
    }
    if (form.seats.find((s) => s.number === seatNumberInput.trim())) {
      setError("Seat number already exists.");
      return;
    }
    const newSeat = {
      number: seatNumberInput.trim(),
      isAvailable: seatAvailableInput,
      type: seatTypeInput,
    };
    setForm({
      ...form,
      seats: [...form.seats, newSeat],
    });
    setSeatNumberInput("");
    setSeatAvailableInput(true);
    setSeatTypeInput("standard");
    setError("");
  };

  const removeSeat = (number) => {
    setForm({
      ...form,
      seats: form.seats.filter((s) => s.number !== number),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Buses</h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by bus number, operator, or model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-grow"
        />
        <button
          onClick={searchBuses}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchTerm("");
            setFilteredBuses(buses);
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>

      {/* Add Button */}
      {isAdmin && (
        <button
          onClick={openAddModal}
          className="mb-4 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add New Bus
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Bus Number</th>
              <th className="p-3">Operator</th>
              <th className="p-3">Model</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Amenities</th>
              <th className="p-3">Seats Count</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBuses.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No buses found.
                </td>
              </tr>
            ) : (
              currentBuses.map((bus) => (
                <tr key={bus._id || bus.id} className="border-t">
                  <td className="p-3">{bus.busNumber}</td>
                  <td className="p-3">{bus.operator}</td>
                  <td className="p-3">{bus.model}</td>
                  <td className="p-3">{bus.capacity}</td>
                  <td className="p-3">{bus.amenities?.join(", ")}</td>
                  <td className="p-3">{bus.seats?.length || 0}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openEditModal(bus)}
                      disabled={!isAdmin}
                      className={`px-3 py-1 rounded ${isAdmin
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBus(bus._id || bus.id)}
                      disabled={!isAdmin}
                      className={`px-3 py-1 rounded ${isAdmin
                          ? "bg-red-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold capitalize">
              {modalMode === "add" ? "Add New Bus" : "Edit Bus"}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
            )}

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Bus Number"
              value={form.busNumber}
              onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Operator"
              value={form.operator}
              onChange={(e) => setForm({ ...form, operator: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />

            <input
              type="number"
              min="1"
              className="w-full border p-2 rounded mb-2"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
            />

            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Amenities (comma separated)"
              value={form.amenities.join(", ")}
              onChange={handleAmenitiesChange}
            />

            {/* Seats Management */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Seats</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Seat Number"
                  value={seatNumberInput}
                  onChange={(e) => setSeatNumberInput(e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <select
                  value={seatAvailableInput ? "available" : "unavailable"}
                  onChange={(e) =>
                    setSeatAvailableInput(e.target.value === "available")
                  }
                  className="border p-2 rounded w-32"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <select
                  value={seatTypeInput}
                  onChange={(e) => setSeatTypeInput(e.target.value)}
                  className="border p-2 rounded w-36"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="disabled">Disabled</option>
                </select>
                <button
                  type="button"
                  onClick={addSeat}
                  className="bg-blue-600 text-white px-4 rounded"
                >
                  Add Seat
                </button>
              </div>
              {form.seats.length === 0 && (
                <p className="text-sm text-gray-500">No seats added yet.</p>
              )}
              {form.seats.length > 0 && (
                <ul className="max-h-48 overflow-auto border rounded p-2 space-y-1 bg-gray-50">
                  {form.seats.map((seat) => (
                    <li
                      key={seat.number}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {seat.number} - {seat.type} -{" "}
                        {seat.isAvailable ? "Available" : "Unavailable"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSeat(seat.number)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={saveBus}
                className="px-6 py-2 bg-blue-700 text-white rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
