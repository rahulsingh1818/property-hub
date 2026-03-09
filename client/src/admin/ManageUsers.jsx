import { useState, useEffect } from "react";

const API = "http://localhost:5000/api/admin";

export function ManageUsers() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${API}/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchFilter = filter === "all" || u.role === filter;
    const matchSearch =
      search === "" ||
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getRoleBadge = (role) => {
    const map = {
      user: "bg-blue-500/20 text-blue-400",
      dealer: "bg-purple-500/20 text-purple-400",
      admin: "bg-red-500/20 text-red-400",
    };
    return map[role] || map.user;
  };

  const totalStats = [
    { label: "Total Users", value: users.length, color: "text-blue-400" },
    {
      label: "Active",
      value: users.filter((u) => u.status === "active").length,
      color: "text-emerald-400",
    },
    {
      label: "Dealers",
      value: users.filter((u) => u.role === "dealer").length,
      color: "text-purple-400",
    },
    {
      label: "Inactive",
      value: users.filter((u) => u.status === "inactive").length,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Users</h1>
        <p className="text-gray-900">View and manage all registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {totalStats.map((s, i) => (
          <div key={i} className="bg-blue-800 border border-gray-800 rounded-2xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-blue-800 border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="🔍  Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "user", label: "Users" },
              { value: "dealer", label: "Dealers" },
              { value: "admin", label: "Admin" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.value
                    ? "bg-white text-gray-800"
                    : "bg-white text-gray-800 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-blue-800 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/60 border-b border-gray-800">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-gray-500">
                      <div className="text-5xl mb-3">👥</div>
                      <div className="text-lg font-medium">No users found</div>
                      <div className="text-sm mt-1">Try adjusting your search or filters</div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {(user.name || user.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">
                              {user.name || "—"}
                            </div>
                            <div className="text-gray-400 text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${getRoleBadge(user.role)} bg-transparent`}
                        >
                          <option value="user">User</option>
                          <option value="dealer">Dealer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleStatusToggle(user._id, user.status)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                            user.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                          }`}
                        >
                          {user.status === "active" ? "● Active" : "○ Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm"
                          title="Delete user"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}