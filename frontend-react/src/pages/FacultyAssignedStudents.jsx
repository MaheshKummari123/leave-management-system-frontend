import { useEffect, useState } from "react";
import FacultyNavBar from "../layout/FacultyNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faEye,
    faUserGraduate,
    faCalendarDays,
    faCircleCheck,
    faCircleXmark,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import "./FacultyAssignedStudents.css";
import {
    assignedStudents,
    getStudentDetails,
    getStudentLeaveCountsById,
    updateStatus,
} from "../api";

function FacultyAssignedStudents() {
    const [students, setStudents] = useState([]);
    const [leaveCounts, setLeaveCounts] = useState({});
    const [selectedStudent, setSelectedStudent] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    const assignedStudentsList = async () => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            const res = await assignedStudents(user.id);
            setStudents(res.data);

            const counts = {};
            await Promise.all(
                res.data.map(async (student) => {
                    try {
                        const leaveRes = await getStudentLeaveCountsById(student.id);
                        counts[student.id] = leaveRes.data;
                    } catch {
                        counts[student.id] = 0;
                    }
                })
            );
            setLeaveCounts(counts);
        } catch (err) {
            console.log(err);
        }
    };

    const openDrawer = async (studentId) => {
        try {
            const res = await getStudentDetails(studentId);
            console.log("Student data", res.data);
            setSelectedStudent(res.data);
            setShowDrawer(true);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            (student.rollNumber || "").toLowerCase().includes(searchText.toLowerCase());

        const matchesDepartment =
            !departmentFilter || student.department === departmentFilter;

        const matchesYear = !yearFilter || student.year === yearFilter;

        return matchesSearch && matchesDepartment && matchesYear;
    });

    const handleStatusChange = async (leaveId, status) => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));

            await updateStatus(leaveId, user.id, status);

            const updated = await getStudentDetails(selectedStudent[0].studentId);

            setSelectedStudent(updated.data);

            assignedStudentsList();
        } catch (err) {
            console.log(err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
    };

    const formatShortDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };
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
        assignedStudentsList();
    }, []);

    // Profile info is the same across every leave entry for a student,
    // so we just take it from the first item once.
    const profile = selectedStudent[0];

    return (
        <>
            <FacultyNavBar />

            <div className="assigned-page">
                <div className="assigned-header">
                    <div>
                        <h2 className="page-title">Assigned Students</h2>
                        <p className="page-subtitle">
                            Manage and view records of assigned students
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="search-card">
                    <div className="search-row">
                        <div className="search-input-wrap">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search student name / roll number"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        <select
                            className="filter-select"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>
                        </select>

                        <select
                            className="filter-select"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                        >
                            <option value="">All Years</option>
                            <option value="FIRST_YEAR">1st Year</option>
                            <option value="SECOND_YEAR">2nd Year</option>
                            <option value="THIRD_YEAR">3rd Year</option>
                            <option value="FOURTH_YEAR">4th Year</option>
                        </select>
                    </div>
                </div>

                {/* Student Cards */}
                <div className="cards-grid">
                    {filteredStudents.map((student) => (
                        <div className="student-card" key={student.id}>
                            <div className="card-top">
                                <div className="avatar-wrap">
                                    <img
                                        src={
                                            student.profileImage
                                                ? `http://localhost:8080/${student.profileImage}`
                                                : "/male-profile-img.png"
                                        }
                                        alt=""
                                        className="student-avatar"
                                    />
                                </div>
                                <div className="student-info">
                                    <p className="student-name">{student.name}</p>
                                    <p className="student-roll">
                                        {student.rollNumber || "—"}
                                    </p>
                                    {student.year && (
                                        <span className="year-badge">
                                            {student.year.replaceAll("_", " ")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <hr className="card-divider" />

                            <div className="card-stats">
                                <div className="stat-box">
                                    <p className="stat-label">Section</p>
                                    <p className="stat-value">{student.section || "—"}</p>
                                </div>
                                <div className="stat-box leaves">
                                    <p className="stat-label">Leaves</p>
                                    <p className="stat-value">{leaveCounts[student.id] || 0}</p>
                                </div>
                            </div>

                            <button
                                className="view-btn"
                                onClick={() => openDrawer(student.id)}
                            >
                                <FontAwesomeIcon icon={faEye} />
                                {" "}View details
                            </button>
                        </div>
                    ))}

                    {filteredStudents.length === 0 && (
                        <div className="empty-state">
                            <h5>No students found</h5>
                            <p>Try changing your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Drawer */}
            {showDrawer && (
                <>
                    <div
                        className="drawer-overlay"
                        onClick={() => setShowDrawer(false)}
                    />
                    <div className="student-drawer">
                        <div className="drawer-header">
                            <h2>Leave Details</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowDrawer(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Profile shown ONCE */}
                        {profile && (
                            <div className="drawer-profile-card">
                                <img
                                    src={
                                        profile.profileImage
                                            ? `http://localhost:8080/${profile.profileImage}`
                                            : "/male-profile-img.png"
                                    }
                                    alt=""
                                    className="drawer-avatar"
                                />

                                <div className="drawer-profile-info">
                                    <h3>{profile.studentName}</h3>
                                    <p className="drawer-dept">{profile.department}</p>

                                    <div className="drawer-tags">
                                        <span className="id-tag">
                                            Student ID: {profile.studentId}
                                        </span>
                                        {profile.year && (
                                            <span className="id-tag">
                                                {formatYear(profile.year)}
                                            </span>
                                        )}
                                        {profile.section && (
                                            <span className="id-tag">
                                                Section {profile.section}
                                            </span>
                                        )}
                                        {profile.semester && (
                                            <span className="id-tag">
                                                Sem {profile.semester}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leave list */}
                        <div className="leave-list">
                            <label className="leave-list-label">
                                Leave Requests ({selectedStudent.length})
                            </label>

                            {selectedStudent.map((leave) => {
                                const duration =
                                    Math.ceil(
                                        (new Date(leave.toDate) - new Date(leave.fromDate)) /
                                            (1000 * 60 * 60 * 24)
                                    ) + 1;

                                const statusIcon =
                                    leave.status === "APPROVED"
                                        ? faCircleCheck
                                        : leave.status === "REJECTED"
                                        ? faCircleXmark
                                        : faClock;

                                return (
                                    <div key={leave.leaveId} className="leave-entry">
                                        {/* Top row: leave type + status */}
                                        <div className="leave-entry-top">
                                            <div className="leave-type-badge">
                                                {leave.leaveType
                                                    ?.toLowerCase()
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                                            </div>

                                            <span
                                                className={`status-tag ${leave.status.toLowerCase()}`}
                                            >
                                                <FontAwesomeIcon icon={statusIcon} />
                                                {" "}{leave.status}
                                            </span>
                                        </div>

                                        {/* Dates row */}
                                        <div className="leave-dates-row">
                                            <FontAwesomeIcon
                                                icon={faCalendarDays}
                                                className="date-icon"
                                            />
                                            <span>
                                                {formatShortDate(leave.fromDate)}
                                                {" "}&rarr;{" "}
                                                {formatShortDate(leave.toDate)}
                                            </span>
                                            <span className="duration-chip">
                                                {duration} {duration === 1 ? "Day" : "Days"}
                                            </span>
                                        </div>

                                        {/* Reason */}
                                        <div className="reason-box">{leave.reason}</div>

                                        {/* Footer: applied date + approver */}
                                        <div className="leave-footer">
                                            <span>
                                                Applied: {formatDate(leave.appliedAt)}
                                            </span>
                                            <span>
                                                Approved by: {leave.approvedBy || "Pending"}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        {leave.status === "PENDING" && (
                                            <div className="drawer-action-buttons">
                                                <button
                                                    className="reject-btn"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            leave.leaveId,
                                                            "REJECTED"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    className="approve-btn"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            leave.leaveId,
                                                            "APPROVED"
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {selectedStudent.length === 0 && (
                                <div className="leave-empty">
                                    No leave requests found.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default FacultyAssignedStudents;