import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import PageDocumentation from '../components/PageDocumentation';
import EmptyState from '../components/EmptyState';

import {
  Bell,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

// Format Date object to local datetime-local string (YYYY-MM-DDTHH:mm) without UTC conversion
const formatLocalISO = (d = new Date()) => {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return '';
  const pad = (num) => String(num).padStart(2, '0');
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
};

const Reminders = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [categorizedReminders, setCategorizedReminders] = useState({
    dueToday: [],
    dueTomorrow: [],
    upcoming: [],
    overdue: [],
    all: []
  });

  const [activeTab, setActiveTab] = useState('dueToday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newReminder, setNewReminder] = useState({
    title: '',
    dueDate: '',
    reminderType: 'Custom'
  });

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/reminders');
      if (res.data.success) {
        setCategorizedReminders(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load reminders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.dueDate) {
      showToast('Please enter title and due date', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/reminders', newReminder);
      if (res.data.success) {
        showToast('Reminder added successfully!', 'success');
        setIsModalOpen(false);
        setNewReminder({ title: '', dueDate: '', reminderType: 'Custom' });
        fetchReminders();
      }
    } catch (err) {
      showToast('Failed to create reminder', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await API.put(`/reminders/${id}/toggle`);
      if (res.data.success) {
        showToast('Reminder status updated', 'success');
        fetchReminders();
      }
    } catch (err) {
      showToast('Failed to update reminder', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/reminders/${id}`);
      if (res.data.success) {
        showToast('Reminder deleted', 'success');
        fetchReminders();
      }
    } catch (err) {
      showToast('Failed to delete reminder', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching active reminders..." />;

  const tabs = [
    { key: 'dueToday', label: 'Due Today', count: categorizedReminders.dueToday.length, badgeClass: 'bg-primary' },
    { key: 'dueTomorrow', label: 'Due Tomorrow', count: categorizedReminders.dueTomorrow.length, badgeClass: 'bg-info' },
    { key: 'upcoming', label: 'Upcoming', count: categorizedReminders.upcoming.length, badgeClass: 'bg-secondary' },
    { key: 'overdue', label: 'Overdue', count: categorizedReminders.overdue.length, badgeClass: 'bg-danger' }
  ];

  const currentList = categorizedReminders[activeTab] || [];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom gap-3">
        <div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            Reminders & Alerts
          </h2>
          <p className="text-muted small m-0 mt-1">
            Stay notified on upcoming assignment submission deadlines and study sessions.
          </p>
        </div>

        <button
          onClick={() => {
            const nextDate = new Date();
            nextDate.setHours(nextDate.getHours() + 2);
            setNewReminder({
              title: '',
              dueDate: formatLocalISO(nextDate),
              reminderType: 'Custom'
            });
            setIsModalOpen(true);
          }}
          className="btn btn-primary-custom rounded-3 shadow-sm"
        >
          <Plus size={18} /> Add Custom Reminder
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills gap-2 mb-4 border-bottom pb-3">
        {tabs.map((t) => (
          <li className="nav-item" key={t.key}>
            <button
              onClick={() => setActiveTab(t.key)}
              className={`nav-link rounded-pill d-flex align-items-center gap-2 px-3 py-2 ${
                activeTab === t.key ? 'active bg-primary text-white fw-semibold' : 'text-body bg-light'
              }`}
            >
              <span>{t.label}</span>
              <span className={`badge ${t.badgeClass} rounded-pill`}>{t.count}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Reminder Cards Grid */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={`No reminders for ${activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
          message="You are completely caught up! Create a custom reminder or add a new assignment deadline."
          actionText="Add Custom Reminder"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="row g-3">
          {currentList.map((rem) => {
            const formattedDate = new Date(rem.dueDate).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });

            return (
              <div key={rem._id} className="col-12 col-md-6 col-lg-4">
                <div
                  className={`tf-card p-3.5 h-100 d-flex flex-column justify-content-between border-start border-4 ${
                    activeTab === 'overdue'
                      ? 'border-danger'
                      : activeTab === 'dueToday'
                      ? 'border-primary'
                      : 'border-info'
                  }`}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-secondary bg-opacity-10 text-body border px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                        {rem.reminderType}
                      </span>
                      <span className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                        <Clock size={13} /> {formattedDate}
                      </span>
                    </div>

                    <h6 className={`brand-font fw-bold m-0 mb-1 ${rem.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
                      {rem.title}
                    </h6>

                    {rem.assignment && (
                      <div className="small text-muted mb-2">
                        Linked Task: <strong>{rem.assignment.title}</strong> ({rem.assignment.subject})
                      </div>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3">
                    <button
                      onClick={() => handleToggle(rem._id)}
                      className={`btn btn-sm ${
                        rem.isCompleted ? 'btn-success' : 'btn-outline-secondary'
                      } rounded-pill d-flex align-items-center gap-1.5`}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <Check size={14} /> {rem.isCompleted ? 'Completed' : 'Mark Done'}
                    </button>

                    <button
                      onClick={() => handleDelete(rem._id)}
                      className="btn btn-sm btn-light border text-danger rounded-circle p-2"
                      title="Delete Reminder"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Custom Reminder"
        size="md"
      >
        <form onSubmit={handleCreateReminder}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Reminder Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Submit CS201 Lab Report to Portal"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Due Date & Time *</label>
            <input
              type="datetime-local"
              className="form-control"
              value={newReminder.dueDate}
              onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Type</label>
            <select
              className="form-select"
              value={newReminder.reminderType}
              onChange={(e) => setNewReminder({ ...newReminder, reminderType: e.target.value })}
            >
              <option value="Deadline">Deadline</option>
              <option value="Study Session">Study Session</option>
              <option value="General">General</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary-custom"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-custom"
            >
              {submitting ? 'Creating...' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Categorizes notification alerts for assignment submission deadlines and custom study sessions."
        technologies={['React.js', 'Bootstrap 5', 'Axios', 'Express.js', 'MongoDB']}
        concepts={['Date Comparison', 'Time Bucket Filtering', 'Status Toggling']}
        logic="Bins reminders into Due Today, Due Tomorrow, Upcoming, and Overdue status buckets using date calculations."
      />
    </div>
  );
};

export default Reminders;
