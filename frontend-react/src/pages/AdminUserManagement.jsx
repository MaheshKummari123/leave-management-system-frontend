import { useEffect, useState } from "react"
import { deleteUser, getAllUsers, getDepartments, searchUsers, updateUserDepartment } from "../api";
import AdminSidebar from "../layout/AdminSideBar";
import AdminTopBar from "../layout/AdminTopBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTrash, faBuilding } from "@fortawesome/free-solid-svg-icons";
import './AdminUserManagement.css';

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function RolePill({ role }) {
    const map = {
        ADMIN: "pill-admin",
        FACULTY: "pill-faculty",
        STUDENT: "pill-student",
    };
    return <span className={`role-pill ${map[role] || "pill-student"}`}>{role}</span>;
}

function AdminUserManagement() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [departments, setDepartments] = useState([]);

    const getAllDepartments = async () => {
        const res = await getDepartments();
        setDepartments(res.data);
    }

    const [newDept, setNewDept] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const roles = ['All Roles', 'STUDENT', 'FACULTY', 'ADMIN']

    const [filteredUsers, setFilteredUsers] = useState([]);

    const [open, setOpen] = useState(false);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    const allUsers = async () => {
        const userList = await getAllUsers();
        setUsers(userList.data);
        setFilteredUsers(userList.data)
    }

    //Delete popup
    const [deleteUserData, setDeleteUserData] = useState(null);

    useEffect(() => {
        allUsers();
        getAllDepartments();
    }, [])

    const handleSearch = async (value) => {
        if (value.trim() === "") {
            setFilteredUsers(users);
            setCurrentPage(1);
            return;
        }
        const res = await searchUsers(value);
        setFilteredUsers(res.data);
        setCurrentPage(1);
    }

    const handleDelete = async (id) => {
        await deleteUser(id);
        allUsers();

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }

    const handleChangeDepartment = async (user) => {
        const res = updateUserDepartment(user.id,)
    }

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setCurrentPage(1);

        if (role === "All Roles") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) => user.role === role
            );
            setFilteredUsers(filtered);
        }
    }
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const currentUsers = filteredUsers.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminTopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="aum-page">

                {/* Header */}
                <div className="aum-header">
                    <div>
                        <h1 className="aum-title">User Management</h1>
                        <p className="aum-subtitle">Manage users, roles, and access across your platform.</p>
                    </div>
                    <div className="aum-header-actions">
                        <Link className="aum-btn-primary" to="/admin/user/add-user">
                            <FontAwesomeIcon icon={faPlus} /> Add User
                        </Link>
                    </div>
                </div>

                {/* Table Card */}
                <div className="aum-table-card">
                    {/* Filters */}
                    <div className="aum-filters">
                        <div className="aum-search-wrap">
                            <FontAwesomeIcon icon={faSearch} className="aum-search-icon" />
                            <input
                                type="search"
                                className="aum-search"
                                placeholder="Search users..."
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                        </div>

                        <div className="dropdown">
                            <button
                                className="aum-select-btn dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                onClick={() => setOpen(!open)}
                            >
                                {selectedRole}
                            </button>
                            <ul className="dropdown-menu">
                                {
                                    roles.map((role, index) => (
                                        <li key={index}>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => handleRoleChange(role)}
                                            >
                                                {role}
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <span className="aum-showing-text">
                            Showing {filteredUsers.length} of {users.length} users
                        </span>
                    </div>

                    {/* Table */}
                    <div className="aum-table-wrap">
                        <table className="aum-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>USER</th>
                                    <th>EMAIL</th>
                                    <th>ROLE</th>
                                    <th>DEPARTMENT</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    currentUsers.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{indexOfFirstUser + index + 1}</td>
                                            <td>
                                                <div className="aum-user-cell">
                                                    <div className="aum-avatar">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div className="aum-user-name">{user.name}</div>
                                                </div>
                                            </td>
                                            <td className="aum-email">{user.email}</td>
                                            <td><RolePill role={user.role} /></td>
                                            <td className="aum-department">{user.department || "—"}</td>
                                            <td>
                                                <div className="aum-actions">
                                                    <button
                                                        className="aum-action-dept"
                                                        onClick={() => {
                                                            setNewDept(user.department);
                                                            setSelectedUser(user);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faBuilding} /> Change Department
                                                    </button>
                                                    <button
                                                        className="aum-action-delete"
                                                        title="Delete user"
                                                        onClick={() => setDeleteUserData(user)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="aum-empty">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="aum-pagination">
                        <span className="aum-page-info">
                            {
                                filteredUsers.length > 0
                                    ? `Showing ${indexOfFirstUser + 1}-${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length} users`
                                    : "No users found"
                            }
                        </span>

                        <div className="aum-pagination-controls">
                            <button
                                className="aum-page-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`aum-page-btn ${currentPage === i + 1 ? "aum-page-active" : ""
                                        }`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                className="aum-page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="aum-modal-overlay">
                    <div className="aum-modal-box">

                        <h4 className="aum-modal-title">Change Department</h4>

                        <p className="aum-modal-user">
                            {selectedUser?.name}
                        </p>

                        <select
                            className="aum-select-full"
                            value={newDept}
                            onChange={(e) => setNewDept(e.target.value)}
                        >
                            <option value="">Select Department</option>

                            {
                                departments.map((dept, index) => (
                                    <option key={index} value={dept.name}>
                                        {dept.name}
                                    </option>
                                ))
                            }
                        </select>

                        <div className="aum-modal-actions">
                            <button
                                className="aum-btn-outline"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="aum-btn-primary"
                                onClick={async () => {
                                    await updateUserDepartment(selectedUser.id, newDept);
                                    setShowModal(false);
                                    allUsers(); // refresh table
                                }}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {deleteUserData && (
                <div className="aum-modal-overlay">
                    <div className="aum-delete-modal">

                        <div className="aum-delete-icon">
                            <FontAwesomeIcon icon={faTrash} />
                        </div>

                        <h3 className="aum-delete-title">
                            Delete User?
                        </h3>

                        <p className="aum-delete-text">
                            Are you sure you want to delete
                            <strong> {deleteUserData.name}</strong>?
                            This action cannot be undone.
                        </p>

                        <div className="aum-delete-actions">

                            <button
                                className="aum-btn-outline"
                                onClick={() => setDeleteUserData(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="aum-delete-btn"
                                onClick={async () => {
                                    await handleDelete(deleteUserData.id);
                                    setDeleteUserData(null);
                                }}
                            >
                                Delete User
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    )
}
export default AdminUserManagement