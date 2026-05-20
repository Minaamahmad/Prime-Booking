import { useEffect, useState, useCallback } from 'react';
import { adminService } from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingUserId, setSavingUserId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId, banned) => {
    setSavingUserId(userId);
    setError('');
    try {
      if (banned) {
        await adminService.unbanUser(userId);
      } else {
        await adminService.banUser(userId);
      }
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="pb-page min-h-[calc(100vh-5rem)] px-4 py-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Admin User Management</h1>
            <p className="mt-2 text-sm text-slate-500">
              View all registered users and ban or unban accounts.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold">Role</th>
                  <th className="px-4 py-3 text-sm font-semibold">Banned</th>
                  <th className="px-4 py-3 text-sm font-semibold">Joined</th>
                  <th className="px-4 py-3 text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-4 text-sm text-slate-700">{user.name}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{user.role || 'Pending'}</td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-700">
                      {user.banned ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        disabled={savingUserId === user._id || user.role === 'Admin'}
                        onClick={() => handleStatusChange(user._id, user.banned)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          user.banned
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } ${savingUserId === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {savingUserId === user._id
                          ? 'Saving...'
                          : user.banned
                          ? 'Unban'
                          : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
