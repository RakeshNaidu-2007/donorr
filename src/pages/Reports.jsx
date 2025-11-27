import React, { useEffect, useState } from "react";
import { fetchReports } from "../api/admin";

const Reports = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchReports({ limit: 100 })
      .then((res) => setItems(res.data.reports))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Reports</h1>
      <p className="text-gray-600 mb-6">Recent activity & system reports.</p>

      <div className="bg-white rounded shadow p-4">
        {items.length === 0 && <div className="text-sm text-gray-500">No reports yet.</div>}
        {items.map((r) => (
          <div key={r._id} className="border-b py-2">
            <div className="text-sm font-medium">{r.title || r.type}</div>
            <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
            <div className="mt-1 text-sm">{r.summary || r.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
