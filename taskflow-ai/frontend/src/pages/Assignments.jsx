import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import PageDocumentation from '../components/PageDocumentation';
import EmptyState from '../components/EmptyState';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';

// Format Date object to local datetime-local string (YYYY-MM-DDTHH:mm) without UTC conversion
const formatLocalISO = (d = new Date()) => {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return '';
  const pad = (num) => String(num).padStart(2, '0');
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
};

const Assignments = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    subject: '',
    description: '',
    deadline: '',
    priority: 'Medium',
    estimatedHours: 2,
    status: 'Pending',
    category: 'Homework',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (priorityFilter !== 'All') params.append('priority', priorityFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await API.get(`/assignments?${params.toString()}`);
      if (res.data.success) {
        setAssignments(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [searchTerm, priorityFilter, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Check if opened via query string e.g. /assignments?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();
      setSearchParams({});
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingId(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deadlineFormatted = formatLocalISO(tomorrow);

    setFormData({ ...initialForm, deadline: deadlineFormatted });
    setIsModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setEditingId(assignment._id);
    const deadlineFormatted = formatLocalISO(assignment.deadline);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description || '',
      deadline: deadlineFormatted,
      priority: assignment.priority,
      estimatedHours: assignment.estimatedHours || 1,
      status: assignment.status,
      category: assignment.category || 'Homework',
      notes: assignment.notes || ''
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (assignment) => {
    setDeletingAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.subject || !formData.deadline) {
      showToast('Please fill in Title, Subject, and Deadline', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        const res = await API.put(`/assignments/${editingId}`, formData);
        if (res.data.success) {
          showToast('Assignment updated successfully!', 'success');
          setIsModalOpen(false);
          fetchAssignments();
        }
      } else {
        const res = await API.post('/assignments', formData);
        if (res.data.success) {
          showToast('New assignment created with automated reminder!', 'success');
          setIsModalOpen(false);
          fetchAssignments();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAssignment) return;

    setSubmitting(true);
    try {
      const res = await API.delete(`/assignments/${deletingAssignment._id}`);
      if (res.data.success) {
        showToast('Assignment deleted successfully', 'success');
        setIsDeleteModalOpen(false);
        setDeletingAssignment(null);
        fetchAssignments();
      }
    } catch (err) {
      showToast('Failed to delete assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatusQuick = async (assignment) => {
    const nextStatus = assignment.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await API.put(`/assignments/${assignment._id}`, { status: nextStatus });
      if (res.data.success) {
        showToast(`Task marked as ${nextStatus}`, 'success');
        fetchAssignments();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom gap-3">
        <div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            Assignments & Tasks
          </h2>
          <p className="text-muted small m-0 mt-1">
            Manage deadlines, priorities, and study hours with full tracking.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary-custom rounded-3 shadow-sm">
          <Plus size={18} /> Add New Assignment
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="tf-card p-3.5 mb-4">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><Search size={18} /></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by title, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Homework">Homework</option>
              <option value="Project">Project</option>
              <option value="Lab">Lab</option>
              <option value="Exam Prep">Exam Prep</option>
              <option value="Quiz">Quiz</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-6 col-md-2 d-flex gap-1">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="deadline">Sort Deadline</option>
              <option value="priority">Sort Priority</option>
              <option value="title">Sort Title</option>
              <option value="createdAt">Sort Created</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-outline-secondary p-2 rounded-3"
              title={`Order: ${sortOrder.toUpperCase()}`}
            >
              <ArrowUpDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Cards List */}
      {loading ? (
        <LoadingSpinner text="Loading assignments list..." />
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No assignments found"
          message="No tasks match your search or filter parameters. Create your first assignment to get started."
          actionText="Create New Assignment"
          onAction={openAddModal}
        />
      ) : (
        <div className="row g-3">
          {assignments.map((assignment) => {
            const isOverdue =
              assignment.status !== 'Completed' && new Date(assignment.deadline) < new Date();
            const formattedDeadline = new Date(assignment.deadline).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });

            return (
              <div key={assignment._id} className="col-12 col-md-6 col-xl-4">
                <div
                  className={`tf-card h-100 p-4 d-flex flex-column justify-content-between position-relative ${
                    isOverdue ? 'border-danger border-opacity-50' : ''
                  }`}
                >
                  <div>
                    {/* Top Row: Subject & Badges */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2.5 py-1 rounded-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
                        {assignment.subject}
                      </span>
                      <div className="d-flex align-items-center gap-1.5">
                        <span className={`badge badge-priority-${assignment.priority.toLowerCase()}`}>
                          {assignment.priority}
                        </span>
                        {isOverdue && (
                          <span className="badge bg-danger text-white rounded-pill px-2 py-0.5" style={{ fontSize: '0.68rem' }}>
                            OVERDUE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h5
                      className={`brand-font fw-bold mb-1 ${
                        assignment.status === 'Completed' ? 'text-decoration-line-through text-muted' : ''
                      }`}
                    >
                      {assignment.title}
                    </h5>
                    {assignment.description && (
                      <p className="text-muted small mb-3 text-truncate-2" style={{ fontSize: '0.85rem' }}>
                        {assignment.description}
                      </p>
                    )}

                    {/* Details Pill Grid */}
                    <div className="bg-light-subtle rounded-3 p-2.5 mb-3 border small d-flex flex-column gap-1.5">
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Calendar size={14} className={isOverdue ? 'text-danger' : 'text-primary'} />
                        <span className={isOverdue ? 'text-danger fw-semibold' : ''}>
                          Due: {formattedDeadline}
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between text-muted">
                        <span className="d-flex align-items-center gap-1.5">
                          <Clock size={14} /> Est: {assignment.estimatedHours} hrs
                        </span>
                        <span className="badge bg-secondary bg-opacity-25 text-body px-2 py-0.5">
                          {assignment.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
                    <button
                      onClick={() => toggleStatusQuick(assignment)}
                      className={`btn btn-sm ${
                        assignment.status === 'Completed'
                          ? 'btn-success text-white'
                          : 'btn-outline-secondary'
                      } rounded-pill d-flex align-items-center gap-1.5`}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <CheckCircle2 size={15} />
                      <span>{assignment.status}</span>
                    </button>

                    <div className="d-flex align-items-center gap-1">
                      <button
                        onClick={() => openEditModal(assignment)}
                        className="btn btn-sm btn-light border rounded-circle p-2 text-muted"
                        title="Edit Assignment"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(assignment)}
                        className="btn btn-sm btn-light border border-danger-subtle text-danger rounded-circle p-2"
                        title="Delete Assignment"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Assignment' : 'Create New Assignment'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="row g-3">
            {/* Title */}
            <div className="col-12 col-md-8">
              <label className="form-label small fw-semibold">Assignment Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Data Structures Binary Trees Project"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Subject */}
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Subject / Course *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CS201"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label small fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Detailed instructions or submission link..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            {/* Deadline */}
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Deadline Date & Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            {/* Priority */}
            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold">Priority *</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Estimated Hours */}
            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold">Est. Hours *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                className="form-control"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="col-6 col-md-4">
              <label className="form-label small fw-semibold">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Homework">Homework</option>
                <option value="Project">Project</option>
                <option value="Lab">Lab</option>
                <option value="Exam Prep">Exam Prep</option>
                <option value="Quiz">Quiz</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-6 col-md-4">
              <label className="form-label small fw-semibold">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Notes */}
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Additional Notes</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Chapter 4 reference"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-end gap-2 mt-4 pt-3 border-top">
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
              {submitting ? 'Saving...' : editingId ? 'Update Assignment' : 'Save Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Assignment"
        size="md"
      >
        <div className="text-center py-3">
          <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle d-inline-block mb-3">
            <AlertTriangle size={32} />
          </div>
          <h5 className="fw-bold mb-2">Are you sure you want to delete this assignment?</h5>
          <p className="text-muted small">
            "{deletingAssignment?.title}" for subject <strong>{deletingAssignment?.subject}</strong> will be permanently removed along with its associated reminders.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary-custom px-4"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="btn btn-danger px-4 rounded-3 fw-semibold"
            >
              {submitting ? 'Deleting...' : 'Yes, Delete Assignment'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Manage assignment records using full CRUD operations."
        technologies={['React.js', 'Bootstrap 5', 'Axios', 'Express.js', 'MongoDB']}
        concepts={['CRUD Operations', 'Form Validation', 'Search & Filter', 'Sorting']}
        logic="Create, Read, Update, Delete assignments with multi-attribute filtering and deadline sorting."
      />
    </div>
  );
};

export default Assignments;
