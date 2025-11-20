import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateName, getErrorMessage } from '../../utils/validation';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSuccess('');
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must be between 2 and 50 characters';
    }
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSuccess('');
    setApiError('');

    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setApiError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {apiError}
          </div>
        )}

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-lg font-medium text-gray-900">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            error={errors.name}
            required
          />

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="4"
              className="input"
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.bio.length}/500 characters</p>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;