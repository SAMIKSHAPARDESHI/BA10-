import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Shield,
  TrendingUp,
  Users,
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
  ChevronRight,
} from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Verifications",
      value: "12,458",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "emerald",
    },
    {
      label: "Success Rate",
      value: "98.2%",
      change: "+2.3%",
      trend: "up",
      icon: CheckCircle2,
      color: "blue",
    },
    {
      label: "Avg. Processing Time",
      value: "42s",
      change: "-8.1%",
      trend: "up",
      icon: Clock,
      color: "purple",
    },
    {
      label: "Active Today",
      value: "1,247",
      change: "+18.2%",
      trend: "up",
      icon: Activity,
      color: "amber",
    },
  ];

  const recentVerifications = [
    {
      id: "VRF-2024-8741",
      name: "Rashi Jambhale",
      status: "success",
      time: "2 minutes ago",
      trust: 98,
    },
    {
      id: "VRF-2024-8740",
      name: "Priya Sharma",
      status: "success",
      time: "5 minutes ago",
      trust: 96,
    },
    {
      id: "VRF-2024-8739",
      name: "Amit Patel",
      status: "pending",
      time: "8 minutes ago",
      trust: 0,
    },
    {
      id: "VRF-2024-8738",
      name: "Sneha Reddy",
      status: "success",
      time: "12 minutes ago",
      trust: 99,
    },
    {
      id: "VRF-2024-8737",
      name: "Vikram Singh",
      status: "failed",
      time: "15 minutes ago",
      trust: 45,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
      {/* Header */}
      <header className="border-b border-gray-200/80 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl tracking-tight text-[#0f172a]">
                  SecureKYC
                </h1>
                <p className="text-xs text-[#0f172a]/50">Admin Dashboard</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 glass rounded-xl text-sm text-[#0f172a] hover:bg-white/90 transition-all duration-300"
            >
              Exit Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl text-[#0f172a] tracking-tight mb-2">
            Welcome back, Admin
          </h2>
          <p className="text-[#0f172a]/60 font-light">
            Here's what's happening with your verification platform today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              emerald: "from-emerald-500 to-emerald-600",
              blue: "from-blue-500 to-blue-600",
              purple: "from-purple-500 to-purple-600",
              amber: "from-amber-500 to-amber-600",
            }[stat.color];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                className="glass premium-shadow rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-3xl text-[#0f172a] mb-1">{stat.value}</p>
                  <p className="text-sm text-[#0f172a]/60 font-light">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Verifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 glass premium-shadow rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-[#0f172a]">Recent Verifications</h3>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentVerifications.map((verification, index) => (
                <motion.div
                  key={verification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[#0f172a]">
                        {verification.name}
                      </p>
                      <p className="text-xs text-[#0f172a]/50 mt-0.5">
                        {verification.id} • {verification.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {verification.status === "success" && (
                      <>
                        <div className="text-right">
                          <p className="text-xs text-[#0f172a]/50">
                            Trust Score
                          </p>
                          <p className="text-sm text-emerald-600">
                            {verification.trust}%
                          </p>
                        </div>
                        <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Success
                        </div>
                      </>
                    )}
                    {verification.status === "pending" && (
                      <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </div>
                    )}
                    {verification.status === "failed" && (
                      <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        Failed
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="glass premium-shadow rounded-2xl p-6">
              <h3 className="text-lg text-[#0f172a] mb-4">Quick Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-[#0f172a]/70">
                      Completed
                    </span>
                  </div>
                  <span className="text-sm text-[#0f172a]">11,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm text-[#0f172a]/70">Pending</span>
                  </div>
                  <span className="text-sm text-[#0f172a]">342</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm text-[#0f172a]/70">Failed</span>
                  </div>
                  <span className="text-sm text-[#0f172a]">882</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="glass premium-shadow rounded-2xl p-6">
              <h3 className="text-lg text-[#0f172a] mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#0f172a]/70">API Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm text-emerald-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#0f172a]/70">AI Service</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm text-emerald-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#0f172a]/70">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm text-emerald-600">Healthy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">
                    Security Update Available
                  </p>
                  <p className="text-xs text-blue-700/70 font-light mb-3">
                    A new security patch is ready to install
                  </p>
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
