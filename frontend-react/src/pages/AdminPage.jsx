import './AdminPage.css'
import AdminTopBar from '../layout/AdminTopBar'
import AdminCountBox from '../components/AdminCountBox'
import { useEffect, useRef, useState } from 'react'
import { getAllLeaves, statusCounts, searchLeaves, getAllUsers, recentLeaves, searchLeavesBySelecteDate } from '../api'

import { faFile, faHourglassHalf, faCircleCheck, faCircleXmark, faUser, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import AdminSidebar from '../layout/AdminSideBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import { updateStatus, } from '../api'

function AdminPage() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    //Handle search 
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const getRecentLeaves = async (value) => {
        const res = await recentLeaves();
        setFilteredLeaves(res.data);
        setLeave(res.data);
    }

    const handleStatusChange = (selectedStatus) => {
        setStatus(selectedStatus);
        if (selectedStatus === "") {
            getRecentLeaves();
        }

        const filtered = leave.filter((item) => item.status === selectedStatus);
        setFilteredLeaves(filtered);

    }

    const formatDateWithSuffix = (dateString) => {
        if (!dateString) return "----";

        const date = new Date(dateString);
        const day = date.getDate();


        const getSuffix = (d) => {
            if (d >= 11 && d <= 13) return "th";
            switch (d % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        const suffix = getSuffix(day);

        const month = date.toLocaleString("en-IN", { month: "long" });
        const year = date.getFullYear();

        return `${day}${suffix} ${month} ${year}`;
    };

    const [users, setUsers] = useState([]);

    const [leave, setLeave] = useState([]);
    const [count, setCount] = useState(
        {
            pending: 0,
            approved: 0,
            rejected: 0
        }

    )

    const allLeaves = async () => {
        const leaves = await getAllLeaves();
        console.log(leaves.data);
        setLeave(leaves.data);
    }
    const leaveCounts = async () => {
        const statusLeavecounts = await statusCounts();
        console.log(statusLeavecounts.data);
        setCount(statusLeavecounts.data);
    }

const user = JSON.parse(sessionStorage.getItem("user"));

    const handleAprrove = async (id) => {
        
        const leave = await updateStatus(id, user.id, "APPROVED");

        allLeaves();
        getRecentLeaves();
        leaveCounts();

    }
    const handleReject = async (id) => {
        const updateReject = await updateStatus(id, user.id, "REJECTED");
        allLeaves();
        getRecentLeaves();
        leaveCounts();
    }



    const allUsers = async () => {
        const users = await getAllUsers();
        console.log(users.data);
        setUsers(users.data);
    }
    useEffect(() => {
        allLeaves();
        leaveCounts();
        allUsers();
        getRecentLeaves();
    }, [])


    //Search leaves based on input date
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const searchLeavesByDate = async () => {
        const result = await searchLeavesBySelecteDate(startDate, endDate);
        setFilteredLeaves(result.data);
    }

    useEffect(() => {
        if (startDate && endDate) {
            searchLeavesByDate();
        }
    }, [startDate, endDate]);

    return (
        <>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminTopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="main-section">
                <section className="welcome-section">
                    <h2>Dashboard</h2>
                    <p>Welcome back, Admin</p>
                </section>
                <div className="alm-stats">

                    <div className="alm-stat-card alm-stat-blue">
                        <div>
                            <p className="alm-stat-label">TOTAL USERS</p>
                            <h2 className="alm-stat-value">{users.length}</h2>
                            <p className="alm-stat-sub">Registered users</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-blue">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-purple">
                        <div>
                            <p className="alm-stat-label">TOTAL LEAVES</p>
                            <h2 className="alm-stat-value">{leave.length}</h2>
                            <p className="alm-stat-sub">All time</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-purple">
                            <FontAwesomeIcon icon={faFile} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-yellow">
                        <div>
                            <p className="alm-stat-label">PENDING REQUESTS</p>
                            <h2 className="alm-stat-value">{count.pending}</h2>
                            <p className="alm-stat-sub">Still pending</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-yellow">
                            <FontAwesomeIcon icon={faHourglassHalf} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-green">
                        <div>
                            <p className="alm-stat-label">APPROVED LEAVES</p>
                            <h2 className="alm-stat-value">{count.approved}</h2>
                            <p className="alm-stat-sub">Successfully approved</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-green">
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-red">
                        <div>
                            <p className="alm-stat-label">REJECTED LEAVES</p>
                            <h2 className="alm-stat-value">{count.rejected}</h2>
                            <p className="alm-stat-sub">Unfortunately rejected</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-red">
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </div>
                    </div>

                </div>
                <section className="admin-table-card">
                    <div>
                        <div className="admin-table-header">
                            <h2 className="admin-table-title">
                                Recent Leave Requests
                            </h2>
                        </div>
                    </div>

                    <div className="lq-filters">

                        <select
                            className="lq-select"
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>

                        <input
                            type="date"
                            className="lq-select"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />

                        <input
                            type="date"
                            className="lq-select"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />

                        <button
                            className="lq-action-review"
                            onClick={searchLeavesByDate}
                        >
                            Filter
                        </button>

                        <button
                            className="lq-action-review"
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                                setStatus("");
                                getRecentLeaves();
                            }}
                        >
                            Clear
                        </button>

                    </div>

                    <div className="lq-table-wrap">

                        <table className="lq-table">

                            <thead>
                                <tr>
                                    <th>STUDENT</th>
                                    <th>LEAVE DETAILS</th>
                                    <th>DURATION</th>
                                    <th>APPLIED</th>
                                    <th>APPROVED BY</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredLeaves.length > 0 ? (
                                    filteredLeaves.map((leave) => (

                                        <tr key={leave.id}>

                                            <td>
                                                <div className="lq-student-cell">

                                                    <div className="lq-avatar">
                                                        {leave.user?.name?.charAt(0)}
                                                    </div>

                                                    <div>
                                                        <div className="lq-student-name">
                                                            {leave.user?.name}
                                                        </div>

                                                        <div className="lq-student-meta">
                                                            {leave.user?.rollNumber}
                                                        </div>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <div className="lq-leave-type">
                                                    {leave.leaveType
                                                        ?.toLowerCase()
                                                        .replace(/_/g, " ")
                                                        .replace(/\b\w/g, c => c.toUpperCase())
                                                    }
                                                </div>

                                                <div className="lq-leave-reason">
                                                    {leave.reason}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="lq-duration-range">
                                                    {formatDateWithSuffix(leave.fromDate)}
                                                </div>

                                                <div className="lq-duration-days">
                                                    To {formatDateWithSuffix(leave.toDate)}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="lq-applied-at">
                                                    {
                                                        leave.appliedAt
                                                            ? new Date(leave.appliedAt)
                                                                .toLocaleString("en-IN", {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })
                                                            : "----"
                                                    }
                                                </div>
                                            </td>

                                            <td>
                                                {leave.approvedBy?.name || "----"}
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

                                                {
                                                    leave.status === "PENDING" ? (

                                                        <div className="lq-actions">

                                                            <button
                                                                className="lq-action-approve"
                                                                onClick={() => handleAprrove(leave.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </button>

                                                            <button
                                                                className="lq-action-reject"
                                                                onClick={() => handleReject(leave.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faXmark} />
                                                            </button>

                                                        </div>

                                                    ) : (
                                                        "—"
                                                    )
                                                }

                                            </td>

                                        </tr>

                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="lq-empty">
                                            No leave requests found
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>
            </div>
        </>
    )
}
export default AdminPage