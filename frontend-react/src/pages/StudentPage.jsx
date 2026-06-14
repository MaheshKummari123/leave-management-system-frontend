import { useEffect, useState } from "react";
import CountBox from "../components/CountBox";
import NavBar from "../layout/NavBar";
import "./StudentPage.css";
import {
    getLastThreeLeavesById,
    studentStatusCounts,
    updateStatus
} from "../api";

import {
    faFile,
    faHourglassHalf,
    faCircleCheck,
    faCircleXmark,
    faCheck,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

import { faCalendar } from "@fortawesome/free-regular-svg-icons";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function StudentPage() {

    const [name, setName] = useState("");
    const [leaves, setLeaves] = useState([]);
    const [count, setCount] = useState({
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const user = JSON.parse(sessionStorage.getItem("user"));

    //Main leaves data
    const studentLeaves = async () => {

        if (!user) return;
        const userId = user.id;
        setName(user.name);
        const result = await getLastThreeLeavesById(userId);
        const counts = await studentStatusCounts(userId);
        setCount(counts.data);
        console.log(result.data)
        setLeaves(result.data);
    };
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

    //handling leave approves and rejects
    const handleAprrove = async (id) => {
        const leave = await updateStatus(id, user.id, "APPROVED");

        studentLeaves();

    }
    const handleReject = async (id) => {

        const updateReject = await updateStatus(id, user.id, "REJECTED");
        studentLeaves();
    }

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
        studentLeaves();
    }, []);

    return (
        <>
            <NavBar />

            {/* HERO SECTION */}
            <section className="container hero-section mt-4">
                <div className="hero-card">
                    <div className="hero-content">

                        {/* LEFT COLUMN — text + button */}
                        <div className="hero-left">
                            <span className="hero-badge">👋 Welcome Back</span>
                            <h1>{name}</h1>
                            <h2>Manage Your Leave Requests Effortlessly</h2>
                            <p>
                                Apply for leave, track approvals, and monitor
                                all your requests from one place.
                            </p>
                            <Link className="hero-btn" to="/student/apply-leave">
                                <FontAwesomeIcon icon={faCalendar} />
                                Apply Leave Now
                            </Link>
                        </div>

                        {/* RIGHT COLUMN — image */}
                        <div className="hero-right">
                            <img
                                src="/hero-section.png"
                                alt="Hero"
                                className="hero-img"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* COUNT CARDS */}
            <section className="container mt-4">
                <div className="row g-4">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <CountBox
                            leaves={count.pending + count.approved + count.rejected}
                            title="TOTAL LEAVES"
                            subTitle="All time"
                            icon={faFile}
                            variant="blue"
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <CountBox
                            leaves={count.pending}
                            title="PENDING LEAVES"
                            subTitle="Awaiting approval"
                            icon={faHourglassHalf}
                            variant="yellow"
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <CountBox
                            leaves={count.approved}
                            title="APPROVED LEAVES"
                            subTitle="Successfully approved"
                            icon={faCircleCheck}
                            variant="green"
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <CountBox
                            leaves={count.rejected}
                            title="REJECTED LEAVES"
                            subTitle="Unfortunately rejected"
                            icon={faCircleXmark}
                            variant="red"
                        />
                    </div>
                </div>
            </section>

            {/* TABLE SECTION */}
            <section className="container mt-5 recent-section p-4">
                <div className="lq-table-card">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h2 className="table-header-h2">Recent Leave Requests</h2>
                        {/* <span className="lq-showing-text">
                            Total Requests: {leaves.length}
                        </span> */}
                    </div>

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
                                    leaves.map((leave, index) => (
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
        </>
    );
}

export default StudentPage;