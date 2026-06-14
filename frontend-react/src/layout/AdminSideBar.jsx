import React from "react";
import './AdminSideBar.css'
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    if (route === "/admin") {
      return path === "/admin";
    }
    return path === route || path.startsWith(route + "/");
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="logo">
          <h2>
            <FontAwesomeIcon icon={faCalendarCheck} color="#4F47E5" /> LeaveFlow
          </h2>
        </div>

        <ul>
          <li>
            <Link to="/admin" className={isActive("/admin") ? "active" : ""} onClick={onClose}>
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/user" className={isActive("/admin/user") ? "active" : ""} onClick={onClose}>
              User Management
            </Link>
          </li>

          <li>
            <Link to="/admin/leave" className={isActive("/admin/leave") ? "active" : ""} onClick={onClose}>
              Leave Management
            </Link>
          </li>

          <li>
            <Link to="/admin/leave-reports" className={isActive("/admin/leave-reports") ? "active" : ""} onClick={onClose}>
              Leave Reports
            </Link>
          </li>

          <li>
            <Link to="/admin/department" className={isActive("/admin/department") ? "active" : ""} onClick={onClose}>
              Department Management
            </Link>
          </li>

          <li>
            <Link to="/admin/faculty" className={isActive("/admin/faculty") ? "active" : ""} onClick={onClose}>
              Faculty Assignment
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;