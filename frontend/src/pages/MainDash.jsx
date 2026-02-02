import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, FileText, Users } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

import api from "../lib/axios"; // 🔥 shared axios
import { useAuthContext } from "../hooks/useAuthContext"; // 🔥 JWT + logout
import { toast } from "react-hot-toast";

function MainDash() {
  const { user, dispatch } = useAuthContext();

  const [stats, setStats] = useState({
    dailySales: 0,
    monthlyRevenue: 0,
    growthRate: 0,
    employees: 0
  });

  const [graphData, setGraphData] = useState([]);
  const [viewMode, setViewMode] = useState("monthly");
  const [loading, setLoading] = useState(true);

  const username = user?.username || "Guest";

  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user]);

  // ==============================
  // FETCH DASHBOARD DATA (JWT)
  // ==============================
  const fetchData = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${user.token}`
      };

      const [sRes, gRes] = await Promise.all([
        api.get("/dashboard/stats", { headers }),
        api.get("/dashboard/graph", { headers })
      ]);

      setStats(sRes.data || {});
      setGraphData(gRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        dispatch({ type: "LOGOUT" });
      } else {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // GRAPH SORT / GROUP
  // ==============================
  const getSortedData = () => {
    if (!graphData.length) return [];

    // YEARLY
    if (viewMode === "yearly") {
      const map = {};
      graphData.forEach((item) => {
        const [, year] = item.name.split("/");
        map[year] = (map[year] || 0) + Number(item.revenue || 0);
      });

      return Object.keys(map)
        .sort((a, b) => Number(a) - Number(b))
        .map((y) => ({ name: y, revenue: map[y] }));
    }

    // QUARTERLY (your "weekly" mode)
    if (viewMode === "weekly") {
      const map = {};
      graphData.forEach((item) => {
        const [m, y] = item.name.split("/").map(Number);
        const q = Math.ceil(m / 3);
        const key = `Q${q}-${y}`;
        map[key] = (map[key] || 0) + Number(item.revenue || 0);
      });

      return Object.keys(map)
        .sort((a, b) => {
          const [q1, y1] = a.replace("Q", "").split("-").map(Number);
          const [q2, y2] = b.replace("Q", "").split("-").map(Number);
          return y1 !== y2 ? y1 - y2 : q1 - q2;
        })
        .map((k) => ({ name: k, revenue: map[k] }));
    }

    // MONTHLY
    return [...graphData].sort((a, b) => {
      const [m1, y1] = a.name.split("/").map(Number);
      const [m2, y2] = b.name.split("/").map(Number);
      return y1 !== y2 ? y1 - y2 : m1 - m2;
    });
  };

  const activeData = getSortedData();

  // ==============================
  // UI
  // ==============================
  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col p-4 bg-slate-50 gap-4">
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Welcome, {username}
          </h1>
          <p className="text-xs text-slate-500">
            Business overview at a glance
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-lg shadow-sm border scale-90 origin-right">
          {["weekly", "monthly", "yearly"].map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === m
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <StatCard
          title="Total Monthly Sales"
          value={`₹${stats.dailySales || 0}`}
          icon={<DollarSign size={18} className="text-emerald-600" />}
          color="bg-emerald-100"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.monthlyRevenue || 0}`}
          icon={<FileText size={18} className="text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate || 0}%`}
          icon={<TrendingUp size={18} className="text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Active Employees"
          value={stats.employees || 0}
          icon={<Users size={18} className="text-rose-600" />}
          color="bg-rose-100"
        />
      </div>

      {/* CHARTS */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <ChartContainer title="Revenue Trend">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  dy={5}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <ChartContainer title="Comparison View">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>
    </div>
  );
}

// ==============================
// COMPACT STAT CARD
// ==============================
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-slate-500 uppercase truncate">
          {title}
        </p>
        <p className="text-lg font-bold text-slate-800 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

// ==============================
// CHART CONTAINER
// ==============================
function ChartContainer({ children, title }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-0">
      <h3 className="text-sm font-bold text-slate-800 mb-3">
        {title}
      </h3>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export default MainDash;
