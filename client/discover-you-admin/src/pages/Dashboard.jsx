import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Video,
  Briefcase,
  DollarSign,
  RefreshCw,
  BarChart3,
  Activity,
  Globe,
  Target,
} from "lucide-react";

const API_URL = "http://localhost:8000/";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [platformActivity, setPlatformActivity] = useState([]);
  const [topCommunities, setTopCommunities] = useState([]);
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [demographics, setDemographics] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        statsRes,
        growthRes,
        activityRes,
        communitiesRes,
        coursesRes,
        engagementRes,
        revenueRes,
        demoRes,
      ] = await Promise.all([
        fetch(`${API_URL}/admin/stats`).then((res) => res.json()),
        fetch(`${API_URL}/admin/user-growth`).then((res) => res.json()),
        fetch(`${API_URL}/admin/platform-activity`).then((res) => res.json()),
        fetch(`${API_URL}/admin/top-communities`).then((res) => res.json()),
        fetch(`${API_URL}/admin/course-performance`).then((res) => res.json()),
        fetch(`${API_URL}/admin/engagement-metrics`).then((res) => res.json()),
        fetch(`${API_URL}/admin/revenue-analytics`).then((res) => res.json()),
        fetch(`${API_URL}/admin/user-demographics`).then((res) => res.json()),
      ]);

      setStats(statsRes.data);
      setUserGrowth(growthRes.data);
      setPlatformActivity(activityRes.data);
      setTopCommunities(communitiesRes.data);
      setCoursePerformance(coursesRes.data);
      setEngagementMetrics(engagementRes.data);
      setRevenueAnalytics(revenueRes.data);
      setDemographics(demoRes.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const COLORS = ["#FF6B35", "#F7931E", "#FDC830", "#37B7C3", "#088395"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1s" }}
          ></div>
        </div>
        <p className="mt-6 text-lg font-semibold text-slate-700 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Glassmorphic Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Real-time platform analytics
                </p>
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              className="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            title="Total Users"
            value={stats?.totalUsers || 0}
            subtitle="Platform members"
            gradient="from-blue-500 to-cyan-500"
            trend="+12.5%"
          />
          <MetricCard
            icon={<Globe className="w-6 h-6" />}
            title="Communities"
            value={stats?.totalCommunities || 0}
            subtitle="Active groups"
            gradient="from-purple-500 to-pink-500"
            trend="+8.3%"
          />
          <MetricCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Courses"
            value={stats?.totalCourses || 0}
            subtitle="Available courses"
            gradient="from-orange-500 to-red-500"
            trend="+15.7%"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Enrollments"
            value={stats?.totalEnrollments || 0}
            subtitle="Total enrolled"
            gradient="from-green-500 to-emerald-500"
            trend="+23.1%"
          />
          <MetricCard
            icon={<Award className="w-6 h-6" />}
            title="Contests"
            value={stats?.totalContests || 0}
            subtitle="Active contests"
            gradient="from-yellow-500 to-orange-500"
          />
          <MetricCard
            icon={<Video className="w-6 h-6" />}
            title="Webinars"
            value={stats?.totalWebinars || 0}
            subtitle="Scheduled events"
            gradient="from-indigo-500 to-purple-500"
          />
          <MetricCard
            icon={<Briefcase className="w-6 h-6" />}
            title="Job Posts"
            value={stats?.totalJobs || 0}
            subtitle="Opportunities"
            gradient="from-teal-500 to-cyan-500"
          />
          <MetricCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Revenue"
            value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
            subtitle="Total earnings"
            gradient="from-emerald-500 to-green-500"
            trend="+18.4%"
          />
        </div>

        {/* User Growth Chart */}
        <ChartCard
          title="User Growth Trend"
          subtitle="Last 12 months"
          icon={<TrendingUp className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                stroke="#64748B"
                style={{ fontSize: "12px", fontWeight: "500" }}
              />
              <YAxis
                stroke="#64748B"
                style={{ fontSize: "12px", fontWeight: "500" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Platform Activity */}
        <ChartCard
          title="Platform Activity"
          subtitle="Last 30 days"
          icon={<Activity className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={platformActivity}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                style={{ fontSize: "12px", fontWeight: "500" }}
              />
              <YAxis
                stroke="#64748B"
                style={{ fontSize: "12px", fontWeight: "500" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: "#F59E0B", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Analytics */}
        {revenueAnalytics && (
          <ChartCard
            title="Revenue Analytics"
            subtitle="Monthly breakdown"
            icon={<DollarSign className="w-5 h-5" />}
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueAnalytics.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                />
                <YAxis
                  stroke="#64748B"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {revenueAnalytics.topCourses.slice(0, 3).map((course, index) => (
                <div
                  key={index}
                  className="relative group p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    #{index + 1}
                  </div>
                  <h4 className="text-slate-800 font-semibold mb-3 pr-12 line-clamp-2">
                    {course.name}
                  </h4>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    ${course.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {course.enrollments} enrollments
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Communities */}
          <ChartCard
            title="Top Communities"
            subtitle="By member count"
            icon={<Globe className="w-5 h-5" />}
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topCommunities.slice(0, 6)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: "11px", fontWeight: "500" }}
                />
                <YAxis
                  stroke="#64748B"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                />
                <Bar
                  dataKey="members"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Demographics */}
          {demographics && demographics.gender && (
            <ChartCard
              title="User Demographics"
              subtitle="Gender distribution"
              icon={<Users className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={demographics.gender}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: "#64748B", strokeWidth: 1 }}
                  >
                    {demographics.gender.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>

        {/* Engagement Metrics */}
        {engagementMetrics && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Engagement Metrics
                </h2>
                <p className="text-sm text-slate-500">
                  Platform interaction overview
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EngagementCard
                title="Showcase Posts"
                metrics={[
                  {
                    label: "Total Posts",
                    value: engagementMetrics.posts.total_posts,
                  },
                  {
                    label: "Reactions",
                    value: engagementMetrics.posts.total_reactions,
                  },
                  {
                    label: "Comments",
                    value: engagementMetrics.posts.total_comments,
                  },
                ]}
                gradient="from-orange-500 to-red-500"
              />
              <EngagementCard
                title="Contest Activity"
                metrics={[
                  {
                    label: "Contests",
                    value: engagementMetrics.contests.total_contests,
                  },
                  {
                    label: "Participants",
                    value: engagementMetrics.contests.total_participants,
                  },
                  {
                    label: "Submissions",
                    value: engagementMetrics.contests.total_submissions,
                  },
                ]}
                gradient="from-purple-500 to-pink-500"
              />
              <EngagementCard
                title="Webinar Stats"
                metrics={[
                  {
                    label: "Total Events",
                    value: engagementMetrics.webinars.total_webinars,
                  },
                  {
                    label: "Registered",
                    value: engagementMetrics.webinars.total_registered,
                  },
                  {
                    label: "Attended",
                    value: engagementMetrics.webinars.total_attended,
                  },
                  {
                    label: "Attendance",
                    value: `${
                      engagementMetrics.webinars.total_registered > 0
                        ? (
                            (engagementMetrics.webinars.total_attended /
                              engagementMetrics.webinars.total_registered) *
                            100
                          ).toFixed(1)
                        : 0
                    }%`,
                  },
                ]}
                gradient="from-blue-500 to-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DataTable
            title="Top Performing Courses"
            icon={<BookOpen className="w-5 h-5" />}
            headers={["Course", "Category", "Students", "Revenue"]}
            data={coursePerformance
              .slice(0, 5)
              .map((course) => [
                course.name,
                course.category,
                course.enrollments,
                `$${course.revenue.toFixed(0)}`,
              ])}
          />
          <DataTable
            title="Most Active Communities"
            icon={<Globe className="w-5 h-5" />}
            headers={["Community", "Category", "Members", "Messages"]}
            data={topCommunities
              .slice(0, 5)
              .map((community) => [
                community.name,
                community.category,
                community.members,
                community.messages,
              ])}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            icon="🔥"
            title="Active Communities"
            value={stats?.activeCommunities || 0}
            subtitle={`${
              stats?.totalCommunities > 0
                ? (
                    (stats.activeCommunities / stats.totalCommunities) *
                    100
                  ).toFixed(1)
                : 0
            }% active (7 days)`}
            gradient="from-orange-500 to-red-500"
          />
          <SummaryCard
            icon="📚"
            title="Enrollment Rate"
            value={
              stats?.totalCourses > 0
                ? (stats.totalEnrollments / stats.totalCourses).toFixed(1)
                : 0
            }
            subtitle="average per course"
            gradient="from-blue-500 to-purple-500"
          />
          <SummaryCard
            icon="⭐"
            title="Platform Score"
            value={
              engagementMetrics
                ? (
                    (engagementMetrics.posts.total_reactions +
                      engagementMetrics.posts.total_comments +
                      engagementMetrics.contests.total_submissions) /
                    100
                  ).toFixed(1)
                : 0
            }
            subtitle="engagement index"
            gradient="from-green-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <p className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </footer>
    </div>
  );
};

const MetricCard = ({ icon, title, value, subtitle, gradient, trend }) => (
  <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
      {title}
    </p>
    <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
    <p className="text-xs text-slate-500">{subtitle}</p>
  </div>
);

const ChartCard = ({ title, subtitle, icon, children }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-xl">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

const EngagementCard = ({ title, metrics, gradient }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16`}
    ></div>
    <h3 className="text-lg font-bold text-slate-800 mb-6">{title}</h3>
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm text-slate-600">{metric.label}</span>
          <span className="text-lg font-bold text-slate-800">
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const DataTable = ({ title, icon, headers, data }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-4 text-sm text-slate-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SummaryCard = ({ icon, title, value, subtitle, gradient }) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
  >
    <div className="absolute top-0 right-0 text-9xl opacity-10">{icon}</div>
    <div className="relative z-10">
      <p className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-90">
        {title}
      </p>
      <p className="text-5xl font-bold mb-2">{value}</p>
      <p className="text-sm opacity-80">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
