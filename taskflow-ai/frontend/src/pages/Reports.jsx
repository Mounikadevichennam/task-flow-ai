import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PageDocumentation from '../components/PageDocumentation';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, PolarArea } from 'react-chartjs-2';

import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get('/user/reports');
      if (res.data.success) {
        setReportsData(res.data.data);
      }
    } catch (err) {
      showToast('Failed to fetch reports data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!reportsData || !reportsData.rawAssignments || reportsData.rawAssignments.length === 0) {
      showToast('No assignment data available to export.', 'warning');
      return;
    }

    const headers = ['Title', 'Subject', 'Category', 'Priority', 'Status', 'Estimated Hours', 'Deadline', 'Completed At', 'Notes'];
    const csvRows = [headers.join(',')];

    reportsData.rawAssignments.forEach((a) => {
      const row = [
        `"${a.title.replace(/"/g, '""')}"`,
        `"${a.subject.replace(/"/g, '""')}"`,
        `"${a.category || ''}"`,
        `"${a.priority}"`,
        `"${a.status}"`,
        a.estimatedHours || 1,
        `"${new Date(a.deadline).toLocaleString()}"`,
        `"${a.completedAt ? new Date(a.completedAt).toLocaleString() : ''}"`,
        `"${(a.notes || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TaskFlow_AI_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV Report exported successfully!', 'success');
  };

  if (loading) return <LoadingSpinner text="Generating reports analytics..." />;

  const { summary, priorityDistribution, subjectDistribution, weeklyProgress, monthlyProgress } = reportsData || {};

  // Charts configs
  const weeklyChartConfig = {
    labels: weeklyProgress?.map((w) => w.label) || [],
    datasets: [
      {
        label: 'Assignments Created',
        data: weeklyProgress?.map((w) => w.created) || [],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: '#2563eb',
        borderWidth: 2
      },
      {
        label: 'Assignments Completed',
        data: weeklyProgress?.map((w) => w.completed) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderWidth: 2
      }
    ]
  };

  const monthlyChartConfig = {
    labels: monthlyProgress?.map((m) => m.label) || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Monthly Completed Velocity',
        data: monthlyProgress?.map((m) => m.completed) || [2, 4, 3, 5],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const priorityChartConfig = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        data: [priorityDistribution?.High || 0, priorityDistribution?.Medium || 0, priorityDistribution?.Low || 0],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
      }
    ]
  };

  const subjectLabels = Object.keys(subjectDistribution || {});
  const subjectValues = Object.values(subjectDistribution || {});

  const subjectChartConfig = {
    labels: subjectLabels.length > 0 ? subjectLabels : ['CS101', 'MATH202', 'PHYS105'],
    datasets: [
      {
        data: subjectValues.length > 0 ? subjectValues : [3, 2, 4],
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)'
        ]
      }
    ]
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom gap-3">
        <div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            Academic Reports & Analytics
          </h2>
          <p className="text-muted small m-0 mt-1">
            Comprehensive workload analytics, completion velocity, and subject distribution.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-primary-custom rounded-3 shadow-sm">
          <Download size={18} /> Export CSV Report
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tf-card p-3.5 border-start border-4 border-success">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted fw-semibold">Completed Tasks</span>
                <h3 className="brand-font fw-bold m-0 text-success">{summary?.completed || 0}</h3>
              </div>
              <div className="bg-success bg-opacity-10 text-success p-2.5 rounded-3">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tf-card p-3.5 border-start border-4 border-warning">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted fw-semibold">Pending Queue</span>
                <h3 className="brand-font fw-bold m-0 text-warning">{summary?.pending || 0}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning p-2.5 rounded-3">
                <Clock size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tf-card p-3.5 border-start border-4 border-danger">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted fw-semibold">Overdue Tasks</span>
                <h3 className="brand-font fw-bold m-0 text-danger">{summary?.overdue || 0}</h3>
              </div>
              <div className="bg-danger bg-opacity-10 text-danger p-2.5 rounded-3">
                <AlertCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tf-card p-3.5 border-start border-4 border-primary">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted fw-semibold">Completion %</span>
                <h3 className="brand-font fw-bold m-0 text-primary">{summary?.completionPercentage || 0}%</h3>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-2.5 rounded-3">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        {/* Weekly Progress Chart */}
        <div className="col-lg-6">
          <div className="tf-card p-4 h-100">
            <h5 className="brand-font fw-bold mb-1">Weekly Velocity</h5>
            <span className="small text-muted d-block mb-3">Tasks created vs completed over last 7 days</span>
            <div style={{ height: '260px' }}>
              <Bar
                data={weeklyChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }}
              />
            </div>
          </div>
        </div>

        {/* Monthly Progress Line Chart */}
        <div className="col-lg-6">
          <div className="tf-card p-4 h-100">
            <h5 className="brand-font fw-bold mb-1">Monthly Progression</h5>
            <span className="small text-muted d-block mb-3">Cumulative task completion trend</span>
            <div style={{ height: '260px' }}>
              <Line
                data={monthlyChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Priority Distribution Doughnut */}
        <div className="col-md-6 col-lg-6">
          <div className="tf-card p-4 h-100">
            <h5 className="brand-font fw-bold mb-1">Priority Distribution</h5>
            <span className="small text-muted d-block mb-3">Tasks categorized by urgency</span>
            <div className="d-flex justify-content-center" style={{ height: '250px' }}>
              <Doughnut
                data={priorityChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>
        </div>

        {/* Subject Distribution Polar Area */}
        <div className="col-md-6 col-lg-6">
          <div className="tf-card p-4 h-100">
            <h5 className="brand-font fw-bold mb-1">Subject Distribution</h5>
            <span className="small text-muted d-block mb-3">Academic load divided per subject</span>
            <div className="d-flex justify-content-center" style={{ height: '250px' }}>
              <PolarArea
                data={subjectChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Visualizes academic workload analytics, completion velocity, and subject distribution."
        technologies={['React.js', 'Chart.js', 'React-Chartjs-2', 'Bootstrap 5']}
        concepts={['Data Visualization', 'Data Aggregation', 'File Generation (CSV)']}
        logic="Aggregates weekly velocity metrics and subject load percentages to render responsive charts and export CSV reports."
      />
    </div>
  );
};

export default Reports;
