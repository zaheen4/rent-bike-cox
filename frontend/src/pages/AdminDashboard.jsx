import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Settings, Tag, Users, Bike } from 'lucide-react';

const AdminDashboard = () => {
  const [settings, setSettings] = useState({ basePricePerHour: 200, packages: [] });
  const [bikes, setBikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsRes, bikesRes, usersRes] = await Promise.all([
          api.get('/dashboard/settings'),
          api.get('/dashboard/admin/bikes'),
          api.get('/dashboard/admin/users')
        ]);
        setSettings(settingsRes.data);
        setBikes(bikesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/dashboard/admin/settings', settings);
      alert('Settings updated successfully!');
    } catch {
      alert('Failed to update settings');
    }
  };

  const handleToggleBikeVerification = async (bikeId) => {
    try {
      const res = await api.put(`/dashboard/admin/bikes/${bikeId}/verify`);
      setBikes(bikes.map(b => b._id === bikeId ? res.data : b));
    } catch {
      alert('Failed to update bike verification');
    }
  };

  const handleToggleUserVerification = async (userId) => {
    try {
      const res = await api.put(`/dashboard/admin/users/${userId}/verify`);
      setUsers(users.map(u => u._id === userId ? res.data : u));
    } catch {
      alert('Failed to update user verification');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-8">
        <button onClick={() => setActiveTab('settings')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
          <Settings className="mr-2" size={18} /> Settings
        </button>
        <button onClick={() => setActiveTab('bikes')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'bikes' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
          <Bike className="mr-2" size={18} /> Bikes
        </button>
        <button onClick={() => setActiveTab('users')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
          <Users className="mr-2" size={18} /> Users
        </button>
        <button onClick={() => setActiveTab('coupons')} className={`flex items-center px-4 py-2 rounded ${activeTab === 'coupons' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
          <Tag className="mr-2" size={18} /> Coupons
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded shadow-md max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Global Fees & Pricing</h2>
          <form onSubmit={handleUpdateSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Base Price Per Hour (TK)</label>
              <input
                type="number"
                value={settings.basePricePerHour}
                onChange={e => setSettings({...settings, basePricePerHour: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {activeTab === 'bikes' && (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Bike</th>
                <th className="p-4">Renter</th>
                <th className="p-4">Price/hr</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Verified</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {bikes.map(bike => (
                <tr key={bike._id} className="border-t">
                  <td className="p-4 font-medium">{bike.model}</td>
                  <td className="p-4">{bike.renter?.name}</td>
                  <td className="p-4">{bike.pricePerHour} TK</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${bike.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {bike.availability ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${bike.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {bike.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleBikeVerification(bike._id)}
                      className={`px-3 py-1 rounded text-xs ${bike.isVerified ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {bike.isVerified ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">NID</th>
                <th className="p-4">Verified</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : user.role === 'Renter' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.nid}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleUserVerification(user._id)}
                      className={`px-3 py-1 rounded text-xs ${user.isVerified ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {user.isVerified ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="bg-white p-6 rounded shadow-md">
          <p className="text-gray-500">Coupon management coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
