import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { categories } from '../constants';

export default function Contest() {
  const [contests, setContests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: categories[0],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: categories[0],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });

  const handleFormChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleEditFormChange = (field) => (e) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: categories[0],
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newContest = {
      id: contests.length + 1,
      name: form.name,
      category: form.category,
      organizer_name: 'Current User',
      organizer_profile_picture_url: null,
      start_time: `${form.startDate}T${form.startTime}:00`,
      ending_time: `${form.endDate}T${form.endTime}:00`,
      total_participants: 0,
      type: 'Upcoming'
    };
    setContests([...contests, newContest]);
    resetForm();
    setModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedContests = contests.map(c => {
      if (c.id === selectedContest.id) {
        return {
          ...c,
          name: editForm.name,
          category: editForm.category,
          start_time: `${editForm.startDate}T${editForm.startTime}:00`,
          ending_time: `${editForm.endDate}T${editForm.endTime}:00`,
        };
      }
      return c;
    });
    setContests(updatedContests);
    setEditModalOpen(false);
    setSelectedContest(null);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleEdit = (contest) => {
    setSelectedContest(contest);
    const startDateTime = new Date(contest.start_time);
    const endDateTime = new Date(contest.ending_time);
    
    setEditForm({
      name: contest.name,
      description: contest.description || '',
      category: contest.category,
      startDate: startDateTime.toISOString().split('T')[0],
      startTime: startDateTime.toTimeString().slice(0, 5),
      endDate: endDateTime.toISOString().split('T')[0],
      endTime: endDateTime.toTimeString().slice(0, 5)
    });
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      setContests(contests.filter(c => c.id !== id));
    }
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/contest', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setContests(data.contests);
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();
  }, []);

  const renderModal = (isEdit) => {
    const currentForm = isEdit ? editForm : form;
    const handleChange = isEdit ? handleEditFormChange : handleFormChange;
    const handleSubmit = isEdit ? handleEditSubmit : handleCreateSubmit;
    const isOpen = isEdit ? editModalOpen : modalOpen;
    const setIsOpen = isEdit ? setEditModalOpen : setModalOpen;
    const title = isEdit ? 'Edit Contest' : 'Create New Contest';
    const buttonText = isEdit ? 'Update Contest' : 'Create Contest';
    const headerColor =  'from-orange-500 to-orange-600';
    const focusColor = 'focus:border-orange-400 focus:ring-orange-100';
    const buttonColor = 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-300';

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={() => {
          setIsOpen(false);
          if (isEdit) setSelectedContest(null);
        }}
      >
        <div
          className="relative z-10 w-full max-w-2xl my-8 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${headerColor}`}>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={() => {
                setIsOpen(false);
                if (isEdit) setSelectedContest(null);
              }}
              className="text-white hover:text-orange-100 rounded-full p-1 hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contest Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentForm.name}
                  onChange={handleChange('name')}
                  className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} transition-all`}
                  placeholder="Enter contest name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contest Description
                </label>
                <textarea
                  value={currentForm.description}
                  onChange={handleChange('description')}
                  className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-28 resize-y focus:outline-none ${focusColor} transition-all`}
                  placeholder="Describe the contest"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contest Category <span className="text-orange-500">*</span>
                </label>
                <select
                  value={currentForm.category}
                  onChange={handleChange('category')}
                  className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} bg-white transition-all`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Starting Date & Time <span className="text-orange-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={currentForm.startDate}
                      onChange={handleChange('startDate')}
                      className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} transition-all`}
                      required
                    />
                    <input
                      type="time"
                      value={currentForm.startTime}
                      onChange={handleChange('startTime')}
                      className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} transition-all`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ending Date & Time <span className="text-orange-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={currentForm.endDate}
                      onChange={handleChange('endDate')}
                      className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} transition-all`}
                      required
                    />
                    <input
                      type="time"
                      value={currentForm.endTime}
                      onChange={handleChange('endTime')}
                      className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} transition-all`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    if (isEdit) {
                      setEditModalOpen(false);
                      setSelectedContest(null);
                    } else {
                      resetForm();
                      setModalOpen(false);
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`px-8 py-3 rounded-xl bg-gradient-to-r ${buttonColor} text-white font-semibold shadow-lg transform hover:scale-105 transition-all`}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Contest
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all contests</p>
        </header>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Contest Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Starting Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Ending Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {contests.map((c, index) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-orange-50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{c.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {c.organizer_profile_picture_url ? (
                          <img
                            src={"http://localhost:8000" + c.organizer_profile_picture_url}
                            alt={`${c.organizer_name || 'Organizer'} profile`}
                            className="h-8 w-8 rounded-full object-cover mr-3 border border-orange-100"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-semibold mr-3">
                            {(c.organizer_name && c.organizer_name.charAt(0).toUpperCase()) || '?'}
                          </div>
                        )}
                        <div className="text-sm text-gray-700">{c.organizer_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{formatDateTime(c.start_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{formatDateTime(c.ending_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-orange-600">{c.total_participants}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClasses(
                          c.type
                        )}`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-150"
                          aria-label="Edit contest"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                          aria-label="Delete contest"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="fixed right-6 bottom-6">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-4 rounded-full shadow-2xl hover:shadow-orange-300 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Create New Contest"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
            <span>Create New Contest</span>
          </button>
        </div>
      </div>

      {renderModal(false)}
      {renderModal(true)}
    </div>
  );
}