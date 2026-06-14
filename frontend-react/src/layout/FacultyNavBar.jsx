import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faBars, faXmark, faCalendar } from '@fortawesome/free-solid-svg-icons';
import './FacultyNavbar.css';

function FacultyNavBar() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="faculty-navbar px-4">

            <div className="navbar-top">

                <Link className="navbar-brand" to="/faculty" onClick={closeMenu}>
                    <div className="brand-icon">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className="brand-text">
                        LeaveFlow
                        <span>Faculty Portal</span>
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
                        <NavLink className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"} to="/faculty/assigned-students" onClick={closeMenu}>
                            Assigned Students
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"} to="/faculty/leave-queue" onClick={closeMenu}>
                            Leave Queue
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
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <span className="profile-name">
                            {user?.name}
                        </span>
                    </NavLink>
                    <div className="nav-divider-2"></div>
                    <Link className="logout-btn" to="/" onClick={closeMenu}>Logout</Link>
                </div>
            </div>
        </nav>
    );
}

export default FacultyNavBar;