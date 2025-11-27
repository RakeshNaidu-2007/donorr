import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStats } from "../api/admin";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchStats()
      .then((res) => {
        if (mounted) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-semibold">{stats?.totals?.users ?? "-"}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Donations</div>
          <div className="text-2xl font-semibold">{stats?.totals?.donations ?? "-"}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Requests</div>
          <div className="text-2xl font-semibold">{stats?.totals?.requests ?? "-"}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Active Drives</div>
          <div className="text-2xl font-semibold">{stats?.totals?.activeDrives ?? "-"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="block bg-white p-5 rounded shadow hover:shadow-md">
          <h3 className="text-lg font-semibold">Manage Users</h3>
          <p className="text-sm text-gray-600 mt-2">View, search, edit roles and delete users.</p>
        </Link>

        <Link to="/admin/reports" className="block bg-white p-5 rounded shadow hover:shadow-md">
          <h3 className="text-lg font-semibold">Reports</h3>
          <p className="text-sm text-gray-600 mt-2">Generate and download activity reports.</p>
        </Link>

        <Link to="/admin/system" className="block bg-white p-5 rounded shadow hover:shadow-md">
          <h3 className="text-lg font-semibold">System Overview</h3>
          <p className="text-sm text-gray-600 mt-2">Live operational metrics.</p>
        </Link>
      </div>

      {loading && <div className="mt-4 text-sm text-gray-500">Loading stats...</div>}
    </div>
  );
};

export default AdminDashboard;
