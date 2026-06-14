import { useEffect, useState } from "react";
import AdminSidebar from "../layout/AdminSideBar";
import AdminTopBar from "../layout/AdminTopBar";
import { registerUser, getDepartments, getAllUsers } from "../api";
import { Link, useNavigate } from "react-router-dom";

import "./AddUserPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function AddUserPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        department: "",

        mobileNumber: "",

        // Student
        rollNumber: "",
        year: "",
        semester: "",
        section: "",

        // Faculty/Admin
        employeeId: "",
        designation: "",

        role: "STUDENT",
        facultyId: ""
    });

    const [departments, setDepartments] = useState([]);
    const [facultyList, setFacultyList] = useState([]);

     const [sidebarOpen, setSidebarOpen] = useState(false);

     const [open, setOpen] = useState(false);

    useEffect(() => {

        const fetchData = async () => {

            const deptRes = await getDepartments();
            setDepartments(deptRes.data);

            const userRes = await getAllUsers();

            const faculty =
                userRes.data.filter(
                    u => u.role === "FACULTY"
                );

            setFacultyList(faculty);
        };

        fetchData();

    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                ...formData,
                facultyId: formData.facultyId
                    ? {
                        id: parseInt(
                            formData.facultyId
                        )
                    }
                    : null
            };

            console.log(payload);

            await registerUser(payload);

            alert("User created successfully");

            navigate("/admin/user");

        } catch (err) {

            console.error(err);
            alert("Error creating user");

        }
    };

    return (
        <>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminTopBar
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />

            <div className="main-section">

                <div className="container mt-4">

                    <div className="aup-header">

                        <div>

                            <div className="aup-breadcrumb">
                                <Link to="/admin/user">
                                    User Management
                                </Link>

                                <span>/</span>

                                <span>Add User</span>
                            </div>

                            <h1 className="aup-title">
                                Add New User
                            </h1>

                            <p className="aup-subtitle">
                                Create and assign user details for students, faculty and administrators.
                            </p>

                        </div>

                        <Link
                            className="aup-back-btn"
                            to="/admin/user"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Back
                        </Link>

                    </div>

                    <div className="aup-form-card">

                        <form onSubmit={handleSubmit}>

                            {/* Name */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Username */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Password */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Email */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Mobile */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Mobile Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Department */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Department
                                </label>

                                <select
                                    className="form-select"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select Department
                                    </option>

                                    {departments.map((d, i) => (
                                        <option
                                            key={i}
                                            value={d.name}
                                        >
                                            {d.name}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {/* Role */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Role
                                </label>

                                <select
                                    className="form-select"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="STUDENT">
                                        Student
                                    </option>

                                    <option value="FACULTY">
                                        Faculty
                                    </option>

                                    <option value="ADMIN">
                                        Admin
                                    </option>

                                </select>

                            </div>

                            {/* Student Fields */}

                            {formData.role === "STUDENT" && (
                                <>
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Roll Number
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="rollNumber"
                                            value={formData.rollNumber}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Year
                                        </label>

                                        <select
                                            className="form-select"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Year
                                            </option>

                                            <option value="FIRST_YEAR">
                                                1st Year
                                            </option>

                                            <option value="SECOND_YEAR">
                                                2nd Year
                                            </option>

                                            <option value="THIRD_YEAR">
                                                3rd Year
                                            </option>

                                            <option value="FOURTH_YEAR">
                                                4th Year
                                            </option>
                                        </select>

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Semester
                                        </label>

                                        <select
                                            className="form-select"
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Semester
                                            </option>

                                            <option value="SEM1">
                                                Semester 1
                                            </option>

                                            <option value="SEM2">
                                                Semester 2
                                            </option>
                                        </select>

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Section
                                        </label>

                                        <select
                                            className="form-select"
                                            name="section"
                                            value={formData.section}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Section
                                            </option>

                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>

                                        </select>

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Assign Faculty
                                        </label>

                                        <select
                                            className="form-select"
                                            name="facultyId"
                                            value={formData.facultyId}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Faculty
                                            </option>

                                            {facultyList.map(f => (
                                                <option
                                                    key={f.id}
                                                    value={f.id}
                                                >
                                                    {f.name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </>
                            )}

                            {/* Faculty/Admin */}

                            {(formData.role === "FACULTY" ||
                                formData.role === "ADMIN") && (
                                    <>
                                        <div className="mb-3">

                                            <label className="form-label">
                                                Employee ID
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="employeeId"
                                                value={formData.employeeId}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label">
                                                Designation
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleChange}
                                            />

                                        </div>
                                    </>
                                )}

                            <div className="d-flex justify-content-end">

                                <button
                                    className="btn btn-primary"
                                >
                                    Create User
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </>
    );
}

export default AddUserPage;