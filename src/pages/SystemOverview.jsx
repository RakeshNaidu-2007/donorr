import React, { useEffect, useState } from "react";
import { fetchStats } from "../api/admin";

const SystemOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">System Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pending Requests</div>
          <div className="text-2xl font-semibold">{stats?.pendingRequests ?? "-"}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Donations Available</div>
          <div className="text-2xl font-semibold">{stats?.availableDonations ?? "-"}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Active Drives</div>
          <div className="text-2xl font-semibold">{stats?.totals?.activeDrives ?? "-"}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recent drives</h3>
          {stats?.recentDrives?.length ? (
            <ul className="list-disc pl-5">
              {stats.recentDrives.map((d) => (
                <li key={d._id}>
                  {d.title} — {new Date(d.startDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No recent drives</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
