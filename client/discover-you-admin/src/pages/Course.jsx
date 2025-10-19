import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { categories } from '../constants';

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: categories[0],
    previewImage: null
  });

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: categories[0],
    previewImage: null
  });

  const handleFormChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleEditFormChange = (field) => (e) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };

  const handleImageChange = (isEdit) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditPreviewImage(reader.result);
          setEditForm({ ...editForm, previewImage: reader.result });
        } else {
          setPreviewImage(reader.result);
          setForm({ ...form, previewImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: categories[0],
      previewImage: null
    });
    setPreviewImage(null);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      id: courses.length + 1,
      name: form.name,
      description: form.description,
      category: form.category,
      cover_image_url: form.previewImage,
      instructor_name: 'Current User',
      instructor_profile_picture_url: null,
      total_enrollment: 0,
      total_materials: 0
    };
    setCourses([...courses, newCourse]);
    resetForm();
    setModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourse.id) {
        return {
          ...c,
          name: editForm.name,
          description: editForm.description,
          category: editForm.category,
          cover_image_url: editForm.previewImage || c.cover_image_url
        };
      }
      return c;
    });
    setCourses(updatedCourses);
    setEditModalOpen(false);
    setSelectedCourse(null);
    setEditPreviewImage(null);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setEditForm({
      name: course.name,
      description: course.description || '',
      category: course.category,
      previewImage: course.cover_image_url
    });
    setEditPreviewImage(course.cover_image_url);
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/course', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const renderModal = (isEdit) => {
    const currentForm = isEdit ? editForm : form;
    const handleChange = isEdit ? handleEditFormChange : handleFormChange;
    const handleSubmit = isEdit ? handleEditSubmit : handleCreateSubmit;
    const isOpen = isEdit ? editModalOpen : modalOpen;
    const setIsOpen = isEdit ? setEditModalOpen : setModalOpen;
    const title = isEdit ? 'Edit Course' : 'Create New Course';
    const buttonText = isEdit ? 'Update Course' : 'Create Course';
    const currentPreview = isEdit ? editPreviewImage : previewImage;
    const headerColor = 'from-orange-500 to-orange-600';
    const focusColor = 'focus:border-orange-400 focus:ring-orange-100';
    const buttonColor = 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-300';

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={() => {
          setIsOpen(false);
          if (isEdit) {
            setSelectedCourse(null);
            setEditPreviewImage(null);
          } else {
            resetForm();
          }
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
                if (isEdit) {
                  setSelectedCourse(null);
                  setEditPreviewImage(null);
                } else {
                  resetForm();
                }
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
                  Course Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentForm.name}
                  onChange={handleChange('name')}
                  className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} transition-all`}
                  placeholder="Enter course name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Description <span className="text-orange-500">*</span>
                </label>
                <textarea
                  value={currentForm.description}
                  onChange={handleChange('description')}
                  className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-28 resize-y focus:outline-none ${focusColor} transition-all`}
                  placeholder="Describe the course"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Category <span className="text-orange-500">*</span>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preview Image <span className="text-orange-500">*</span>
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange(isEdit)}
                      className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none ${focusColor} transition-all`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a preview image for the course</p>
                  </div>
                  {currentPreview && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={currentPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    if (isEdit) {
                      setEditModalOpen(false);
                      setSelectedCourse(null);
                      setEditPreviewImage(null);
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
            Course
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all courses</p>
        </header>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Preview Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Course Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Course Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Total Enrollment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Total Material
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {courses.map((course, index) => (
                  <tr
                    key={course.id}
                    className={`hover:bg-orange-50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.cover_image_url ? (
                        <img
                          src={course.cover_image_url.startsWith('data:') ? course.cover_image_url : `http://localhost:8000${course.cover_image_url}`}
                          alt={course.name}
                          className="h-16 w-24 rounded-lg object-cover border border-orange-100"
                        />
                      ) : (
                        <div className="h-16 w-24 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200">
                          <ImageIcon className="h-8 w-8 text-orange-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{course.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{course.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate" title={course.description}>
                        {course.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {course.instructor_profile_picture_url ? (
                          <img
                            src={`http://localhost:8000${course.instructor_profile_picture_url}`}
                            alt={`${course.instructor_name || 'Instructor'} profile`}
                            className="h-8 w-8 rounded-full object-cover mr-3 border border-orange-100"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-semibold mr-3">
                            {(course.instructor_name && course.instructor_name.charAt(0).toUpperCase()) || '?'}
                          </div>
                        )}
                        <div className="text-sm text-gray-700">{course.instructor_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-orange-600">{course.total_participants}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-orange-600">{course.total_materials}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-150"
                          aria-label="Edit course"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                          aria-label="Delete course"
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
            aria-label="Create New Course"
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
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {renderModal(false)}
      {renderModal(true)}
    </div>
  );
}