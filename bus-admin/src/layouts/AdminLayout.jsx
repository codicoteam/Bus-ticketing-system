import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">
          Bus Admin
        </h2>

        <nav className="flex-1 space-y-4">
          <Link to="/admin/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link to="/admin/tickets" className="block hover:text-blue-400">
            Tickets
          </Link>

          <Link to="/admin/buses" className="block hover:text-blue-400">
            Buses
          </Link>

          <Link to="/admin/routes" className="block hover:text-blue-400">
            Routes
          </Link>

          <Link to="/admin/drivers" className="block hover:text-blue-400">
            Drivers
          </Link>
        </nav>

        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
