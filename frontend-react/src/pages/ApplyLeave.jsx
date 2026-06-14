import { useState } from "react"
import { applyLeave } from "../api";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../layout/NavBar";
import './ApplyLeave.css'

const LEAVE_TYPES = [
    { value: "SICK", label: "🤒  Sick Leave", desc: "Feeling unwell or ill" },
    { value: "PERSONAL", label: "🙋  Personal Leave", desc: "Personal errands or matters" },
    { value: "MEDICAL", label: "🏥  Medical Leave", desc: "Doctor visits or procedures" },
    { value: "FAMILY_FUNCTION", label: "🎉  Family Function", desc: "Weddings, ceremonies & events" },
    { value: "ACADEMIC_EVENT", label: "🎓  Academic Event", desc: "Conferences, fests or exams" },
    { value: "EMERGENCY", label: "🚨  Emergency", desc: "Urgent unforeseen circumstances" },
    { value: "OTHER", label: "📝  Other", desc: "Any other reason" },
];

function ApplyLeave() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeField, setActiveField] = useState(null);

    const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();

    const getDuration = () => {
        if (!fromDate || !toDate) return null;
        const diff = Math.round((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1;
        return diff > 0 ? diff : null;
    };

    const duration = getDuration();

    async function handleApplyLeave(e) {
        e.preventDefault();

        if (!fromDate || !toDate || !reason.trim() || !leaveType) {
            alert("Please fill all fields");
            return;
        }
        if (new Date(toDate) < new Date(fromDate)) {
            alert("To Date cannot be earlier than From Date");
            return;
        }

        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user?.id;

        const newLeave = {
            fromDate,
            toDate,
            reason,
            status: "PENDING",
            leaveType,
            user: { id: userId },
            approvedBy: null,
        };

        try {
            setLoading(true);
            await applyLeave(newLeave);
            alert("Leave Applied Successfully");
            navigate("/student");
        } catch {
            alert("Error Applying Leave");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <NavBar />

            <div className="al-page">

                {/* Background blobs */}
                <div className="al-blob al-blob-1" />
                <div className="al-blob al-blob-2" />
                <div className="al-blob al-blob-3" />

                <div className="al-wrapper">

                    {/* Left panel */}
                    <aside className="al-sidebar">
                        <div className="al-sidebar-inner">
                            <div className="al-sidebar-badge">Leave Request</div>
                            <h1 className="al-sidebar-heading">Plan your <em>time off</em> with ease.</h1>
                            <p className="al-sidebar-sub">Fill in the form to submit a leave request. Your advisor will review it shortly.</p>

                            <div className="al-steps">
                                {[
                                    { label: "Leave Type", done: !!leaveType },
                                    { label: "Select Dates", done: !!fromDate && !!toDate },
                                    { label: "Add Reason", done: reason.trim().length > 0 },
                                ].map((step, i) => (
                                    <div key={i} className={`al-step ${step.done ? "al-step--done" : ""}`}>
                                        <div className="al-step-dot">
                                            {step.done ? (
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <span>{i + 1}</span>
                                            )}
                                        </div>
                                        <span className="al-step-label">{step.label}</span>
                                    </div>
                                ))}
                            </div>

                            {duration && (
                                <div className="al-duration-pill">
                                    <span className="al-duration-num">{duration}</span>
                                    <span className="al-duration-text">day{duration !== 1 ? "s" : ""} requested</span>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Form card */}
                    <main className="al-card">
                        <form onSubmit={handleApplyLeave} className="al-form">

                            {/* Leave Type */}
                            <div className="al-field">
                                <label className="al-label">Leave Type</label>
                                <div className="al-type-grid">
                                    {LEAVE_TYPES.map(lt => (
                                        <button
                                            key={lt.value}
                                            type="button"
                                            className={`al-type-btn ${leaveType === lt.value ? "al-type-btn--active" : ""}`}
                                            onClick={() => setLeaveType(lt.value)}
                                        >
                                            <span className="al-type-label">{lt.label}</span>
                                            <span className="al-type-desc">{lt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date row */}
                            <div className="al-date-row">
                                <div className={`al-field al-field--input ${activeField === 'from' ? "al-field--active" : ""}`}>
                                    <label className="al-label">From Date</label>
                                    <div className="al-input-wrap">
                                        <svg className="al-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                            <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                        </svg>
                                        <input
                                            type="date"
                                            min={today}
                                            value={fromDate}
                                            onFocus={() => setActiveField('from')}
                                            onBlur={() => setActiveField(null)}
                                            onChange={(e) => {
                                                setFromDate(e.target.value);
                                                if (toDate && e.target.value > toDate) setToDate("");
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="al-date-arrow">→</div>

                                <div className={`al-field al-field--input ${activeField === 'to' ? "al-field--active" : ""}`}>
                                    <label className="al-label">To Date</label>
                                    <div className="al-input-wrap">
                                        <svg className="al-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                            <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                        </svg>
                                        <input
                                            type="date"
                                            min={fromDate || today}
                                            value={toDate}
                                            onFocus={() => setActiveField('to')}
                                            onBlur={() => setActiveField(null)}
                                            onChange={(e) => setToDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className={`al-field ${activeField === 'reason' ? "al-field--active" : ""}`}>
                                <label className="al-label">
                                    Reason
                                    <span className="al-char-count">{reason.length}/300</span>
                                </label>
                                <textarea
                                    className="al-textarea"
                                    placeholder="Briefly describe your reason for taking leave..."
                                    maxLength={300}
                                    value={reason}
                                    onFocus={() => setActiveField('reason')}
                                    onBlur={() => setActiveField(null)}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            {/* Actions */}
                            <div className="al-actions">
                                <Link to="/student" className="al-btn-cancel">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className={`al-btn-submit ${loading ? "al-btn-submit--loading" : ""}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="al-spinner" />
                                    ) : (
                                        <>
                                            <span>Submit Request</span>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </main>

                </div>
            </div>
        </>
    );
}

export default ApplyLeave;