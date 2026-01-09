import api from "./axios";

/**
 * Buses API Service
 * Based on Swagger documentation
 */

// GET /api/buses - List all buses
export const getAllBuses = async () => {
  try {
    const response = await api.get("/api/buses");
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Get all buses error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch buses",
      data: []
    };
  }
};

// GET /api/buses/{id} - Get bus by ID
export const getBusById = async (id) => {
  try {
    const response = await api.get(`/api/buses/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch bus details"
    };
  }
};

// POST /api/buses - Create new bus
export const createBus = async (busData) => {
  try {
    const response = await api.post("/api/buses", {
      busNumber: busData.busNumber,
      operator: busData.operator,
      model: busData.model,
      capacity: busData.capacity,
      amenities: busData.amenities || [],
      seats: busData.seats || []
    });
    return {
      success: true,
      data: response.data,
      message: "Bus created successfully"
    };
  } catch (error) {
    console.error("Create bus error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create bus"
    };
  }
};

// PUT /api/buses/{id} - Update bus (Admin only)
export const updateBus = async (id, busData) => {
  try {
    const response = await api.put(`/api/buses/${id}`, {
      busNumber: busData.busNumber,
      operator: busData.operator,
      model: busData.model,
      capacity: busData.capacity,
      amenities: busData.amenities,
      seats: busData.seats
    });
    return {
      success: true,
      data: response.data,
      message: "Bus updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update bus"
    };
  }
};

// DELETE /api/buses/{id} - Delete bus (Admin only)
export const deleteBus = async (id) => {
  try {
    await api.delete(`/api/buses/${id}`);
    return {
      success: true,
      message: "Bus deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete bus"
    };
  }
};

// Helper function to generate seats array
export const generateSeats = (capacity, layout = "2-2") => {
  const seats = [];
  const rows = Math.ceil(capacity / 4);
  const columns = ["A", "B", "C", "D"];

  for (let row = 1; row <= rows; row++) {
    for (let col of columns) {
      if (seats.length >= capacity) break;
      seats.push({
        number: `${col}${row}`,
        isAvailable: true,
        type: "standard"
      });
    }
  }

  return seats;
};