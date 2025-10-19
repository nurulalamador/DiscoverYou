import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { categories } from '../constants';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusClasses = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Upcoming':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Over':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };


  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(c => c.id !== id));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/user', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all users</p>
        </header>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Interests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((c, index) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-orange-50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {c.profile_picture_url ? (
                          <img
                            src={"http://localhost:8000" + c.profile_picture_url}
                            alt={`${c.organizer_name || 'Organizer'} profile`}
                            className="h-8 w-8 rounded-full object-cover mr-3 border border-orange-100"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-semibold mr-3">
                            {(c.full_name && c.full_name.charAt(0).toUpperCase()) || '?'}
                          </div>
                        )}
                        <div className="text-sm text-gray-700">{c.full_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">@{c.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-orange-600">{c.gender == "male" ? "Male" : "Female"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {
                        c.interests && c.interests.length > 0 ? (
                          c.interests.map((interest, idx) => (
                            <div className="bg-orange-100 rounded-lg m-2 px-3 py-1 text-sm text-orange-500 font-semibold">{interest}</div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400">No Interests</div>
                        )
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{formatDateTime(c.date_of_birth)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150 flex flex-row items-center gap-2"
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-4 w-4" /> <div>Delete Account</div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}