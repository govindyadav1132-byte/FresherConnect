import { useState, useEffect } from 'react'
import './App.css'

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-sample-1',
    title: 'Frontend React Developer Intern',
    company: 'TechNovus Solutions',
    type: 'Internship',
    location: 'Mumbai / Remote',
    mode: 'Hybrid',
    stipend: '₹18,000 / month',
    readinessScore: 85,
    status: 'Interview',
    appliedDate: '2026-09-28T10:30:00.000Z',
    notes: 'Technical round scheduled for next Tuesday. Focus on React hooks and JavaScript closures.',
  },
  {
    id: 'app-sample-2',
    title: 'Python Backend & API Intern',
    company: 'CloudMatrix Labs',
    type: 'Internship',
    location: 'Bengaluru / Remote',
    mode: 'Remote',
    stipend: '₹22,000 / month',
    readinessScore: 75,
    status: 'Under Review',
    appliedDate: '2026-09-30T14:15:00.000Z',
    notes: 'Application submitted through portal. Resume match score 75%.',
  },
  {
    id: 'app-sample-3',
    title: 'Junior Software Engineer (Fresher)',
    company: 'Zensar Tech Solutions',
    type: 'Fresher Job',
    location: 'Mumbai',
    mode: 'Hybrid',
    stipend: '₹4.5 LPA',
    readinessScore: 70,
    status: 'Applied',
    appliedDate: '2026-10-01T09:00:00.000Z',
    notes: 'Applied for 2026 graduate intake program.',
  },
]

function ApplicationTracker({ user, onBack, onNavigateToOpportunities }) {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_applications_list')
      return saved ? JSON.parse(saved) : DEFAULT_APPLICATIONS
    } catch {
      return DEFAULT_APPLICATIONS
    }
  })

  const [activeFilter, setActiveFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newApp, setNewApp] = useState({
    title: '',
    company: '',
    type: 'Internship',
    location: '',
    mode: 'Remote',
    stipend: '',
    readinessScore: 80,
    status: 'Applied',
    notes: '',
  })

  useEffect(() => {
    localStorage.setItem('fc_applications_list', JSON.stringify(applications))
  }, [applications])

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    )
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this tracked application?')) {
      setApplications((prev) => prev.filter((app) => app.id !== id))
    }
  }

  const handleCreateApplication = (e) => {
    e.preventDefault()
    if (!newApp.title || !newApp.company) return

    const created = {
      ...newApp,
      id: `app-custom-${Date.now()}`,
      appliedDate: new Date().toISOString(),
    }

    setApplications((prev) => [created, ...prev])
    setShowAddModal(false)
    setNewApp({
      title: '',
      company: '',
      type: 'Internship',
      location: '',
      mode: 'Remote',
      stipend: '',
      readinessScore: 80,
      status: 'Applied',
      notes: '',
    })
  }

  // Statistics calculation
  const totalCount = applications.length
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length
  const interviewCount = applications.filter((a) => a.status === 'Interview').length
  const offeredCount = applications.filter((a) => a.status === 'Offered').length
  const avgReadiness =
    totalCount > 0
      ? Math.round(
          applications.reduce((acc, a) => acc + (Number(a.readinessScore) || 70), 0) /
            totalCount
        )
      : 0

  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'All') return true
    return app.status === activeFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Saved':
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' }
      case 'Applied':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
      case 'Under Review':
        return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' }
      case 'Interview':
        return { bg: '#f3e8ff', color: '#7c3aed', border: '#ddd6fe' }
      case 'Offered':
        return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' }
      case 'Rejected':
        return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' }
      default:
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
    }
  }

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          Fresher<span>Connect</span>
        </div>
        <div className="nav-links">
          <button type="button" className="login-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="dashboard-hero">
        <div className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
            <span>📊</span> APPLICATION PIPELINE
          </div>
          <h1 className="dashboard-title">
            Application <span>Tracking</span>
          </h1>
          <p>
            Monitor the status of your internship and fresher job applications, track interview stages, and measure your role readiness in one unified dashboard.
          </p>
        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <section style={{ maxWidth: '1100px', margin: '25px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(15,23,42,0.03)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb' }}>{totalCount}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>Total Tracked</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(15,23,42,0.03)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#d97706' }}>{underReviewCount}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>Under Review</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(15,23,42,0.03)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#7c3aed' }}>{interviewCount}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>Interviews</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(15,23,42,0.03)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#16a34a' }}>{offeredCount}</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>Offers Received</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(15,23,42,0.03)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0284c7' }}>{avgReadiness}%</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>Avg. Readiness</div>
          </div>
        </div>
      </section>

      {/* FILTER & ACTIONS BAR */}
      <section className="features-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '24px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['All', 'Applied', 'Under Review', 'Interview', 'Offered', 'Saved', 'Rejected'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeFilter === status ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: activeFilter === status ? '#eff6ff' : '#ffffff',
                  color: activeFilter === status ? '#2563eb' : '#475569',
                  fontWeight: activeFilter === status ? '700' : '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {onNavigateToOpportunities && (
              <button
                type="button"
                onClick={onNavigateToOpportunities}
                style={{
                  padding: '9px 16px',
                  border: '1px solid #2563eb',
                  background: '#eff6ff',
                  color: '#2563eb',
                  borderRadius: '9px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                + Browse Internships
              </button>
            )}

            <button
              type="button"
              className="hero-btn"
              onClick={() => setShowAddModal(true)}
              style={{ padding: '9px 16px', fontSize: '13px' }}
            >
              + Add Custom Application
            </button>
          </div>
        </div>

        {/* APPLICATION CARDS LIST */}
        {filteredApps.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '45px 25px', textAlign: 'center' }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>📂</div>
            <h3 style={{ margin: '0 0 8px', color: '#172033' }}>No applications in this category</h3>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px' }}>
              Apply to internships or add custom applications to track your recruitment progress here.
            </p>
            {onNavigateToOpportunities && (
              <button type="button" className="hero-btn" onClick={onNavigateToOpportunities}>
                Explore Internships →
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredApps.map((app) => {
              const statusStyle = getStatusColor(app.status)
              const appliedDateStr = app.appliedDate
                ? new Date(app.appliedDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent'

              return (
                <div
                  key={app.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '22px 26px',
                    boxShadow: '0 4px 18px rgba(15,23,42,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb' }}>
                          {app.type || 'Internship'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Applied on {appliedDateStr}</span>
                      </div>

                      <h3 style={{ margin: '0 0 5px', fontSize: '18px', fontWeight: '700', color: '#172033' }}>
                        {app.title}
                      </h3>
                      <p style={{ margin: 0, color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                        🏢 {app.company} {app.location && `• 📍 ${app.location}`} {app.stipend && `• 💰 ${app.stipend}`}
                      </p>
                    </div>

                    {/* READINESS INDICATOR & STATUS SELECTOR */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>READINESS</div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: app.readinessScore >= 75 ? '#16a34a' : '#2563eb' }}>
                          {app.readinessScore || 75}%
                        </div>
                      </div>

                      {/* Interactive Status Changer */}
                      <div>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          style={{
                            padding: '7px 12px',
                            borderRadius: '8px',
                            border: `1px solid ${statusStyle.border}`,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="Saved">Saved</option>
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Offered">Offered 🎉</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', padding: '4px 8px' }}
                        title="Delete application"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* NOTES SECTION */}
                  {app.notes && (
                    <div style={{ marginTop: '14px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#64748b', border: '1px solid #f1f5f9' }}>
                      <strong>📝 Notes:</strong> {app.notes}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ADD CUSTOM APPLICATION MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', width: '500px', maxWidth: '100%', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 6px', color: '#172033', fontSize: '20px' }}>
              Add Tracked Application
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 18px' }}>
              Manually log internships or jobs you applied to on external company portals.
            </p>

            <form onSubmit={handleCreateApplication}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>JOB / ROLE TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Developer Intern"
                  value={newApp.title}
                  onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>COMPANY NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Infosys, Tech Startup"
                  value={newApp.company}
                  onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>CATEGORY</label>
                  <select
                    value={newApp.type}
                    onChange={(e) => setNewApp({ ...newApp, type: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Fresher Job">Fresher Job</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>INITIAL STATUS</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Saved">Saved</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>NOTES & NEXT STEPS</label>
                <textarea
                  rows="3"
                  placeholder="Add interview dates, recruiter contact, or preparation notes..."
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="hero-btn" style={{ padding: '10px 20px' }}>
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationTracker
