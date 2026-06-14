import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AdminSidebar from "../layout/AdminSideBar"
import AdminTopBar from "../layout/AdminTopBar"
import { faSearch, faUserCheck, faRotateLeft, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { assignFaculty, getAllFaculty, getDepartments, studentsWithAssignedFaculty } from "../api"
import { useEffect, useRef, useState } from "react"
import { faUsers, faChalkboardTeacher, faUserGraduate, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import AdminCountBox from "../components/AdminCountBox"
import './AdminFacultyAssignment.css'

const PAGE_SIZE = 8;

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function AdminFacultyAssignment() {

    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [assignedFaculty, setAssignedfaculty] = useState(0);
    const [unassignedFaculty, setUnassignedfaculty] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null);
    const [page, setPage] = useState(1);

    const [deptOpen, setDeptOpen] = useState(false);
    const deptRef = useRef(null);

     const [sidebarOpen, setSidebarOpen] = useState(false);

     const [open, setOpen] = useState(false);

    //bulk assign
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [bulkFaculty, setBulkFaculty] = useState("");

    const handleBulkAssign = async () => {

        if (!bulkFaculty) {
            alert("Please select a faculty");
            return;
        }

        try {

            await Promise.all(
                selectedStudents.map(studentId =>
                    assignFaculty(studentId, bulkFaculty)
                )
            );

            alert(
                `${selectedStudents.length} students assigned successfully`
            );

            setSelectedStudents([]);
            setBulkFaculty("");

            await getStudentsFromAPI();

        } catch (err) {
            console.log(err);
            alert("Bulk assignment failed");
        }
    };

    const getStudentsFromAPI = async () => {
        const res = await studentsWithAssignedFaculty();

        setStudents(res.data);
        setAllStudents(res.data);

        const count = res.data.filter(
            stu => stu.facultyId != null
        ).length;

        setAssignedfaculty(count);
        setUnassignedfaculty(res.data.length - count);
    }

    const fetchAllFaculty = async () => {
        const result = await getAllFaculty();
        setFaculty(result.data);
    }

    const getAlldepts = async () => {
        const res = await getDepartments();
        setDepartments(res.data);
    }

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([
                getStudentsFromAPI(),
                fetchAllFaculty(),
                getAlldepts(),
            ]);
            setLoading(false);
        };
        loadAll();
    }, [])

    // Close department dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (deptRef.current && !deptRef.current.contains(e.target)) {
                setDeptOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAssignFaculty = async (studentId, facultyId) => {

        if (!facultyId) {
            alert("Please select a faculty");
            return;
        }

        setAssigningId(studentId);
        try {
            await assignFaculty(studentId, facultyId);
            await getStudentsFromAPI();
        } catch (err) {
            console.log(err);
            alert("Assignment failed");
        } finally {
            setAssigningId(null);
        }
    };

    const handleFacultyChange = (studentId, facultyId) => {
        setStudents(prev =>
            prev.map(student =>
                student.id === studentId
                    ? { ...student, selectedFaculty: facultyId }
                    : student
            )
        );
    };

    const applyFilters = (nextKeyword, nextDept) => {
        let filtered = allStudents;

        if (nextDept) {
            filtered = filtered.filter(item => item.department === nextDept);
        }

        if (nextKeyword.trim() !== "") {
            filtered = filtered.filter(
                (student) =>
                    student.name?.toLowerCase().includes(nextKeyword.toLowerCase()) ||
                    student.id?.toString().includes(nextKeyword)
            );
        }

        setStudents(filtered);
        setPage(1);
    };

    const handleDepartmentChange = (dept) => {
        setDepartment(dept);
        setDeptOpen(false);
        applyFilters(keyword, dept);
    }

    const handleSearch = (value) => {
        setKeyword(value);
        applyFilters(value, department);
    };

    const handleResetFilters = () => {
        setKeyword("");
        setDepartment("");
        setStudents(allStudents);
        setPage(1);
    };

    const hasActiveFilters = keyword || department;

    const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedStudents = students.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminTopBar
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />

            <div className="main-section">
                <section className="afa-header">
                    <div>
                        <h2>Faculty Assignment</h2>
                        <p>Assign faculty mentors to students across departments.</p>
                    </div>
                </section>

                <div className="alm-stats">

                    <div className="alm-stat-card alm-stat-blue">
                        <div>
                            <p className="alm-stat-label">TOTAL STUDENTS</p>
                            <h2 className="alm-stat-value">{allStudents.length}</h2>
                            <p className="alm-stat-sub">Registered students</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-blue">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-purple">
                        <div>
                            <p className="alm-stat-label">TOTAL FACULTY</p>
                            <h2 className="alm-stat-value">{faculty.length}</h2>
                            <p className="alm-stat-sub">Available mentors</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-purple">
                            <FontAwesomeIcon icon={faChalkboardTeacher} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-green">
                        <div>
                            <p className="alm-stat-label">ASSIGNED STUDENTS</p>
                            <h2 className="alm-stat-value">{assignedFaculty}</h2>
                            <p className="alm-stat-sub">Faculty assigned</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-green">
                            <FontAwesomeIcon icon={faUserGraduate} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-red">
                        <div>
                            <p className="alm-stat-label">UNASSIGNED STUDENTS</p>
                            <h2 className="alm-stat-value">{unassignedFaculty}</h2>
                            <p className="alm-stat-sub">Need assignment</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-red">
                            <FontAwesomeIcon icon={faUserXmark} />
                        </div>
                    </div>

                </div>

                <section className="afa-table-card">
                    {/* Filters */}
                    <div className="afa-filters">
                        <div className="afa-search-wrap">
                            <FontAwesomeIcon icon={faSearch} className="afa-search-icon" />
                            <input
                                type="search"
                                placeholder="Search by name or roll no..."
                                className="afa-search"
                                value={keyword}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="afa-dropdown" ref={deptRef}>
                            <button
                                type="button"
                                className="afa-dropdown-btn"
                                onClick={() => setDeptOpen(o => !o)}
                            >
                                {department || "All Departments"}
                                <FontAwesomeIcon icon={faChevronDown} className="afa-dropdown-caret" />
                            </button>

                            {deptOpen && (
                                <ul className="afa-dropdown-menu">
                                    <li>
                                        <button
                                            className={`afa-dropdown-item ${department === "" ? "active" : ""}`}
                                            onClick={() => handleDepartmentChange("")}
                                        >
                                            All Departments
                                        </button>
                                    </li>
                                    {departments.map((dept, index) => (
                                        <li key={index}>
                                            <button
                                                className={`afa-dropdown-item ${department === dept.name ? "active" : ""}`}
                                                onClick={() => handleDepartmentChange(dept.name)}
                                            >
                                                {dept.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {selectedStudents.length > 0 && (
                            <div className="afa-bulk-actions">

                                <select
                                    className="afa-select"
                                    value={bulkFaculty}
                                    onChange={(e) => setBulkFaculty(e.target.value)}
                                >
                                    <option value="">
                                        Select Faculty
                                    </option>

                                    {faculty.map(f => (
                                        <option key={f.id} value={f.id}>
                                            {f.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    className="afa-bulk-btn"
                                    disabled={!bulkFaculty}
                                    onClick={handleBulkAssign}
                                >
                                    Assign {selectedStudents.length} Students
                                </button>

                            </div>
                        )}

                        {hasActiveFilters && (
                            <button className="afa-reset-btn" onClick={handleResetFilters}>
                                <FontAwesomeIcon icon={faRotateLeft} /> Reset
                            </button>
                        )}

                        <span className="afa-showing-text">
                            Showing {students.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
                            -{Math.min(currentPage * PAGE_SIZE, students.length)} of {students.length}
                        </span>
                    </div>

                    {/* Table */}
                    <div className="afa-table-wrap">
                        <table className="afa-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={
                                                paginatedStudents.length > 0 &&
                                                paginatedStudents.every(s =>
                                                    selectedStudents.includes(s.id)
                                                )
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedStudents(prev => [
                                                        ...new Set([
                                                            ...prev,
                                                            ...paginatedStudents.map(s => s.id)
                                                        ])
                                                    ]);
                                                } else {
                                                    setSelectedStudents(prev =>
                                                        prev.filter(
                                                            id =>
                                                                !paginatedStudents.some(
                                                                    s => s.id === id
                                                                )
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                    </th>
                                    <th>NAME</th>
                                    <th>DEPARTMENT</th>
                                    <th>CURRENT FACULTY</th>
                                    <th>ASSIGN FACULTY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="afa-empty">Loading students…</td>
                                    </tr>
                                ) : paginatedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="afa-empty">No students found.</td>
                                    </tr>
                                ) : (
                                    paginatedStudents.map(student => (
                                        <tr key={student.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStudents(prev => [...prev, student.id]);
                                                        } else {
                                                            setSelectedStudents(prev =>
                                                                prev.filter(id => id !== student.id)
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td>
                                                <div className="afa-user-cell">
                                                    <div className="afa-avatar">
                                                        {getInitials(student.name)}
                                                    </div>
                                                    <div className="afa-user-name">{student.name}</div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="afa-dept-pill">{student.department}</span>
                                            </td>

                                            <td>
                                                {student.facultyName ? (
                                                    <span className="afa-faculty-pill assigned">
                                                        <FontAwesomeIcon icon={faUserCheck} /> {student.facultyName}
                                                    </span>
                                                ) : (
                                                    <span className="afa-faculty-pill unassigned">Not Assigned</span>
                                                )}
                                            </td>

                                            <td>
                                                <select
                                                    className="afa-select"
                                                    value={student.selectedFaculty || ""}
                                                    onChange={(e) =>
                                                        handleFacultyChange(student.id, e.target.value)
                                                    }
                                                >
                                                    <option value="">Select Faculty</option>
                                                    {faculty.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td>
                                                <button
                                                    className="afa-assign-btn"
                                                    disabled={assigningId === student.id || !student.selectedFaculty}
                                                    onClick={() =>
                                                        handleAssignFaculty(student.id, student.selectedFaculty)
                                                    }
                                                >
                                                    {assigningId === student.id ? "Assigning…" : "Assign"}
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && students.length > 0 && (
                        <div className="afa-pagination">
                            <button
                                className="afa-page-btn"
                                disabled={currentPage === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Prev
                            </button>
                            <span className="afa-page-info">Page {currentPage} of {totalPages}</span>
                            <button
                                className="afa-page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}
export default AdminFacultyAssignment