import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, X, MapPin, Loader2 } from "lucide-react";
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

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    destination: "",
    distance: 0,
    duration: 0,
    departureTime: "",
    arrivalTime: "",
    baseFare: 0,
    stops: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const api = createApiInstance();
      const response = await api.get("/api/routes");
      setRoutes(response.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch routes error:", err);
      setError(err.response?.data?.message || "Failed to fetch routes");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || (r.isActive ? "active" : "inactive") === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this route?")) return;

    try {
      const api = createApiInstance();
      await api.delete(`/api/routes/${id}`);
      setRoutes(routes.filter((r) => r._id !== id));
      alert("Route deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete route");
    }
  };

  const openModal = async (mode, route = null) => {
    setModalMode(mode);
    setError("");

    if (mode === "view" && route) {
      setSelectedRoute(route);
    } else if (mode === "edit" && route) {
      setSelectedRoute(route);
      setFormData({
        name: route.name || "",
        origin: route.origin || "",
        destination: route.destination || "",
        distance: route.distance || 0,
        duration: route.duration || 0,
        departureTime: route.departureTime || "",
        arrivalTime: route.arrivalTime || "",
        baseFare: route.baseFare || 0,
        stops: route.stops || []
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        origin: "",
        destination: "",
        distance: 0,
        duration: 0,
        departureTime: "",
        arrivalTime: "",
        baseFare: 0,
        stops: []
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoute(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const api = createApiInstance();

      if (modalMode === "add") {
        await api.post("/api/routes", formData);
        alert("Route created successfully");
      } else {
        await api.put(`/api/routes/${selectedRoute._id}`, formData);
        alert("Route updated successfully");
      }

      await fetchRoutes();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Centered Page Header */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Routes Management</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Manage bus routes and connections
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-5 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Route
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Routes" value={routes.length} />
        <StatCard label="Active" value={routes.filter((r) => r.isActive).length} />
        <StatCard label="Avg Distance" value={`${Math.round(routes.reduce((s, r) => s + (r.distance || 0), 0) / routes.length || 0)} km`} />
        <StatCard label="Avg Fare" value={`$${(routes.reduce((s, r) => s + (r.baseFare || 0), 0) / routes.length || 0).toFixed(2)}`} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search routes..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <p className="text-slate-600 dark:text-slate-400">No routes found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Route</th>
                <th className="px-6 py-4 text-left">Distance</th>
                <th className="px-6 py-4 text-left">Duration</th>
                <th className="px-6 py-4 text-left">Fare</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{route.name}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">
                    {route.origin} → {route.destination}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{route.distance} km</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{route.duration} min</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">${route.baseFare}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${route.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"}`}>
                      {route.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button onClick={() => openModal("view", route)} className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                      <Eye size={14} />View
                    </button>
                    <button onClick={() => openModal("edit", route)} className="text-slate-600 dark:text-slate-400 hover:underline inline-flex items-center gap-1">
                      <Edit size={14} />Edit
                    </button>
                    <button onClick={() => handleDelete(route._id)} className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1">
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
        <RouteModal
          mode={modalMode}
          route={selectedRoute}
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}

function RouteModal({ mode, route, formData, setFormData, onClose, onSubmit, submitting, error }) {
  const isView = mode === "view";
  const isAdd = mode === "add";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isAdd && "Add New Route"}
              {mode === "edit" && "Edit Route"}
              {isView && "Route Details"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {isAdd && "Enter route information"}
              {mode === "edit" && "Update route information"}
              {isView && route?.name}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isView && route ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="Name" value={route.name} />
                <InfoItem label="Origin" value={route.origin} />
                <InfoItem label="Destination" value={route.destination} />
                <InfoItem label="Distance" value={`${route.distance} km`} />
                <InfoItem label="Duration" value={`${route.duration} min`} />
                <InfoItem label="Base Fare" value={`$${route.baseFare}`} />
                <InfoItem label="Departure Time" value={route.departureTime} />
                <InfoItem label="Arrival Time" value={route.arrivalTime} />
              </div>
              {route.stops && route.stops.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Stops</h3>
                  <div className="space-y-2">
                    {route.stops.map((stop, index) => (
                      <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-medium text-slate-900 dark:text-white">{stop.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {stop.distanceFromOrigin} km • {stop.arrivalTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Route Name" placeholder="NYC to Boston Express" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <FormField label="Base Fare ($)" type="number" placeholder="45" value={formData.baseFare}
                  onChange={(e) => setFormData({ ...formData, baseFare: parseFloat(e.target.value) })} required />
                <FormField label="Origin" placeholder="New York" value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })} required />
                <FormField label="Destination" placeholder="Boston" value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required />
                <FormField label="Distance (km)" type="number" placeholder="350" value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) })} required />
                <FormField label="Duration (min)" type="number" placeholder="240" value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} required />
                <FormField label="Departure Time" type="time" value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} required />
                <FormField label="Arrival Time" type="time" value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })} required />
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
                    isAdd ? "Add Route" : "Save Changes"
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

function FormField({ label, ...props }) {
  const className = "w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <input className={className} {...props} />
    </div>
  );
}