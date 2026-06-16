import { useEffect, useState } from "react";
import FacultyNavBar from "../layout/FacultyNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch, faDownload, faCheckDouble,
    faHourglassHalf, faCalendarDay, faCircleCheck,
    faCircleXmark, faCheck, faXmark, faEye,
    faChevronLeft, faChevronRight, faPaperclip, faPenToSquare
} from "@fortawesome/free-solid-svg-icons";
import "./FacultyLeaveQueue.css";
import { getStudentLeavesByFacultyId, updateStatus } from "../api";


const PAGE_SIZE = 10;

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}


export default function LeaveQueuePage() {
    const [leaves, setLeaves] = useState([]);
    const user = JSON.parse(sessionStorage.getItem('user'));

    //Bulk approval modification
    const [toast, setToast] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchingStudentLeaves = async () => {

        const res = await getStudentLeavesByFacultyId(user.id);
        console.log(res.data);
        setLeaves(res.data);
    }


    const [search, setSearch] = useState("");

    const [sort, setSort] = useState("Newest First");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);

    const pending = leaves.filter(l => l.status === "PENDING").length;
    const today = new Date();

    const todayLeaves = leaves.filter(leave => {
        const from = new Date(leave.fromDate);
        const to = new Date(leave.toDate);

        return today >= from && today <= to;
    }).length;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const approvedWeek = leaves.filter(leave =>
        leave.status === "APPROVED" &&
        new Date(leave.updatedAt || leave.appliedAt) >= startOfWeek
    ).length;


    const rejectedWeek = leaves.filter(leave =>
        leave.status === "REJECTED" &&
        new Date(leave.updatedAt || leave.appliedAt) >= startOfWeek
    ).length;

    //Filtering leave type
    const [filterType, setFilterType] = useState("ALL");

    const filtered = leaves.filter((leave) => {

        const matchesSearch =
            leave.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            leave.user?.rollNumber?.toLowerCase().includes(search.toLowerCase());

        const matchesType =
            filterType === "ALL" ||
            leave.leaveType === filterType;

        return matchesSearch && matchesType;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === "Newest First") return b.id - a.id;
        if (sort === "Oldest First") return a.id - b.id;
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const allChecked = paginated.length > 0 && paginated.every(l => selected.includes(l.id));

    const toggleAll = () => {
        if (allChecked) setSelected(s => s.filter(id => !paginated.find(l => l.id === id)));
        else setSelected(s => [...new Set([...s, ...paginated.map(l => l.id)])]);
    };

    const toggleOne = (id) => {
        setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
    };

    const handleApprove = async (id) => {
        try {
            await updateStatus(id, user.id, "APPROVED");
            setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "APPROVED" } : l));
            setToast({ type: "success", text: "Leave approved successfully." });
        } catch (err) {
            setToast({ type: "error", text: "Failed to approve leave. Please try again." });
        }
        setEditingId(null);
    };

    const handleReject = async (id) => {
        try {
            await updateStatus(id, user.id, "REJECTED");
            setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "REJECTED" } : l));
            setToast({ type: "success", text: "Leave rejected successfully." });
        } catch (err) {
            setToast({ type: "error", text: "Failed to reject leave. Please try again." });
        }
        setEditingId(null);
    };

    const handleBulkApprove = async () => {
        if (selected.length === 0) {
            setToast({ type: "error", text: "Please select at least one leave request." });
            return;
        }

        const pendingSelected = leaves.filter(l => selected.includes(l.id) && l.status === "PENDING");

        if (pendingSelected.length === 0) {
            setToast({ type: "error", text: "Selected leave(s) are already approved/rejected. Only pending leaves can be bulk approved." });
            return;
        }

        try {
            await Promise.all(
                pendingSelected.map(l => updateStatus(l.id, user.id, "APPROVED"))
            );

            setLeaves(prev =>
                prev.map(l =>
                    pendingSelected.find(p => p.id === l.id)
                        ? { ...l, status: "APPROVED" }
                        : l
                )
            );

            const skipped = selected.length - pendingSelected.length;
            setToast({
                type: "success",
                text: skipped > 0
                    ? `Approved ${pendingSelected.length} request(s). ${skipped} already-decided request(s) were skipped.`
                    : `Approved ${pendingSelected.length} request(s).`
            });
        } catch (err) {
            setToast({ type: "error", text: "Some requests failed to update. Please refresh and try again." });
        }

        setSelected([]);
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
    };

    const formatDurationDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
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


    const calculateLeaveDays = (fromDate, toDate) => {
        const days =
            Math.ceil(
                (new Date(toDate) - new Date(fromDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        return `${days} ${days === 1 ? "Day" : "Days"}`;
    };



    useEffect(() => {
        fetchingStudentLeaves();
    }, []);

    const handleExport = () => {

        const csvData = sorted.map(leave => ({
            Student: leave.user.name,
            RollNumber: leave.user.rollNumber,
            Year: leave.user.year,
            LeaveType: leave.leaveType,
            Status: leave.status,
            FromDate: leave.fromDate,
            ToDate: leave.toDate,
            Reason: leave.reason
        }));

        const headers = Object.keys(csvData[0]).join(",");

        const rows = csvData.map(row =>
            Object.values(row)
                .map(value => `"${value}"`)
                .join(",")
        );

        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "leave-requests.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <>
            <FacultyNavBar />

            {toast && (
                <div className={`lq-toast lq-toast--${toast.type}`}>
                    <span>{toast.text}</span>
                    <button onClick={() => setToast(null)} aria-label="Dismiss">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            )}

            <div className="lq-page">

                {/* Header */}
                <div className="lq-header">
                    <div>
                        <h1 className="lq-title">Leave Requests Queue</h1>
                        <p className="lq-subtitle">Manage and review pending student leave applications.</p>
                    </div>
                    <div className="lq-header-actions">
                        <button
                            className="lq-btn-outline"
                            onClick={handleExport}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            Export List
                        </button>
                        <button
                            className={`lq-btn-primary ${selected.length === 0 ? "lq-btn-disabled" : ""}`}
                            onClick={handleBulkApprove}
                        >
                            <FontAwesomeIcon icon={faCheckDouble} /> Bulk Approve
                            {selected.length > 0 && <span className="lq-bulk-count">{selected.length}</span>}
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="lq-stats">
                    <div className="lq-stat-card lq-stat-yellow">
                        <div>
                            <p className="lq-stat-label">PENDING REVIEW</p>
                            <h2 className="lq-stat-value">{pending}</h2>
                            <p className="lq-stat-sub">Requires immediate action</p>
                        </div>
                        <div className="lq-stat-icon lq-icon-yellow">
                            <FontAwesomeIcon icon={faHourglassHalf} />
                        </div>
                    </div>
                    <div className="lq-stat-card lq-stat-blue">
                        <div>
                            <p className="lq-stat-label">TODAY'S LEAVES</p>
                            <h2 className="lq-stat-value">{todayLeaves}</h2>
                            <p className="lq-stat-sub">Currently on leave</p>
                        </div>
                        <div className="lq-stat-icon lq-icon-blue">
                            <FontAwesomeIcon icon={faCalendarDay} />
                        </div>
                    </div>
                    <div className="lq-stat-card lq-stat-green">
                        <div>
                            <p className="lq-stat-label">APPROVED THIS WEEK</p>
                            <h2 className="lq-stat-value">{approvedWeek}</h2>
                            <p className="lq-stat-sub">Successfully processed</p>
                        </div>
                        <div className="lq-stat-icon lq-icon-green">
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </div>
                    </div>
                    <div className="lq-stat-card lq-stat-red">
                        <div>
                            <p className="lq-stat-label">REJECTED THIS WEEK</p>
                            <h2 className="lq-stat-value">{rejectedWeek}</h2>
                            <p className="lq-stat-sub">Declined requests</p>
                        </div>
                        <div className="lq-stat-icon lq-icon-red">
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="lq-table-card">
                    {/* Filters */}
                    <div className="lq-filters">
                        <div className="lq-search-wrap">
                            <FontAwesomeIcon icon={faSearch} className="lq-search-icon" />
                            <input
                                type="text"
                                className="lq-search"
                                placeholder="Search by student name or ID."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                        <select
                            className="lq-select"
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="ALL">All Leave Types</option>
                            <option value="SICK">Sick</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="FAMILY_FUNCTION">Family Function</option>
                            <option value="ACADEMIC_EVENT">Academic Event</option>
                            <option value="EMERGENCY">Emergency</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <select className="lq-select" value={sort}
                            onChange={e => setSort(e.target.value)}>
                            <option>Newest First</option>
                            <option>Oldest First</option>
                        </select>
                        <span className="lq-showing-text">
                            Showing 1-{Math.min(PAGE_SIZE, sorted.length)} of {filtered.filter(l => l.status === "PENDING").length} pending requests
                        </span>
                    </div>

                    {/* Table */}
                    <div className="lq-table-wrap">
                        <table className="lq-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
                                    <th>STUDENT</th>
                                    <th>LEAVE DETAILS</th>
                                    <th>DURATION</th>
                                    <th>SUBMITTED</th>
                                    <th>QUICK ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(leave => (
                                    <tr key={leave.id} className={selected.includes(leave.id) ? "lq-row-selected" : ""}>
                                        <td>
                                            <input type="checkbox"
                                                checked={selected.includes(leave.id)}
                                                onChange={() => toggleOne(leave.id)} />
                                        </td>
                                        <td>
                                            <div className="lq-student-cell">
                                                <div className="lq-avatar">
                                                    {leave.user.profileImage
                                                        ? <img src={leave.user.profileImage} alt="" />
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
                                            <div className="lq-leave-type">
                                                {leave.leaveType && (
                                                    leave.leaveType
                                                        .toLowerCase()
                                                        .replace(/_/g, " ")
                                                        .replace(/\b\w/g, c => c.toUpperCase())
                                                )}
                                            </div>
                                            <div className="lq-leave-reason">{leave.reason}</div>
                                            {leave.attachment && (
                                                <AttachmentTag label={leave.attachment} type={leave.attachmentType} />
                                            )}
                                        </td>
                                        <td>
                                            <div className="lq-duration-range">
                                                {formatDurationDate(leave.fromDate)} – {formatDurationDate(leave.toDate)}
                                            </div>
                                            <div className="lq-duration-days">{calculateLeaveDays(leave.fromDate, leave.toDate)}</div>
                                        </td>
                                        <td>
                                            <div className="lq-applied-at">{formatDate(leave.appliedAt)}</div>
                                            {leave.urgent && (
                                                <div className="lq-urgent-badge">
                                                    🔴 Starts in 2 days
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {leave.status === "PENDING" || editingId === leave.id ? (
                                                <div className="lq-actions">
                                                    <button className="lq-action-approve" title="Approve"
                                                        onClick={() => handleApprove(leave.id)}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                    <button className="lq-action-reject" title="Reject"
                                                        onClick={() => handleReject(leave.id)}>
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                                    {editingId === leave.id ? (
                                                        <button className="lq-action-review" title="Cancel"
                                                            onClick={() => setEditingId(null)}>
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <button className="lq-action-review" title="Review">
                                                            Review
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="lq-completed-cell">
                                                    <span className={`lq-status-pill ${leave.status === "APPROVED" ? "pill-approved" : "pill-rejected"}`}>
                                                        {leave.status}
                                                    </span>
                                                    <button className="lq-edit-action" title="Edit decision"
                                                        onClick={() => setEditingId(leave.id)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {paginated.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="lq-empty">No leave requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="lq-pagination">
                        <span className="lq-pagination-info">
                            Showing <b>{(page - 1) * PAGE_SIZE + 1}</b> to <b>{Math.min(page * PAGE_SIZE, sorted.length)}</b> of <b>{sorted.length}</b> results
                        </span>
                        <div className="lq-pagination-controls">
                            <button className="lq-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p}
                                    className={`lq-page-btn ${p === page ? "lq-page-active" : ""}`}
                                    onClick={() => setPage(p)}>
                                    {p}
                                </button>
                            ))}
                            <button className="lq-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}