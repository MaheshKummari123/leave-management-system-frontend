import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUser, registerUser } from '../api';
import './LandingPage.css';

// ============ ICONS (inline SVG, no external deps) ============
const Icon = ({ name, size = 24 }) => {
  const icons = {
    calendar: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
    cap: <path d="M22 10L12 4 2 10l10 6 10-6zM6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />,
    docs: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h6 M9 9h1" />,
    check: <path d="M9 12l2 2 4-4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
    clock: <path d="M12 6v6l4 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
    shield: <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z M9 12l2 2 4-4" />,
    chart: <path d="M3 3v18h18 M7 16l4-6 4 4 5-8" />,
    bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0" />,
    lock: <path d="M5 11h14v10H5V11z M8 11V7a4 4 0 1 1 8 0v4" />,
    users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
    phone: <path d="M5 2h14v20H5V2z M9 18h6" />,
    arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    mail: <path d="M4 4h16v16H4V4z M4 6l8 7 8-7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    eye: <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
    eyeOff: <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 4.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22" />,
    twitter: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A6.33 6.33 0 0 0 23 3z" />,
    linkedin: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    instagram: <path d="M2 2h20v20H2V2z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01" />,
    bolt: <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />,
    upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />,
    layers: <path d="M12 2l9 4.5-9 4.5-9-4.5L12 2z M3 11.5l9 4.5 9-4.5 M3 16.5l9 4.5 9-4.5" />,
    activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    grad: <path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || icons.check}
    </svg>
  );
};

// ============ NAVBAR ============
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#" className="navbar__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span className="navbar__logo-icon">
            <Icon name="grad" size={20} />
          </span>
          <span className="navbar__logo-text">LeaveFlow</span>
        </a>

        <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <button onClick={() => scrollTo('features')}>Features</button>
          <button onClick={() => scrollTo('roles')}>Solutions</button>
          <button onClick={() => scrollTo('about')}>About</button>
          <button onClick={() => scrollTo('footer')}>Contact</button>
          <div className="navbar__actions navbar__actions--mobile">
            <button className="btn btn--ghost" onClick={() => scrollTo('auth')}>Sign In</button>
            <button className="btn btn--primary" onClick={() => scrollTo('auth')}>Get Started</button>
          </div>
        </nav>

        <div className="navbar__actions">
          <button className="btn btn--ghost" onClick={() => scrollTo('auth')}>Sign In</button>
          <button className="btn btn--primary" onClick={() => scrollTo('auth')}>Get Started</button>
        </div>

        <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}

// ============ HERO ============
function Hero() {
  const cards = [
    {
      icon: 'docs',
      title: 'Apply Leave',
      value: 'Student',
      sub: 'Submit leave requests',
      cls: 'card--1'
    },
    {
      icon: 'check',
      title: 'Approval Workflow',
      value: 'Faculty',
      sub: 'Review and manage requests',
      cls: 'card--2'
    },
    {
      icon: 'users',
      title: 'User Management',
      value: 'Admin',
      sub: 'Manage students and faculty',
      cls: 'card--3'
    },
    {
      icon: 'chart',
      title: 'Reports',
      value: 'Analytics',
      sub: 'Monitor leave activity',
      cls: 'card--4'
    }
  ];

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__orb hero__orb--1"></div>
        <div className="hero__orb hero__orb--2"></div>
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge badge--glass">
            <Icon name="bolt" size={14} /> Leave Management System
          </span>

          <h1 className="hero__title">
            Streamline Leave Requests with a{' '}
            <span className="text-gradient">
              Smart Leave Management System
            </span>
          </h1>

          <p className="hero__subtitle">
            A centralized platform that enables students to apply for leave,
            faculty to review requests, and administrators to manage leave
            operations efficiently.
          </p>

          <div className="hero__actions">
            <button
              className="btn btn--primary btn--lg"
              onClick={() =>
                document
                  .getElementById('auth')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Get Started <Icon name="arrowRight" size={18} />
            </button>

            <button
              className="btn btn--secondary btn--lg"
              onClick={() =>
                document
                  .getElementById('auth')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="dashboard-mockup glass">
            <div className="dashboard-mockup__header">
              <div className="dashboard-mockup__dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="dashboard-mockup__title">
                Leave Management Dashboard
              </div>
            </div>

            <div className="dashboard-mockup__body">
              <div className="dashboard-mockup__chart">
                <div className="bar-chart">
                  {[40, 65, 45, 80, 60, 95, 70].map((h, i) => (
                    <div
                      key={i}
                      className="bar-chart__bar"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="dashboard-mockup__rows">
                <div className="dashboard-mockup__row">
                  <div className="dashboard-mockup__avatar"></div>

                  <div className="dashboard-mockup__lines">
                    <div className="line line--60"></div>
                    <div className="line line--40"></div>
                  </div>

                  <span className="status-pill status-pill--success">
                    Approved
                  </span>
                </div>

                <div className="dashboard-mockup__row">
                  <div className="dashboard-mockup__avatar"></div>

                  <div className="dashboard-mockup__lines">
                    <div className="line line--70"></div>
                    <div className="line line--30"></div>
                  </div>

                  <span className="status-pill status-pill--pending">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {cards.map((c, i) => (
            <div key={i} className={`floating-card glass ${c.cls}`}>
              <div className="floating-card__icon">
                <Icon name={c.icon} size={18} />
              </div>

              <div className="floating-card__text">
                <span className="floating-card__title">{c.title}</span>
                <span className="floating-card__value">{c.value}</span>
                <span className="floating-card__sub">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ TRUSTED BY ============
function TrustedBy() {
  const stats = [
    { value: '3', label: 'User Roles' },
    { value: '5+', label: 'Core Modules' },
    { value: '24/7', label: 'Leave Access' },
    { value: '100%', label: 'Digital Workflow' },
  ];

  const highlights = [
    'Student Portal',
    'Faculty Portal',
    'Admin Portal',
    'Leave Tracking',
    'Approval Workflow'
  ];

  return (
    <section className="trusted">
      <div className="container">
        <p className="section-eyebrow section-eyebrow--center">
          Designed for educational institutions
        </p>

        <div className="trusted__logos">
          {highlights.map((item, i) => (
            <span key={i} className="trusted__logo">
              {item}
            </span>
          ))}
        </div>

        <div className="trusted__stats">
          {stats.map((s, i) => (
            <div key={i} className="trusted__stat">
              <span className="trusted__stat-value text-gradient">
                {s.value}
              </span>
              <span className="trusted__stat-label">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FEATURES ============
function Features() {
  const features = [
    {
      icon: 'docs',
      title: 'Leave Application Management',
      desc: 'Students can submit leave requests with leave type, dates, and reason.'
    },
    {
      icon: 'activity',
      title: 'Leave Status Tracking',
      desc: 'Track pending, approved, and rejected leave requests in real time.'
    },
    {
      icon: 'check',
      title: 'Faculty Approval System',
      desc: 'Faculty members can review, approve, or reject student leave requests.'
    },
    {
      icon: 'layers',
      title: 'Student Dashboard',
      desc: 'View leave history, recent activity, and application status from a single place.'
    },
    {
      icon: 'shield',
      title: 'Faculty Dashboard',
      desc: 'Manage pending requests and monitor leave approval activities efficiently.'
    },
    {
      icon: 'users',
      title: 'User Management',
      desc: 'Administrators can manage student and faculty accounts.'
    },
    {
      icon: 'calendar',
      title: 'Academic Year Management',
      desc: 'Organize and manage students based on academic years.'
    },
    {
      icon: 'building',
      title: 'Department Management',
      desc: 'Maintain departments and streamline leave administration across the institution.'
    },
    {
      icon: 'chart',
      title: 'Leave Reports',
      desc: 'View leave records and reports for better administrative oversight.'
    },
    {
      icon: 'lock',
      title: 'Role-Based Access',
      desc: 'Separate access levels for students, faculty, and administrators.'
    }
  ];

  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Features</span>
          <h2 className="section-title">Everything your institution needs</h2>
          <p className="section-subtitle">A complete toolkit for managing student leave from request to report.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-card">
              <div className="feature-card__icon">
                <Icon name={f.icon} size={22} />
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ HOW IT WORKS ============
function HowItWorks() {
  const steps = [
    {
      title: 'Student submits a leave request',
      desc: 'Students fill in leave details including leave type, dates, and reason.'
    },
    {
      title: 'Request reaches assigned faculty',
      desc: 'The leave application appears in the faculty approval dashboard for review.'
    },
    {
      title: 'Faculty reviews the application',
      desc: 'Faculty verifies the request and checks the submitted leave information.'
    },
    {
      title: 'Leave is approved or rejected',
      desc: 'Faculty takes action on the request and updates its status accordingly.'
    },
    {
      title: 'Student tracks the final status',
      desc: 'Students can view approved, rejected, or pending requests from their dashboard.'
    }
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Workflow</span>
          <h2 className="section-title">Simple leave approval process</h2>
          <p className="section-subtitle">
            A streamlined workflow connecting students, faculty, and administrators.
          </p>
        </div>
        <div className="timeline">
          {steps.map((s, i) => (
            <div key={i} className="timeline__item">
              <div className="timeline__marker">
                <span className="timeline__number">{i + 1}</span>
              </div>
              <div className="timeline__content glass-card">
                <h3 className="timeline__title">{s.title}</h3>
                <p className="timeline__desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ USER ROLES ============
function UserRoles() {
  const roles = [
    {
      name: 'Students',
      icon: 'graduation-cap',
      items: [
        'Submit leave requests',
        'View Leave Details',
        'View leave history',
        'Track Leave Status (Pending / Approved / Rejected)',
        'View Recent Leave Activity'

      ]
    },
    {
      name: 'Faculty',
      icon: 'users',
      items: [
        'Review student leave requests',
        'Approve or reject applications',
        'View Leave Statistics',
        'Filter requests by status',
        'Monitor pending approvals'
      ]
    },
    {
      name: 'Administrators',
      icon: 'shield',
      items: [
        'Manage students and faculty',
        'Assign faculty advisors',
        'Manage departments',
        'Access leave reports and analytics',
        'Monitor system-wide leave activity'
      ]
    }
  ];

  return (
    <section className="section section--alt" id="roles">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Solutions</span>
          <h2 className="section-title">Built for every role on campus</h2>
          <p className="section-subtitle">Tailored experiences for students, faculty, and administrators.</p>
        </div>
        <div className="roles-grid">
          {roles.map((r, i) => (
            <div key={i} className="role-card glass-card">
              <div className="role-card__icon">
                <Icon name={r.icon} size={26} />
              </div>
              <h3 className="role-card__title">{r.name}</h3>
              <ul className="role-card__list">
                {r.items.map((it, j) => (
                  <li key={j}>
                    <Icon name="check" size={16} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ DASHBOARD PREVIEW ============
function DashboardPreview() {
  const [active, setActive] = useState('student');

  const tabs = [
    { id: 'student', label: 'Student Dashboard' },
    { id: 'faculty', label: 'Faculty Dashboard' },
    { id: 'admin', label: 'Admin Dashboard' },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Product preview</span>
          <h2 className="section-title">A dashboard for every perspective</h2>
          <p className="section-subtitle">Switch between portals to see how each role experiences LeaveFlow.</p>
        </div>

        <div className="preview-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`preview-tab ${active === t.id ? 'preview-tab--active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="preview-panel glass-card">
          {active === 'student' && (
            <div className="preview-grid">
              <div className="preview-card preview-card--accent">
                <span className="preview-card__label">Apply Leave</span>
                <span className="preview-card__value">Easy Requests</span>
                <span className="preview-card__sub">Submit leave applications in seconds</span>
              </div>
              <div className="preview-card">
                <span className="preview-card__label">Recent Applications</span>
                <div className="mini-list">
                  <div className="mini-list__row"><span>Medical leave</span><span className="status-pill status-pill--success">Approved</span></div>
                  <div className="mini-list__row"><span>Family event</span><span className="status-pill status-pill--pending">Pending</span></div>
                  <div className="mini-list__row"><span>Sports meet</span><span className="status-pill status-pill--success">Approved</span></div>
                </div>
              </div>
              <div className="preview-card">
                <span className="preview-card__label">Status overview</span>
                <div className="status-cards">
                  <div className="status-cards__item"><span className="status-cards__value">8</span><span>Approved</span></div>
                  <div className="status-cards__item"><span className="status-cards__value">2</span><span>Pending</span></div>
                  <div className="status-cards__item"><span className="status-cards__value">1</span><span>Rejected</span></div>
                </div>
              </div>
            </div>
          )}

          {active === 'faculty' && (
            <div className="preview-grid">
              <div className="preview-card preview-card--accent">
                <span className="preview-card__label">Pending Requests</span>
                <span className="preview-card__value">14</span>
                <span className="preview-card__sub">Awaiting your review</span>
              </div>
              <div className="preview-card">
                <span className="preview-card__label">Approval Queue</span>
                <div className="mini-list">
                  <div className="mini-list__row"><span>Aditi Sharma — Sick leave</span><span className="status-pill status-pill--pending">Review</span></div>
                  <div className="mini-list__row"><span>Rohan Mehta — Family event</span><span className="status-pill status-pill--pending">Review</span></div>
                  <div className="mini-list__row"><span>Sara Khan — Conference</span><span className="status-pill status-pill--pending">Review</span></div>
                </div>
              </div>
              <div className="preview-card">
                <span className="preview-card__label">Quick statistics</span>
                <div className="status-cards">
                  <div className="status-cards__item"><span className="status-cards__value">120</span><span>Total reviewed</span></div>
                  <div className="status-cards__item"><span className="status-cards__value">96%</span><span>On-time rate</span></div>
                  <div className="status-cards__item"><span className="status-cards__value">42</span><span>Students assigned</span></div>
                </div>
              </div>
            </div>
          )}

          {active === 'admin' && (
            <div className="preview-grid">
              <div className="preview-card preview-card--accent">
                <span className="preview-card__label">Analytics</span>
                <div className="bar-chart bar-chart--small">
                  {[55, 70, 40, 85, 60, 75, 90].map((h, i) => (
                    <div key={i} className="bar-chart__bar" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="preview-card">
                <span className="preview-card__label">Department Reports</span>
                <div className="mini-list">
                  <div className="mini-list__row"><span>CSE</span><span>312 Requests</span></div>
                  <div className="mini-list__row"><span>ECE</span><span>198 Requests</span></div>
                  <div className="mini-list__row"><span>Mechanical</span><span>275 Requests</span></div>
                </div>
              </div>
              <div className="preview-card">
                <span className="preview-card__label">User Management</span>
                <div className="status-cards">
                  <div className="status-cards__item"><span className="status-cards__value">10,240</span><span>Students</span></div>
                  <div className="status-cards__item"><span className="status-cards__value">512</span><span>Faculty</span></div>
                  <div className="status-cards__item"><span className="status-cards__value">18</span><span>Admins</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============ ANALYTICS ============
function Analytics() {
  const kpis = [
    { label: 'Total Leave Requests', value: '48,219', delta: '+12.4%' },
    { label: 'Approved Leaves', value: '41,508', delta: '+9.1%' },
    { label: 'Rejected Leaves', value: '3,112', delta: '-2.3%' },
    { label: 'Pending Requests', value: '3,599', delta: '+4.8%' },
  ];

  const trend = [30, 45, 38, 60, 55, 72, 68, 80, 75, 90, 85, 95];
  const depts = [
    { name: 'Computer Science', value: 88 },
    { name: 'Mechanical', value: 64 },
    { name: 'Commerce', value: 76 },
    { name: 'Electronics', value: 52 },
  ];

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Analytics</span>
          <h2 className="section-title">Insights that drive decisions</h2>
          <p className="section-subtitle">Track trends, monitor performance, and act on real-time data.</p>
        </div>

        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div key={i} className="kpi-card glass-card">
              <span className="kpi-card__label">{k.label}</span>
              <span className="kpi-card__value">{k.value}</span>
              <span className={`kpi-card__delta ${k.delta.startsWith('-') ? 'kpi-card__delta--neg' : ''}`}>{k.delta}</span>
            </div>
          ))}
        </div>

        <div className="analytics-charts">
          <div className="chart-card glass-card">
            <h3 className="chart-card__title">Monthly trends</h3>
            <div className="line-chart">
              <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                <polyline
                  points={trend.map((v, i) => `${(i / (trend.length - 1)) * 300},${100 - v}`).join(' ')}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="chart-card glass-card">
            <h3 className="chart-card__title">Department statistics</h3>
            <div className="dept-bars">
              {depts.map((d, i) => (
                <div key={i} className="dept-bars__row">
                  <span className="dept-bars__label">{d.name}</span>
                  <div className="dept-bars__track">
                    <div className="dept-bars__fill" style={{ width: `${d.value}%` }}></div>
                  </div>
                  <span className="dept-bars__value">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIALS ============
function Testimonials() {
  const testimonials = [
    {
      name: 'Dr. Meera Iyer',
      role: 'College Administrator',
      text: 'LeaveFlow gave our administration full visibility into leave patterns across departments. Reporting that used to take days now takes minutes.',
      rating: 5,
    },
    {
      name: 'Prof. Arjun Nair',
      role: 'Faculty Member',
      text: 'Reviewing student leave requests used to mean digging through emails. Now everything is in one queue, organized and easy to act on.',
      rating: 5,
    },
    {
      name: 'Priya Das',
      role: 'Student Representative',
      text: 'Applying for leave and tracking approval status is so much easier now. I always know exactly where my request stands.',
      rating: 5,
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title">Loved by campuses everywhere</h2>
          <p className="section-subtitle">See what administrators, faculty, and students are saying.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card glass-card">
              <div className="testimonial-card__stars">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Icon key={j} name="star" size={16} />
                ))}
              </div>
              <p className="testimonial-card__text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-card__profile">
                <div className="testimonial-card__avatar">{t.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ SECURITY ============
function Security() {
  const items = [
    { icon: 'lock', title: 'Secure Login', desc: 'Encrypted credentials and session management protect every account.' },
    { icon: 'shield', title: 'Data Protection', desc: 'Sensitive records are encrypted at rest and in transit.' },
    { icon: 'users', title: 'Role-Based Security', desc: 'Granular permissions ensure people only see what they need.' },
    { icon: 'layers', title: 'Cloud Ready Architecture', desc: 'Built to scale across campuses and growing user bases.' },
    { icon: 'bolt', title: 'Fast Performance', desc: 'Optimized for quick load times, even on slower connections.' },
    { icon: 'check', title: 'Reliable Availability', desc: '99.9% uptime keeps your institution running without interruption.' },
  ];

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Security &amp; reliability</span>
          <h2 className="section-title">Enterprise-grade trust, built in</h2>
          <p className="section-subtitle">Your institution's data deserves the highest standard of protection.</p>
        </div>
        <div className="security-grid">
          {items.map((it, i) => (
            <div key={i} className="security-card glass-card">
              <div className="security-card__icon">
                <Icon name={it.icon} size={22} />
              </div>
              <div>
                <h3 className="security-card__title">{it.title}</h3>
                <p className="security-card__desc">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ AUTH ============
function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ---- Sign in state ----
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // ---- Sign up state ----
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    department: '',
    mobileNumber: '',

    // Student fields
    rollNumber: '',
    year: '',
    semester: '',
    section: '',

    // Faculty/Admin fields
    employeeId: '',
    designation: '',

    role: 'STUDENT',
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await getUser(loginData);
      const user = res.data;

      sessionStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'STUDENT') navigate('/student');
      else navigate('/faculty');
    } catch (err) {
      setError('Invalid User or Password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      switchMode('signin');
    } catch (err) {
      setError('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="auth">
      <div className="container container--narrow">
        <div className="section-header">
          <span className="section-eyebrow">Get started</span>
          <h2 className="section-title">Sign in or create your account</h2>
          <p className="section-subtitle">Access your dashboard or join your institution's LeaveFlow workspace.</p>
        </div>

        <div className="auth-card glass-card">
          <div className="auth-toggle">
            <button className={`auth-toggle__btn ${mode === 'signin' ? 'auth-toggle__btn--active' : ''}`} onClick={() => switchMode('signin')}>
              Sign In
            </button>
            <button className={`auth-toggle__btn ${mode === 'signup' ? 'auth-toggle__btn--active' : ''}`} onClick={() => switchMode('signup')}>
              Sign Up
            </button>
            <div className={`auth-toggle__indicator ${mode === 'signup' ? 'auth-toggle__indicator--right' : ''}`}></div>
          </div>

          {error && <div className="alert-error">{error}</div>}

          {mode === 'signin' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label className="field">
                <span className="field__label">Username</span>
                <input
                  type="text"
                  name="username"
                  className="field__input"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                />
              </label>
              <label className="field">
                <span className="field__label">Password</span>
                <div className="field__input-wrap">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    name="password"
                    className="field__input"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <button type="button" className="field__icon-btn" onClick={() => setShowPwd(!showPwd)} aria-label="Toggle password visibility">
                    <Icon name={showPwd ? 'eyeOff' : 'eye'} size={18} />
                  </button>
                </div>
              </label>
              <div className="auth-form__row">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="link">Forgot password?</a>
              </div>
              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="signin-text">
                Don't have an account?{' '}
                <button type="button" className="link" onClick={() => switchMode('signup')}>Sign Up</button>
              </p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <label className="field">
                <span className="field__label">Full Name</span>
                <input
                  type="text"
                  name="name"
                  className="field__input"
                  placeholder="Jordan Patel"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label className="field">
                <span className="field__label">Username</span>
                <input
                  type="text"
                  name="username"
                  className="field__input"
                  placeholder="jordanp"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label className="field">
                <span className="field__label">Email</span>
                <input
                  type="email"
                  name="email"
                  className="field__input"
                  placeholder="you@college.edu"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label className="field">
                <span className="field__label">Password</span>
                <div className="field__input-wrap">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    name="password"
                    className="field__input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                  />
                  <button type="button" className="field__icon-btn" onClick={() => setShowPwd(!showPwd)} aria-label="Toggle password visibility">
                    <Icon name={showPwd ? 'eyeOff' : 'eye'} size={18} />
                  </button>
                </div>
              </label>

              <div className="form-row">
                <label className="field">
                  <span className="field__label">Department</span>
                  <input
                    type="text"
                    name="department"
                    className="field__input"
                    value={formData.department}
                    onChange={handleFormChange}
                  />
                </label>
                <label className="field">
                  <span className="field__label">Mobile Number</span>
                  <input
                    type="text"
                    name="mobileNumber"
                    className="field__input"
                    value={formData.mobileNumber}
                    onChange={handleFormChange}
                  />
                </label>
              </div>

              <div className="field">
                <span className="field__label">I am a</span>
                <div className="role-toggle role-toggle--three">
                  <button type="button" className={`role-toggle__btn ${formData.role === 'STUDENT' ? 'role-toggle__btn--active' : ''}`} onClick={() => setFormData({ ...formData, role: 'STUDENT' })}>
                    Student
                  </button>
                  <button type="button" className={`role-toggle__btn ${formData.role === 'FACULTY' ? 'role-toggle__btn--active' : ''}`} onClick={() => setFormData({ ...formData, role: 'FACULTY' })}>
                    Faculty
                  </button>
                  <button type="button" className={`role-toggle__btn ${formData.role === 'ADMIN' ? 'role-toggle__btn--active' : ''}`} onClick={() => setFormData({ ...formData, role: 'ADMIN' })}>
                    Admin
                  </button>
                </div>
              </div>

              {formData.role === 'STUDENT' && (
                <>
                  <div className="form-section-title">Student details</div>
                  <div className="form-row">
                    <label className="field">
                      <span className="field__label">Roll Number</span>
                      <input
                        type="text"
                        name="rollNumber"
                        className="field__input"
                        value={formData.rollNumber}
                        onChange={handleFormChange}
                      />
                    </label>
                    <label className="field">
                      <span className="field__label">Year</span>
                      <select name="year" className="field__input" value={formData.year} onChange={handleFormChange}>
                        <option value="">Select year</option>
                        <option value="FIRST_YEAR">1st Year</option>
                        <option value="SECOND_YEAR">2nd Year</option>
                        <option value="THIRD_YEAR">3rd Year</option>
                        <option value="FOURTH_YEAR">4th Year</option>
                      </select>
                    </label>
                  </div>
                  <div className="form-row">
                    <label className="field">
                      <span className="field__label">Semester</span>
                      <select name="semester" className="field__input" value={formData.semester} onChange={handleFormChange}>
                        <option value="">Select semester</option>
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                      </select>
                    </label>
                    <label className="field">
                      <span className="field__label">Section</span>
                      <select name="section" className="field__input" value={formData.section} onChange={handleFormChange}>
                        <option value="">Select section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {(formData.role === 'FACULTY' || formData.role === 'ADMIN') && (
                <>
                  <div className="form-section-title">{formData.role === 'FACULTY' ? 'Faculty' : 'Admin'} details</div>
                  <div className="form-row">
                    <label className="field">
                      <span className="field__label">Employee ID</span>
                      <input
                        type="text"
                        name="employeeId"
                        className="field__input"
                        value={formData.employeeId}
                        onChange={handleFormChange}
                      />
                    </label>
                    <label className="field">
                      <span className="field__label">Designation</span>
                      <input
                        type="text"
                        name="designation"
                        className="field__input"
                        value={formData.designation}
                        onChange={handleFormChange}
                      />
                    </label>
                  </div>
                </>
              )}

              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <p className="signin-text">
                Already have an account?{' '}
                <button type="button" className="link" onClick={() => switchMode('signin')}>Login</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ============ FAQ ============
function FAQ() {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'How do students apply for leave?', a: 'Students log in to their portal, select leave dates, choose a reason, attach supporting documents if needed, and submit. The request immediately appears in the assigned faculty member\'s queue.' },
    { q: 'How does faculty approval work?', a: 'Faculty members see all pending requests from their assigned students in one queue. They can review details, approve or reject with comments, and the student is notified instantly.' },
    { q: 'Can administrators generate reports?', a: 'Yes. Administrators have access to a full analytics dashboard with department-level statistics, monthly trends, and exportable reports.' },
    { q: 'Is the system secure?', a: 'Yes. LeaveFlow uses encrypted authentication, role-based access control, and data protection practices to keep institutional data safe.' },
    { q: 'Can academic event leaves be managed?', a: 'Absolutely. Academic event leave requests, such as for exams, conferences, or fests, can be submitted, tracked, and approved through the same streamlined workflow.' },
  ];

  return (
    <section className="section" id="contact">
      <div className="container container--narrow">
        <div className="section-header">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-subtitle">Everything you need to know before getting started.</p>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div key={i} className={`faq-item glass-card ${open === i ? 'faq-item--open' : ''}`}>
              <button className="faq-item__question" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <Icon name={open === i ? 'minus' : 'plus'} size={18} />
              </button>
              {open === i && <p className="faq-item__answer">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FINAL CTA ============
// function FinalCTA() {
//   return (
//     <section className="final-cta">
//       <div className="container final-cta__inner">
//         <h2 className="final-cta__title">Transform Leave Management Today</h2>
//         <p className="final-cta__subtitle">
//           Join educational institutions that are simplifying leave management with our platform.
//         </p>
//         <div className="final-cta__actions">
//           <button className="btn btn--white btn--lg">Get Started Free</button>
//           <button className="btn btn--outline-white btn--lg">Request Demo</button>
//         </div>
//       </div>
//     </section>
//   );
// }
function About() {
  const highlights = [
    "Student Leave Applications",
    "Faculty Approval Workflow",
    "Leave Status Tracking",
    "Department Management",
    "Academic Year Management",
    "Reports & Analytics"
  ];

  return (
    <section className="section section--alt" id="about">
      <div className="container about__grid">
        <div className="about__content">
          <span className="section-eyebrow">About LMS</span>
          <h2 className="section-title">
            A Smarter Way to Manage Student Leave Requests
          </h2>

          <p className="about__text">
            The Leave Management System digitizes the complete leave approval
            process within educational institutions. Students can submit leave
            requests online, faculty can review applications efficiently, and
            administrators can oversee the entire workflow through a centralized
            platform.
          </p>

          <div className="about__highlights">
            {highlights.map((item, index) => (
              <div key={index} className="about__highlight">
                <Icon name="check" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about__visual glass-card">
          <div className="about__stats">
            <div className="about__stat">
              <span className="about__number">3</span>
              <span className="about__label">User Roles</span>
            </div>

            <div className="about__stat">
              <span className="about__number">6+</span>
              <span className="about__label">Core Modules</span>
            </div>

            <div className="about__stat">
              <span className="about__number">24/7</span>
              <span className="about__label">Accessibility</span>
            </div>

            <div className="about__stat">
              <span className="about__number">100%</span>
              <span className="about__label">Digital Workflow</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="footer" id='footer'>
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#" className="navbar__logo">
            <span className="navbar__logo-icon">
              <Icon name="grad" size={20} />
            </span>
            <span className="navbar__logo-text">LeaveFlow</span>
          </a>

          <p className="footer__tagline">
            A centralized leave management system for students, faculty, and administrators.
          </p>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <a href="#features">Features</a>
          <a href="#how-it-works">Workflow</a>
          <a href="#roles">Roles</a>
          <a href="#auth">Login</a>
        </div>

        <div className="footer__col">
          <h4>Core Features</h4>
          <a href="#features">Leave Applications</a>
          <a href="#features">Faculty Approval</a>
          <a href="#features">Leave Tracking</a>
          <a href="#features">Reports & Analytics</a>
        </div>

        <div className="footer__col">
          <h4>User Portals</h4>
          <a href="#roles">Student Portal</a>
          <a href="#roles">Faculty Portal</a>
          <a href="#roles">Admin Portal</a>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <a href="mailto:leaveflow.in@gmail.com">leaveflow.in@gmail.com</a>

        </div>
      </div>

      <div className="footer__bottom container">
        <p>
          © {new Date().getFullYear()} LeaveFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ============ APP ============
export default function LandingPage() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <UserRoles />
      <DashboardPreview />
      <Analytics />
      <Testimonials />
      <Security />
      <Auth />
      <FAQ />
      <About />
      <Footer />
    </div>
  );
}