import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import './FacultyNotifications.css';

function FacultyNotifications() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="faculty-navbar px-4">

            <div className="navbar-top">

                <Link className="navbar-brand" to="/faculty" onClick={closeMenu}>
                    <div className="brand-icon">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </div>
                    <div className="brand-text">
                        LeaveFlow
                        <span>Student Portal</span>
                    </div>
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
                </button>

            </div>

            <div className={`faculty-nav-content ${menuOpen ? "open" : ""}`}>
                <ul className="navbar-nav mx-auto gap-1">
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"} to="/faculty" end onClick={closeMenu}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"} to="/student/apply-leave" onClick={closeMenu}>
                            Apply Leave
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"} to="/student/myleaves" onClick={closeMenu}>
                            My Leaves
                        </NavLink>
                    </li>
                </ul>

                <div className="right-cluster">
                    {/* <NavLink to="/faculty/notifications" className="notif-btn" aria-label="Notifications">
                        🔔
                        <span className="badge-dot"></span>
                    </NavLink> */}
                    <div className="nav-divider-1"></div>
                    <NavLink
                        to="/profile"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive
                                ? "profile-area active-profile"
                                : "profile-area"
                        }
                    >
                        <div className="avatar">
                            {user?.name?.charAt(0)?.toUpperCase()||'NJ'}
                        </div>

                        <span className="profile-name">
                            {user?.name||'Neymar Jr'}
                        </span>
                    </NavLink>
                    <div className="nav-divider-2"></div>
                    <Link className="logout-btn" to="/" onClick={closeMenu}>Logout</Link>
                </div>
            </div>
        </nav>
    );
}

export default FacultyNotifications;