import api from "./axios";

/**
 * Payments API Service
 * Based on Swagger documentation
 */

// POST /api/payments/ecocash - Pay with EcoCash
export const payWithEcoCash = async (bookingId, mobile) => {
  try {
    const response = await api.post("/api/payments/ecocash", {
      bookingId,
      mobile
    });
    return {
      success: true,
      data: response.data,
      message: "EcoCash payment initiated successfully"
    };
  } catch (error) {
    console.error("EcoCash payment error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "EcoCash payment failed"
    };
  }
};

// GET /api/payments/status/{bookingId} - Check payment status for booking
export const getPaymentStatus = async (bookingId) => {
  try {
    const response = await api.get(`/api/payments/status/${bookingId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch payment status"
    };
  }
};

// POST /api/payments/reset-payment/{bookingId} - Reset payment status for testing (Admin only)
export const resetPaymentStatus = async (bookingId) => {
  try {
    const response = await api.post(`/api/payments/reset-payment/${bookingId}`);
    return {
      success: true,
      data: response.data,
      message: "Payment status reset successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to reset payment status"
    };
  }
};

// GET /api/payments/test-paynow - Test PayNow connection
export const testPayNowConnection = async () => {
  try {
    const response = await api.get("/api/payments/test-paynow");
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "PayNow connection test failed"
    };
  }
};

// Helper: Format payment status for display
export const formatPaymentStatus = (status) => {
  const statusMap = {
    pending: { label: "Pending", color: "yellow" },
    paid: { label: "Paid", color: "green" },
    failed: { label: "Failed", color: "red" },
    refunded: { label: "Refunded", color: "blue" }
  };
  return statusMap[status] || { label: status, color: "gray" };
};