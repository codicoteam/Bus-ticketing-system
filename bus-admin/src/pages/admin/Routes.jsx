
import React, { useState } from 'react';

export default function Routes() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      routeCode: 'RT001',
      origin: 'Harare',
      destination: 'Masvingo',
      distance: '215 Km',
      duration: '4h 30m',
      fare: 45.00,
      status: 'Active',
      frequency: 'Daily',
      stops: ['Mvuma', 'Masvingo'],
      departureTime: '08:00 AM',
      arrivalTime: '12:30 PM',
      assignedBuses: ['Bus #A1234', 'Bus #B5678'],
      totalBookings: 1247
    },
    {
      id: 2,
      routeCode: 'RT002',
      origin: 'Mabvuku',
      destination: 'Mazowe',
      distance: '383 Km',
      duration: '6h 15m',
      fare: 65.00,
      status: 'Active',
      frequency: 'Daily',
      stops: ['Turn42'],
      departureTime: '07:00 AM',
      arrivalTime: '01:15 PM',
      assignedBuses: ['Bus #C9012', 'Bus #D3456'],
      totalBookings: 892
    },
    {
      id: 3,
      routeCode: 'RT003',
      origin: 'Marondera',
      destination: 'Mutoko',
      distance: '283Km',
      duration: '5h 00m',
      fare: 38.00,
      status: 'Suspended',
      frequency: 'Weekdays',
      stops: [],
      departureTime: '09:00 AM',
      arrivalTime: '02:00 PM',
      assignedBuses: [],
      totalBookings: 634
    },
    {
      id: 4,
      routeCode: 'RT004',
      origin: 'Mudzi',
      destination: 'Mvurwi',
      distance: '123 Km',
      duration: '2h 45m',
      fare: 42.00,
      status: 'Active',
      frequency: 'Daily',
      stops: [],
      departureTime: '10:30 AM',
      arrivalTime: '02:15 PM',
      assignedBuses: ['Bus #E7890'],
      totalBookings: 1056
    },
    {
      id: 5,
      routeCode: 'RT005',
      origin: 'Harare',
      destination: 'Murehwa',
      distance: '373 Km',
      duration: '3h 15m',
      fare: 35.00,
      status: 'Active',
      frequency: 'Daily',
      stops: ['Shawasha'],
      departureTime: '06:30 AM',
      arrivalTime: '09:45 AM',
      assignedBuses: ['Bus #F2345', 'Bus #G6789'],
      totalBookings: 1523
    },
    {
      id: 6,
      routeCode: 'RT006',
      origin: 'Kwekwe',
      destination: 'Karoyi',
      distance: '239 Km',
      duration: '4h 00m',
      fare: 40.00,
      status: 'Under Maintenance',
      frequency: 'Daily',
      stops: [],
      departureTime: '08:30 AM',
      arrivalTime: '12:30 PM',
      assignedBuses: ['Bus #H1234'],
      totalBookings: 789
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const statusColors = {
    'Active': 'bg-green-100 text-green-800 border-green-200',
    'Suspended': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Under Maintenance': 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    'Active': (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Suspended': (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    'Under Maintenance': (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch =
      route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.routeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewRoute = (route) => {
    setSelectedRoute(route);
    setShowModal(true);
  };

  const handleDeleteRoute = (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(r => r.id !== routeId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces, serif' }}>
                Routes Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage bus routes, schedules, and connections
              </p>
            </div>
            {/* Add Route button placeholder */}
            <button
              disabled
              className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-semibold">Add Route (Admin only)</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Routes</p>
                  <p className="text-3xl font-bold text-gray-900">{routes.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Routes</p>
                  <p className="text-3xl font-bold text-green-600">
                    {routes.filter(r => r.status === 'Active').length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Distance</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {routes.reduce((total, r) => {
                      const dist = parseInt(r.distance.replace(/\D/g, ''), 10);
                      return total + (isNaN(dist) ? 0 : dist);
                    }, 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">km covered</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Fare</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${(routes.reduce((sum, r) => sum + r.fare, 0) / routes.length).toFixed(2)}
                  </p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search routes by origin, destination, or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>

                <button
                  onClick={() => alert('Export feature not implemented')}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Routes Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Route Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Origin</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Distance</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fare (USD)</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500">No routes found.</td>
                    </tr>
                  ) : (
                    filteredRoutes.map(route => (
                      <tr
                        key={route.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{route.routeCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{route.origin}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{route.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{route.distance}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{route.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">${route.fare.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-semibold border ${statusColors[route.status]}`}
                            title={route.status}
                          >
                            {statusIcons[route.status]}
                            <span>{route.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleViewRoute(route)}
                            className="px-3 py-1 text-blue-600 hover:underline"
                            aria-label={`View details of route ${route.routeCode}`}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className="px-3 py-1 text-red-600 hover:underline"
                            aria-label={`Delete route ${route.routeCode}`}
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
          </div>

          {/* Pagination (basic placeholder) */}
          <div className="mt-6 flex justify-center space-x-2 text-gray-700">
            <button disabled className="px-3 py-1 rounded border border-gray-300 bg-gray-200 cursor-not-allowed" aria-label="Previous page">Prev</button>
            <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100">2</button>
            <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100">3</button>
            <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100" aria-label="Next page">Next</button>
          </div>
        </div>

        {/* Details Modal */}
        {showModal && selectedRoute && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="route-details-title"
          >
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 mx-4 relative">
              <h3
                id="route-details-title"
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                Route Details - {selectedRoute.routeCode}
              </h3>

              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-3 text-gray-800">
                <p><strong>Origin:</strong> {selectedRoute.origin}</p>
                <p><strong>Destination:</strong> {selectedRoute.destination}</p>
                <p><strong>Distance:</strong> {selectedRoute.distance}</p>
                <p><strong>Duration:</strong> {selectedRoute.duration}</p>
                <p><strong>Fare:</strong> ${selectedRoute.fare.toFixed(2)}</p>
                <p><strong>Status:</strong> {selectedRoute.status}</p>
                <p><strong>Frequency:</strong> {selectedRoute.frequency}</p>
                <p><strong>Departure Time:</strong> {selectedRoute.departureTime}</p>
                <p><strong>Arrival Time:</strong> {selectedRoute.arrivalTime}</p>
                <p><strong>Stops:</strong> {selectedRoute.stops.length ? selectedRoute.stops.join(', ') : 'None'}</p>
                <p><strong>Assigned Buses:</strong> {selectedRoute.assignedBuses.length ? selectedRoute.assignedBuses.join(', ') : 'None'}</p>
                <p><strong>Total Bookings:</strong> {selectedRoute.totalBookings}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
