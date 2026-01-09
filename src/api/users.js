import api from "./axios";

/**
 * Users API Service
 * Based on Swagger documentation
 */

// GET /api/users - Get all users (Admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Get all users error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch users",
      data: []
    };
  }
};

// GET /api/users/{id} - Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user details"
    };
  }
};

// PUT /api/users/{id} - Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/users/${id}`, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone
    });
    return {
      success: true,
      data: response.data,
      message: "User updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update user"
    };
  }
};

// DELETE /api/users/{id} - Delete user (Admin only)
export const deleteUser = async (id) => {
  try {
    await api.delete(`/api/users/${id}`);
    return {
      success: true,
      message: "User deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete user"
    };
  }
};

// Helper: Get users by role
export const getUsersByRole = async (role) => {
  try {
    const result = await getAllUsers();
    if (result.success) {
      const filteredUsers = result.data.filter(user => user.role === role);
      return {
        success: true,
        data: filteredUsers
      };
    }
    return result;
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch ${role} users`,
      data: []
    };
  }
};

// Helper: Get admin users
export const getAdminUsers = async () => {
  return getUsersByRole("admin");
};

// Helper: Get customer users
export const getCustomerUsers = async () => {
  return getUsersByRole("customer");
};