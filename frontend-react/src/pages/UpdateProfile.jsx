import { useEffect, useState } from "react";
import { updateUser, uploadProfileImage } from "../api";
import { useNavigate, Link } from "react-router-dom";

import NavBar from "../layout/NavBar";
import FacultyNavBar from "../layout/FacultyNavBar";
import AdminTopBar from "../layout/AdminTopBar";

import "./UpdateProfile.css";

function UpdateProfile() {

    const [role, setRole] = useState("");
    const navigate = useNavigate();

    //Profile image
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [profileImage, setProfileImage] = useState("");

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);

        setPreview(URL.createObjectURL(file));
    };

    const [formData, setFormData] = useState({
        id: "",
        name: "",
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

        password: ""
    });

    useEffect(() => {

        const user = JSON.parse(sessionStorage.getItem("user"));

        if (user) {

            setRole(user.role);

            setProfileImage(user.profileImage || "");

            setFormData({
                id: user.id,
                name: user.name || "",
                email: user.email || "",
                department: user.department || "",
                mobileNumber: user.mobileNumber || "",

                rollNumber: user.rollNumber || "",
                year: user.year || "",
                semester: user.semester || "",
                section: user.section || "",

                employeeId: user.employeeId || "",
                designation: user.designation || "",

                password: ""
            });
        }

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            // Upload Image
            if (selectedImage) {

                const imageData = new FormData();

                imageData.append(
                    "file",
                    selectedImage
                );

                const imageRes =
                    await uploadProfileImage(
                        formData.id,
                        imageData
                    );

                if (imageRes?.data) {

                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(
                            imageRes.data
                        )
                    );
                }
            }

            // Prepare Update Data
            const updateData = {
                ...formData,

                year: formData.year || null,
                section: formData.section || null,
                semester: formData.semester || null,

                employeeId:
                    formData.employeeId || null,

                designation:
                    formData.designation || null
            };

            // Remove Student Fields for Admin/Faculty
            if (
                role === "ADMIN" ||
                role === "FACULTY"
            ) {

                delete updateData.rollNumber;
                delete updateData.year;
                delete updateData.semester;
                delete updateData.section;
            }

            // Remove Faculty Fields for Student
            if (role === "STUDENT") {

                delete updateData.employeeId;
                delete updateData.designation;
            }

            console.log(
                JSON.stringify(
                    updateData,
                    null,
                    2
                )
            );

            // Update Profile
            const res = await updateUser(
                formData.id,
                updateData
            );

            if (res?.data) {

                sessionStorage.setItem(
                    "user",
                    JSON.stringify(
                        res.data
                    )
                );
            }

            alert(
                "Profile updated successfully"
            );

            navigate("/profile");

        } catch (error) {

            console.log(
                "STATUS:",
                error.response?.status
            );

            console.log(
                "DATA:",
                error.response?.data
            );

            console.error(error);

            alert("Update failed");
        }
    };

    //Rendering respected nav bars
    const user = JSON.parse(sessionStorage.getItem("user"));

    const renderNavbar = () => {
        if (user?.role === "FACULTY") {
            return <FacultyNavBar />;
        }

        if (user?.role === "ADMIN") {
            return <AdminTopBar />;
        }

        return <NavBar />;
    };

    return (

        <>

            {renderNavbar()}
            <div className="update-page">
                {/* Header Section */}
                <div className="page-header">
                    <div className="breadcrumb">
                        <Link to="/profile" className="breadcrumb-link">
                            Profile
                        </Link>

                        <span className="breadcrumb-separator">›</span>

                        <span className="breadcrumb-current">
                            Update Profile
                        </span>
                    </div>

                    <h1 className="page-title">
                        Update Profile
                    </h1>
                </div>

                <div className="update-card">
                    <div className="image-upload-wrapper">

                        <img
                            src={
                                preview
                                    ? preview
                                    : profileImage
                                        ? profileImage  // now a full Cloudinary URL like https://res.cloudinary.com/...
                                        : "/male-profile-img.png"
                            }
                            alt="Profile"
                            className="edit-profile-img"
                        />

                        <label className="camera-btn">
                            📷
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>

                    </div>

                    <form onSubmit={handleUpdate}>

                        {/* Name */}

                        <div className="mb-3">

                            <label className="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                className="form-control modern-input"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Email */}

                        <div className="mb-3">

                            <label className="form-label">
                                Email Address
                            </label>

                            <input
                                type="email"
                                className="form-control modern-input"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Department */}

                        <div className="mb-3">

                            <label className="form-label">
                                Department
                            </label>

                            <input
                                type="text"
                                className="form-control modern-input"
                                name="department"
                                value={formData.department}
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
                                className="form-control modern-input"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                            />

                        </div>

                        {/* STUDENT FIELDS */}

                        {role === "STUDENT" && (
                            <>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Roll Number
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control modern-input"
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
                                        className="form-select modern-input"
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
                                        className="form-select modern-input"
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
                                        className="form-select modern-input"
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

                            </>
                        )}

                        {/* FACULTY / ADMIN */}

                        {(role === "FACULTY" ||
                            role === "ADMIN") && (
                                <>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Employee ID
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control modern-input"
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
                                            className="form-control modern-input"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </>
                            )}

                        {/* Password */}

                        <div className="mb-4">

                            <label className="form-label">
                                New Password
                            </label>

                            <input
                                type="password"
                                className="form-control modern-input"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank if not changing"
                            />

                        </div>

                        {/* Buttons */}

                        <div className="button-group">

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/profile")}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </>

    );
}

export default UpdateProfile;