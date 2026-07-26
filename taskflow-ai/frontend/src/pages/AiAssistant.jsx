import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PageDocumentation from '../components/PageDocumentation';

import {
  Sparkles,
  Calendar,
  Target,
  BarChart2,
  Award,
  ListOrdered,
  Quote,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock
} from 'lucide-react';

const AiAssistant = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');

  // AI State
  const [recommended, setRecommended] = useState(null);
  const [productivityScore, setProductivityScore] = useState(null);
  const [priorityAnalysis, setPriorityAnalysis] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [weeklyInsights, setWeeklyInsights] = useState(null);
  const [dailyMotivation, setDailyMotivation] = useState(null);
  const [taskBreakdown, setTaskBreakdown] = useState(null);
  const [customBreakdownTitle, setCustomBreakdownTitle] = useState('');
  const [breakdownLoading, setBreakdownLoading] = useState(false);

  const fetchAiData = async () => {
    try {
      setLoading(true);
      const [
        recRes,
        scoreRes,
        priorityRes,
        plannerRes,
        insightsRes,
        motivationRes
      ] = await Promise.all([
        API.get('/ai/recommended-next'),
        API.get('/ai/productivity-score'),
        API.get('/ai/priority-analyzer'),
        API.get('/ai/study-planner'),
        API.get('/ai/weekly-insights'),
        API.get('/ai/daily-motivation')
      ]);

      if (recRes.data.success) setRecommended(recRes.data.data);
      if (scoreRes.data.success) setProductivityScore(scoreRes.data.data);
      if (priorityRes.data.success) setPriorityAnalysis(priorityRes.data.data);
      if (plannerRes.data.success) setStudyPlan(plannerRes.data.data);
      if (insightsRes.data.success) setWeeklyInsights(insightsRes.data.data);
      if (motivationRes.data.success) setDailyMotivation(motivationRes.data.data);
    } catch (err) {
      showToast('Failed to load AI Assistant data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiData();
  }, []);

  const handleGenerateBreakdown = async (e) => {
    e.preventDefault();
    if (!customBreakdownTitle) return;

    setBreakdownLoading(true);
    try {
      const res = await API.post('/ai/task-breakdown', { customTitle: customBreakdownTitle });
      if (res.data.success) {
        setTaskBreakdown(res.data.data);
        showToast('Task breakdown generated!', 'success');
      }
    } catch (err) {
      showToast('Failed to generate breakdown', 'error');
    } finally {
      setBreakdownLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Consulting TaskFlow AI engine..." />;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom gap-3">
        <div>
          <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill mb-2 d-inline-flex align-items-center gap-1.5">
            <Sparkles size={15} /> Rule-Based Academic Intelligence
          </div>
          <h2 className="brand-font fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            TaskFlow AI Assistant
          </h2>
          <p className="text-muted small m-0 mt-1">
            Intelligent priority calculations, automated study schedule generation, and milestone breakdowns.
          </p>
        </div>

        {/* Daily Motivation Banner */}
        {dailyMotivation && (
          <div className="tf-card p-3 bg-primary text-white border-0 shadow-sm rounded-3" style={{ maxWidth: '420px' }}>
            <div className="d-flex align-items-center gap-2 mb-1 opacity-90 small">
              <Quote size={15} /> <span className="fw-semibold">Daily Academic Motivation</span>
            </div>
            <p className="small mb-1 fst-italic">"{dailyMotivation.quote}"</p>
            <div className="text-end small opacity-75" style={{ fontSize: '0.72rem' }}>— {dailyMotivation.author}</div>
          </div>
        )}
      </div>

      {/* Navigation Pills */}
      <ul className="nav nav-pills gap-2 mb-4 border-bottom pb-3">
        {[
          { key: 'recommended', label: 'Recommended Task', icon: Zap },
          { key: 'score', label: 'Productivity Score', icon: Award },
          { key: 'priority', label: 'Priority Analyzer', icon: Target },
          { key: 'planner', label: 'Study Planner', icon: Calendar },
          { key: 'insights', label: 'Weekly Insights', icon: BarChart2 },
          { key: 'breakdown', label: 'Task Breakdown', icon: ListOrdered }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <li className="nav-item" key={tab.key}>
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`nav-link rounded-pill d-flex align-items-center gap-2 px-3 py-2 ${
                  activeTab === tab.key ? 'active bg-primary text-white fw-semibold' : 'text-body bg-light'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Tab 1: Recommended Next Task */}
      {activeTab === 'recommended' && (
        <div className="animate-fade-in">
          <div className="tf-card p-4 p-md-5 mb-4 border-start border-4 border-primary">
            <div className="d-flex align-items-center gap-2 text-primary fw-bold mb-2">
              <Zap size={22} />
              <span>AI #1 HIGHEST IMPACT TASK TO DO RIGHT NOW</span>
            </div>

            {recommended && recommended.task ? (
              <div>
                <h3 className="brand-font fw-bold mb-2">{recommended.task.title}</h3>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <span className="badge bg-primary px-3 py-1.5 rounded-pill">{recommended.task.subject}</span>
                  <span className={`badge badge-priority-${recommended.task.priority.toLowerCase()} px-3 py-1.5`}>
                    {recommended.task.priority} Priority
                  </span>
                  <span className="badge bg-secondary bg-opacity-25 text-body px-3 py-1.5 rounded-pill">
                    Est: {recommended.task.estimatedHours} Hours
                  </span>
                  <span className="badge bg-warning bg-opacity-25 text-warning-emphasis px-3 py-1.5 rounded-pill">
                    Due: {new Date(recommended.task.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-3 bg-light-subtle rounded-3 border mb-4">
                  <h6 className="fw-bold mb-1 text-main">Why this task was selected by TaskFlow AI:</h6>
                  <p className="text-muted small m-0">{recommended.reason}</p>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 d-flex align-items-center gap-2">
                    <CheckCircle2 size={20} />
                    <span className="fw-semibold small">{recommended.suggestedAction}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <CheckCircle2 size={48} className="text-success opacity-50 mb-2" />
                <h5 className="brand-font fw-bold">All caught up!</h5>
                <p className="small m-0">You have zero pending tasks in your queue. Great job maintaining an empty backlog!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Productivity Score */}
      {activeTab === 'score' && productivityScore && (
        <div className="animate-fade-in">
          <div className="row g-4">
            <div className="col-md-5 col-lg-4">
              <div className="tf-card p-4 text-center h-100 d-flex flex-column justify-content-center align-items-center">
                <span className="small text-muted fw-semibold text-uppercase mb-2">Overall Productivity Score</span>
                <div
                  className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold brand-font my-3"
                  style={{ width: '120px', height: '120px', fontSize: '2.5rem', boxShadow: '0 8px 24px rgba(37,99,235,0.2)' }}
                >
                  {productivityScore.score}
                </div>
                <div className="badge bg-success px-3 py-1 rounded-pill mb-2" style={{ fontSize: '1rem' }}>
                  Grade: {productivityScore.grade}
                </div>
                <p className="small text-muted m-0">{productivityScore.summary}</p>
              </div>
            </div>

            <div className="col-md-7 col-lg-8">
              <div className="tf-card p-4 h-100 d-flex flex-column justify-content-between">
                <h5 className="brand-font fw-bold mb-3">Score Metrics Breakdown</h5>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 border rounded-3 bg-light-subtle">
                      <span className="small text-muted">Total Assignments</span>
                      <h4 className="fw-bold m-0 mt-1">{productivityScore.details?.total}</h4>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 border rounded-3 bg-light-subtle">
                      <span className="small text-muted">Completed</span>
                      <h4 className="fw-bold m-0 mt-1 text-success">{productivityScore.details?.completed}</h4>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 border rounded-3 bg-light-subtle">
                      <span className="small text-muted">Pending</span>
                      <h4 className="fw-bold m-0 mt-1 text-warning">{productivityScore.details?.pending}</h4>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 border rounded-3 bg-light-subtle">
                      <span className="small text-muted">Overdue Penalty</span>
                      <h4 className="fw-bold m-0 mt-1 text-danger">{productivityScore.details?.overdue}</h4>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between small fw-semibold mb-1">
                    <span>Completion Rate</span>
                    <span>{productivityScore.details?.completionRate}%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${productivityScore.details?.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Priority Analyzer */}
      {activeTab === 'priority' && (
        <div className="animate-fade-in">
          <div className="tf-card p-4 mb-4">
            <h5 className="brand-font fw-bold mb-1">Intelligent Priority Analyzer</h5>
            <p className="text-muted small mb-3">
              TaskFlow AI evaluates remaining hours, task weight, and estimated study duration to score urgency.
            </p>

            {priorityAnalysis.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p className="small m-0">No active pending tasks to analyze.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="table-light small text-uppercase">
                      <th>Task / Subject</th>
                      <th>Priority</th>
                      <th>Hours Left</th>
                      <th>Urgency Score</th>
                      <th>Risk Level</th>
                      <th>AI Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priorityAnalysis.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="fw-bold">{item.title}</div>
                          <span className="small text-muted">{item.subject}</span>
                        </td>
                        <td>
                          <span className={`badge badge-priority-${item.priority.toLowerCase()}`}>
                            {item.priority}
                          </span>
                        </td>
                        <td>
                          <span className={item.isOverdue ? 'text-danger fw-bold' : 'text-body'}>
                            {item.isOverdue ? `${Math.abs(item.hoursLeft)}h Overdue` : `${item.hoursLeft} hrs`}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold">{item.urgencyScore}</span>
                            <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '60px' }}>
                              <div
                                className={`progress-bar ${
                                  item.riskLevel === 'Critical' ? 'bg-danger' : item.riskLevel === 'High' ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{ width: `${Math.min(100, item.urgencyScore)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.riskLevel === 'Critical'
                                ? 'bg-danger text-white'
                                : item.riskLevel === 'High'
                                ? 'bg-warning text-dark'
                                : 'bg-success text-white'
                            } px-2.5 py-1`}
                          >
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="small text-muted" style={{ maxWidth: '250px' }}>
                          {item.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Study Planner */}
      {activeTab === 'planner' && (
        <div className="animate-fade-in">
          <div className="row g-3">
            {studyPlan.map((day) => (
              <div key={day.date} className="col-12 col-md-6 col-lg-4">
                <div className={`tf-card p-3.5 h-100 ${day.isToday ? 'border-primary border-2 shadow-sm' : ''}`}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="brand-font fw-bold m-0 d-flex align-items-center gap-2">
                      {day.dayName}
                      {day.isToday && <span className="badge bg-primary rounded-pill px-2">Today</span>}
                    </h6>
                    <span className="small text-muted">{day.totalStudyHours} hrs scheduled</span>
                  </div>

                  {day.sessions.length === 0 ? (
                    <div className="py-3 text-center text-muted small">Free study day</div>
                  ) : (
                    <div className="d-flex flex-column gap-2 mt-2">
                      {day.sessions.map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-3 border bg-light-subtle small">
                          <div className="d-flex align-items-center justify-content-between text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                            <span className="d-flex align-items-center gap-1"><Clock size={12} /> {s.timeSlot}</span>
                            <span className={`badge badge-priority-${s.priority.toLowerCase()}`}>{s.priority}</span>
                          </div>
                          <div className="fw-semibold text-main">{s.taskTitle}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{s.subject} ({s.recommendedHours} hrs block)</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Weekly Insights */}
      {activeTab === 'insights' && weeklyInsights && (
        <div className="animate-fade-in">
          <div className="tf-card p-4">
            <h5 className="brand-font fw-bold mb-3">AI Weekly Productivity Insights</h5>
            <div className="d-flex flex-column gap-3">
              {weeklyInsights.summary.map((text, idx) => (
                <div key={idx} className="p-3 rounded-3 border bg-light-subtle d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle flex-shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="m-0 fw-medium text-main" style={{ fontSize: '0.925rem' }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Task Breakdown */}
      {activeTab === 'breakdown' && (
        <div className="animate-fade-in">
          <div className="tf-card p-4 mb-4">
            <h5 className="brand-font fw-bold mb-2">AI Task Step-by-Step Breakdown</h5>
            <p className="text-muted small mb-4">
              Enter any assignment title or project to generate an actionable 5-step milestone roadmap.
            </p>

            <form onSubmit={handleGenerateBreakdown} className="row g-2 mb-4">
              <div className="col-12 col-md-9">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="e.g. Operating Systems File System Implementation Project"
                  value={customBreakdownTitle}
                  onChange={(e) => setCustomBreakdownTitle(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <button
                  type="submit"
                  disabled={breakdownLoading}
                  className="btn btn-primary-custom btn-lg w-100 justify-content-center"
                >
                  {breakdownLoading ? 'Generating...' : <>Generate Steps <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>

            {taskBreakdown && (
              <div className="border rounded-3 p-4 bg-light-subtle">
                <h5 className="brand-font fw-bold text-primary mb-1">{taskBreakdown.title}</h5>
                <span className="small text-muted d-block mb-3">Total Estimated Time: {taskBreakdown.totalEstimatedHours} hours</span>

                <div className="d-flex flex-column gap-3">
                  {taskBreakdown.steps.map((step) => (
                    <div key={step.step} className="p-3 bg-white rounded-3 border d-flex align-items-start gap-3 shadow-sm">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{ width: '32px', height: '32px' }}
                      >
                        {step.step}
                      </div>
                      <div>
                        <h6 className="fw-bold m-0">{step.title}</h6>
                        <p className="text-muted small m-0 mt-1">{step.description}</p>
                        <span className="badge bg-secondary bg-opacity-25 text-body px-2 py-0.5 mt-2" style={{ fontSize: '0.7rem' }}>
                          ~{step.estimatedMinutes} mins session
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standardized 4-Card Documentation */}
      <PageDocumentation
        purpose="Provides study planning, productivity insights and intelligent task recommendations."
        technologies={['React.js', 'Bootstrap 5', 'JavaScript', 'Express.js']}
        concepts={['Rule-Based Logic', 'Conditional Rendering', 'Array Processing']}
        logic="Analyses assignments based on priority, deadlines and estimated study hours."
      />
    </div>
  );
};

export default AiAssistant;
