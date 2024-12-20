import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileInfo, getUserData } from '../../api/auth';
import { updateProfile } from '../../store/authReducer';
import SuccessPopup from '../../components/SuccessPopup';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profileImage: null,
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const userData = await getUserData(); // Assuming this API fetches user data
      dispatch(updateProfile(userData)); // Update Redux state
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [dispatch]);

useEffect(() => {
  if (user) {
    setFormData({
      fullName: user.first_name || '',
      lastname: user.last_name || '',
      phoneNumber: user.phone || '',
      profileImage: user.id_card_image || null,
    });
  }
}, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = new FormData();
      Object.keys(formData).forEach((key) => {
        updateData.append(key, formData[key]);
      });

      const updatedUser = await updateProfileInfo(updateData);
      dispatch(updateProfile(updatedUser));
      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      fullName: user.fullName || '',
      lastname: user.last_name || '',
      phoneNumber: user.phoneNumber || '',
      profileImage: user.profileImage || null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      {success && (
        <SuccessPopup
          message="Profile updated successfully!"
          onClose={() => setSuccess(false)}
        />
      )}
      <div className="bg-white p-8 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={
                formData.profileImage instanceof File
                  ? URL.createObjectURL(formData.profileImage)
                  : formData.profileImage || '/default-avatar.png'
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>

          <div className="w-full">
            <label className="block text-gray-600 mb-2">First Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
              }`}
              readOnly={!editMode}
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-600 mb-2">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
              }`}
              readOnly={!editMode}
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-600 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
              }`}
              readOnly={!editMode}
            />
          </div>

          {editMode ? (
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
