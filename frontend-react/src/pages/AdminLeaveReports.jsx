import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../layout/AdminSideBar";
import AdminTopBar from "../layout/AdminTopBar";
import AdminCountBox from "../components/AdminCountBox";

import './AdminLeaveReports.css';


import { departmentLeaveCounts, facultyLeaveReports, getAllLeaves, leaveReports, statusCounts } from "../api";
import { faFile, faClock, faCircleCheck, faCircleXmark, faChartPie, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
} from "recharts";


const DEPT_COLORS = ["#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f97316", "#14b8a6", "#facc15"];

function formatLeaveType(type) {
    if (!type) return "Unspecified";
    return type
        .toLowerCase()
        .split("_")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function AdminLeaveReports() {
    const [count, setCount] = useState({
        pending: 0,
        approved: 0,
        rejected: 0
    })
    const [leaves, setLeaves] = useState([]);
    const [monthWiseLeaves, setMonthWiseLeaves] = useState([]);
    const [facultyReport, setFacultyReport] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [open, setOpen] = useState(false);

    const countLeaves = async () => {
        const res = await statusCounts();
        setCount(res.data);
    }
    const getLeaves = async () => {
        const res = await getAllLeaves();
        setLeaves(res.data);
    }


    const monthWiseReports = async () => {
        const res = await leaveReports();
        setMonthWiseLeaves(res.data);
    }


    //Faculty reports [Faculty Name | Students | Pending | Approved | Rejected]
    const facultyReports = async () => {
        const res = await facultyLeaveReports();
        setFacultyReport(res.data);
    }

    const deptsLeavesCounts = async () => {
        const res = await departmentLeaveCounts();
        setDepartmentData(res.data);
    }

    const maxLeaves = Math.max(
        1,
        ...departmentData.map((d) => d[1])
    );

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([
                countLeaves(),
                getLeaves(),
                monthWiseReports(),
                facultyReports(),
                deptsLeavesCounts(),
            ]);
            setLoading(false);
        };
        loadAll();
    }, []);

    // Overall approval rate derived from status counts
    const totalDecided = count.approved + count.rejected;
    const approvalRate = totalDecided > 0
        ? Math.round((count.approved / totalDecided) * 100)
        : 0;

    // Leave type breakdown + average duration, derived client-side from `leaves`
    const { typeBreakdown, avgDuration, totalDays } = useMemo(() => {
        const typeMap = {};
        let durationSum = 0;
        let durationCount = 0;

        leaves.forEach((leave) => {
            const key = leave.leaveType || "OTHER";
            typeMap[key] = (typeMap[key] || 0) + 1;

            if (leave.fromDate && leave.toDate) {
                const f = new Date(leave.fromDate);
                const t = new Date(leave.toDate);
                if (!isNaN(f.getTime()) && !isNaN(t.getTime())) {
                    const days = Math.round((t - f) / (1000 * 60 * 60 * 24)) + 1;
                    if (days > 0) {
                        durationSum += days;
                        durationCount += 1;
                    }
                }
            }
        });

        const breakdown = Object.entries(typeMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return {
            typeBreakdown: breakdown,
            avgDuration: durationCount > 0 ? (durationSum / durationCount).toFixed(1) : "0",
            totalDays: durationSum,
        };
    }, [leaves]);

    const maxTypeCount = Math.max(1, ...typeBreakdown.map(([, c]) => c));

    // SVG donut geometry for approval rate
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (approvalRate / 100) * circumference;

    return (
        <>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminTopBar
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />
            <div className="main-section">
                <section className="reports-header">
                    <div>
                        <h2>Leave Reports</h2>
                        <p>Comprehensive overview and analysis of leave data across the platform.</p>
                    </div>
                </section>

                <section className="count-row">
                    <AdminCountBox
                        leaves={leaves.length}
                        title="Total Leaves"
                        subTitle="All time"
                        icon={faFile}
                        bgColor="#f5f3ff"
                        iconColor="#7c3aed"
                        iconBgColor="#ede9fe"
                    />

                    <AdminCountBox
                        leaves={count.pending}
                        title="Pending Requests"
                        subTitle="Still pending"
                        icon={faClock}
                        bgColor="#fffbeb"
                        iconColor="#f59e0b"
                        iconBgColor="#fef3c7"
                    />
                    <AdminCountBox
                        leaves={count.approved}
                        title="Approved Leaves"
                        subTitle="Successfully approved"
                        icon={faCircleCheck}
                        bgColor="#f0fdf4"
                        iconColor="#16a34a"
                        iconBgColor="#dcfce7"
                    />
                    <AdminCountBox
                        leaves={count.rejected}
                        title="Rejected Leaves"
                        subTitle="Unfortunately rejected"
                        icon={faCircleXmark}
                        bgColor="#fef2f2"
                        iconColor="#dc2626"
                        iconBgColor="#fee2e2"
                    />
                </section>

                <div className="dashboard-layout mt-3">

                    <div className="left-section">
                        {/* Month Wise Report */}
                        <section className="report-chart">
                            <div className="chart-header">
                                <h4>Month-wise Leave Reports</h4>
                                <p>Total leave requests submitted each month</p>
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={monthWiseLeaves}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tick={{ fill: "#64748b", fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: "#f5f3ff" }}
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }}
                                    />
                                    <Bar
                                        dataKey="leaves"
                                        fill="#7c3aed"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={48}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </section>

                        <section className="report-chart">
                            <div className="chart-header">
                                <h4>Faculty Wise Report</h4>
                                <p>Leave activity managed by each faculty member</p>
                            </div>
                            <div className="table-responsive">
                                <table className="reports-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Faculty Name</th>
                                            <th>Department</th>
                                            <th>Total Students</th>
                                            <th>Leaves Managed</th>
                                            <th>Approval Rate</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="reports-empty">Loading faculty report…</td>
                                            </tr>
                                        ) : facultyReport.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="reports-empty">No faculty data available.</td>
                                            </tr>
                                        ) : (
                                            facultyReport.map((user, index) => (
                                                <tr key={user.facultyId}>
                                                    <td>{index + 1}</td>
                                                    <td className="reports-name">{user.facultyName}</td>
                                                    <td>{user.department}</td>
                                                    <td>{user.totalStudents}</td>
                                                    <td>{user.leavesManaged}</td>
                                                    <td>
                                                        <span className={`rate-pill ${user.approvalRate >= 70 ? "rate-high" : user.approvalRate >= 40 ? "rate-mid" : "rate-low"}`}>
                                                            {user.approvalRate}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    </div>

                    <div className="right-section">

                        <section className="report-chart">
                            {/* Department Breakdown */}
                            <div className="chart-header">
                                <h4>Department Wise Leave Count</h4>
                                <p>Total leaves by department</p>
                            </div>

                            {departmentData.length === 0 ? (
                                <p className="reports-empty">No department data available.</p>
                            ) : (
                                departmentData.map((dept, index) => (
                                    <div key={dept[0]} className="dept-row">
                                        <div className="dept-row-top">
                                            <span className="dept-name">{dept[0]}</span>
                                            <span className="dept-count">{dept[1]} Leaves</span>
                                        </div>

                                        <div className="dept-bar-track">
                                            <div
                                                className="dept-bar-fill"
                                                style={{
                                                    width: `${(dept[1] / maxLeaves) * 100}%`,
                                                    background: DEPT_COLORS[index % DEPT_COLORS.length],
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </section>

                        <section className="report-chart approval-rate-card">
                            {/* Approval Rate */}
                            <div className="chart-header">
                                <h4>Overall Approval Rate</h4>
                                <p>Approved vs. rejected decisions</p>
                            </div>

                            <div className="donut-wrap">
                                <svg width="140" height="140" viewBox="0 0 140 140">
                                    <circle
                                        cx="70" cy="70" r={radius}
                                        fill="none"
                                        stroke="#fee2e2"
                                        strokeWidth="14"
                                    />
                                    <circle
                                        cx="70" cy="70" r={radius}
                                        fill="none"
                                        stroke="#16a34a"
                                        strokeWidth="14"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={dashOffset}
                                        strokeLinecap="round"
                                        transform="rotate(-90 70 70)"
                                    />
                                </svg>
                                <div className="donut-label">
                                    <span className="donut-value">{approvalRate}%</span>
                                    <span className="donut-caption">Approved</span>
                                </div>
                            </div>

                            <div className="approval-legend">
                                <div className="legend-item">
                                    <span className="legend-dot legend-approved" />
                                    Approved <strong>{count.approved}</strong>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot legend-rejected" />
                                    Rejected <strong>{count.rejected}</strong>
                                </div>
                            </div>
                        </section>

                        <section className="report-chart">
                            {/* Leave Type Breakdown + Avg Duration */}
                            <div className="chart-header">
                                <h4>Leave Insights</h4>
                                <p>Most common leave types and average duration</p>
                            </div>

                            <div className="insight-stats">
                                <div className="insight-stat">
                                    <div className="insight-icon insight-icon-purple">
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                    </div>
                                    <div>
                                        <span className="insight-value">{avgDuration}</span>
                                        <span className="insight-label">Avg. days / leave</span>
                                    </div>
                                </div>
                                <div className="insight-stat">
                                    <div className="insight-icon insight-icon-blue">
                                        <FontAwesomeIcon icon={faChartPie} />
                                    </div>
                                    <div>
                                        <span className="insight-value">{totalDays}</span>
                                        <span className="insight-label">Total leave days</span>
                                    </div>
                                </div>
                            </div>

                            {typeBreakdown.length === 0 ? (
                                <p className="reports-empty">No leave type data available.</p>
                            ) : (
                                <div className="type-breakdown">
                                    {typeBreakdown.map(([type, value], index) => (
                                        <div key={type} className="dept-row">
                                            <div className="dept-row-top">
                                                <span className="dept-name">{formatLeaveType(type)}</span>
                                                <span className="dept-count">{value}</span>
                                            </div>
                                            <div className="dept-bar-track">
                                                <div
                                                    className="dept-bar-fill"
                                                    style={{
                                                        width: `${(value / maxTypeCount) * 100}%`,
                                                        background: DEPT_COLORS[index % DEPT_COLORS.length],
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>

                </div>

            </div>
        </>
    )
}
export default AdminLeaveReports;