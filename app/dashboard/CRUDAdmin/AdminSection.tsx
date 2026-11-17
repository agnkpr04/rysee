"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit, Shield, Users, Calendar } from 'lucide-react';

interface Admin {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSection() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'admin' });
  const [error, setError] = useState('');

  console.log('[AdminSection] Component rendered, isLoading:', isLoading);

  useEffect(() => {
    const checkSession = async () => {
      const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('admin_session='));
      if (!sessionCookie) {
        router.push('/admin/login');
        return;
      }

      await fetchAdmins();
    };

    checkSession();
  }, [router]);

  const fetchAdmins = async () => {
    try {
      console.log('[AdminSection] Fetching admins...');
      const res = await fetch('/api/admin/manage');
      console.log('[AdminSection] Response status:', res.status);
      if (res.status === 401 || res.status === 403) {
        console.log('[AdminSection] Unauthorized, redirecting to login');
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      console.log('[AdminSection] Admins data:', data);
      setAdmins(data.admins || []);
    } catch (err) {
      console.error('[AdminSection] Failed to fetch admins:', err);
      alert('[AdminSection] Failed to fetch admins: ' + (err as Error).message);
    } finally {
      console.log('[AdminSection] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAdmin(null);
    setFormData({ username: '', password: '', role: 'admin' });
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({ username: admin.username, password: '', role: admin.role });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const res = await fetch(`/api/admin/manage?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAdmins();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete admin');
      }
    } catch (err) {
      console.error('Failed to delete admin:', err);
      alert('Failed to delete admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username) {
      setError('Username is required');
      return;
    }

    if (!editingAdmin && !formData.password) {
      setError('Password is required for new admin');
      return;
    }

    try {
      const url = editingAdmin ? '/api/admin/manage' : '/api/admin/manage';
      const method = editingAdmin ? 'PUT' : 'POST';
      const body = editingAdmin 
        ? { id: editingAdmin.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAdmins();
      } else {
        const error = await res.json();
        setError(error.error || 'Failed to save admin');
      }
    } catch (err) {
      console.error('Failed to save admin:', err);
      setError('Failed to save admin');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Admins</p>
              <p className="text-2xl font-bold">{admins.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Super Admins</p>
              <p className="text-2xl font-bold">{admins.filter(a => a.role === 'super_admin').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Regular Admins</p>
              <p className="text-2xl font-bold">{admins.filter(a => a.role === 'admin').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Admin Accounts</h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No admins found</div>
        ) : (
          <div className="divide-y">
            {admins.map((admin) => (
              <div key={admin.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{admin.username}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        admin.role === 'super_admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {admin.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password {editingAdmin && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={editingAdmin ? 'New password (optional)' : 'Enter password'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingAdmin ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
