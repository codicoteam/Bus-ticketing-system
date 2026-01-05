import { useEffect, useState } from "react";
import {
  Ticket,
  Bus,
  Map,
  Users,
  Bell,
  Download,
  Moon,
  Sun,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { applyTheme, initTheme } from "../../utils/theme";

/* ------------------ MOCK DATA ------------------ */
const ticketData = [
  { route: "Harare → Bulawayo", tickets: 320 },
  { route: "Harare → Mutare", tickets: 210 },
  { route: "Harare → Gweru", tickets: 180 },
  { route: "Harare → Masvingo", tickets: 150 },
];

export default function Dashboard() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(initTheme());
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  const chartColor = theme === "dark" ? "#60A5FA" : "#2563EB";
  const axisColor = theme === "dark" ? "#CBD5E1" : "#334155";

  return (
    <div className="space-y-8 text-slate-800 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stat icon={<Ticket />} label="Tickets Sold" value="860" />
        <Stat icon={<Bus />} label="Active Buses" value="24" />
        <Stat icon={<Map />} label="Routes" value="12" />
        <Stat icon={<Users />} label="Drivers" value="18" />
      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Ticket Sales per Route
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ticketData}>
            <XAxis dataKey="route" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip />
            <Bar dataKey="tickets" fill={chartColor} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell size={18} /> Notifications
        </h2>

        <ul className="space-y-3 text-sm">
          <li className="p-3 bg-slate-100 dark:bg-slate-700 rounded">
            Bus <strong>ABC-123</strong> scheduled for maintenance tomorrow.
          </li>
          <li className="p-3 bg-slate-100 dark:bg-slate-700 rounded">
            Route <strong>Harare → Mutare</strong> reached full capacity.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------ STAT CARD ------------------ */
function Stat({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow flex items-center gap-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
