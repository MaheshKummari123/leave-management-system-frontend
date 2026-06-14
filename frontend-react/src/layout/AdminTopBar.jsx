import './AdminTopBar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleUser,
} from '@fortawesome/free-regular-svg-icons';

import {
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import { Link, NavLink } from 'react-router-dom';

function AdminTopBar({ onToggleSidebar }) {
    return (
        <nav className="navbar navbar-expand-lg px-3 topbar">
            <div className="container-fluid">

                {/* Hamburger */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={onToggleSidebar}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Right Side Actions */}
                <div className="navbar-content">
                    <ul className="navbar-nav">

                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive
                                        ? "admin-profile-link active"
                                        : "admin-profile-link"
                                }
                                to="/profile"
                            >
                                <FontAwesomeIcon icon={faCircleUser} />
                                <span>Admin</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <Link className="btn btn-outline-danger logout-btn" to="/">
                                <FontAwesomeIcon icon={faRightFromBracket} />
                                <span className="logout-text">Logout</span>
                            </Link>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default AdminTopBar;