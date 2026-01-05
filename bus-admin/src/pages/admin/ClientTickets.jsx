import { useState } from "react";
import axios from "axios";

const API_BASE = "https://busticketing-tq3o.onrender.com/api";

export default function BookingAndTicket() {
  const token = localStorage.getItem("token"); // adjust if your token key is different

  const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Booking form state
  const [tripId, setTripId] = useState("");
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [seats, setSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState([]);

  // Seat input fields
  const [seatNumberInput, setSeatNumberInput] = useState("");
  const [seatFareInput, setSeatFareInput] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [ticketMessage, setTicketMessage] = useState("");

  // Add seat & corresponding empty passenger details entry
  const addSeatAndPassenger = () => {
    if (!seatNumberInput.trim() || !seatFareInput.trim()) {
      setError("Seat number and fare are required.");
      return;
    }
    if (seats.find((s) => s.number === seatNumberInput.trim())) {
      setError("This seat is already added.");
      return;
    }
    setSeats([...seats, { number: seatNumberInput.trim(), fare: Number(seatFareInput) }]);
    setPassengerDetails([
      ...passengerDetails,
      { name: "", age: "", gender: "", idType: "", idNumber: "" },
    ]);
    setSeatNumberInput("");
    setSeatFareInput("");
    setError("");
  };

  // Update passenger details at index
  const updatePassenger = (index, field, value) => {
    const updated = [...passengerDetails];
    updated[index][field] = value;
    setPassengerDetails(updated);
  };

  // Calculate total fare
  const totalAmount = seats.reduce((acc, seat) => acc + seat.fare, 0);

  // Submit booking form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTicketMessage("");
    setBookingId(null);

    if (!tripId.trim()) return setError("Trip ID is required.");
    if (!boardingPoint.trim()) return setError("Boarding point is required.");
    if (!droppingPoint.trim()) return setError("Dropping point is required.");
    if (seats.length === 0) return setError("Add at least one seat.");
    if (passengerDetails.length !== seats.length) return setError("Passenger details must match seats.");

    for (const p of passengerDetails) {
      if (
        !p.name.trim() ||
        !p.age ||
        !p.gender.trim() ||
        !p.idType.trim() ||
        !p.idNumber.trim()
      ) {
        return setError("All passenger details are required.");
      }
    }

    const payload = {
      tripId: tripId.trim(),
      seats,
      totalAmount,
      passengerDetails: passengerDetails.map((p) => ({
        name: p.name.trim(),
        age: Number(p.age),
        gender: p.gender.trim(),
        idType: p.idType.trim(),
        idNumber: p.idNumber.trim(),
      })),
      boardingPoint: boardingPoint.trim(),
      droppingPoint: droppingPoint.trim(),
    };

    try {
      setLoadingBooking(true);
      const response = await axiosInstance.post("/bookings", payload);
      const createdBookingId = response.data.id || response.data._id || null;
      if (!createdBookingId) {
        setError("Booking created but booking ID not returned by API.");
        return;
      }
      setBookingId(createdBookingId);
      alert("Booking created successfully. You can now download or email your ticket.");
      setTripId("");
      setBoardingPoint("");
      setDroppingPoint("");
      setSeats([]);
      setPassengerDetails([]);
    } catch (err) {
      setError(err.response?.data?.message || "Booking creation failed. Please try again.");
    } finally {
      setLoadingBooking(false);
    }
  };

  // Download ticket PDF
  const downloadTicket = async () => {
    if (!bookingId) return;
    setError("");
    setTicketMessage("");
    setLoadingTicket(true);
    try {
      const response = await axiosInstance.get(`/tickets/${bookingId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTicketMessage("Ticket downloaded successfully.");
    } catch (err) {
      setError("Failed to download ticket.");
    } finally {
      setLoadingTicket(false);
    }
  };

  // Email ticket to customer
  const emailTicket = async () => {
    if (!bookingId) return;
    setError("");
    setTicketMessage("");
    setLoadingTicket(true);
    try {
      await axiosInstance.post(`/tickets/${bookingId}/email`);
      setTicketMessage("Ticket emailed successfully.");
    } catch (err) {
      setError("Failed to email ticket.");
    } finally {
      setLoadingTicket(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-900">Create Booking & Manage Ticket</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Trip ID */}
          <input
            type="text"
            placeholder="Trip ID"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            required
          />

          {/* Boarding Point */}
          <input
            type="text"
            placeholder="Boarding Point"
            value={boardingPoint}
            onChange={(e) => setBoardingPoint(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            required
          />

          {/* Dropping Point */}
          <input
            type="text"
            placeholder="Dropping Point"
            value={droppingPoint}
            onChange={(e) => setDroppingPoint(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            required
          />

          {/* Seat Number & Fare Inputs */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Seat Number (e.g. A1)"
              value={seatNumberInput}
              onChange={(e) => setSeatNumberInput(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Fare"
              value={seatFareInput}
              onChange={(e) => setSeatFareInput(e.target.value)}
              className="w-28 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
              min="0"
            />
            <button
              type="button"
              onClick={addSeatAndPassenger}
              className="bg-blue-900 text-white px-6 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Add Seat
            </button>
          </div>

          {/* Seats list with remove */}
          {seats.length > 0 && (
            <div>
              <h2 className="font-semibold text-blue-900 mb-3">Seats Added:</h2>
              <ul className="mb-6 space-y-2">
                {seats.map((seat, idx) => (
                  <li key={idx} className="flex justify-between border p-3 rounded-lg">
                    <span className="font-medium">{seat.number} - ${seat.fare.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSeats = seats.filter((_, i) => i !== idx);
                        const newPassengers = passengerDetails.filter((_, i) => i !== idx);
                        setSeats(newSeats);
                        setPassengerDetails(newPassengers);
                      }}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Passenger details forms */}
          {passengerDetails.length > 0 && (
            <div>
              <h2 className="font-semibold text-blue-900 mb-3">Passenger Details:</h2>
              {passengerDetails.map((p, idx) => (
                <div key={idx} className="border p-4 rounded-lg mb-5 space-y-3 bg-gray-50">
                  <h3 className="font-semibold text-blue-800 mb-2">Passenger {idx + 1}</h3>

                  <input
                    type="text"
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Age"
                    value={p.age}
                    onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    min="0"
                    required
                  />

                  <select
                    value={p.gender}
                    onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="text"
                    placeholder="ID Type (e.g. National ID)"
                    value={p.idType}
                    onChange={(e) => updatePassenger(idx, "idType", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <input
                    type="text"
                    placeholder="ID Number"
                    value={p.idNumber}
                    onChange={(e) => updatePassenger(idx, "idNumber", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Total Amount */}
          <div className="text-right font-semibold text-blue-900 mb-4">
            Total Amount: ${totalAmount.toFixed(2)}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loadingBooking}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loadingBooking ? "Booking..." : "Create Booking"}
          </button>
        </form>

        {/* Ticket Actions */}
        {bookingId && (
          <div className="mt-10 space-y-4">
            <h2 className="text-2xl font-semibold text-blue-900">Ticket Actions</h2>

            {ticketMessage && (
              <div className="bg-green-100 text-green-700 p-3 rounded text-sm">
                {ticketMessage}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={downloadTicket}
                disabled={loadingTicket}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
              >
                {loadingTicket ? "Processing..." : "Download Ticket (PDF)"}
              </button>

              <button
                onClick={emailTicket}
                disabled={loadingTicket}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {loadingTicket ? "Processing..." : "Email Ticket"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
