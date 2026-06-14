import { useEffect, useState } from "react";
import CountBox from "../components/CountBox";
import FacultyNavBar from "../layout/FacultyNavBar";
import './FacultyPage.css'
import {
    getfacultyStatusRequestCounts,
    getStudentLeaves,
    getTop5FacultyLeavesByStatus,
    getTop5StudentLeavesByFacultyId,
    searchFacultyLeaves,
    searchLeaves,
    updateStatus
} from "../api";
import {
    faFile, faHourglassHalf, faCircleCheck, faCircleXmark,
    faCheck, faXmark, faBell, faSearch, faMagnifyingGlass,
    faCalendarDays, faChartBar, faChartPie, faUser,
    faClock, faTriangleExclamation, faEye
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* ─── tiny bar-chart helper (pure CSS) ─── */
const BAR_DATA = [
    { month: "Jan", val: 30 },
    { month: "Feb", val: 45 },
    { month: "Mar", val: 38 },
    { month: "Apr", val: 60 },
    { month: "May", val: 52 },
    { month: "Jun", val: 70 },
    { month: "Jul", val: 48 },
    { month: "Aug", val: 55 },
    { month: "Sep", val: 42 },
    { month: "Oct", val: 65 },
    { month: "Nov", val: 50 },
    { month: "Dec", val: 58 },
];

/* ─── mock recent activity ─── */
const ACTIVITY = [
    { type: "approved", name: "Rahul Sharma", time: "2 mins ago" },
    { type: "rejected", name: "Priya Nair", time: "18 mins ago" },
    { type: "approved", name: "Kiran Mehta", time: "1 hr ago" },
    { type: "approved", name: "Ananya Reddy", time: "3 hrs ago" },
    { type: "rejected", name: "Mohammed Zaid", time: "Yesterday" },
];

function FacultyPage() {
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [search, setSearch] = useState("");
    const [leaves, setLeaves] = useState([]);
    const [count, setCount] = useState({ pending: 0, approved: 0, rejected: 0 });
    const [detailLeave, setDetailLeave] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("user"));

    //Recent Activity Thing
    const [activity, setActivity] = useState([]);

    /* ── fetch ── */
    const fetchLeaves = async () => {
        if (!user) return;
        const [result, counts] = await Promise.all([
            getTop5StudentLeavesByFacultyId(user.id),
            getfacultyStatusRequestCounts(user.id),
        ]);
        setCount(counts.data);
        setLeaves(result.data);
        setActivity(
            result.data.map((leave) => ({
                type: leave.status?.toLowerCase(),
                name: leave.user?.name,
                time: leave.appliedAt
            }))
        );
    };

    useEffect(() => { fetchLeaves(); }, []);

    /* ── actions ── */
    const handleApprove = async (id) => {
        await updateStatus(id, user.id, "APPROVED");
        fetchLeaves();
        setDetailLeave(null);
    };
    const handleReject = async (id) => {
        await updateStatus(id, user.id, "REJECTED");
        fetchLeaves();
        setDetailLeave(null);
    };

    /* ── search / filter ── */
    const handleSearch = async (
        selectedStatus = status,
        fromDate = startDate,
        toDate = endDate
    ) => {
        if (!user) return;

        setStatus(selectedStatus || "");

        const res = await getTop5FacultyLeavesByStatus(
            user.id,
            selectedStatus || null,
            fromDate || null,
            toDate || null
        );

        setLeaves(res.data);
    };

    const handleStatusChange = async (newStatus) => {

        if (!user) return;

        setStatus(newStatus);

        if (!newStatus) {
            fetchLeaves();   // <-- load default recent requests
            return;
        }

        const res = await getTop5FacultyLeavesByStatus(
            user.id,
            newStatus
        );
        console.log(
            newStatus,
            res.data.map(x => x.status)
        );

        setLeaves(res.data);
    };

    const filteredLeaves = leaves.filter((l) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            l.user?.name?.toLowerCase().includes(q) ||
            l.user?.rollNumber?.toLowerCase().includes(q) ||
            l.user?.department?.toLowerCase().includes(q)
        );
    });



    /* ── derived stats ── */
    const total = count.pending + count.approved + count.rejected;
    const approvalRate = total ? Math.round((count.approved / total) * 100) : 0;
    const maxBar = Math.max(...BAR_DATA.map(d => d.val));

    const getTimeAgo = (dateString) => {
        const diff = Math.floor(
            (new Date() - new Date(dateString)) / 1000
        );

        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

        return `${Math.floor(diff / 86400)} days ago`;
    };
    const emergencyCount = leaves.filter(
        leave =>
            leave.leaveType === "EMERGENCY" &&
            leave.status === "PENDING"
    ).length;

    return (
        <>
            <FacultyNavBar />
            <section className="fp-hero">
                <div className="fp-hero__inner container">
                    <div className="fp-hero__text">
                        <span className="fp-hero__eyebrow">Faculty Portal</span>
                        <h1 className="fp-hero__title">
                            Welcome,<br />Faculty Member!
                        </h1>
                        <p className="fp-hero__sub">
                            Student Leave Management Portal — Review, monitor, approve,
                            and reject student leave requests efficiently from a
                            centralised dashboard.
                        </p>
                        <div className="fp-hero__chips">
                            <span className="fp-chip fp-chip--blue">
                                <FontAwesomeIcon icon={faHourglassHalf} />
                                {count.pending} Pending
                            </span>
                            <span className="fp-chip fp-chip--green">
                                <FontAwesomeIcon icon={faCircleCheck} />
                                {count.approved} Approved
                            </span>
                            <span className="fp-chip fp-chip--red">
                                <FontAwesomeIcon icon={faCircleXmark} />
                                {count.rejected} Rejected
                            </span>
                        </div>
                    </div>
                    <div className="fp-hero__img-wrap">
                        <img src="/faculty-hero.jpg" alt="Faculty illustration" />
                    </div>
                </div>
            </section>

            <section className="container fp-section mt-4 mb-4">
                <div className="fp-cards">
                    <StatCard
                        value={total}
                        label="Total Requests"
                        sub="All time received"
                        icon={faFile}
                        color="blue"
                    />
                    <StatCard
                        value={count.pending}
                        label="Pending"
                        sub="Awaiting your action"
                        icon={faHourglassHalf}
                        color="amber"
                    />
                    <StatCard
                        value={count.approved}
                        label="Approved"
                        sub="Successfully approved"
                        icon={faCircleCheck}
                        color="green"
                    />
                    <StatCard
                        value={count.rejected}
                        label="Rejected"
                        sub="Not approved"
                        icon={faCircleXmark}
                        color="red"
                    />
                </div>
            </section>

            {count.pending > 0 && (
                <section className="container fp-section">
                    <div className="fp-notifications">

                        <div className="fp-notif fp-notif--warn">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <span>
                                <strong>{count.pending} requests</strong> are awaiting your approval.
                            </span>
                        </div>

                        {emergencyCount > 0 && (
                            <div className="fp-notif fp-notif--info">
                                <FontAwesomeIcon icon={faBell} />
                                <span>
                                    <strong>{emergencyCount} urgent</strong>{" "}
                                    leave request{emergencyCount > 1 ? "s" : ""} submitted today.
                                </span>
                            </div>
                        )}

                    </div>
                </section>
            )}

            
            <section className="container fp-section">
                <div className="fp-layout">

                    {/* ── Main table panel ── */}
                    <div className="fp-main">
                        <div className="fp-table-header">
                            <SectionHeader title="Student Leave Requests" icon={faCalendarDays} />

                            {/* search + filters */}
                            <div className="fp-filters">
                                <div className="fp-search">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="fp-search__icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, roll no, department…"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="fp-filter-row">
                                    <div className="fp-status-tabs">
                                        {["", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                                            <button
                                                key={s}
                                                className={`fp-tab ${status === s ? "fp-tab--active" : ""}`}
                                                onClick={() => handleStatusChange(s)}
                                            >
                                                {s || "All"}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="fp-date-range">
                                        <input
                                            type="date"
                                            className="fp-date-input"
                                            value={startDate}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setStartDate(value);
                                                handleSearch(status, value, endDate);
                                            }}
                                            title="From date"
                                        />
                                        <span className="fp-date-sep">→</span>
                                        <input
                                            type="date"
                                            className="fp-date-input"
                                            value={endDate}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setEndDate(value);
                                                handleSearch(status, startDate, value);
                                            }}
                                            title="To date"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* table */}
                        <div className="fp-table-wrap">
                            <table className="fp-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student</th>
                                        <th>Department</th>
                                        <th>Duration</th>
                                        <th>Days</th>
                                        <th>Reason</th>
                                        <th>Applied On</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeaves.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="fp-empty">
                                                <FontAwesomeIcon icon={faCalendarDays} />
                                                <p>No leave requests found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeaves.map((leave, idx) => {
                                            const from = leave.fromDate ? new Date(leave.fromDate) : null;
                                            const to = leave.toDate ? new Date(leave.toDate) : null;
                                            const days = (from && to)
                                                ? Math.ceil((to - from) / 86400000) + 1
                                                : "-";
                                            return (
                                                <tr key={leave.id}>
                                                    <td className="fp-td-num" data-label="#">{idx + 1}</td>
                                                    <td data-label="Student">
                                                        <div className="fp-student">
                                                            <img
                                                                src={
                                                                    leave.user?.profileImage
                                                                        ? `http://localhost:8080/${leave.user.profileImage}`
                                                                        : "/male-profile-img.png"
                                                                }
                                                                alt={leave.user?.name}
                                                            />
                                                            <div>
                                                                <span className="fp-student__name">{leave.user?.name}</span>
                                                                <span className="fp-student__roll">{leave.user?.rollNumber || "—"}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td data-label="Department">
                                                        <span className="fp-dept">{leave.user?.department || "—"}</span>
                                                    </td>
                                                    <td data-label="Duration">
                                                        <div className="fp-duration">
                                                            <span>{leave.fromDate}</span>
                                                            <span className="fp-duration__arrow">→</span>
                                                            <span>{leave.toDate}</span>
                                                        </div>
                                                    </td>
                                                    <td data-label="Days">
                                                        <span className="fp-days-badge">{days}d</span>
                                                    </td>
                                                    <td className="fp-td-reason" data-label="Reason">
                                                        <div className="lq-leave-type">
                                                            {leave.leaveType && (
                                                                leave.leaveType
                                                                    .toLowerCase()
                                                                    .replace(/_/g, " ")
                                                                    .replace(/\b\w/g, c => c.toUpperCase())
                                                            )}
                                                        </div>
                                                        {leave.reason}
                                                    </td>
                                                    <td className="fp-td-date" data-label="Applied On">{leave.appliedAt?.substring(0, 10)}</td>
                                                    <td data-label="Status">
                                                        <span className={`fp-status fp-status--${leave.status?.toLowerCase()}`}>
                                                            {leave.status}
                                                        </span>
                                                    </td>
                                                    <td data-label="Action">
                                                        {leave.status === "PENDING" ? (
                                                            <div className="fp-actions">
                                                                <button className="fp-btn fp-btn--approve" title="Approve" onClick={() => handleApprove(leave.id)}>
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </button>
                                                                <button className="fp-btn fp-btn--reject" title="Reject" onClick={() => handleReject(leave.id)}>
                                                                    <FontAwesomeIcon icon={faXmark} />
                                                                </button>
                                                                <button className="fp-btn fp-btn--view" title="View details" onClick={() => setDetailLeave(leave)}>
                                                                    <FontAwesomeIcon icon={faEye} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="fp-completed">Completed</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Side panels ── */}
                    <aside className="fp-aside">

                        {/* Recent Activity */}
                        <div className="fp-panel">
                            <h3 className="fp-panel__title">
                                <FontAwesomeIcon icon={faClock} /> Recent Activity
                            </h3>
                            <ul className="fp-activity">
                                {activity.map((a, i) => (
                                    <li key={i} className="fp-activity__item">
                                        <span className={`fp-activity__dot fp-activity__dot--${a.type}`} />
                                        <div>
                                            <p>
                                                <strong>
                                                    {a.type?.charAt(0).toUpperCase() + a.type?.slice(1)}
                                                </strong>{" "}
                                                leave request of <strong>{a.name}</strong>.
                                            </p>
                                            <span className="fp-activity__time">
                                                {getTimeAgo(a.time)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pie chart — leave status distribution */}
                        <div className="fp-panel">
                            <h3 className="fp-panel__title">
                                <FontAwesomeIcon icon={faChartPie} /> Status Distribution
                            </h3>
                            <PieChart approved={count.approved} rejected={count.rejected} pending={count.pending} />
                        </div>

                    </aside>
                </div>
            </section>



            {/* ════════════════════════════════
          DETAIL DRAWER
      ════════════════════════════════ */}
            {detailLeave && (
                <>
                    <div className="fp-overlay" onClick={() => setDetailLeave(null)} />
                    <aside className="fp-drawer">
                        <div className="fp-drawer__header">
                            <h2>Leave Details</h2>
                            <button className="fp-drawer__close" onClick={() => setDetailLeave(null)}>×</button>
                        </div>

                        <div className="fp-drawer__profile">
                            <img
                                src={
                                    detailLeave.user?.profileImage
                                        ? `http://localhost:8080/${detailLeave.user.profileImage}`
                                        : "/male-profile-img.png"
                                }
                                alt={detailLeave.user?.name}
                            />
                            <div>
                                <h3>{detailLeave.user?.name}</h3>
                                <p className="fp-drawer__dept">{detailLeave.user?.department}</p>
                                <div className="fp-drawer__tags">
                                    <span className="fp-id-tag">{detailLeave.user?.rollNumber || "—"}</span>
                                    <span className={`fp-status fp-status--${detailLeave.status?.toLowerCase()}`}>
                                        {detailLeave.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="fp-drawer__dates">
                            <div className="fp-drawer__date-card">
                                <span>From</span>
                                <strong>{detailLeave.fromDate}</strong>
                            </div>
                            <div className="fp-drawer__date-card">
                                <span>To</span>
                                <strong>{detailLeave.toDate}</strong>
                            </div>
                        </div>

                        <div className="fp-drawer__section">
                            <label>Reason</label>
                            <div className="fp-drawer__reason">{detailLeave.reason}</div>
                        </div>

                        <div className="fp-drawer__section">
                            <label>Applied On</label>
                            <p>{detailLeave.appliedAt?.substring(0, 10)}</p>
                        </div>

                        {detailLeave.status === "PENDING" && (
                            <div className="fp-drawer__actions">
                                <button
                                    className="fp-drawer__btn fp-drawer__btn--approve"
                                    onClick={() => handleApprove(detailLeave.id)}
                                >
                                    <FontAwesomeIcon icon={faCheck} /> Approve
                                </button>
                                <button
                                    className="fp-drawer__btn fp-drawer__btn--reject"
                                    onClick={() => handleReject(detailLeave.id)}
                                >
                                    <FontAwesomeIcon icon={faXmark} /> Reject
                                </button>
                            </div>
                        )}
                    </aside>
                </>
            )}
        </>
    );
}

/* ── Sub-components ── */

function StatCard({ value, label, sub, icon, color }) {
    return (
        <div className={`fp-stat fp-stat--${color}`}>
            <div className="fp-stat__icon">
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className="fp-stat__body">
                <span className="fp-stat__value">{value}</span>
                <span className="fp-stat__label">{label}</span>
                <span className="fp-stat__sub">{sub}</span>
            </div>
        </div>
    );
}

function InsightTile({ label, value, accent }) {
    return (
        <div className={`fp-insight fp-insight--${accent}`}>
            <span className="fp-insight__val">{value}</span>
            <span className="fp-insight__lbl">{label}</span>
        </div>
    );
}

function SectionHeader({ title, icon }) {
    return (
        <div className="fp-sec-header">
            <FontAwesomeIcon icon={icon} className="fp-sec-header__icon" />
            <h2>{title}</h2>
        </div>
    );
}

function PieChart({ approved, rejected, pending }) {
    const total = approved + rejected + pending || 1;
    const ap = (approved / total) * 100;
    const rj = (rejected / total) * 100;
    const pe = (pending / total) * 100;

    /* conic-gradient segments */
    const conic = `conic-gradient(
    #10b981 0% ${ap}%,
    #ef4444 ${ap}% ${ap + rj}%,
    #f59e0b ${ap + rj}% 100%
  )`;

    return (
        <div className="fp-pie">
            <div className="fp-pie__donut" style={{ background: conic }} />
            <div className="fp-pie__legend">
                <span className="fp-pie__dot" style={{ background: "#10b981" }} />
                <span>Approved ({approved})</span>
                <span className="fp-pie__dot" style={{ background: "#ef4444" }} />
                <span>Rejected ({rejected})</span>
                <span className="fp-pie__dot" style={{ background: "#f59e0b" }} />
                <span>Pending ({pending})</span>
            </div>
        </div>
    );
}

export default FacultyPage;