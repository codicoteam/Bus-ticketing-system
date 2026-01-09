import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun, LogOut, User } from "lucide-react";

// Inline theme utilities
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
};

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  if (!saved) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = prefersDark ? "dark" : "light";
    applyTheme(theme);
    return theme;
  }
  applyTheme(saved);
  return saved;
};

const toggleTheme = (currentTheme) => {
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
  return newTheme;
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTheme(initTheme());

    // Get user from localStorage
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      try {
        setUser(JSON.parse(adminUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const handleToggleTheme = () => {
    const newTheme = toggleTheme(theme);
    setTheme(newTheme);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    navigate("/");
  };

  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || user.email?.charAt(0) || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const getUserEmail = () => {
    return user?.email || "user@example.com";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">Bus Admin</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ticketing System</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/tickets">Tickets</NavLink>
          <NavLink to="/admin/buses">Buses</NavLink>
          <NavLink to="/admin/routes">Routes</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
        </nav>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleToggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Sun size={18} />
                Light Mode
              </>
            ) : (
              <>
                <Moon size={18} />
                Dark Mode
              </>
            )}
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="ml-64 min-h-screen">
        {/* Top Profile Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-end items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.firstName || "User"} {user?.lastName || ""}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getUserEmail()}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {getInitials()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
    >
      {children}
    </Link>
  );
}