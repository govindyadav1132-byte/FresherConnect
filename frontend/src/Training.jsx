import React, { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'

function Training({ onBack }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [completedLessons, setCompletedLessons] = useState({})
  const [missingSkills, setMissingSkills] = useState([])
  const [loadingSkills, setLoadingSkills] = useState(true)

  const courses = [
    {
      id: 1,
      title: 'HTML & CSS Fundamentals',
      skills: ['HTML', 'CSS'],
      level: 'Beginner',
      icon: '🌐',
      description:
        'Learn how to build and style modern web pages using HTML and CSS.',
      lessons: [
        'Introduction to HTML',
        'HTML Elements & Forms',
        'Introduction to CSS',
        'CSS Selectors & Properties',
        'Flexbox & Responsive Design',
        'Build a Personal Web Page',
      ],
      quiz: [
        {
          question: 'What does HTML stand for?',
          answer: 'HyperText Markup Language',
        },
        {
          question: 'Which language is used to style HTML pages?',
          answer: 'CSS',
        },
      ],
      practical:
        'Create a responsive personal portfolio page using HTML and CSS.',
    },

    {
      id: 2,
      title: 'JavaScript Fundamentals',
      skills: ['JavaScript'],
      level: 'Beginner',
      icon: '⚡',
      description:
        'Learn JavaScript fundamentals and add interactive behaviour to websites.',
      lessons: [
        'Introduction to JavaScript',
        'Variables & Data Types',
        'Operators & Conditions',
        'Loops',
        'Functions',
        'Arrays & Objects',
        'DOM Manipulation',
        'Build an Interactive Web Page',
      ],
      quiz: [
        {
          question: 'Which keyword can be used to declare a variable?',
          answer: 'let',
        },
        {
          question: 'What does DOM stand for?',
          answer: 'Document Object Model',
        },
      ],
      practical:
        'Build a JavaScript to-do list application with add and delete functionality.',
    },

    {
      id: 3,
      title: 'React Development',
      skills: ['React'],
      level: 'Intermediate',
      icon: '⚛️',
      description:
        'Learn React components, state, props and build modern frontend applications.',
      lessons: [
        'Introduction to React',
        'Components',
        'JSX',
        'Props',
        'State with useState',
        'Events & Forms',
        'useEffect',
        'Build a React Application',
      ],
      quiz: [
        {
          question: 'What is React primarily used for?',
          answer: 'Building user interfaces',
        },
        {
          question: 'Which hook is commonly used for component state?',
          answer: 'useState',
        },
      ],
      practical:
        'Build a React task management application using components and state.',
    },

    {
      id: 4,
      title: 'Python Fundamentals',
      skills: ['Python'],
      level: 'Beginner',
      icon: '🐍',
      description:
        'Learn Python programming fundamentals and prepare for backend and data roles.',
      lessons: [
        'Introduction to Python',
        'Variables & Data Types',
        'Conditions',
        'Loops',
        'Functions',
        'Lists & Dictionaries',
        'File Handling',
        'Build a Python Project',
      ],
      quiz: [
        {
          question: 'What function is used to display output in Python?',
          answer: 'print()',
        },
        {
          question: 'Which keyword is used to define a function?',
          answer: 'def',
        },
      ],
      practical:
        'Build a Python command-line student management application.',
    },

    {
      id: 5,
      title: 'SQL & Database Fundamentals',
      skills: ['SQL', 'MySQL', 'PostgreSQL'],
      level: 'Beginner',
      icon: '🗄️',
      description:
        'Learn databases, SQL queries, tables and CRUD operations.',
      lessons: [
        'Introduction to Databases',
        'Tables & Records',
        'SELECT Queries',
        'INSERT, UPDATE & DELETE',
        'WHERE & ORDER BY',
        'JOIN Operations',
        'Database Relationships',
        'Build a Database Project',
      ],
      quiz: [
        {
          question: 'Which SQL command is used to retrieve data?',
          answer: 'SELECT',
        },
        {
          question: 'Which SQL command is used to add data?',
          answer: 'INSERT',
        },
      ],
      practical:
        'Create a student database and perform CRUD operations using SQL.',
    },

    {
      id: 6,
      title: 'Git & GitHub',
      skills: ['Git', 'GitHub'],
      level: 'Beginner',
      icon: '🔧',
      description:
        'Learn version control and how to manage projects using Git and GitHub.',
      lessons: [
        'Introduction to Git',
        'Git Repository',
        'git add & git commit',
        'Branches',
        'Merging',
        'GitHub Repositories',
        'Push & Pull',
        'Collaborative Development',
      ],
      quiz: [
        {
          question: 'Which command creates a Git commit?',
          answer: 'git commit',
        },
        {
          question: 'What platform is commonly used to host Git repositories?',
          answer: 'GitHub',
        },
      ],
      practical:
        'Create a GitHub repository and push a complete project to it.',
    },
  ]

  /* =========================
     LOAD LATEST RESUME ANALYSIS
  ========================= */

  useEffect(() => {
    loadMissingSkills()
  }, [])

  async function loadMissingSkills() {
    setLoadingSkills(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoadingSkills(false)
      return
    }

    const { data, error } = await supabase
      .from('resume_analysis')
      .select('missing_skills, role')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      setMissingSkills(data.missing_skills || [])
    }

    setLoadingSkills(false)
  }

  /* =========================
     CHECK RECOMMENDED COURSE
  ========================= */

  function isRecommended(course) {
    if (missingSkills.length === 0) {
      return false
    }

    return course.skills.some((courseSkill) =>
      missingSkills.some(
        (missingSkill) =>
          missingSkill.toLowerCase() ===
          courseSkill.toLowerCase()
      )
    )
  }

  const recommendedCourses = courses.filter(isRecommended)

  const otherCourses = courses.filter(
    (course) => !isRecommended(course)
  )

  /* =========================
     PROGRESS
  ========================= */

  function getCompletedCount(course) {
    return course.lessons.filter(
      (_, index) =>
        completedLessons[`${course.id}-${index}`]
    ).length
  }

  function getProgress(course) {
    const completed = getCompletedCount(course)

    return Math.round(
      (completed / course.lessons.length) * 100
    )
  }

  function toggleLesson(courseId, lessonIndex) {
    const key = `${courseId}-${lessonIndex}`

    setCompletedLessons((previous) => ({
      ...previous,
      [key]: !previous[key],
    }))
  }

  /* =========================
     COURSE DETAILS
  ========================= */

  if (selectedCourse) {
    const progress = getProgress(selectedCourse)

    return (
      <div className="dashboard-page">

        <div className="dashboard-hero">
          <div className="dashboard-content">

            <button
              className="back-btn"
              onClick={() => setSelectedCourse(null)}
              style={{ marginBottom: '20px' }}
            >
              ← Back to Training
            </button>

            <div
              style={{
                fontSize: '55px',
                marginBottom: '10px',
              }}
            >
              {selectedCourse.icon}
            </div>

            <h1 className="dashboard-title">
              {selectedCourse.title}
            </h1>

            <p>
              {selectedCourse.description}
            </p>

          </div>
        </div>

        {/* COURSE PROGRESS */}

        <section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '25px',
              boxShadow:
                '0 8px 25px rgba(15, 23, 42, 0.06)',
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <h3 style={{ margin: 0 }}>
                Course Progress
              </h3>

              <strong
                style={{
                  color: '#2563eb',
                  fontSize: '20px',
                }}
              >
                {progress}%
              </strong>
            </div>

            <div
              style={{
                width: '100%',
                height: '10px',
                background: '#e2e8f0',
                borderRadius: '20px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: '#2563eb',
                  borderRadius: '20px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {progress === 100 && (
              <p
                style={{
                  color: '#16a34a',
                  marginBottom: 0,
                  marginTop: '12px',
                }}
              >
                🎉 Course completed!
              </p>
            )}

          </div>
        </section>

        {/* LESSONS */}

        <section className="features-section">

          <div className="section-heading">
            <h2>📖 Lessons</h2>
            <p>
              Complete each lesson to improve your progress.
            </p>
          </div>

          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto',
            }}
          >

            {selectedCourse.lessons.map(
              (lesson, index) => {
                const completed =
                  completedLessons[
                    `${selectedCourse.id}-${index}`
                  ]

                return (
                  <div
                    key={index}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      marginBottom: '12px',

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',

                      boxShadow:
                        '0 4px 12px rgba(15, 23, 42, 0.04)',
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >

                      <div
                        style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',

                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',

                          background: completed
                            ? '#dcfce7'
                            : '#eff6ff',

                          color: completed
                            ? '#16a34a'
                            : '#2563eb',

                          fontWeight: '700',
                        }}
                      >
                        {completed
                          ? '✓'
                          : index + 1}
                      </div>

                      <div>
                        <strong
                          style={{
                            color: '#172033',
                          }}
                        >
                          {lesson}
                        </strong>

                        <div
                          style={{
                            fontSize: '13px',
                            color: '#64748b',
                            marginTop: '4px',
                          }}
                        >
                          Lesson {index + 1}
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        toggleLesson(
                          selectedCourse.id,
                          index
                        )
                      }
                      style={{
                        padding: '9px 15px',
                        borderRadius: '8px',

                        border: completed
                          ? '1px solid #16a34a'
                          : '1px solid #2563eb',

                        background: completed
                          ? '#f0fdf4'
                          : '#eff6ff',

                        color: completed
                          ? '#16a34a'
                          : '#2563eb',

                        fontWeight: '600',
                      }}
                    >
                      {completed
                        ? 'Completed'
                        : 'Mark Complete'}
                    </button>

                  </div>
                )
              }
            )}

          </div>

        </section>

        {/* QUIZ */}

        <section
          style={{
            padding: '60px 20px',
            background: '#ffffff',
          }}
        >

          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto',
            }}
          >

            <h2
              style={{
                color: '#172033',
                marginBottom: '10px',
              }}
            >
              🧠 Quiz
            </h2>

            <p
              style={{
                color: '#64748b',
                marginBottom: '25px',
              }}
            >
              Test your understanding of the course.
            </p>

            {selectedCourse.quiz.map(
              (quiz, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    marginBottom: '15px',

                    background: '#f8fafc',

                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                  }}
                >

                  <strong>
                    {index + 1}. {quiz.question}
                  </strong>

                  <p
                    style={{
                      marginTop: '10px',
                      color: '#64748b',
                    }}
                  >
                    Answer: {quiz.answer}
                  </p>

                </div>
              )
            )}

          </div>

        </section>

        {/* PRACTICAL TASK */}

        <section className="features-section">

          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto',
            }}
          >

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '30px',
                boxShadow:
                  '0 8px 25px rgba(15, 23, 42, 0.05)',
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: '#172033',
                }}
              >
                🛠️ Practical Task
              </h2>

              <p
                style={{
                  color: '#64748b',
                  lineHeight: '1.7',
                }}
              >
                {selectedCourse.practical}
              </p>

              <button
                className="hero-btn"
                style={{ marginTop: '10px' }}
              >
                Submit Evidence
              </button>

            </div>

          </div>

        </section>

      </div>
    )
  }

  /* =========================
     TRAINING COURSE LIST
  ========================= */

  return (
    <div className="dashboard-page">

      <div className="dashboard-hero">

        <div className="dashboard-content">

          <button
            onClick={onBack}
            className="back-btn"
            style={{ marginBottom: '20px' }}
          >
            ← Back to Dashboard
          </button>

          <h1 className="dashboard-title">
            Training <span>& Learning</span>
          </h1>

          <p>
            Build the skills you need for your target
            internship or fresher role.
          </p>

        </div>

      </div>

      {/* RECOMMENDED SKILLS */}

      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '30px 20px',
        }}
      >

        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '16px',
            padding: '25px',
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: '#172033',
            }}
          >
            🎯 Your Recommended Skills
          </h2>

          {loadingSkills ? (
            <p style={{ color: '#64748b' }}>
              Checking your latest resume analysis...
            </p>
          ) : missingSkills.length > 0 ? (
            <>
              <p style={{ color: '#64748b' }}>
                Based on your latest resume analysis,
                these skills need improvement:
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginTop: '15px',
                }}
              >
                {missingSkills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '20px',
                        background: '#ffffff',
                        border: '1px solid #93c5fd',
                        color: '#1d4ed8',
                        fontWeight: '600',
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </>
          ) : (
            <p style={{ color: '#64748b' }}>
              No recent resume skill gaps found.
              Complete a resume analysis to get
              personalized training recommendations.
            </p>
          )}

        </div>

      </section>

      {/* RECOMMENDED COURSES */}

      {recommendedCourses.length > 0 && (
        <section className="features-section">

          <div className="section-heading">

            <h2>⭐ Recommended For You</h2>

            <p>
              These courses match the skills missing
              from your latest resume analysis.
            </p>

          </div>

          <div className="features-grid">

            {recommendedCourses.map((course) => {

              const progress = getProgress(course)

              return (
                <div
                  className="feature-card"
                  key={course.id}
                >

                  <div
                    style={{
                      fontSize: '42px',
                      marginBottom: '15px',
                    }}
                  >
                    {course.icon}
                  </div>

                  <h3>{course.title}</h3>

                  <p>
                    {course.description}
                  </p>

                  <div
                    style={{
                      marginTop: '15px',
                      color: '#2563eb',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Missing skill match:
                    {' '}
                    {course.skills
                      .filter((skill) =>
                        missingSkills.some(
                          (missing) =>
                            missing.toLowerCase() ===
                            skill.toLowerCase()
                        )
                      )
                      .join(', ')}
                  </div>

                  <div style={{ marginTop: '18px' }}>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '7px',
                        fontSize: '13px',
                      }}
                    >
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: '#2563eb',
                          borderRadius: '10px',
                        }}
                      />
                    </div>

                  </div>

                  <button
                    className="hero-btn"
                    onClick={() =>
                      setSelectedCourse(course)
                    }
                    style={{
                      marginTop: '20px',
                      width: '100%',
                    }}
                  >
                    {progress > 0
                      ? 'Continue Learning'
                      : 'Start Learning'}
                  </button>

                </div>
              )
            })}

          </div>

        </section>
      )}

      {/* ALL COURSES */}

      <section className="features-section">

        <div className="section-heading">

          <h2>📚 All Training Courses</h2>

          <p>
            Explore additional courses to strengthen
            your career skills.
          </p>

        </div>

        <div className="features-grid">

          {otherCourses.map((course) => {

            const progress = getProgress(course)

            return (
              <div
                className="feature-card"
                key={course.id}
              >

                <div
                  style={{
                    fontSize: '42px',
                    marginBottom: '15px',
                  }}
                >
                  {course.icon}
                </div>

                <h3>{course.title}</h3>

                <p>
                  {course.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '18px',
                    fontSize: '14px',
                    color: '#64748b',
                  }}
                >
                  <span>
                    🎯 {course.level}
                  </span>

                  <span>
                    📖 {course.lessons.length} Lessons
                  </span>
                </div>

                <div style={{ marginTop: '18px' }}>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '7px',
                      fontSize: '13px',
                    }}
                  >
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#2563eb',
                        borderRadius: '10px',
                      }}
                    />
                  </div>

                </div>

                <button
                  className="hero-btn"
                  onClick={() =>
                    setSelectedCourse(course)
                  }
                  style={{
                    marginTop: '20px',
                    width: '100%',
                  }}
                >
                  {progress > 0
                    ? 'Continue Learning'
                    : 'Start Learning'}
                </button>

              </div>
            )
          })}

        </div>

      </section>

    </div>
  )
}

export default Training