import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import ClientTickets from "./pages/admin/ClientTickets";
import Buses from "./pages/admin/Buses";
import RoutesPage from "./pages/admin/Routes";
import Drivers from "./pages/admin/Drivers";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Default landing page */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="tickets" element={<ClientTickets />} />
          <Route path="buses" element={<Buses />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="drivers" element={<Drivers />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
