import api from "./axios";

/**
 * Routes API Service
 * Based on Swagger documentation
 */

// GET /api/routes - Get all routes
export const getAllRoutes = async () => {
  try {
    const response = await api.get("/api/routes");
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Get all routes error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch routes",
      data: []
    };
  }
};

// GET /api/routes/{id} - Get route by ID
export const getRouteById = async (id) => {
  try {
    const response = await api.get(`/api/routes/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch route details"
    };
  }
};

// POST /api/routes - Create a new route (Admin only)
export const createRoute = async (routeData) => {
  try {
    const response = await api.post("/api/routes", {
      name: routeData.name,
      origin: routeData.origin,
      destination: routeData.destination,
      distance: routeData.distance,
      duration: routeData.duration,
      stops: routeData.stops || [], // [{ name, distanceFromOrigin, arrivalTime }]
      arrivalTime: routeData.arrivalTime,
      departureTime: routeData.departureTime,
      baseFare: routeData.baseFare
    });
    return {
      success: true,
      data: response.data,
      message: "Route created successfully"
    };
  } catch (error) {
    console.error("Create route error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create route"
    };
  }
};

// PUT /api/routes/{id} - Update route (Admin only)
export const updateRoute = async (id, routeData) => {
  try {
    const response = await api.put(`/api/routes/${id}`, {
      name: routeData.name,
      origin: routeData.origin,
      destination: routeData.destination,
      distance: routeData.distance,
      duration: routeData.duration,
      stops: routeData.stops,
      arrivalTime: routeData.arrivalTime,
      departureTime: routeData.departureTime,
      baseFare: routeData.baseFare
    });
    return {
      success: true,
      data: response.data,
      message: "Route updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update route"
    };
  }
};

// DELETE /api/routes/{id} - Delete route (Admin only)
export const deleteRoute = async (id) => {
  try {
    await api.delete(`/api/routes/${id}`);
    return {
      success: true,
      message: "Route deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete route"
    };
  }
};

// Helper: Get active routes
export const getActiveRoutes = async () => {
  try {
    const result = await getAllRoutes();
    if (result.success) {
      const activeRoutes = result.data.filter(route => route.isActive !== false);
      return {
        success: true,
        data: activeRoutes
      };
    }
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch active routes",
      data: []
    };
  }
};

// Helper: Calculate duration in hours and minutes
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Helper: Format route for display
export const formatRouteDisplay = (route) => {
  return {
    id: route._id,
    name: route.name,
    origin: route.origin,
    destination: route.destination,
    distance: `${route.distance} km`,
    duration: formatDuration(route.duration),
    baseFare: `$${route.baseFare}`,
    stops: route.stops?.length || 0,
    departureTime: route.departureTime,
    arrivalTime: route.arrivalTime,
    isActive: route.isActive !== false
  };
};