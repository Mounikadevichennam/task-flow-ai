import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import Modal from '../components/Modal';
import PageDocumentation from '../components/PageDocumentation';

import {
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Info,
  Shield,
  Layers,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleExportData = async () => {
    try {
      const res = await API.get('/user/export');
      if (res.data.success) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `TaskFlow_AI_Backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        showToast('Application backup exported successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to export data', 'error');
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importJsonText) return;

    try {
      const parsed = JSON.parse(importJsonText);
      setSubmitting(true);
      const res = await API.post('/user/import', parsed);
      if (res.data.success) {
        showToast('Data imported successfully!', 'success');
        setIsImportModalOpen(false);
        setImportJsonText('');
      }
    } catch (err) {
      showToast('Invalid JSON backup file or format error.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetApplication = async () => {
    setSubmitting(true);
    try {
      const res = await API.post('/user/reset');
      if (res.data.success) {
        showToast('Application reset complete. All tasks and reminders cleared.', 'success');
        setIsResetModalOpen(false);
      }
    } catch (err) {
      showToast('Failed to reset application data', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            System Settings
          </h2>
          <p className="text-muted small m-0 mt-1">
            Theme preferences, data backups, and application configuration.
          </p>
        </div>
      </div>

      <div className="d-flex flex-column gap-4">
        {/* Appearance / Theme Card */}
        <div className="tf-card p-4">
          <h5 className="brand-font fw-bold mb-3 d-flex align-items-center gap-2">
            {theme === 'light' ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
            Appearance & Theme
          </h5>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="fw-semibold">Current Theme: <span className="text-capitalize text-primary">{theme}</span> Mode</div>
              <div className="text-muted small">Switch between crisp light mode and Notion/Linear dark mode.</div>
            </div>
            <button onClick={toggleTheme} className="btn btn-secondary-custom rounded-pill px-4">
              Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>

        {/* Data Backup & Portability Card */}
        <div className="tf-card p-4">
          <h5 className="brand-font fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
            <Shield size={20} /> Data Backup & Portability
          </h5>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="p-3 border rounded-3 bg-light-subtle h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">Export JSON Backup</h6>
                  <p className="text-muted small mb-3">Download a complete JSON snapshot of your assignments and reminders.</p>
                </div>
                <button onClick={handleExportData} className="btn btn-primary-custom w-100 justify-content-center">
                  <Download size={18} /> Export Backup
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-3 border rounded-3 bg-light-subtle h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">Import Data JSON</h6>
                  <p className="text-muted small mb-3">Restore your tasks and reminders from a previously exported backup file.</p>
                </div>
                <button onClick={() => setIsImportModalOpen(true)} className="btn btn-secondary-custom w-100 justify-content-center">
                  <Upload size={18} /> Import Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone: Reset Application */}
        <div className="tf-card p-4 border-danger border-opacity-50">
          <h5 className="brand-font fw-bold mb-2 text-danger d-flex align-items-center gap-2">
            <AlertTriangle size={20} /> Reset Application Data
          </h5>
          <p className="text-muted small mb-3">
            Wipe all assignments, custom reminders, and activity logs associated with your student account. This action cannot be undone.
          </p>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="btn btn-outline-danger rounded-3"
          >
            <RotateCcw size={18} /> Reset Application Data
          </button>
        </div>

        {/* About Section */}
        <div className="tf-card p-4">
          <h5 className="brand-font fw-bold mb-3 d-flex align-items-center gap-2">
            <Info size={20} className="text-info" /> About TaskFlow AI
          </h5>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="bg-primary text-white p-2.5 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
              <Layers size={24} />
            </div>
            <div>
              <h6 className="fw-bold brand-font m-0">TaskFlow AI v1.0.0</h6>
              <span className="small text-muted">College Assignment & Priority Tracker Engine</span>
            </div>
          </div>
          <p className="text-muted small m-0" style={{ lineHeight: 1.6 }}>
            Designed for higher education students to streamline deadline tracking, prioritize high-impact course tasks, generate automated study blocks, and maximize GPA performance.
          </p>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Reset Application Data"
        size="md"
      >
        <div className="text-center py-3">
          <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle d-inline-block mb-3">
            <AlertTriangle size={32} />
          </div>
          <h5 className="fw-bold mb-2">Wipe all application data?</h5>
          <p className="text-muted small">
            This will permanently erase all your assignments, deadlines, and reminders.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button onClick={() => setIsResetModalOpen(false)} className="btn btn-secondary-custom px-4">
              Cancel
            </button>
            <button
              onClick={handleResetApplication}
              disabled={submitting}
              className="btn btn-danger px-4 rounded-3 fw-semibold"
            >
              {submitting ? 'Resetting...' : 'Yes, Reset Data'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data Backup JSON"
        size="md"
      >
        <form onSubmit={handleImportSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Paste Backup JSON Content</label>
            <textarea
              className="form-control font-monospace small"
              rows="6"
              placeholder='{"assignments": [...], "reminders": [...]}'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={() => setIsImportModalOpen(false)} className="btn btn-secondary-custom">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary-custom">
              {submitting ? 'Importing...' : 'Restore Backup'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Configures application theme, handles JSON data backup export/import, and account data reset."
        technologies={['React.js', 'Bootstrap 5', 'Axios', 'Context API']}
        concepts={['Theme Management', 'File Serialization', 'State Context']}
        logic="Toggles Light/Dark mode custom CSS variables, serializes database documents into JSON backups, and clears account state."
      />
    </div>
  );
};

export default Settings;
