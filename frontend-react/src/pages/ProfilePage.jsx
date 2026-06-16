import { useEffect, useState } from "react";
import "./ProfilePage.css";
import { Link } from "react-router-dom";
import {
    getfacultyStatusRequestCounts,
    studentStatusCounts,
} from "../api";
import NavBar from "../layout/NavBar";
import AdminTopBar from "../layout/AdminTopBar";
import FacultyNavBar from "../layout/FacultyNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-regular-svg-icons";
import AdminSidebar from "../layout/AdminSideBar";

function ProfilePage() {
    const [leaves, setLeaves] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [dept, setDept] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");
    const [section, setSection] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [designation, setDesignation] = useState("");
    const [profileImage, setProfileImage] = useState("");

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setProfileImage(URL.createObjectURL(file));
        } catch (error) {
            console.error(error);
        }
    };

    const getInitials = (fullName) => {
        if (!fullName) return "?";
        return fullName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const getUser = () => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        setRole(user?.role || "");
        setName(user.name || "");
        setDept(user.department || "");
        setEmail(user.email || "");
        setMobileNumber(user.mobileNumber || "");
        setRollNumber(user.rollNumber || "");
        setYear(user.year || "");
        setSemester(user.semester || "");
        setSection(user.section || "");
        setEmployeeId(user.employeeId || "");
        setDesignation(user.designation || "");
        setProfileImage(user.profileImage || "");
        if (user?.role === "STUDENT") {
            countUserLeaves(user.id);
        } else {
            countFacultyLeaves(user.id);
        }
    };

    const countUserLeaves = async (id) => {
        const res = await studentStatusCounts(id);
        setLeaves(res.data);
    };

    const countFacultyLeaves = async (id) => {
        const res = await getfacultyStatusRequestCounts(id);
        setLeaves(res.data);
    };

    const user = JSON.parse(sessionStorage.getItem("user"));

    const formatYear = (year) => {
        const yearMap = {
            FIRST_YEAR: "1st Year",
            SECOND_YEAR: "2nd Year",
            THIRD_YEAR: "3rd Year",
            FOURTH_YEAR: "4th Year"
        };

        return yearMap[year] || year;
    };


    useEffect(() => {
        getUser();
    }, []);

    const totalLeaves = leaves.pending + leaves.approved + leaves.rejected;

    return (
        <>
            <>
                {user?.role === "ADMIN" && (
                    <>
                        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                        <AdminTopBar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
                    </>
                )}

                {user?.role === "FACULTY" && <FacultyNavBar />}

                {user?.role === "STUDENT" && <NavBar />}


            </>

            <div className={`pp-page ${user?.role === "ADMIN" ? "pp-admin-page" : ""}`}>

                <div className="pp-card">

                    {/* Hero */}
                    <div className="pp-hero">
                        <div className="pp-hero-dots" />
                        <div className="pp-hero-glow" />
                    </div>

                    {/* Avatar */}
                    <div className="pp-avatar-area">
                        <div className="pp-avatar-wrap">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="pp-avatar-img"
                                />
                            ) : (
                                <div className="pp-avatar-initials">
                                    {getInitials(name)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="pp-body">

                        {/* Identity */}
                        <div className="pp-identity">
                            <h2 className="pp-name">{name}</h2>
                            <span className="pp-badge">{role}</span>
                            <p className="pp-dept">{dept}</p>
                            <p className="pp-email">{email}</p>
                        </div>

                        <hr className="pp-divider" />

                        {/* Personal Info */}
                        <div className="pp-info-block">
                            <div className="pp-info-header">
                                Personal information
                            </div>
                            <div className="pp-info-grid">
                                <div className="pp-info-cell">
                                    <span className="pp-info-label">Mobile</span>
                                    <span className="pp-info-val">{mobileNumber || "—"}</span>
                                </div>
                                <div className="pp-info-cell">
                                    <span className="pp-info-label">Department</span>
                                    <span className="pp-info-val">{dept || "—"}</span>
                                </div>
                                <div className="pp-info-cell">
                                    <span className="pp-info-label">Email</span>
                                    <span className="pp-info-val">{email || "—"}</span>
                                </div>

                                {role === "STUDENT" && (
                                    <>
                                        <div className="pp-info-cell">
                                            <span className="pp-info-label">Roll number</span>
                                            <span className="pp-info-val">{rollNumber || "—"}</span>
                                        </div>
                                        <div className="pp-info-cell">
                                            <span className="pp-info-label">Year</span>
                                            <span className="pp-info-val">{formatYear(year) || "—"}</span>
                                        </div>
                                        <div className="pp-info-cell">
                                            <span className="pp-info-label">Semester</span>
                                            <span className="pp-info-val">{semester || "—"}</span>
                                        </div>
                                        <div className="pp-info-cell">
                                            <span className="pp-info-label">Section</span>
                                            <span className="pp-info-val">{section || "—"}</span>
                                        </div>
                                    </>
                                )}

                                {(role === "FACULTY" || role === "ADMIN") && (
                                    <>
                                        <div className="pp-info-cell">
                                            <span className="pp-info-label">Employee ID</span>
                                            <span className="pp-info-val">{employeeId || "—"}</span>
                                        </div>
                                        <div className="pp-info-cell">
                                            <span className="pp-info-label">Designation</span>
                                            <span className="pp-info-val">{designation || "—"}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Leave Stats */}
                        <p className="pp-section-title">Leave statistics</p>
                        <div className="pp-stats-row">
                            <div className="pp-stat pp-stat--total">
                                <span className="pp-stat-num">{totalLeaves}</span>
                                <span className="pp-stat-label">Total</span>
                            </div>
                            <div className="pp-stat pp-stat--pending">
                                <span className="pp-stat-num">{leaves.pending}</span>
                                <span className="pp-stat-label">Pending</span>
                            </div>
                            <div className="pp-stat pp-stat--approved">
                                <span className="pp-stat-num">{leaves.approved}</span>
                                <span className="pp-stat-label">Approved</span>
                            </div>
                            <div className="pp-stat pp-stat--rejected">
                                <span className="pp-stat-num">{leaves.rejected}</span>
                                <span className="pp-stat-label">Rejected</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pp-actions">
                            <Link to="/update-profile" className="pp-btn pp-btn--primary">
                                Edit profile
                            </Link>
                            <Link
                                to={`/${role.toLowerCase()}`}
                                className="pp-btn pp-btn--outline"
                            >
                                Back to dashboard
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;