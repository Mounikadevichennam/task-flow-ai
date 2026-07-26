import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import PageDocumentation from '../components/PageDocumentation';
import { User, Mail, BookOpen, Building2, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    branch: user?.branch || '',
    semester: user?.semester || '1',
    institution: user?.institution || '',
    profilePicture: user?.profilePicture || ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await API.put('/user/profile', {
        fullName: formData.fullName,
        branch: formData.branch,
        semester: formData.semester,
        institution: formData.institution,
        profilePicture: formData.profilePicture
      });

      if (res.data.success) {
        updateUserProfile(res.data.user);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            Student Profile
          </h2>
          <p className="text-muted small m-0 mt-1">
            Manage your academic credentials and personal details.
          </p>
        </div>
      </div>

      <div className="tf-card p-4 p-md-5">
        <form onSubmit={handleSubmit}>
          {/* Avatar Header */}
          <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold brand-font shadow-sm overflow-hidden"
              style={{ width: '80px', height: '80px', fontSize: '2rem' }}
            >
              {formData.profilePicture ? (
                <img src={formData.profilePicture} alt="Avatar" className="w-100 h-100 object-fit-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase() || 'S'
              )}
            </div>

            <div>
              <h5 className="fw-bold brand-font m-0">{user?.fullName}</h5>
              <span className="text-muted small">{user?.email}</span>
              <div className="mt-2 d-flex align-items-center gap-2">
                <span className="small text-muted">Choose Avatar:</span>
                {avatars.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="avatar option"
                    className="rounded-circle border cursor-pointer hover-scale"
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => setFormData({ ...formData, profilePicture: av })}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="row g-3">
            {/* Full Name */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Full Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><User size={18} /></span>
                <input
                  type="text"
                  name="fullName"
                  className="form-control border-start-0 ps-0"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Email Address (Read Only)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Mail size={18} /></span>
                <input
                  type="email"
                  name="email"
                  className="form-control border-start-0 ps-0 bg-light"
                  value={formData.email}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Branch / Department */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Branch / Department *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><BookOpen size={18} /></span>
                <input
                  type="text"
                  name="branch"
                  className="form-control border-start-0 ps-0"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Semester */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Semester *</label>
              <select
                name="semester"
                className="form-select"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            {/* Institution */}
            <div className="col-12">
              <label className="form-label small fw-semibold">Institution / University</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><Building2 size={18} /></span>
                <input
                  type="text"
                  name="institution"
                  className="form-control border-start-0 ps-0"
                  placeholder="University Name"
                  value={formData.institution}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4 pt-3 border-top">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-custom px-4 rounded-3"
            >
              {submitting ? 'Saving Changes...' : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Manages student profile information, branch, semester, and avatar preferences."
        technologies={['React.js', 'Bootstrap 5', 'Axios', 'Express.js', 'MongoDB']}
        concepts={['Authentication', 'State Management', 'Form Handling']}
        logic="Updates user account profile data and synchronizes local session storage."
      />
    </div>
  );
};

export default Profile;
