import { useState, useEffect } from "react";
import { Plus, Search, Eye, Download, Mail, Loader2, CreditCard, Check, X as XIcon } from "lucide-react";
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

export default function ClientTickets() {
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState("");

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [passengers, setPassengers] = useState([{
    name: "", age: "", gender: "Male", idType: "National ID", idNumber: ""
  }]);
  const [submitting, setSubmitting] = useState(false);

  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchTrips();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const api = createApiInstance();
      const response = await api.get("/api/bookings");
      setBookings(response.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const api = createApiInstance();
      const response = await api.get("/api/trips");
      setTrips(response.data || []);
    } catch (err) {
      console.error("Fetch trips error:", err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tripId?.routeId?.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tripId?.routeId?.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedTrip || selectedSeats.length === 0) {
      setError("Please select a trip and at least one seat");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const api = createApiInstance();
      const totalAmount = selectedSeats.reduce((sum, seat) => sum + selectedTrip.fare, 0);

      const response = await api.post("/api/bookings", {
        tripId: selectedTrip._id,
        seats: selectedSeats.map(seat => ({ number: seat, fare: selectedTrip.fare })),
        totalAmount,
        passengerDetails: passengers,
        boardingPoint,
        droppingPoint
      });

      setSelectedBooking(response.data);
      setShowBookingModal(false);
      setShowPaymentModal(true);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setPaymentLoading(true);
    setError("");

    try {
      const api = createApiInstance();
      await api.post("/api/payments/ecocash", {
        bookingId: selectedBooking._id || selectedBooking.id,
        mobile: mobileNumber
      });

      alert("Payment initiated! Please check your phone for the EcoCash prompt.");
      setShowPaymentModal(false);
      setMobileNumber("");
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const openBookingModal = () => {
    setSelectedTrip(null);
    setSelectedSeats([]);
    setBoardingPoint("");
    setDroppingPoint("");
    setPassengers([{ name: "", age: "", gender: "Male", idType: "National ID", idNumber: "" }]);
    setError("");
    setShowBookingModal(true);
  };

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", age: "", gender: "Male", idType: "National ID", idNumber: "" }]);
  };

  return (
    <div className="space-y-8">
      {/* Centered Page Header */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tickets & Bookings</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Manage bookings and payments
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={openBookingModal}
            className="flex items-center gap-2 px-5 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            New Booking
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Bookings" value={bookings.length} />
        <StatCard label="Confirmed" value={bookings.filter(b => b.status === "confirmed").length} />
        <StatCard label="Pending" value={bookings.filter(b => b.status === "pending").length} />
        <StatCard label="Revenue" value={`$${bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}`} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search bookings..."
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Booking ID</th>
                <th className="px-6 py-4 text-left">Route</th>
                <th className="px-6 py-4 text-left">Seats</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Payment</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-mono text-slate-900 dark:text-white">#{booking._id.slice(-8)}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">
                    {booking.tripId?.routeId?.origin || "N/A"} → {booking.tripId?.routeId?.destination || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">
                    {booking.seats?.map(s => s.number).join(", ") || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">${booking.totalAmount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentBadge status={booking.paymentStatus} />
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                      <Eye size={14} />View
                    </button>
                    {booking.paymentStatus !== "paid" && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowPaymentModal(true);
                        }}
                        className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1"
                      >
                        <CreditCard size={14} />Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBookingModal && (
        <BookingModal
          trips={trips}
          selectedTrip={selectedTrip}
          setSelectedTrip={setSelectedTrip}
          selectedSeats={selectedSeats}
          handleSeatSelect={handleSeatSelect}
          boardingPoint={boardingPoint}
          setBoardingPoint={setBoardingPoint}
          droppingPoint={droppingPoint}
          setDroppingPoint={setDroppingPoint}
          passengers={passengers}
          setPassengers={setPassengers}
          addPassenger={addPassenger}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleCreateBooking}
          submitting={submitting}
          error={error}
        />
      )}

      {showPaymentModal && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBooking(null);
            setMobileNumber("");
          }}
          onSubmit={handlePayment}
          loading={paymentLoading}
          error={error}
        />
      )}
    </div>
  );
}

function BookingModal({ trips, selectedTrip, setSelectedTrip, selectedSeats, handleSeatSelect, boardingPoint, setBoardingPoint, droppingPoint, setDroppingPoint, passengers, setPassengers, addPassenger, onClose, onSubmit, submitting, error }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full my-8 border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Booking</h2>
            <p className="text-blue-100 text-sm mt-1">Select trip and passenger details</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-2 rounded-lg">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Trip</label>
            <select
              value={selectedTrip?._id || ""}
              onChange={(e) => {
                const trip = trips.find(t => t._id === e.target.value);
                setSelectedTrip(trip);
              }}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Choose a trip...</option>
              {trips.map(trip => (
                <option key={trip._id} value={trip._id}>
                  {trip.routeId?.origin} → {trip.routeId?.destination} | {new Date(trip.departureTime).toLocaleString()} | ${trip.fare}
                </option>
              ))}
            </select>
          </div>

          {selectedTrip && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Seats ({selectedSeats.length} selected)
              </label>
              <div className="grid grid-cols-8 gap-2">
                {selectedTrip.availableSeats?.map(seat => (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => handleSeatSelect(seat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSeats.includes(seat)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                      }`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Boarding Point</label>
              <input
                type="text"
                value={boardingPoint}
                onChange={(e) => setBoardingPoint(e.target.value)}
                placeholder="Main Station"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Dropping Point</label>
              <input
                type="text"
                value={droppingPoint}
                onChange={(e) => setDroppingPoint(e.target.value)}
                placeholder="Destination Station"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Passenger Details</label>
              <button type="button" onClick={addPassenger} className="text-sm text-blue-600 hover:underline">+ Add Passenger</button>
            </div>
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="grid grid-cols-5 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <input
                    type="text"
                    placeholder="Name"
                    value={passenger.name}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].name = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={passenger.age}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].age = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-sm"
                    required
                  />
                  <select
                    value={passenger.gender}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].gender = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-sm"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  <select
                    value={passenger.idType}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].idType = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-sm"
                  >
                    <option>National ID</option>
                    <option>Passport</option>
                  </select>
                  <input
                    type="text"
                    placeholder="ID Number"
                    value={passenger.idNumber}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].idNumber = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-sm"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {selectedTrip && selectedSeats.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900 dark:text-white">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                  ${selectedSeats.length * selectedTrip.fare}
                </span>
              </div>
            </div>
          )}

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
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentModal({ booking, mobileNumber, setMobileNumber, onClose, onSubmit, loading, error }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Payment</h2>
            <p className="text-blue-100 text-sm mt-1">Pay with EcoCash</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-2 rounded-lg">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">Amount to Pay</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${booking.totalAmount}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              EcoCash Mobile Number
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="0771234567"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    confirmed: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
  };
  return <span className={`px-3 py-1 rounded-full text-xs ${styles[status] || styles.pending}`}>{status}</span>;
}

function PaymentBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    paid: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    failed: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
  };
  return <span className={`px-3 py-1 rounded-full text-xs ${styles[status] || styles.pending}`}>{status || "pending"}</span>;
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}