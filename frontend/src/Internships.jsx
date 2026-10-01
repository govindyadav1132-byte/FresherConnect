import { useState, useMemo } from 'react'
import './App.css'

const OPPORTUNITIES_DATA = [
  // --- INTERNSHIPS (PRIMARY CATEGORY) ---
  {
    id: 'int-1',
    type: 'Internship',
    title: 'Frontend React Developer Intern',
    company: 'TechNovus Solutions',
    logoText: 'TN',
    location: 'Mumbai / Remote',
    mode: 'Hybrid',
    stipend: '₹15,000 - ₹22,000 / month',
    duration: '3 - 6 Months',
    eligibility: 'B.Sc CS / IT, BCA, B.Tech (2026-2027 Batch)',
    roleCategory: 'Frontend Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    description: 'Work alongside senior frontend engineers building responsive web applications using React, JavaScript, and modern CSS.',
    openings: 3,
    posted: '2 days ago',
  },
  {
    id: 'int-2',
    type: 'Internship',
    title: 'Python Backend & API Intern',
    company: 'CloudMatrix Labs',
    logoText: 'CM',
    location: 'Bengaluru / Remote',
    mode: 'Remote',
    stipend: '₹18,000 - ₹25,000 / month',
    duration: '6 Months (OJT with PPO)',
    eligibility: 'CS / IT Students with Python knowledge',
    roleCategory: 'Python Developer',
    skills: ['Python', 'Flask', 'SQL', 'Git'],
    description: 'Build REST APIs, design database queries, and contribute to production cloud microservices with hands-on on-the-job training.',
    openings: 2,
    posted: '1 day ago',
  },
  {
    id: 'int-3',
    type: 'Internship',
    title: 'Full Stack Web Development Intern',
    company: 'Apex CodeCraft',
    logoText: 'AC',
    location: 'Pune / Hybrid',
    mode: 'Hybrid',
    stipend: '₹20,000 / month',
    duration: '6 Months',
    eligibility: 'T.Y. B.Sc CS / BCA / B.Tech Freshers',
    roleCategory: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git', 'HTML', 'CSS'],
    description: 'Gain full-lifecycle web experience connecting React frontends with Node/Express backends and relational database management.',
    openings: 4,
    posted: '3 days ago',
  },
  {
    id: 'int-4',
    type: 'Internship',
    title: 'Data Analyst & BI Intern',
    company: 'FinMetrics Analytics',
    logoText: 'FM',
    location: 'Mumbai / On-site',
    mode: 'On-site',
    stipend: '₹16,000 - ₹20,000 / month',
    duration: '4 Months',
    eligibility: 'B.Sc CS / Statistics / Mathematics',
    roleCategory: 'Data Analyst',
    skills: ['Python', 'SQL', 'Excel', 'Statistics', 'Power BI'],
    description: 'Analyze operational data, build Power BI reports, write SQL queries, and clean datasets for executive dashboard presentations.',
    openings: 2,
    posted: 'Just now',
  },
  {
    id: 'int-5',
    type: 'Internship',
    title: 'Java Backend Intern',
    company: 'InfraCore Systems',
    logoText: 'IC',
    location: 'Hyderabad / Hybrid',
    mode: 'Hybrid',
    stipend: '₹18,000 / month',
    duration: '6 Months',
    eligibility: '2026/2027 Graduating Batch',
    roleCategory: 'Java Developer',
    skills: ['Java', 'SQL', 'Spring', 'MySQL', 'Git'],
    description: 'Develop enterprise Java web applications, handle backend business logic, and collaborate on database schema optimizations.',
    openings: 3,
    posted: '4 days ago',
  },
  {
    id: 'int-6',
    type: 'Internship',
    title: 'Junior Machine Learning Intern',
    company: 'Cognitive AI Research',
    logoText: 'CA',
    location: 'Remote',
    mode: 'Remote',
    stipend: '₹22,000 / month',
    duration: '6 Months (OJT Practical)',
    eligibility: 'Passionate about Python & Data Science',
    roleCategory: 'Machine Learning Engineer',
    skills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Machine Learning'],
    description: 'Train and validate machine learning models, preprocess real-world datasets, and create evaluation reports with our AI team.',
    openings: 2,
    posted: '5 days ago',
  },

  // --- FRESHER JOBS (SECONDARY CATEGORY) ---
  {
    id: 'job-1',
    type: 'Fresher Job',
    title: 'Junior Software Engineer (Fresher)',
    company: 'Zensar Tech Solutions',
    logoText: 'ZT',
    location: 'Mumbai / Pune',
    mode: 'Hybrid',
    stipend: '₹4.2 - ₹5.5 LPA',
    duration: 'Full Time',
    eligibility: 'Fresh Graduates (2025/2026/2027)',
    roleCategory: 'Full Stack Developer',
    skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git'],
    description: 'Exciting opportunity for freshers to start their tech career. Comprehensive onboarding training and project allocation provided.',
    openings: 8,
    posted: '1 week ago',
  },
  {
    id: 'job-2',
    type: 'Fresher Job',
    title: 'Associate Python Developer',
    company: 'Dataview Corp',
    logoText: 'DC',
    location: 'Bengaluru / Remote',
    mode: 'Remote',
    stipend: '₹3.8 - ₹5.0 LPA',
    duration: 'Full Time',
    eligibility: 'B.Sc CS / BCA / B.Tech Freshers',
    roleCategory: 'Python Developer',
    skills: ['Python', 'Flask', 'Django', 'SQL', 'Git'],
    description: 'Entry-level position developing web backend systems, automating data extraction workflows, and maintaining database integrations.',
    openings: 4,
    posted: '3 days ago',
  },
  {
    id: 'job-3',
    type: 'Fresher Job',
    title: 'Graduate Data Analyst',
    company: 'InnoData Global',
    logoText: 'ID',
    location: 'Mumbai / Hybrid',
    mode: 'Hybrid',
    stipend: '₹3.6 - ₹4.8 LPA',
    duration: 'Full Time',
    eligibility: 'Fresh Graduates with Analytical Skills',
    roleCategory: 'Data Analyst',
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI'],
    description: 'Extract business insights, maintain interactive client dashboards, and present reporting summaries to cross-functional stakeholders.',
    openings: 5,
    posted: '2 days ago',
  },
  {
    id: 'job-4',
    type: 'Fresher Job',
    title: 'Associate Java Developer',
    company: 'Apex Banking Tech',
    logoText: 'AB',
    location: 'Pune / On-site',
    mode: 'On-site',
    stipend: '₹4.5 - ₹6.0 LPA',
    duration: 'Full Time',
    eligibility: 'T.Y. B.Sc CS / B.Tech with Java Core',
    roleCategory: 'Java Developer',
    skills: ['Java', 'Spring', 'MySQL', 'Git'],
    description: 'Join our financial software development team building scalable transaction processing components using Java and modern frameworks.',
    openings: 6,
    posted: '4 days ago',
  },
]

function Internships({ user, onBack, onApplyOpportunity, userSkills = [] }) {
  const [activeTab, setActiveTab] = useState('Internship') // 'Internship' (primary) or 'Fresher Job' (secondary)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [selectedMode, setSelectedMode] = useState('All')
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_saved_opportunities')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [appliedIds, setAppliedIds] = useState(() => {
    try {
      const applied = localStorage.getItem('fc_applied_opportunities')
      return applied ? JSON.parse(applied) : []
    } catch {
      return []
    }
  })
  const [applyModalData, setApplyModalData] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Calculate readiness score for a given opportunity
  const calculateMatchScore = (oppSkills) => {
    if (!userSkills || userSkills.length === 0) return 65 // Default baseline estimate
    const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim())
    const matchedCount = oppSkills.filter((s) =>
      normalizedUserSkills.includes(s.toLowerCase().trim())
    ).length
    return Math.round((matchedCount / oppSkills.length) * 100)
  }

  // Filtered opportunities
  const filteredList = useMemo(() => {
    return OPPORTUNITIES_DATA.filter((opp) => {
      // Tab filter: Internships (Primary) vs Fresher Jobs (Secondary)
      if (opp.type !== activeTab) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = opp.title.toLowerCase().includes(q)
        const matchesCompany = opp.company.toLowerCase().includes(q)
        const matchesSkill = opp.skills.some((s) => s.toLowerCase().includes(q))
        if (!matchesTitle && !matchesCompany && !matchesSkill) return false
      }

      // Role filter
      if (selectedRole !== 'All' && opp.roleCategory !== selectedRole) {
        return false
      }

      // Mode filter
      if (selectedMode !== 'All' && opp.mode !== selectedMode) {
        return false
      }

      return true
    })
  }, [activeTab, searchQuery, selectedRole, selectedMode])

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      localStorage.setItem('fc_saved_opportunities', JSON.stringify(updated))
      return updated
    })
  }

  const handleConfirmApply = (opp) => {
    const newApplied = [...appliedIds, opp.id]
    setAppliedIds(newApplied)
    localStorage.setItem('fc_applied_opportunities', JSON.stringify(newApplied))

    // Save to application tracker
    if (onApplyOpportunity) {
      onApplyOpportunity({
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        title: opp.title,
        company: opp.company,
        type: opp.type,
        location: opp.location,
        mode: opp.mode,
        stipend: opp.stipend,
        skills: opp.skills,
        readinessScore: calculateMatchScore(opp.skills),
        status: 'Applied',
        appliedDate: new Date().toISOString(),
        notes: 'Applied through FresherConnect portal.',
      })
    }

    setApplyModalData(null)
    setFeedbackMsg(`Successfully applied to ${opp.title} at ${opp.company}! Track it in your Application Tracker.`)
    setTimeout(() => setFeedbackMsg(''), 4500)
  }

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          Fresher<span>Connect</span>
        </div>
        <div className="nav-links">
          <button
            type="button"
            className="login-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="dashboard-hero">
        <div className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
            <span>💼</span> CAREER OPPORTUNITIES
          </div>
          <h1 className="dashboard-title">
            Internship & <span>Fresher Jobs</span>
          </h1>
          <p>
            Discover verified internship-first opportunities and entry-level fresher roles matching your skills, college eligibility, and preferred work mode.
          </p>

          {/* PRIMARY / SECONDARY TABS (PROPOSAL DIRECT REQUIREMENT) */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('Internship')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '15px',
                border: activeTab === 'Internship' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: activeTab === 'Internship' ? '#2563eb' : '#ffffff',
                color: activeTab === 'Internship' ? '#ffffff' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === 'Internship' ? '0 4px 15px rgba(37,99,235,0.25)' : 'none',
              }}
            >
              🎓 Internships <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', background: activeTab === 'Internship' ? 'rgba(255,255,255,0.25)' : '#eff6ff', color: activeTab === 'Internship' ? '#fff' : '#2563eb' }}>Primary Focus</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Fresher Job')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '15px',
                border: activeTab === 'Fresher Job' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: activeTab === 'Fresher Job' ? '#2563eb' : '#ffffff',
                color: activeTab === 'Fresher Job' ? '#ffffff' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === 'Fresher Job' ? '0 4px 15px rgba(37,99,235,0.25)' : 'none',
              }}
            >
              💼 Fresher Jobs <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', background: activeTab === 'Fresher Job' ? 'rgba(255,255,255,0.25)' : '#f1f5f9', color: activeTab === 'Fresher Job' ? '#fff' : '#64748b' }}>Secondary</span>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION FEEDBACK */}
      {feedbackMsg && (
        <div style={{ maxWidth: '1100px', margin: '20px auto 0', padding: '14px 20px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '12px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✅</span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <section style={{ maxWidth: '1100px', margin: '25px auto 0', padding: '0 20px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', alignItems: 'center' }}>
            {/* Search Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>SEARCH ROLES & SKILLS</label>
              <input
                type="text"
                placeholder="Search React, Python, Mumbai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            {/* Target Role Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>ROLE CATEGORY</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: '#fff', cursor: 'pointer' }}
              >
                <option value="All">All Categories</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>WORK MODE</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: '#fff', cursor: 'pointer' }}
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITY CARDS LIST */}
      <section className="features-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#172033' }}>
            {activeTab === 'Internship' ? '🎓 Available Internships & OJT' : '💼 Available Entry-Level Fresher Jobs'}
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginLeft: '10px' }}>({filteredList.length} opportunities)</span>
          </h2>
        </div>

        {filteredList.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ margin: '0 0 8px', color: '#172033' }}>No opportunities matched your criteria</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Try clearing filters or searching for different keywords.</p>
            <button
              type="button"
              className="hero-btn"
              onClick={() => { setSearchQuery(''); setSelectedRole('All'); setSelectedMode('All'); }}
              style={{ marginTop: '15px' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {filteredList.map((opp) => {
              const matchScore = calculateMatchScore(opp.skills)
              const isApplied = appliedIds.includes(opp.id)
              const isSaved = savedIds.includes(opp.id)

              return (
                <div
                  key={opp.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                    {/* LEFT INFO */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: '800',
                          flexShrink: 0,
                        }}
                      >
                        {opp.logoText}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: opp.type === 'Internship' ? '#eff6ff' : '#f0fdf4', color: opp.type === 'Internship' ? '#2563eb' : '#16a34a', textTransform: 'uppercase' }}>
                            {opp.type}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>
                            {opp.mode}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>• {opp.posted}</span>
                        </div>

                        <h3 style={{ margin: '0 0 4px', fontSize: '19px', fontWeight: '700', color: '#172033' }}>
                          {opp.title}
                        </h3>
                        <p style={{ margin: 0, color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                          🏢 {opp.company} &nbsp;•&nbsp; 📍 {opp.location}
                        </p>
                      </div>
                    </div>

                    {/* READINESS INDICATOR (PROPOSAL REQUIREMENT) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>CAREER READINESS</div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: matchScore >= 75 ? '#16a34a' : matchScore >= 50 ? '#2563eb' : '#d97706' }}>
                          {matchScore}% Match
                        </div>
                      </div>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: matchScore >= 75 ? '#dcfce7' : matchScore >= 50 ? '#eff6ff' : '#fef3c7',
                          color: matchScore >= 75 ? '#16a34a' : matchScore >= 50 ? '#2563eb' : '#d97706',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '15px',
                        }}
                      >
                        {matchScore >= 75 ? '✓' : '⚡'}
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: '14px 0', color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                    {opp.description}
                  </p>

                  {/* KEY SPECIFICATIONS */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#475569', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', marginBottom: '16px' }}>
                    <span>💰 <strong>{opp.stipend}</strong></span>
                    <span>⏳ <strong>{opp.duration}</strong></span>
                    <span>🎓 <strong>{opp.eligibility}</strong></span>
                    <span>👥 <strong>{opp.openings} Openings</strong></span>
                  </div>

                  {/* REQUIRED SKILLS */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginRight: '4px' }}>Skills:</span>
                      {opp.skills.map((skill, idx) => (
                        <span key={idx} style={{ padding: '4px 10px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '600' }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => toggleSave(opp.id)}
                        style={{
                          padding: '9px 15px',
                          border: isSaved ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                          background: isSaved ? '#fffbeb' : '#ffffff',
                          color: isSaved ? '#d97706' : '#475569',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        {isSaved ? '★ Saved' : '☆ Save'}
                      </button>

                      {isApplied ? (
                        <span style={{ padding: '9px 16px', background: '#dcfce7', color: '#16a34a', borderRadius: '8px', fontWeight: '700', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          ✓ Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="hero-btn"
                          onClick={() => setApplyModalData(opp)}
                          style={{ padding: '9px 18px', fontSize: '13px' }}
                        >
                          Apply & Track →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* QUICK APPLICATION MODAL */}
      {applyModalData && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', width: '520px', maxWidth: '100%', padding: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 6px', color: '#172033', fontSize: '22px' }}>
              Confirm Application
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px' }}>
              You are applying for <strong>{applyModalData.title}</strong> at <strong>{applyModalData.company}</strong>.
            </p>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>👤 <strong>Applicant:</strong> {user?.full_name || 'Student'}</div>
              <div style={{ marginBottom: '8px' }}>🎯 <strong>Match Score:</strong> {calculateMatchScore(applyModalData.skills)}% Readiness</div>
              <div>⚡ <strong>Status:</strong> Will be logged in your Application Tracker automatically</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setApplyModalData(null)}
                style={{ padding: '10px 18px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', color: '#334155', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="hero-btn"
                onClick={() => handleConfirmApply(applyModalData)}
              >
                Submit Application 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Internships
