import React, { useState, useEffect } from 'react';

// Reusable Driver Modal for Add/Edit/View
function DriverModal({ mode, driverData, onClose, onSave }) {
  // mode: 'add', 'edit', 'view'
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    license: '',
    experience: '',
    status: 'Active',
    assignedBus: '',
    rating: '',
    completedTrips: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (driverData) {
      setForm({ ...driverData });
    } else {
      setForm({
        id: null,
        name: '',
        email: '',
        phone: '',
        license: '',
        experience: '',
        status: 'Active',
        assignedBus: '',
        rating: '',
        completedTrips: '',
        avatar: ''
      });
    }
  }, [driverData]);

  const validate = () => {
    let errs = {};

    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Email is invalid';
    }
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.license.trim()) errs.license = 'License is required';
    if (!form.experience.trim()) errs.experience = 'Experience is required';
    if (form.rating === '' || isNaN(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5) {
      errs.rating = 'Rating must be a number between 0 and 5';
    }
    if (form.completedTrips === '' || isNaN(Number(form.completedTrips)) || Number(form.completedTrips) < 0) {
      errs.completedTrips = 'Completed trips must be a non-negative number';
    }
    if (!form.avatar.trim()) errs.avatar = 'Avatar initials are required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(form);
  };

  const isView = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'add' && 'Add New Driver'}
          {mode === 'edit' && 'Edit Driver'}
          {mode === 'view' && 'Driver Details'}
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block font-medium">Name</label>
            {isView ? (
              <p className="mt-1">{form.name}</p>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email</label>
            {isView ? (
              <p className="mt-1">{form.email}</p>
            ) : (
              <>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium">Phone</label>
            {isView ? (
              <p className="mt-1">{form.phone}</p>
            ) : (
              <>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </>
            )}
          </div>

          {/* License */}
          <div>
            <label className="block font-medium">License</label>
            {isView ? (
              <p className="mt-1">{form.license}</p>
            ) : (
              <>
                <input
                  type="text"
                  name="license"
                  value={form.license}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.license ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.license && <p className="text-red-600 text-sm mt-1">{errors.license}</p>}
              </>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block font-medium">Experience</label>
            {isView ? (
              <p className="mt-1">{form.experience}</p>
            ) : (
              <>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. 5 years"
                  value={form.experience}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
              </>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium">Status</label>
            {isView ? (
              <p className="mt-1">{form.status}</p>
            ) : (
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            )}
          </div>

          {/* Assigned Bus */}
          <div>
            <label className="block font-medium">Assigned Bus</label>
            {isView ? (
              <p className="mt-1">{form.assignedBus || 'Unassigned'}</p>
            ) : (
              <input
                type="text"
                name="assignedBus"
                placeholder="e.g. Bus #A1234"
                value={form.assignedBus}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block font-medium">Rating (0-5)</label>
            {isView ? (
              <p className="mt-1">{form.rating}</p>
            ) : (
              <>
                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.rating ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.rating && <p className="text-red-600 text-sm mt-1">{errors.rating}</p>}
              </>
            )}
          </div>

          {/* Completed Trips */}
          <div>
            <label className="block font-medium">Completed Trips</label>
            {isView ? (
              <p className="mt-1">{form.completedTrips}</p>
            ) : (
              <>
                <input
                  type="number"
                  name="completedTrips"
                  min="0"
                  step="1"
                  value={form.completedTrips}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.completedTrips ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.completedTrips && <p className="text-red-600 text-sm mt-1">{errors.completedTrips}</p>}
              </>
            )}
          </div>

          {/* Avatar */}
          <div>
            <label className="block font-medium">Avatar Initials</label>
            {isView ? (
              <p className="mt-1">{form.avatar}</p>
            ) : (
              <>
                <input
                  type="text"
                  name="avatar"
                  maxLength={3}
                  value={form.avatar}
                  onChange={handleChange}
                  className={`w-full mt-1 border rounded px-3 py-2 ${errors.avatar ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.avatar && <p className="text-red-600 text-sm mt-1">{errors.avatar}</p>}
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'view' && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Driver Card (for Grid View)
function DriverCard({ driver, avatarColor, onEdit, onView, onDelete }) {
  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    'Inactive': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`${avatarColor} w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
              {driver.avatar}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
              <p className="text-sm text-gray-500">{driver.experience} experience</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[driver.status]}`}>
            {driver.status}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <p className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {driver.email}
          </p>
          <p className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {driver.phone}
          </p>
          <p className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            License: {driver.license}
          </p>
          <p className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {driver.assignedBus || 'Unassigned'}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">{driver.rating}</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{driver.completedTrips}</p>
            <p className="text-xs text-gray-500">completed trips</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(driver)}
            className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm"
            type="button"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(driver)}
            className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all font-medium text-sm"
            type="button"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(driver.id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Driver Table Row (for List View)
function DriverTableRow({ driver, avatarColor, onEdit, onView, onDelete }) {
  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    'Inactive': 'bg-gray-100 text-gray-800'
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-3">
        <div className={`${avatarColor} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold`}>
          {driver.avatar}
        </div>
      </td>
      <td className="p-3">
        <div className="font-semibold">{driver.name}</div>
        <div className="text-sm text-gray-600">{driver.email}</div>
      </td>
      <td className="p-3">{driver.phone}</td>
      <td className="p-3">{driver.license}</td>
      <td className="p-3">{driver.experience}</td>
      <td className="p-3">
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusColors[driver.status]}`}>
          {driver.status}
        </span>
      </td>
      <td className="p-3">{driver.assignedBus || 'Unassigned'}</td>
      <td className="p-3 flex space-x-2">
        <button
          onClick={() => onView(driver)}
          className="px-3 py-1 text-blue-600 hover:underline text-sm"
          type="button"
        >
          View
        </button>
        <button
          onClick={() => onEdit(driver)}
          className="px-3 py-1 text-gray-600 hover:underline text-sm"
          type="button"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(driver.id)}
          className="px-3 py-1 text-red-600 hover:underline text-sm"
          type="button"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function Drivers() {
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'Robert Chikiti',
      email: 'robertc@company.com',
      phone: '+263712345678',
      license: 'B123456',
      experience: '5 years',
      status: 'Active',
      assignedBus: 'Bus A123',
      rating: 4.8,
      completedTrips: 128,
      avatar: 'RC'
    },
    {
      id: 2,
      name: 'James Doe',
      email: 'james.d@company.com',
      phone: '+263798765432',
      license: 'C987654',
      experience: '3 years',
      status: 'On Leave',
      assignedBus: '',
      rating: 4.3,
      completedTrips: 89,
      avatar: 'JD'
    },
    {
      id: 3,
      name: 'Sarah Moyo',
      email: 'sarahm@company.com',
      phone: '+263778899001',
      license: 'D456789',
      experience: '7 years',
      status: 'Active',
      assignedBus: 'Bus B456',
      rating: 4.9,
      completedTrips: 150,
      avatar: 'SM'
    }
  ]);

  // Modal state
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'view' or null
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Helpers for avatar colors, cycle through a fixed set of colours
  const avatarColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];

  const getAvatarColor = (name) => {
    const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[charCodeSum % avatarColors.length];
  };

  // Modal handlers
  const openAddModal = () => {
    setSelectedDriver(null);
    setModalMode('add');
  };

  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    setModalMode('edit');
  };

  const openViewModal = (driver) => {
    setSelectedDriver(driver);
    setModalMode('view');
  };

  const closeModal = () => {
    setSelectedDriver(null);
    setModalMode(null);
  };

  // Add or update driver handler
  const handleSaveDriver = (driver) => {
    if (modalMode === 'add') {
      // Assign new unique ID (simple incremental logic)
      const newId = drivers.length ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
      setDrivers(prev => [...prev, { ...driver, id: newId }]);
    } else if (modalMode === 'edit') {
      setDrivers(prev => prev.map(d => (d.id === driver.id ? driver : d)));
    }
    closeModal();
  };

  // Delete driver
  const handleDeleteDriver = (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDrivers(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header and View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Drivers</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add New Driver
            </button>
            <button
              onClick={() => setViewType('grid')}
              aria-label="Grid View"
              className={`p-2 rounded ${viewType === 'grid' ? 'bg-gray-300' : 'bg-white hover:bg-gray-100'}`}
              type="button"
            >
              {/* Grid icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <rect x="14" y="3" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <rect x="14" y="14" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="14" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => setViewType('list')}
              aria-label="List View"
              className={`p-2 rounded ${viewType === 'list' ? 'bg-gray-300' : 'bg-white hover:bg-gray-100'}`}
              type="button"
            >
              {/* List icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <line x1="4" y1="12" x2="20" y2="12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <line x1="4" y1="18" x2="20" y2="18" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map(driver => (
              <DriverCard
                key={driver.id}
                driver={driver}
                avatarColor={getAvatarColor(driver.name)}
                onEdit={openEditModal}
                onView={openViewModal}
                onDelete={handleDeleteDriver}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="p-3">Avatar</th>
                  <th className="p-3">Name & Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">License</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Bus</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <DriverTableRow
                    key={driver.id}
                    driver={driver}
                    avatarColor={getAvatarColor(driver.name)}
                    onEdit={openEditModal}
                    onView={openViewModal}
                    onDelete={handleDeleteDriver}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modalMode && (
          <DriverModal
            mode={modalMode}
            driverData={selectedDriver}
            onClose={closeModal}
            onSave={handleSaveDriver}
          />
        )}
      </div>
    </div>
  );
}
