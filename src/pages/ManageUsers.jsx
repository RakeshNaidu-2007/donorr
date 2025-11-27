import React, { useEffect, useState } from "react";
import { fetchUsers, updateUserRole, deleteUser } from "../api/admin";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers({ page, perPage, q });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [page, perPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await load();
  };

  const changeRole = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      toast.success("Role updated");
      load();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const removeUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Manage Users</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Search by name or email..."
        />
        <button className="px-4 py-2 bg-red-600 text-white rounded">Search</button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm">Name</th>
              <th className="p-3 text-left text-sm">Email</th>
              <th className="p-3 text-left text-sm">Role</th>
              <th className="p-3 text-left text-sm">Phone</th>
              <th className="p-3 text-left text-sm">Created</th>
              <th className="p-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="p-3 text-sm">{u.name}</td>
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="donor">donor</option>
                    <option value="recipient">recipient</option>
                    <option value="logistics">logistics</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 text-sm">{u.phone}</td>
                <td className="p-3 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-sm">
                  <button onClick={() => removeUser(u._id)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-sm text-gray-500">
                  {loading ? "Loading..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {Math.min((page - 1) * perPage + 1, total)} -{" "}
          {Math.min(page * perPage, total)} of {total}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page * perPage >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
