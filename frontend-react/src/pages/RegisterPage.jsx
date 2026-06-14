import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import "./RegisterPage.css";

function RegisterPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        department: "",
        mobileNumber: "",

        // Student Fields
        rollNumber: "",
        year: "",
        semester: "",
        section: "",

        // Faculty/Admin Fields
        employeeId: "",
        designation: "",

        role: "STUDENT"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await registerUser(formData);
            navigate("/");
        } catch (err) {
            setError("Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-shape shape-one"></div>
            <div className="auth-bg-shape shape-two"></div>

            <div className="auth-card">

                <div className="auth-header">
                    <div className="brand-block">
                    <div className="brand-icon">📋</div>
                    <p className="brand-subtitle">LeaveFlow</p>
                </div>
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join and manage your leaves easily</p>
                </div>

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleRegister}>

                    <div className="form-section-title">Basic Information</div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="custom-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="custom-input"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="custom-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="custom-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                name="department"
                                className="custom-input"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label">Mobile Number</label>
                            <input
                                type="text"
                                name="mobileNumber"
                                className="custom-input"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className="custom-input"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {/* STUDENT FIELDS */}
                    {formData.role === "STUDENT" && (
                        <>
                            <div className="form-section-title">Student Details</div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label className="form-label">Roll Number</label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        className="custom-input"
                                        value={formData.rollNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="form-label">Year</label>
                                    <select
                                        name="year"
                                        className="custom-input"
                                        value={formData.year}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="FIRST_YEAR">1st Year</option>
                                        <option value="SECOND_YEAR">2nd Year</option>
                                        <option value="THIRD_YEAR">3rd Year</option>
                                        <option value="FOURTH_YEAR">4th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label className="form-label">Semester</label>
                                    <select
                                        name="semester"
                                        className="custom-input"
                                        value={formData.semester}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Semester</option>
                                        <option value="Semester 1">Semester 1</option>
                                        <option value="Semester 2">Semester 2</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="form-label">Section</label>
                                    <select
                                        name="section"
                                        className="custom-input"
                                        value={formData.section}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Section</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* FACULTY / ADMIN FIELDS */}
                    {(formData.role === "FACULTY" || formData.role === "ADMIN") && (
                        <>
                            <div className="form-section-title">
                                {formData.role === "FACULTY" ? "Faculty" : "Admin"} Details
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label className="form-label">Employee ID</label>
                                    <input
                                        type="text"
                                        name="employeeId"
                                        className="custom-input"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="form-label">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        className="custom-input"
                                        value={formData.designation}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="custom-btn" disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                    <p className="signin-text">
                        Already have an account?{" "}
                        <Link to="/" className="signin-link">Login</Link>
                    </p>

                </form>

            </div>
        </div>
    );
}

export default RegisterPage;