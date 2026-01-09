import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, X, Bus, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE = "https://busticketing-tq3o.onrender.com";

const createApiInstance = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedBus, setSelectedBus] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: "",
    operator: "",
    model: "",
    capacity: 40,
    amenities: [],
    status: "Active"
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const api = createApiInstance();
      const response = await api.get("/api/buses");

      const mappedBuses = response.data.map(bus => ({
        id: bus._id || bus.id,
        busNumber: bus.busNumber,
        model: bus.model,
        operator: bus.operator,
        capacity: bus.capacity,
        status: bus.status || "Active",
        driver: bus.assignedDriver || "",
        route: bus.assignedRoute || "",
        amenities: bus.amenities || [],
        seats: bus.seats || [],
        lastMaintenance: bus.lastMaintenance || "N/A",
        nextMaintenance: bus.nextMaintenance || "N/A",
        mileage: bus.mileage || 0
      }));

      setBuses(mappedBuses);
      setError("");
    } catch (err) {
      console.error("Fetch buses error:", err);
      setError(err.response?.data?.message || "Failed to fetch buses");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuses = buses.filter((b) => {
    const matchSearch =
      b.busNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.operator?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;

    try {
      const api = createApiInstance();
      await api.delete(`/api/buses/${id}`);
      setBuses(buses.filter((b) => b.id !== id));
      alert("Bus deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete bus");
    }
  };

  const openModal = async (mode, bus = null) => {
    setModalMode(mode);
    setError("");

    if (mode === "view" && bus) {
      try {
        const api = createApiInstance();
        const response = await api.get(`/api/buses/${bus.id}`);
        setSelectedBus(response.data);
      } catch (err) {
        setSelectedBus(bus);
      }
    } else if (mode === "edit" && bus) {
      setSelectedBus(bus);
      setFormData({
        busNumber: bus.busNumber,
        operator: bus.operator || "",
        model: bus.model,
        capacity: bus.capacity,
        amenities: bus.amenities || [],
        status: bus.status
      });
    } else if (mode === "add") {
      setFormData({
        busNumber: "",
        operator: "",
        model: "",
        capacity: 40,
        amenities: [],
        status: "Active"
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBus(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const seats = [];
    const rows = Math.ceil(formData.capacity / 4);
    const columns = ["A", "B", "C", "D"];

    for (let row = 1; row <= rows; row++) {
      for (let col of columns) {
        if (seats.length >= formData.capacity) break;
        seats.push({
          number: `${col}${row}`,
          isAvailable: true,
          type: "standard"
        });
      }
    }

    const busData = { ...formData, seats };

    try {
      const api = createApiInstance();

      if (modalMode === "add") {
        await api.post("/api/buses", busData);
        alert("Bus created successfully");
      } else {
        await api.put(`/api/buses/${selectedBus.id}`, busData);
        alert("Bus updated successfully");
      }

      await fetchBuses();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Centered Page Header */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Buses Management</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Manage fleet and maintenance schedules
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-5 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Bus
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Buses" value={buses.length} />
        <StatCard label="Active" value={buses.filter((b) => b.status === "Active").length} />
        <StatCard label="Maintenance" value={buses.filter((b) => b.status === "Maintenance").length} />
        <StatCard label="Total Capacity" value={buses.reduce((sum, b) => sum + (b.capacity || 0), 0)} />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by bus number, model, or operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : filteredBuses.length === 0 ? (
        <div className="text-center py-12">
          <Bus className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <p className="text-slate-600 dark:text-slate-400">No buses found</p>
          {!searchTerm && filterStatus === "all" && (
            <button
              onClick={() => openModal("add")}
              className="mt-4 px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
            >
              Add First Bus
            </button>
          )}
        </div>
      ) : (
        /* Buses Table */
        <div className="bg-white dark:bg-slate-900 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Bus Number</th>
                <th className="px-6 py-4 text-left">Model</th>
                <th className="px-6 py-4 text-left">Operator</th>
                <th className="px-6 py-4 text-left">Capacity</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900 dark:text-white">
                    {bus.busNumber}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{bus.model}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{bus.operator || "—"}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{bus.capacity} seats</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={bus.status} />
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => openModal("view", bus)}
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Eye size={14} />View
                    </button>
                    <button
                      onClick={() => openModal("edit", bus)}
                      className="text-slate-600 dark:text-slate-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Edit size={14} />Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bus.id)}
                      className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Trash2 size={14} />Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <BusModal
          mode={modalMode}
          bus={selectedBus}
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onAmenityToggle={handleAmenityToggle}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}

function BusModal({ mode, bus, formData, setFormData, onClose, onSubmit, onAmenityToggle, submitting, error }) {
  const isView = mode === "view";
  const isAdd = mode === "add";
  const availableAmenities = ["AC", "WiFi", "Charging Ports", "Entertainment", "Reclining Seats", "USB Ports"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isAdd && "Add New Bus"}
              {mode === "edit" && "Edit Bus"}
              {isView && "Bus Details"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {isAdd && "Enter bus information"}
              {mode === "edit" && "Update bus information"}
              {isView && bus?.busNumber}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {isView && bus ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem label="Bus Number" value={bus.busNumber} />
                  <InfoItem label="Model" value={bus.model} />
                  <InfoItem label="Operator" value={bus.operator || "N/A"} />
                  <InfoItem label="Capacity" value={`${bus.capacity} seats`} />
                  <InfoItem label="Status" value={bus.status} />
                </div>
              </div>
              {bus.amenities && bus.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {bus.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Bus Number" placeholder="BUS-001" value={formData.busNumber}
                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })} required />
                  <FormField label="Model" placeholder="Volvo B9R" value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
                  <FormField label="Operator" placeholder="Bus Company" value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })} />
                  <FormField label="Capacity" type="number" placeholder="40" value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} required />
                  <FormField label="Status" isSelect value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Inactive</option>
                  </FormField>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {availableAmenities.map((amenity) => (
                    <button key={amenity} type="button" onClick={() => onAmenityToggle(amenity)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${formData.amenities.includes(amenity)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                        }`}>
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={onClose} disabled={submitting}
                  className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {isAdd ? "Adding..." : "Saving..."}
                    </>
                  ) : (
                    isAdd ? "Add Bus" : "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800",
    Maintenance: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    Inactive: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800",
  };
  return <span className={`px-3 py-1 rounded-full text-xs border ${styles[status] || styles.Active}`}>{status}</span>;
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function FormField({ label, isSelect, children, ...props }) {
  const className = "w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      {isSelect ? <select className={className} {...props}>{children}</select> : <input className={className} {...props} />}
    </div>
  );
}