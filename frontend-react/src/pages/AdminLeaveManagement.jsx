import { useEffect, useState } from "react";
import AdminSidebar from "../layout/AdminSideBar"
import AdminTopBar from "../layout/AdminTopBar"
import {
    faFile, faHourglassHalf, faCircleCheck, faCircleXmark,
    faSearch, faCheck, faXmark, faTrash, faEye, faRotateLeft,
    faChevronLeft, faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { deleteLeave, getAllLeaves, searchLeaves, statusCounts, updateStatus } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import './AdminLeaveManagement.css'

const PAGE_SIZE = 8;

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function dayCount(from, to) {
    if (!from || !to) return null;
    const f = new Date(from);
    const t = new Date(to);
    if (isNaN(f.getTime()) || isNaN(t.getTime())) return null;
    const diff = Math.round((t - f) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : null;
}

function formatLeaveType(type) {
    if (!type) return "—";
    return type
        .toLowerCase()
        .split("_")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function RolePill({ role }) {
    const map = {
        ADMIN: "role-pill pill-admin",
        FACULTY: "role-pill pill-faculty",
        STUDENT: "role-pill pill-student",
    };
    return <span className={map[role] || "role-pill pill-student"}>{role}</span>;
}

function AdminLeaveManagement() {

    const [leaves, setLeaves] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [leaveType, setLeaveType] = useState("");

    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const [selectedLeave, setSelectedLeave] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [open, setOpen] = useState(false);

    const [count, setCount] = useState(
        {
            pending: 0,
            approved: 0,
            rejected: 0
        }
    );

    const allLeaves = async () => {
        setLoading(true);
        try {
            const leave = await getAllLeaves();
            setLeaves(leave.data);
            setFilteredLeaves(leave.data);
        } finally {
            setLoading(false);
        }
    }

    const leaveCounts = async () => {
        const statusLeavecounts = await statusCounts();
        setCount(statusLeavecounts.data);
    }

    useEffect(() => {
        allLeaves();
        leaveCounts();
    }, [])

    // Re-run search whenever any filter changes
    const runSearch = async ({
        nextKeyword = keyword,
        nextStatus = status,
        nextStart = start,
        nextEnd = end,
    } = {}) => {
        setLoading(true);
        try {
            const res = await searchLeaves(
                null,
                nextStatus || null,
                nextStart || null,
                nextEnd || null,
                nextKeyword || null
            );
            setFilteredLeaves(res.data);
            setPage(1);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (value) => {
        setKeyword(value);
        runSearch({ nextKeyword: value });
    }

    const handleStatusChange = (value) => {
        setStatus(value);
        runSearch({ nextStatus: value });
    }

    const handleStartChange = (value) => {
        setStart(value);
        runSearch({ nextStart: value });
    }

    const handleEndChange = (value) => {
        setEnd(value);
        runSearch({ nextEnd: value });
    }

    const handleLeaveTypeChange = (value) => {
        setLeaveType(value);
        setPage(1);
    }

    const handleResetFilters = () => {
        setKeyword("");
        setStatus("");
        setStart("");
        setEnd("");
        setLeaveType("");
        setPage(1);
        allLeaves();
    }
    const user = JSON.parse(sessionStorage.getItem("user"));
    const handleApprove = async (id) => {
        setActionLoadingId(id);
        try {

            await updateStatus(id, user.id, "APPROVED");
            await Promise.all([allLeaves(), leaveCounts()]);
        } finally {
            setActionLoadingId(null);
        }
    }

    const handleReject = async (id) => {
        setActionLoadingId(id);
        try {

            await updateStatus(id, user.id, "REJECTED");
            await Promise.all([allLeaves(), leaveCounts()]);
        } finally {
            setActionLoadingId(null);
        }
    }

    const handleDelete = async (id) => {
        setActionLoadingId(id);
        try {
            await deleteLeave(id);
            await Promise.all([allLeaves(), leaveCounts()]);
        } finally {
            setActionLoadingId(null);
            setConfirmDeleteId(null);
        }
    }

    // Apply client-side leave type filter (since search API doesn't take it)
    const typeFiltered = leaveType
        ? filteredLeaves.filter(l => l.leaveType === leaveType)
        : filteredLeaves;

    const totalPages = Math.max(1, Math.ceil(typeFiltered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedLeaves = typeFiltered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const hasActiveFilters = keyword || status || start || end || leaveType;

    return (
        <>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminTopBar
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />
            <div className="alm-page">

                {/* Header */}
                <div className="alm-header">
                    <div>
                        <h1 className="alm-title">LeaveFlow</h1>
                        <p className="alm-subtitle">View, review, and manage all leave requests across the platform.</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="alm-stats">
                    <div className="alm-stat-card alm-stat-purple">
                        <div>
                            <p className="alm-stat-label">TOTAL LEAVES</p>
                            <h2 className="alm-stat-value">{leaves.length}</h2>
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

                {/* Table Card */}
                <div className="alm-table-card">
                    {/* Filters */}
                    <div className="alm-filters">
                        <div className="alm-search-wrap">
                            <FontAwesomeIcon icon={faSearch} className="alm-search-icon" />
                            <input
                                type="search"
                                className="alm-search"
                                placeholder="Search users..."
                                value={keyword}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <select className="alm-select" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>

                        <select className="alm-select" value={leaveType} onChange={(e) => handleLeaveTypeChange(e.target.value)}>
                            <option value="">All Types</option>
                            <option value="SICK">Sick</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="FAMILY_FUNCTION">Family Function</option>
                            <option value="ACADEMIC_EVENT">Academic Event</option>
                            <option value="EMERGENCY">Emergency</option>
                            <option value="OTHER">Other</option>
                        </select>

                        <div className="alm-date-filter">
                            <label className="alm-date-label">From</label>
                            <input
                                type="date"
                                className="alm-date-input"
                                value={start}
                                onChange={(e) => handleStartChange(e.target.value)}
                            />
                        </div>
                        <div className="alm-date-filter">
                            <label className="alm-date-label">To</label>
                            <input
                                type="date"
                                className="alm-date-input"
                                value={end}
                                onChange={(e) => handleEndChange(e.target.value)}
                            />
                        </div>

                        {hasActiveFilters && (
                            <button className="alm-reset-btn" onClick={handleResetFilters} title="Reset filters">
                                <FontAwesomeIcon icon={faRotateLeft} /> Reset
                            </button>
                        )}

                        <span className="alm-showing-text">
                            Showing {typeFiltered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
                            -{Math.min(currentPage * PAGE_SIZE, typeFiltered.length)} of {typeFiltered.length}
                        </span>
                    </div>

                    {/* Table */}
                    <div className="alm-table-wrap">
                        <table className="alm-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>USER</th>
                                    <th>EMAIL</th>
                                    <th>ROLE</th>
                                    <th>TYPE</th>
                                    <th>STATUS</th>
                                    <th>DURATION</th>
                                    <th>DAYS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="alm-empty">Loading leave requests…</td>
                                    </tr>
                                ) : paginatedLeaves.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="alm-empty">No leave requests found.</td>
                                    </tr>
                                ) : (
                                    paginatedLeaves.map((leave, index) => (
                                        <tr key={leave.id}>
                                            <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                            <td>
                                                <div className="alm-user-cell">
                                                    <div className="alm-avatar">
                                                        {getInitials(leave.user?.name)}
                                                    </div>
                                                    <div className="alm-user-name">{leave.user?.name}</div>
                                                </div>
                                            </td>
                                            <td className="alm-email">{leave.user?.email}</td>
                                            <td><RolePill role={leave.user?.role} /></td>
                                            <td>
                                                <span className="alm-type-pill">{formatLeaveType(leave.leaveType)}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`alm-status-pill ${leave.status === "PENDING" ? "pill-pending" :
                                                        leave.status === "APPROVED" ? "pill-approved" :
                                                            leave.status === "REJECTED" ? "pill-rejected" : ""
                                                        }`}
                                                >
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="alm-duration">{formatDate(leave.fromDate)} → {formatDate(leave.toDate)}</td>
                                            <td className="alm-days">{dayCount(leave.fromDate, leave.toDate) ?? "—"}</td>
                                            <td>
                                                <div className="alm-actions">
                                                    <button
                                                        className="alm-action-view"
                                                        title="View details"
                                                        onClick={() => setSelectedLeave(leave)}
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    {
                                                        leave.status === "PENDING" ? (
                                                            <>
                                                                <button
                                                                    className="alm-action-approve"
                                                                    title="Approve"
                                                                    disabled={actionLoadingId === leave.id}
                                                                    onClick={() => handleApprove(leave.id)}
                                                                >
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </button>
                                                                <button
                                                                    className="alm-action-reject"
                                                                    title="Reject"
                                                                    disabled={actionLoadingId === leave.id}
                                                                    onClick={() => handleReject(leave.id)}
                                                                >
                                                                    <FontAwesomeIcon icon={faXmark} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="alm-no-action">—</span>
                                                        )
                                                    }
                                                    <button
                                                        className="alm-action-delete"
                                                        title="Delete leave"
                                                        disabled={actionLoadingId === leave.id}
                                                        onClick={() => setConfirmDeleteId(leave.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && typeFiltered.length > 0 && (
                        <div className="alm-pagination">
                            <button
                                className="alm-page-btn"
                                disabled={currentPage === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} /> Prev
                            </button>
                            <span className="alm-page-info">Page {currentPage} of {totalPages}</span>
                            <button
                                className="alm-page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                Next <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Leave Details Modal */}
            {selectedLeave && (
                <div className="alm-modal-overlay" onClick={() => setSelectedLeave(null)}>
                    <div className="alm-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="alm-modal-header">
                            <h3>Leave Request Details</h3>
                            <button className="alm-modal-close" onClick={() => setSelectedLeave(null)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <div className="alm-modal-body">

                            {/* User summary */}
                            <div className="alm-modal-user-card">
                                <div className="alm-avatar alm-avatar-lg">
                                    {getInitials(selectedLeave.user?.name)}
                                </div>
                                <div className="alm-modal-user-info">
                                    <div className="alm-modal-user-name">{selectedLeave.user?.name}</div>
                                    <div className="alm-modal-user-email">{selectedLeave.user?.email}</div>
                                </div>
                                <RolePill role={selectedLeave.user?.role} />
                            </div>

                            {/* Status banner */}
                            <div className={`alm-modal-status-banner ${selectedLeave.status.toLowerCase()}`}>
                                <span className="alm-modal-status-label">Request Status</span>
                                <span
                                    className={`alm-status-pill ${selectedLeave.status === "PENDING" ? "pill-pending" :
                                        selectedLeave.status === "APPROVED" ? "pill-approved" :
                                            selectedLeave.status === "REJECTED" ? "pill-rejected" : ""
                                        }`}
                                >
                                    {selectedLeave.status}
                                </span>
                            </div>

                            {/* Info grid */}
                            <div className="alm-modal-grid">
                                <div className="alm-modal-info-card">
                                    <span className="alm-modal-label">Leave Type</span>
                                    <p className="alm-modal-value">{formatLeaveType(selectedLeave.leaveType)}</p>
                                </div>
                                <div className="alm-modal-info-card">
                                    <span className="alm-modal-label">Duration</span>
                                    <p className="alm-modal-value">
                                        {dayCount(selectedLeave.fromDate, selectedLeave.toDate) ?? "—"} day(s)
                                    </p>
                                </div>
                                <div className="alm-modal-info-card">
                                    <span className="alm-modal-label">From</span>
                                    <p className="alm-modal-value">{formatDate(selectedLeave.fromDate)}</p>
                                </div>
                                <div className="alm-modal-info-card">
                                    <span className="alm-modal-label">To</span>
                                    <p className="alm-modal-value">{formatDate(selectedLeave.toDate)}</p>
                                </div>
                                <div className="alm-modal-info-card alm-modal-info-card--span">
                                    <span className="alm-modal-label">Applied At</span>
                                    <p className="alm-modal-value">
                                        {selectedLeave.appliedAt ? formatDate(selectedLeave.appliedAt) : "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="alm-modal-section">
                                <span className="alm-modal-label">Reason</span>
                                <p className="alm-modal-reason">{selectedLeave.reason || "No reason provided."}</p>
                            </div>

                            {/* Approved/Rejected by */}
                            {selectedLeave.approvedBy && (
                                <div className="alm-modal-approver">
                                    <FontAwesomeIcon
                                        icon={selectedLeave.status === "REJECTED" ? faXmark : faCheck}
                                        className={`alm-modal-approver-icon ${selectedLeave.status === "REJECTED" ? "rejected" : "approved"}`}
                                    />
                                    <span>
                                        {selectedLeave.status === "REJECTED" ? "Rejected by" : "Approved by"}{" "}
                                        <strong>{selectedLeave.approvedBy?.name}</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="alm-modal-footer">
                            {selectedLeave.status === "PENDING" && (
                                <>
                                    <button
                                        className="alm-modal-action approve"
                                        onClick={() => { handleApprove(selectedLeave.id); setSelectedLeave(null); }}
                                    >
                                        <FontAwesomeIcon icon={faCheck} /> Approve
                                    </button>
                                    <button
                                        className="alm-modal-action reject"
                                        onClick={() => { handleReject(selectedLeave.id); setSelectedLeave(null); }}
                                    >
                                        <FontAwesomeIcon icon={faXmark} /> Reject
                                    </button>
                                </>
                            )}
                            <button className="alm-modal-action close" onClick={() => setSelectedLeave(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteId !== null && (
                <div className="alm-modal-overlay" onClick={() => setConfirmDeleteId(null)}>
                    <div className="alm-modal alm-modal-small" onClick={(e) => e.stopPropagation()}>
                        <div className="alm-modal-header">
                            <h3>Delete Leave Request</h3>
                            <button className="alm-modal-close" onClick={() => setConfirmDeleteId(null)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className="alm-modal-body">
                            <p>Are you sure you want to permanently delete this leave request? This action cannot be undone.</p>
                        </div>
                        <div className="alm-modal-footer">
                            <button
                                className="alm-modal-action reject"
                                disabled={actionLoadingId === confirmDeleteId}
                                onClick={() => handleDelete(confirmDeleteId)}
                            >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <button className="alm-modal-action close" onClick={() => setConfirmDeleteId(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default AdminLeaveManagement