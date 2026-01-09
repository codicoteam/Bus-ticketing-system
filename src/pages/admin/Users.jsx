import { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, X, Users as UsersIcon, Loader2 } from "lucide-react";
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const api = createApiInstance();
      const response = await api.get("/api/users");
      setUsers(response.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch users error:", err);
      // Just show a simple error message but don't block the UI
      setError(err.response?.data?.message || "Could not load users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const api = createApiInstance();
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const openModal = async (mode, user = null) => {
    setModalMode(mode);
    setError("");

    if (mode === "view" && user) {
      setSelectedUser(user);
    } else if (mode === "edit" && user) {
      setSelectedUser(user);
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || ""
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const api = createApiInstance();
      await api.put(`/api/users/${selectedUser._id}`, formData);
      alert("User updated successfully");
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const avatarColors = [
    "bg-blue-600 dark:bg-blue-500",
    "bg-indigo-600 dark:bg-indigo-500",
    "bg-purple-600 dark:bg-purple-500",
    "bg-pink-600 dark:bg-pink-500",
    "bg-green-600 dark:bg-green-500",
    "bg-yellow-600 dark:bg-yellow-500",
  ];

  const getAvatarColor = (name) =>
    avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div className="space-y-8">
      {/* Centered Page Header */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Users Management</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Manage user accounts and profiles
          </p>
        </div>
      </div>

      {/* Simple Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchUsers}
            className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={users.length} />
        <StatCard label="Admins" value={users.filter((u) => u.role === "admin").length} />
        <StatCard label="Customers" value={users.filter((u) => u.role === "customer").length} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <p className="text-slate-600 dark:text-slate-400">
            {users.length === 0 ? "No users available" : "No users found matching your search"}
          </p>
          {users.length === 0 && (
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              avatarColor={getAvatarColor(user.firstName)}
              initials={getInitials(user.firstName, user.lastName)}
              onView={() => openModal("view", user)}
              onEdit={() => openModal("edit", user)}
              onDelete={() => handleDelete(user._id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
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

function UserCard({ user, avatarColor, initials, onView, onEdit, onDelete }) {
  const roleStyles = {
    admin: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
    customer: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${avatarColor} h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md`}>
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${roleStyles[user.role] || roleStyles.customer}`}>
          {user.role}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
        <p>Phone: {user.phone || "N/A"}</p>
        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          <Eye size={14} />
          View
        </button>
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Edit size={14} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function UserModal({ mode, user, formData, setFormData, onClose, onSubmit, submitting, error }) {
  const isView = mode === "view";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {mode === "edit" && "Edit User"}
              {isView && "User Details"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {mode === "edit" && "Update user information"}
              {isView && `${user?.firstName} ${user?.lastName}`}
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

          {isView && user ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="First Name" value={user.firstName} />
                <InfoItem label="Last Name" value={user.lastName} />
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Phone" value={user.phone || "N/A"} />
                <InfoItem label="Role" value={user.role} />
                <InfoItem label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <FormField
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
                <FormField
                  label="Phone"
                  placeholder="+263712345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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