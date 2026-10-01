import { useState, useEffect } from 'react'
import './App.css'

const INITIAL_RESUME_STATE = {
  fullName: 'Govind Yadav',
  title: 'Aspiring Full Stack & Python Developer',
  email: 'govind.yadav@example.com',
  phone: '+91 9876543210',
  location: 'Mumbai, Maharashtra',
  linkedin: 'linkedin.com/in/govindyadav',
  github: 'github.com/govindyadav1132-byte',
  summary:
    'Dedicated Computer Science graduate with solid fundamentals in JavaScript, Python, React, and SQL database design. Experienced in building responsive web applications and passionate about securing an internship or entry-level software developer role.',
  education: [
    {
      degree: 'T.Y. B.Sc. Computer Science',
      institution: 'University of Mumbai',
      year: '2026 - 2027',
      score: 'CGPA: 8.8 / 10',
    },
  ],
  skills: ['Python', 'JavaScript', 'React.js', 'Flask', 'SQL', 'HTML5', 'CSS3', 'Git', 'GitHub'],
  projects: [
    {
      title: 'FresherConnect: Career Readiness Platform',
      tech: 'React, Flask, Python, Supabase, Chart.js',
      description:
        'Developed an internship-first platform featuring PDF resume parsing, role-specific 0-100 match scoring, training recommendations, and application tracking.',
    },
    {
      title: 'Real-Time Task & Student Management App',
      tech: 'Python, Flask, SQLite, RESTful API',
      description:
        'Created a modular CRUD management tool supporting user authentication, role-based access, and task status scheduling.',
    },
  ],
  certifications: [
    'Python & Data Structures Mastery - Online',
    'Responsive Web Design & Modern JavaScript - FreeCodeCamp',
  ],
}

function ResumeBuilder({ user, onBack }) {
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_resume_builder_data')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return {
      ...INITIAL_RESUME_STATE,
      fullName: user?.full_name || INITIAL_RESUME_STATE.fullName,
    }
  })

  const [activeTemplate, setActiveTemplate] = useState('modern') // 'modern', 'minimal', 'tech'
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    localStorage.setItem('fc_resume_builder_data', JSON.stringify(resumeData))
  }, [resumeData])

  const handlePrint = () => {
    window.print()
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    if (!resumeData.skills.includes(newSkill.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()],
      })
    }
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skillToRemove),
    })
  }

  const handleAddProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          title: 'New Project Title',
          tech: 'Technologies used',
          description: 'Brief explanation of key features and results.',
        },
      ],
    })
  }

  const handleUpdateProject = (index, field, value) => {
    const updated = [...resumeData.projects]
    updated[index][field] = value
    setResumeData({ ...resumeData, projects: updated })
  }

  const handleRemoveProject = (index) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <nav className="navbar no-print">
        <div className="logo">
          Fresher<span>Connect</span>
        </div>
        <div className="nav-links">
          <button type="button" className="login-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="dashboard-hero no-print">
        <div className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
            <span>📝</span> RESUME BUILDER
          </div>
          <h1 className="dashboard-title">
            Smart <span>Resume Builder</span>
          </h1>
          <p>
            Build recruiter-approved resumes tailored for internship and fresher roles with live preview and professional templates.
          </p>

          {/* TEMPLATE PICKER */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTemplate('modern')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                border: activeTemplate === 'modern' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: activeTemplate === 'modern' ? '#eff6ff' : '#ffffff',
                color: activeTemplate === 'modern' ? '#2563eb' : '#475569',
                cursor: 'pointer',
              }}
            >
              🎨 Modern Navy Template
            </button>

            <button
              type="button"
              onClick={() => setActiveTemplate('minimal')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                border: activeTemplate === 'minimal' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: activeTemplate === 'minimal' ? '#eff6ff' : '#ffffff',
                color: activeTemplate === 'minimal' ? '#2563eb' : '#475569',
                cursor: 'pointer',
              }}
            >
              📄 Minimalist Classic
            </button>

            <button
              type="button"
              onClick={() => setActiveTemplate('tech')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                border: activeTemplate === 'tech' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: activeTemplate === 'tech' ? '#eff6ff' : '#ffffff',
                color: activeTemplate === 'tech' ? '#2563eb' : '#475569',
                cursor: 'pointer',
              }}
            >
              ⚡ Tech Indigo Sidebar
            </button>

            <button
              type="button"
              className="hero-btn"
              onClick={handlePrint}
              style={{ marginLeft: 'auto', padding: '10px 20px', fontSize: '13px' }}
            >
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE */}
      <section style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.25fr)', gap: '28px', alignItems: 'start' }}>
          
          {/* LEFT: EDITOR FORM */}
          <div className="no-print" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 18px rgba(15,23,42,0.04)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '19px', color: '#172033' }}>
              Edit Resume Content
            </h2>

            {/* BASIC CONTACT */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#2563eb', fontWeight: '800', marginBottom: '10px' }}>
                1. Personal Details
              </h3>

              <div style={{ display: 'grid', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={resumeData.fullName}
                  onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                />

                <input
                  type="text"
                  placeholder="Target Role / Professional Title"
                  value={resumeData.title}
                  onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="City, State"
                    value={resumeData.location}
                    onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn username/link"
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#2563eb', fontWeight: '800', marginBottom: '8px' }}>
                2. Summary / Objective
              </h3>
              <textarea
                rows="4"
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', lineHeight: '1.5' }}
              />
            </div>

            {/* SKILLS TAGS */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#2563eb', fontWeight: '800', marginBottom: '8px' }}>
                3. Skills
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      padding: '4px 10px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add skill (e.g. Docker, TypeScript)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                />
                <button type="submit" className="hero-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  + Add
                </button>
              </form>
            </div>

            {/* PROJECTS */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#2563eb', fontWeight: '800', margin: 0 }}>
                  4. Academic & Personal Projects
                </h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  style={{ border: '1px solid #2563eb', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  + Add Project
                </button>
              </div>

              {resumeData.projects.map((proj, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.title}
                      onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                      style={{ flex: 1, fontWeight: '700', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', marginRight: '8px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(idx)}
                      style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Delete
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Tech Stack (e.g. React, Flask, SQL)"
                    value={proj.tech}
                    onChange={(e) => handleUpdateProject(idx, 'tech', e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', marginBottom: '6px' }}
                  />

                  <textarea
                    rows="2"
                    placeholder="Key contributions and achievements..."
                    value={proj.description}
                    onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: LIVE RESUME PREVIEW */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              id="printable-resume"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 8px 30px rgba(15,23,42,0.08)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#1e293b',
                minHeight: '650px',
              }}
            >
              {/* --- TEMPLATE 1: MODERN NAVY --- */}
              {activeTemplate === 'modern' && (
                <div>
                  <div style={{ borderBottom: '3px solid #2563eb', paddingBottom: '16px', marginBottom: '20px' }}>
                    <h1 style={{ margin: '0 0 4px', fontSize: '26px', color: '#0f172a', fontWeight: '800' }}>
                      {resumeData.fullName}
                    </h1>
                    <div style={{ color: '#2563eb', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>
                      {resumeData.title}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: '#64748b' }}>
                      <span>✉️ {resumeData.email}</span>
                      <span>📞 {resumeData.phone}</span>
                      <span>📍 {resumeData.location}</span>
                      {resumeData.github && <span>💻 {resumeData.github}</span>}
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
                      Professional Summary
                    </h2>
                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
                      {resumeData.summary}
                    </p>
                  </div>

                  {/* Technical Skills */}
                  <div style={{ marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
                      Technical Skills
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {resumeData.skills.map((s, i) => (
                        <span key={i} style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div style={{ marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
                      Projects
                    </h2>
                    {resumeData.projects.map((p, i) => (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>{p.title}</strong>
                          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>{p.tech}</span>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div>
                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
                      Education
                    </h2>
                    {resumeData.education.map((e, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div>
                          <strong>{e.degree}</strong> – {e.institution}
                        </div>
                        <div style={{ color: '#64748b' }}>{e.year} | {e.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TEMPLATE 2: MINIMALIST CLASSIC --- */}
              {activeTemplate === 'minimal' && (
                <div>
                  <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '12px', marginBottom: '18px' }}>
                    <h1 style={{ margin: '0 0 4px', fontSize: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {resumeData.fullName}
                    </h1>
                    <div style={{ fontSize: '12px', color: '#555' }}>
                      {resumeData.email} | {resumeData.phone} | {resumeData.location}
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 6px' }}>Objective</h3>
                    <p style={{ fontSize: '12px', color: '#333', lineHeight: '1.5', margin: 0 }}>{resumeData.summary}</p>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 6px' }}>Skills</h3>
                    <p style={{ fontSize: '12px', color: '#333', margin: 0 }}>{resumeData.skills.join(' • ')}</p>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 6px' }}>Projects</h3>
                    {resumeData.projects.map((p, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{p.title} ({p.tech})</div>
                        <div style={{ fontSize: '12px', color: '#444' }}>{p.description}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 6px' }}>Education</h3>
                    {resumeData.education.map((e, i) => (
                      <div key={i} style={{ fontSize: '12px' }}>
                        <strong>{e.degree}</strong>, {e.institution} ({e.year}) – {e.score}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TEMPLATE 3: TECH INDIGO SIDEBAR --- */}
              {activeTemplate === 'tech' && (
                <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 4px', color: '#312e81' }}>{resumeData.fullName}</h3>
                    <div style={{ fontSize: '11px', color: '#4338ca', fontWeight: '700', marginBottom: '14px' }}>{resumeData.title}</div>
                    
                    <div style={{ fontSize: '11px', color: '#475569', marginBottom: '16px' }}>
                      <div style={{ marginBottom: '4px' }}>📧 {resumeData.email}</div>
                      <div style={{ marginBottom: '4px' }}>📱 {resumeData.phone}</div>
                      <div>📍 {resumeData.location}</div>
                    </div>

                    <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#312e81', margin: '0 0 6px' }}>SKILLS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {resumeData.skills.map((s, i) => (
                        <span key={i} style={{ fontSize: '11px', color: '#334155' }}>• {s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ marginBottom: '14px' }}>
                      <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4338ca', margin: '0 0 4px' }}>ABOUT</h4>
                      <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0, color: '#334155' }}>{resumeData.summary}</p>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4338ca', margin: '0 0 6px' }}>PROJECT WORK</h4>
                      {resumeData.projects.map((p, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e1b4b' }}>{p.title}</div>
                          <div style={{ fontSize: '10px', color: '#4338ca' }}>{p.tech}</div>
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{p.description}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4338ca', margin: '0 0 6px' }}>ACADEMICS</h4>
                      {resumeData.education.map((e, i) => (
                        <div key={i} style={{ fontSize: '11px' }}>
                          <strong>{e.degree}</strong> ({e.year})<br />
                          {e.institution} • {e.score}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ResumeBuilder
