import './App.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

function Results({
  analysis,
  onBack,
  backLabel = 'Upload Another Resume',
}) {
  if (!analysis) {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="auth-logo">
            <span>F</span> FresherConnect
          </div>

          <h1>No Analysis Available</h1>

          <p className="auth-subtitle">
            Please upload a resume to view the analysis.
          </p>

          <button
            className="auth-submit"
            onClick={onBack}
          >
            ← {backLabel}
          </button>

        </div>
      </div>
    )
  }

  // =====================================================
  // ANALYSIS DATA
  // =====================================================

  const skills = analysis.skills || []
  const missingSkills = analysis.missing_skills || []
  const recommendations = analysis.recommendations || []

  const qualityScore =
    analysis.quality_score ??
    analysis.resume_quality?.quality_score ??
    0

  const qualityChecks =
    analysis.resume_quality?.checks || []

  // =====================================================
  // SCORES
  // =====================================================

  const roleMatchScore = Number(
    analysis.skill_score || 0
  )

  const resumeQualityScore = Number(
    qualityScore || 0
  )

  const totalSkills =
    skills.length + missingSkills.length

  const skillCoverage =
    totalSkills > 0
      ? Math.round(
          (skills.length / totalSkills) * 100
        )
      : 0

  // =====================================================
  // CAREER READINESS BAR CHART
  // =====================================================

  const chartData = {
    labels: [
      'Role Match',
      'Resume Quality',
      'Skill Coverage',
    ],

    datasets: [
      {
        label: 'Score',

        data: [
          roleMatchScore,
          resumeQualityScore,
          skillCoverage,
        ],

        backgroundColor: [
          '#2563eb',
          '#16a34a',
          '#7c3aed',
        ],

        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    indexAxis: 'y',

    scales: {
      x: {
        min: 0,
        max: 100,

        ticks: {
          callback: function (value) {
            return value + '%'
          },

          color: '#64748b',
        },

        grid: {
          color: '#e2e8f0',
        },
      },

      y: {
        ticks: {
          color: '#172033',

          font: {
            size: 14,
            weight: '600',
          },
        },

        grid: {
          display: false,
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw}%`
          },
        },
      },
    },
  }

  return (
    <div className="dashboard-page">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="navbar">

        <div className="logo">
          <span>F</span> FresherConnect
        </div>

        <div className="nav-links">

          <button
            className="login-btn"
            onClick={onBack}
            style={{
              padding: '12px 22px',
              border: '1px solid #2563eb',
              borderRadius: '9px',
            }}
          >
            ← {backLabel}
          </button>

        </div>

      </nav>


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="dashboard-hero">

        <div className="dashboard-content">

          <h1 className="dashboard-title">
            Resume <span>Analysis</span>
          </h1>

          <p>
            Here is your resume analysis for the selected
            target job role.
          </p>

        </div>

      </section>


      {/* ================================================= */}
      {/* RESULTS */}
      {/* ================================================= */}

      <section className="features-section">

        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >

          {/* ================================================= */}
          {/* TARGET ROLE */}
          {/* ================================================= */}

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '25px',
              boxShadow:
                '0 4px 15px rgba(15, 23, 42, 0.05)',
            }}
          >

            <p
              style={{
                margin: '0 0 6px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              TARGET JOB ROLE
            </p>

            <h2
              style={{
                margin: 0,
                color: '#172033',
              }}
            >
              {analysis.role}
            </h2>

          </div>


          {/* ================================================= */}
          {/* SCORE CARDS */}
          {/* ================================================= */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >

            {/* ROLE MATCH */}

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                textAlign: 'center',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <div
                style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#2563eb',
                }}
              >
                {roleMatchScore}%
              </div>

              <h3
                style={{
                  margin: '8px 0',
                  color: '#172033',
                }}
              >
                Role Match Score
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                }}
              >
                Skills matching your selected role
              </p>

            </div>


            {/* RESUME QUALITY */}

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                textAlign: 'center',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <div
                style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#16a34a',
                }}
              >
                {resumeQualityScore}%
              </div>

              <h3
                style={{
                  margin: '8px 0',
                  color: '#172033',
                }}
              >
                Resume Quality
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                }}
              >
                Resume structure and content
              </p>

            </div>


            {/* SKILLS FOUND */}

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                textAlign: 'center',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <div
                style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#7c3aed',
                }}
              >
                {skills.length}
              </div>

              <h3
                style={{
                  margin: '8px 0',
                  color: '#172033',
                }}
              >
                Skills Found
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                }}
              >
                Relevant skills detected
              </p>

            </div>


            {/* SKILL GAPS */}

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                textAlign: 'center',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <div
                style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#dc2626',
                }}
              >
                {missingSkills.length}
              </div>

              <h3
                style={{
                  margin: '8px 0',
                  color: '#172033',
                }}
              >
                Skill Gaps
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                }}
              >
                Skills to improve
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* CAREER READINESS */}
          {/* ================================================= */}

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '25px',
              boxShadow:
                '0 4px 15px rgba(15, 23, 42, 0.05)',
            }}
          >

            <h2
              style={{
                marginTop: 0,
                color: '#172033',
                textAlign: 'center',
              }}
            >
              Career Readiness
            </h2>

            <p
              style={{
                color: '#64748b',
                marginBottom: '25px',
                textAlign: 'center',
              }}
            >
              Visual overview of your resume and role readiness.
            </p>

            <div
              style={{
                maxWidth: '750px',
                height: '300px',
                margin: '0 auto',
              }}
            >

              <Bar
                data={chartData}
                options={chartOptions}
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* RESUME INFORMATION */}
          {/* ================================================= */}

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '25px',
              boxShadow:
                '0 4px 15px rgba(15, 23, 42, 0.05)',
            }}
          >

            <h2
              style={{
                marginTop: 0,
                color: '#172033',
              }}
            >
              Resume Information
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
              }}
            >

              <div>

                <strong>Filename</strong>

                <p
                  style={{
                    color: '#64748b',
                    marginTop: '5px',
                    wordBreak: 'break-word',
                  }}
                >
                  {analysis.filename}
                </p>

              </div>


              <div>

                <strong>Target Role</strong>

                <p
                  style={{
                    color: '#64748b',
                    marginTop: '5px',
                  }}
                >
                  {analysis.role}
                </p>

              </div>


              <div>

                <strong>Pages</strong>

                <p
                  style={{
                    color: '#64748b',
                    marginTop: '5px',
                  }}
                >
                  {analysis.pages}
                </p>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* RESUME QUALITY CHECKS */}
          {/* ================================================= */}

          {qualityChecks.length > 0 && (

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '25px',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: '#172033',
                }}
              >
                Resume Quality Checks
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '15px',
                }}
              >

                {qualityChecks.map((check, index) => (

                  <div
                    key={index}
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      background: check.status
                        ? '#f0fdf4'
                        : '#fff7ed',
                      border: check.status
                        ? '1px solid #bbf7d0'
                        : '1px solid #fed7aa',
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                      }}
                    >

                      <span
                        style={{
                          fontSize: '20px',
                        }}
                      >
                        {check.status ? '✅' : '⚠️'}
                      </span>

                      <strong
                        style={{
                          color: '#172033',
                        }}
                      >
                        {check.name}
                      </strong>

                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                    >
                      {check.message}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* SKILLS + SKILL GAPS */}
          {/* ================================================= */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px',
              marginBottom: '25px',
            }}
          >

            {/* SKILLS FOUND */}

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: '#172033',
                }}
              >
                Skills Found
              </h2>

              {skills.length === 0 ? (

                <p
                  style={{
                    color: '#64748b',
                  }}
                >
                  No matching skills detected.
                </p>

              ) : (

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >

                  {skills.map((skill, index) => (

                    <span
                      key={index}
                      style={{
                        padding: '8px 14px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      ✓ {skill}
                    </span>

                  ))}

                </div>

              )}

            </div>


            {/* SKILL GAPS */}

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: '#172033',
                }}
              >
                Skill Gaps
              </h2>

              {missingSkills.length === 0 ? (

                <p
                  style={{
                    color: '#16a34a',
                    fontWeight: '600',
                  }}
                >
                  🎉 No skill gaps detected!
                </p>

              ) : (

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >

                  {missingSkills.map((skill, index) => (

                    <span
                      key={index}
                      style={{
                        padding: '8px 14px',
                        background: '#fef2f2',
                        color: '#dc2626',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      ⚠ {skill}
                    </span>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* ================================================= */}
          {/* RECOMMENDED LEARNING */}
          {/* ================================================= */}

          {recommendations.length > 0 && (

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '30px',
                boxShadow:
                  '0 4px 15px rgba(15, 23, 42, 0.05)',
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: '#172033',
                }}
              >
                Recommended Learning
              </h2>

              <p
                style={{
                  color: '#64748b',
                  marginBottom: '20px',
                }}
              >
                Focus on these areas to improve your match
                for the selected role.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: '15px',
                }}
              >

                {recommendations.map((item, index) => {

                  const skill =
                    typeof item === 'string'
                      ? item
                      : item.skill

                  const recommendation =
                    typeof item === 'string'
                      ? `Learn and practice ${item}.`
                      : item.recommendation

                  return (

                    <div
                      key={index}
                      style={{
                        padding: '18px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >

                      <h3
                        style={{
                          margin: '0 0 7px',
                          color: '#2563eb',
                        }}
                      >
                        {skill}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          color: '#64748b',
                          lineHeight: '1.6',
                        }}
                      >
                        {recommendation}
                      </p>

                    </div>

                  )
                })}

              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  )
}

export default Results