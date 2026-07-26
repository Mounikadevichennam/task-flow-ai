import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageDocumentation from '../components/PageDocumentation';
import EmptyState from '../components/EmptyState';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
  Sparkles,
  Calendar,
  ArrowRight,
  Activity
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    completionPercentage: 0
  });
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [activities, setActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState({ labels: [], created: [], completed: [] });
  const [priorityData, setPriorityData] = useState({ High: 0, Medium: 0, Low: 0 });

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, assignmentsRes, activityRes] = await Promise.all([
        API.get('/user/reports'),
        API.get('/assignments?sort=deadline&order=asc'),
        API.get('/user/activity')
      ]);

      if (reportsRes.data.success) {
        const { summary, weeklyProgress, priorityDistribution } = reportsRes.data.data;
        setStats(summary);
        setPriorityData(priorityDistribution || { High: 0, Medium: 0, Low: 0 });

        if (weeklyProgress) {
          setWeeklyData({
            labels: weeklyProgress.map((w) => w.label),
            created: weeklyProgress.map((w) => w.created),
            completed: weeklyProgress.map((w) => w.completed)
          });
        }
      }

      if (assignmentsRes.data.success) {
        const all = assignmentsRes.data.data;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // Filter today's tasks
        const today = all.filter((a) => {
          const d = new Date(a.deadline);
          return d >= startOfToday && d <= endOfToday;
        });

        // Filter upcoming tasks
        const upcoming = all.filter((a) => {
          const d = new Date(a.deadline);
          return d > endOfToday && a.status !== 'Completed';
        }).slice(0, 5);

        setTodayTasks(today);
        setUpcomingDeadlines(upcoming);
      }

      if (activityRes.data.success) {
        setActivities(activityRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } fiud: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching your academic dashboard..." />;
  }

  // Chart configuration
  const barChartConfig = {
    labels: weeklyData.labels.length > 0 ? weeklyData.labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Assignments Created',
        data: weeklyData.created.length > 0 ? weeklyData.created : [1, 2, 1, 3, 2, 0, 1],
        backgroundColor: 'rgba(37, 99, 235, 0.65)',
        borderRadius: 6
      },
      {
        label: 'Assignments Completed',
        data: weeklyData.completed.length > 0 ? weeklyData.completed : [1, 1, 2, 2, 1, 1, 2],
        backgroundColor: 'rgba(16, 185, 129, 0.65)',
        borderRadius: 6
      }
    ]
  };

  const doughnutChartConfig = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        data: [priorityData.High || 0, priorityData.Medium || 0, priorityData.Low || 0],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom gap-3">
        <div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            Welcome, {user?.fullName || 'Student'}! 👋
          </h2>
          <p className="text-muted small m-0 mt-1 d-flex align-items-center gap-2">
            <Calendar size={15} /> {currentDateStr} &bull; {user?.branch || 'CS'} (Semester {user?.semester || '1'})
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => navigate('/assignments?action=new')}
            className="btn btn-primary-custom rounded-3 shadow-sm"
          >
            <Plus size={18} /> Add Assignment
          </button>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="btn btn-secondary-custom rounded-3"
          >
            <Sparkles size={18} className="text-primary" /> AI Insights
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="row g-3 mb-4">
        {/* Total Assignments */}
        <div className="col-12 col-sm-6 col-xl-2.4 col-lg-3">
          <div className="tf-card h-100 p-3.5 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Total Tasks</span>
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                <BookOpen size={18} />
              </div>
            </div>
            <div>
              <h3 className="brand-font fw-bold m-0">{stats.total}</h3>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>All assignments</span>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="col-12 col-sm-6 col-xl-2.4 col-lg-3">
          <div className="tf-card h-100 p-3.5 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Pending</span>
              <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3">
                <Clock size={18} />
              </div>
            </div>
            <div>
              <h3 className="brand-font fw-bold m-0 text-warning">{stats.pending}</h3>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>In queue & in progress</span>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="col-12 col-sm-6 col-xl-2.4 col-lg-3">
          <div className="tf-card h-100 p-3.5 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Completed</span>
              <div className="bg-success bg-opacity-10 text-success p-2 rounded-3">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div>
              <h3 className="brand-font fw-bold m-0 text-success">{stats.completed}</h3>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Submitted & finished</span>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="col-12 col-sm-6 col-xl-2.4 col-lg-3">
          <div className="tf-card h-100 p-3.5 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Overdue</span>
              <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-3">
                <AlertCircle size={18} />
              </div>
            </div>
            <div>
              <h3 className="brand-font fw-bold m-0 text-danger">{stats.overdue}</h3>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Requires urgent action</span>
            </div>
          </div>
        </div>

        {/* Completion % */}
        <div className="col-12 col-sm-6 col-xl-2.4 col-lg-3">
          <div className="tf-card h-100 p-3.5 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-semibold">Completion %</span>
              <div className="bg-info bg-opacity-10 text-info p-2 rounded-3">
                <TrendingUp size={18} />
              </div>
            </div>
            <div>
              <h3 className="brand-font fw-bold m-0 text-primary">{stats.completionPercentage}%</h3>
              <div className="progress mt-2" style={{ height: '6px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${stats.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Tasks Layout */}
      <div className="row g-4 mb-4">
        {/* Weekly Progress Chart */}
        <div className="col-lg-8">
          <div className="tf-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="brand-font fw-bold m-0">Weekly Workload & Velocity</h5>
                <span className="small text-muted">Created vs completed assignments over the last 7 days</span>
              </div>
              <Link to="/reports" className="btn btn-sm btn-link text-primary text-decoration-none small">
                View Full Reports &rarr;
              </Link>
            </div>
            <div style={{ height: '280px' }}>
              <Bar
                data={barChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }}
              />
            </div>
          </div>
        </div>

        {/* Priority Distribution Chart */}
        <div className="col-lg-4">
          <div className="tf-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="brand-font fw-bold m-0 mb-1">Priority Breakdown</h5>
              <span className="small text-muted">Task distribution by urgency</span>
            </div>
            <div className="my-auto py-3 d-flex justify-content-center" style={{ height: '200px' }}>
              <Doughnut
                data={doughnutChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
            <div className="d-flex justify-content-around text-center border-top pt-3 small">
              <div>
                <span className="fw-bold text-danger">{priorityData.High || 0}</span>
                <div className="text-muted">High</div>
              </div>
              <div>
                <span className="fw-bold text-warning">{priorityData.Medium || 0}</span>
                <div className="text-muted">Medium</div>
              </div>
              <div>
                <span className="fw-bold text-success">{priorityData.Low || 0}</span>
                <div className="text-muted">Low</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks & Activity Row */}
      <div className="row g-4">
        {/* Today's Tasks */}
        <div className="col-md-6 col-lg-4">
          <div className="tf-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="brand-font fw-bold m-0">Due Today</h5>
              <span className="badge bg-primary rounded-pill px-2.5">{todayTasks.length}</span>
            </div>

            {todayTasks.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No tasks due today"
                message="You have zero assignments due today. Enjoy your day or work ahead!"
                actionText="Add New Task"
                onAction={() => navigate('/assignments?action=new')}
              />
            ) : (
              <div className="d-flex flex-column gap-2">
                {todayTasks.map((t) => (
                  <div key={t._id} className="p-2.5 rounded-3 border bg-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-semibold small">{t.title}</div>
                      <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{t.subject}</div>
                    </div>
                    <span className={`badge badge-priority-${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div className="col-md-6 col-lg-4">
          <div className="tf-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="brand-font fw-bold m-0">Upcoming Deadlines</h5>
              <Link to="/assignments" className="small text-primary text-decoration-none">View All</Link>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No upcoming pending tasks"
                message="Your task queue is empty for upcoming days."
                actionText="Add Assignment"
                onAction={() => navigate('/assignments?action=new')}
              />
            ) : (
              <div className="d-flex flex-column gap-2">
                {upcomingDeadlines.map((t) => (
                  <div key={t._id} className="p-2.5 rounded-3 border bg-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-semibold small">{t.title}</div>
                      <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                        Due {new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <span className={`badge badge-priority-${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-md-12 col-lg-4">
          <div className="tf-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="brand-font fw-bold m-0">Recent Activity</h5>
              <Activity size={18} className="text-muted" />
            </div>

            {activities.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No recent activity"
                message="Your recent assignment actions will appear here."
              />
            ) : (
              <div className="d-flex flex-column gap-2.5">
                {activities.map((log) => (
                  <div key={log._id} className="d-flex align-items-start gap-2.5 small">
                    <div className="bg-primary bg-opacity-10 text-primary p-1.5 rounded-circle flex-shrink-0 mt-0.5">
                      <Activity size={12} />
                    </div>
                    <div>
                      <div className="fw-medium">{log.action}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>{log.details}</div>
                      <div className="text-muted opacity-75" style={{ fontSize: '0.68rem' }}>
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Shows overall assignment statistics, completion progress, upcoming deadlines, and recent activity logs."
        technologies={['React.js', 'Bootstrap 5', 'Axios', 'Chart.js']}
        concepts={['State Management', 'API Integration', 'Conditional Rendering']}
        logic="Calculates pending/completed assignments, completion percentage, priority breakdown, and daily velocity analytics."
      />
    </div>
  );
};

export default Dashboard;
