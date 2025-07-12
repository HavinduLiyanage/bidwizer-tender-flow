import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getUser, getToken, logout } from "@/lib/auth";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "ADMIN") {
      navigate("/admin-login");
      return;
    }
    fetchStats();
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStats(await res.json());
    } catch (err) {
      setError("Failed to load stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(await res.json());
    } catch (err) {
      setError("Failed to load users");
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit-logs", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setLogs(await res.json());
    } catch (err) {
      setError("Failed to load audit logs");
    }
  };

  const handleApprove = async (id: number) => {
    await fetch(`/api/admin/publishers/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchUsers();
  };

  const handleReject = async (id: number) => {
    await fetch(`/api/admin/publishers/${id}/reject`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchUsers();
  };

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {stats && (
        <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold">Users</div>
            <div className="text-2xl">{stats.userCount}</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold">Bidders</div>
            <div className="text-2xl">{stats.bidderCount}</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold">Publishers</div>
            <div className="text-2xl">{stats.publisherCount}</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold">Tenders</div>
            <div className="text-2xl">{stats.tenderCount}</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold">Documents</div>
            <div className="text-2xl">{stats.documentCount}</div>
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>{user.position}</td>
                <td className="space-x-2">
                  {user.role === "PUBLISHER" && user.status !== "ACTIVE" && (
                    <Button size="sm" onClick={() => handleApprove(user.id)}>Approve</Button>
                  )}
                  {user.role === "PUBLISHER" && user.status !== "SUSPENDED" && (
                    <Button size="sm" variant="destructive" onClick={() => handleReject(user.id)}>Reject</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-6 rounded shadow mt-8">
        <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Time</th>
              <th>Admin</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-t">
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.admin?.name || log.admin?.email}</td>
                <td>{log.action}</td>
                <td>{log.targetType} #{log.targetId}</td>
                <td><pre className="whitespace-pre-wrap text-xs">{log.details}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard; 