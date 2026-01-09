import { useEffect, useState } from "react";
import { Ticket, Bus, Map, Users, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
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

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalBuses: 0,
    totalRoutes: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const api = createApiInstance();

      const [bookingsRes, busesRes, routesRes, usersRes] = await Promise.all([
        api.get("/api/bookings").catch(() => ({ data: [] })),
        api.get("/api/buses").catch(() => ({ data: [] })),
        api.get("/api/routes").catch(() => ({ data: [] })),
        api.get("/api/users").catch(() => ({ data: [] }))
      ]);

      const bookings = bookingsRes.data || [];
      const buses = busesRes.data || [];
      const routes = routesRes.data || [];
      const users = usersRes.data || [];

      const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      setStats({
        totalBookings: bookings.length,
        totalBuses: buses.length,
        totalRoutes: routes.length,
        totalUsers: users.length,
        totalRevenue
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const ticketData = [
    { route: "Harare → Bulawayo", tickets: 320 },
    { route: "Harare → Mutare", tickets: 210 },
    { route: "Harare → Gweru", tickets: 180 },
    { route: "Harare → Masvingo", tickets: 150 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12400 },
    { month: "Feb", revenue: 15600 },
    { month: "Mar", revenue: 18200 },
    { month: "Apr", revenue: 16800 },
    { month: "May", revenue: 19400 },
    { month: "Jun", revenue: 21200 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header - Centered */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">System overview & performance metrics</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Ticket className="text-blue-600 dark:text-blue-400" />}
              label="Total Bookings"
              value={stats.totalBookings.toString()}
              trend="+12%"
              trendUp
            />
            <StatCard
              icon={<Bus className="text-green-600 dark:text-green-400" />}
              label="Active Buses"
              value={stats.totalBuses.toString()}
              trend="+3"
              trendUp
            />
            <StatCard
              icon={<Map className="text-purple-600 dark:text-purple-400" />}
              label="Routes"
              value={stats.totalRoutes.toString()}
              trend="stable"
            />
            <StatCard
              icon={<Users className="text-orange-600 dark:text-orange-400" />}
              label="Users"
              value={stats.totalUsers.toString()}
              trend="+5"
              trendUp
            />
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <p className="text-4xl font-bold text-white mt-2">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <Ticket className="text-white" size={32} />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket Sales Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Ticket Sales by Route
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ticketData}>
                  <XAxis dataKey="route" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="tickets" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Revenue Trend
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1e3a8a"
                    strokeWidth={3}
                    dot={{ fill: "#1e3a8a", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Bookings
            </h2>
            {recentBookings.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">No recent bookings</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <ActivityItem
                    key={booking._id}
                    title={`Booking #${booking._id.slice(-8)}`}
                    description={`${booking.tripId?.routeId?.origin || "Unknown"} → ${booking.tripId?.routeId?.destination || "Unknown"} • $${booking.totalAmount}`}
                    time={new Date(booking.createdAt).toLocaleString()}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, trend, trendUp }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">{icon}</div>
        {trend && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${trendUp
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">{time}</span>
    </div>
  );
}