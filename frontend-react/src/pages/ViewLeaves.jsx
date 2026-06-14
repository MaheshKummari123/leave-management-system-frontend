import { useEffect, useState } from "react";
import NavBar from "../layout/NavBar";
import { faFile, faHourglassHalf, faCircleCheck, faCircleXmark, faCalendar, faArrowRotateLeft, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getAllLeavesById, searchLeaves, studentStatusCounts } from "../api";
import CountBox from "../components/CountBox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import './ViewLeaves.css'

function ViewLeaves() {
    const [count, setCount] = useState({
        pending: 0,
        approved: 0,
        rejected: 0
    });
    const [leaves, setLeaves] = useState([]);

    //Handle Leave Search
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const [filteredLeaves, setFilteredLeaves] = useState([]);

    const getLeaves = async () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user?.id;

        const result = await getAllLeavesById(userId);
        const counts = await studentStatusCounts(userId);
        setCount(counts.data);
        setLeaves(result.data);
        setFilteredLeaves(result.data);
    }

    const handleSearch = async (value) => {
        setKeyword(value);
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userId = user.id;
        const res = await searchLeaves(
            userId,
            status || null,
            start || null,
            end || null,
            value || null
        );
        setFilteredLeaves(res.data);
    }

    const handleStatusChange = (selectedStatus) => {
        setStatus(selectedStatus);
        if (selectedStatus === "") {
            getLeaves();
        }

        const filtered = leaves.filter((item) => item.status === selectedStatus);
        setFilteredLeaves(filtered);

    }

    function getInitials(name) {
        if (!name) return "?";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    //Format Date  18 OCT, 9:54 PM
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
    };

    //Calculting leave days
    const calculateLeaveDays = (fromDate, toDate) => {
        const days =
            Math.ceil(
                (new Date(toDate) - new Date(fromDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        return `${days} ${days === 1 ? "Day" : "Days"}`;
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

        getLeaves();
    }, [])

    return (
        <div className="bg-white">
            <NavBar />

            <section className="container mt-5">
                <div className="vl-hero-section">

                    <div className="vl-hero-content">

                        <div className="vl-hero-badge">
                            📋 Leave Management Portal
                        </div>

                        <h1 className="vl-hero-title">
                            My Leaves
                        </h1>

                        <p className="vl-hero-subtitle">
                            Track all your leave requests, approvals and leave history from one place.
                        </p>

                        <div className="vl-hero-stats">

                            <div className="vl-stat-card">
                                <span className="vl-stat-number">
                                    {count.pending + count.approved + count.rejected}
                                </span>
                                <span className="vl-stat-label">
                                    Total Leaves
                                </span>
                            </div>

                            <div className="vl-stat-card">
                                <span className="vl-stat-number">
                                    {count.pending}
                                </span>
                                <span className="vl-stat-label">
                                    Pending
                                </span>
                            </div>

                            <div className="vl-stat-card">
                                <span className="vl-stat-number">
                                    {count.approved}
                                </span>
                                <span className="vl-stat-label">
                                    Approved
                                </span>
                            </div>

                            <div className="vl-stat-card">
                                <span className="vl-stat-number">
                                    {count.rejected}
                                </span>
                                <span className="vl-stat-label">
                                    Rejected
                                </span>
                            </div>

                        </div>

                    </div>

                </div>
            </section>


            <section className="container mt-5 border p-3 rounded">
                <div className="leave-header">
                    <div>
                        <h2>Leave Requests</h2>
                        <p>Manage and review student leave applications</p>
                    </div>
                    <span className="lq-showing-text">
                        Total Requests: {leaves.length}
                    </span>

                </div>

                <div className="vl-filters">

                    <div className="vl-search-wrap">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="vl-search-icon"
                        />

                        <input
                            type="text"
                            className="vl-search"
                            placeholder="Search leave reason..."
                            value={keyword}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="vl-select"
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <span className="vl-showing-text">
                        {filteredLeaves.length} Results
                    </span>

                    <button
                        className="vl-reset-btn"
                        onClick={() => handleStatusChange("")}
                    >
                        Reset Filters
                    </button>

                </div>

                <div className="lq-table-card mt-3">
                    {/* Header */}
                    <div className="lq-table-wrap">
                        <table className="lq-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>DURATION</th>
                                    <th>REASON</th>
                                    <th>STATUS</th>
                                    <th>APPROVED BY</th>
                                    <th>APPLIED AT</th>
                                </tr>
                            </thead>

                            <tbody>
                                {leaves.length > 0 ? (
                                    filteredLeaves.map((leave, index) => (
                                        <tr key={leave.id}>
                                            <td>
                                                <div className="fw-bold">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="lq-student-cell">
                                                    <div className="lq-avatar">
                                                        {leave.user.profileImage
                                                            ? <img src={`http://localhost:8080/${leave.user.profileImage}`} alt="" />
                                                            : getInitials(leave.user.name)
                                                        }
                                                    </div>
                                                    <div>
                                                        <div className="lq-student-name">{leave.user.name}</div>
                                                        <div className="lq-student-meta">
                                                            {leave.user.rollNumber} • {formatYear(leave.user.year)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="lq-duration-range">
                                                    {leave.fromDate} - {leave.toDate}
                                                </div>
                                                <div className="lq-duration-days">{calculateLeaveDays(leave.fromDate, leave.toDate)}</div>
                                            </td>

                                            <td>
                                                <div className="lq-leave-type">
                                                    {leave.leaveType && (
                                                        leave.leaveType
                                                            .toLowerCase()
                                                            .replace(/_/g, " ")
                                                            .replace(/\b\w/g, c => c.toUpperCase())
                                                    )}
                                                </div>
                                                <div className="lq-leave-reason">
                                                    {leave.reason}
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`lq-status-pill ${leave.status === "APPROVED"
                                                        ? "pill-approved"
                                                        : leave.status === "REJECTED"
                                                            ? "pill-rejected"
                                                            : "pill-pending"
                                                        }`}
                                                >
                                                    {leave.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="lq-student-name">
                                                    {leave.approvedBy?.name || "----"}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="lq-applied-at">
                                                    {formatDate(leave.appliedAt)}
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="lq-empty">
                                            No leave requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>
        </div>
    )
}
export default ViewLeaves