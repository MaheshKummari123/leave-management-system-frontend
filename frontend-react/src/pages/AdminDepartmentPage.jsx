import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminSidebar from "../layout/AdminSideBar";
import AdminTopBar from "../layout/AdminTopBar";
import { useRef } from "react";
import {
    faAdd,
    faSearch,
    faEye,
    faPencil,
    faTrash,
    faXmark,
    faCheck,
    faTriangleExclamation,
    faBuilding,
    faUserGraduate,
    faChalkboardUser,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getDepartments, updateDepartmentName } from "../api";
import "./AdminDepartmentPage.css";

const DEFAULT_FORM = { name: "" };

function StatCard({ label, value, sub, iconClass }) {
    return (
        <div className="adp-stat-card">
            <div className="adp-stat-label">
                <i className={`fa-solid fa-${iconClass} adp-stat-icon`} aria-hidden="true" />
                {label}
            </div>
            <div className="adp-stat-value">{value}</div>
            <div className="adp-stat-sub">{sub}</div>
        </div>
    );
}

export default function AdminDepartmentPage() {
    const [depts, setDepts] = useState([]);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view' | 'delete'
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [notify, setNotify] = useState({ show: false, msg: "" });

    /* ── data ── */
    useEffect(() => {
        fetchDepts();
    }, []);

    const fetchDepts = async () => {
        try {
            const res = await getDepartments();
            // Expecting each item like:
            // { id, name, studentCount, facultyCount }
            // Falls back gracefully if API only returns plain strings/names.
            console.log(res.data)
            const list = (res.data || []).map((d, idx) => {
                if (typeof d === "string") {
                    return { id: idx + 1, name: d, studentCount: 0, facultyCount: 0 };
                }
                return {
                    id: d.id ?? idx + 1,
                    name: d.name,
                    studentCount: d.students ?? 0,
                    facultyCount: d.faculty ?? 0,
                    totalUsers: d.totalUsers ?? 0
                };
            });
            setDepts(list);
        } catch {
            /* seed with demo data if API unavailable */
            
        }
    };

    /* ── computed totals ── */
    const totalStudents = depts.reduce((a, d) => a + (d.studentCount || 0), 0);
    const totalFaculty = depts.reduce((a, d) => a + (d.facultyCount || 0), 0);
    const totalUsers = depts.reduce(
        (a, d) => a + (d.totalUsers || 0),
        0
    );

    /* ── filtering ── */
    const filtered = depts.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ── notifications ── */
    const notifyTimer = useRef(null);

    const showNotify = (msg) => {

        clearTimeout(notifyTimer.current);

        setNotify({
            show: true,
            msg
        });

        notifyTimer.current = setTimeout(() => {
            setNotify({
                show: false,
                msg: ""
            });
        }, 2800);
    };

    /* ── modal helpers ── */
    const openAdd = () => {
        setForm(DEFAULT_FORM);
        setModal("add");
    };
    const openEdit = (d) => {
        setSelected(d);
        setForm({ name: d.name });
        setModal("edit");
    };
    const openView = (d) => { setSelected(d); setModal("view"); };
    const openDelete = (d) => { setSelected(d); setModal("delete"); };
    const closeModal = () => { setModal(null); setSelected(null); };

     const [sidebarOpen, setSidebarOpen] = useState(false);

     const [open, setOpen] = useState(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    /* ── CRUD (string-based, name only) ── */
    const handleAdd = () => {
        const name = form.name.trim();
        if (!name) return;
        if (depts.some((d) => d.name.toLowerCase() === name.toLowerCase())) {
            showNotify(`"${name}" already exists.`);
            return;
        }
        const newDept = { id: Date.now(), name, studentCount: 0, facultyCount: 0 };
        setDepts((prev) => [...prev, newDept]);
        closeModal();
        showNotify(`"${newDept.name}" department created.`);
        // TODO: call createDepartment(name) API
    };

    const handleEdit = async () => {

        const name = form.name.trim();

        if (!name) return;

        try {

            await updateDepartmentName(
                selected.name,
                name
            );

            await fetchDepts();

            closeModal();

            showNotify(
                `Department renamed to "${name}".`
            );

        } catch (err) {

            console.error(err);

            showNotify(
                "Failed to update department."
            );
        }
    };

    const handleDelete = () => {
        const name = selected.name;
        setDepts((prev) => prev.filter((d) => d.id !== selected.id));
        closeModal();
        showNotify(`"${name}" removed.`);
        // TODO: call deleteDepartment(selected.id) API
    };

    /* ── render ── */
    return (
        <>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminTopBar
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />

            <div className="main-section adp-main">

                {/* Page header */}
                <div className="adp-page-header">
                    <div>
                        <h2>Department management</h2>
                        <p>Create, edit, and remove departments used across the institution.</p>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="alm-stats">

                    <div className="alm-stat-card alm-stat-purple">
                        <div>
                            <p className="alm-stat-label">DEPARTMENTS</p>
                            <h2 className="alm-stat-value">{depts.length}</h2>
                            <p className="alm-stat-sub">Total departments</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-purple">
                            <FontAwesomeIcon icon={faBuilding} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-blue">
                        <div>
                            <p className="alm-stat-label">TOTAL USERS</p>
                            <h2 className="alm-stat-value">
                                {totalUsers}
                            </h2>
                            <p className="alm-stat-sub">Across all departments</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-blue">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-green">
                        <div>
                            <p className="alm-stat-label">STUDENTS</p>
                            <h2 className="alm-stat-value">
                                {totalStudents.toLocaleString()}
                            </h2>
                            <p className="alm-stat-sub">Enrolled students</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-green">
                            <FontAwesomeIcon icon={faUserGraduate} />
                        </div>
                    </div>

                    <div className="alm-stat-card alm-stat-yellow">
                        <div>
                            <p className="alm-stat-label">FACULTY</p>
                            <h2 className="alm-stat-value">
                                {totalFaculty.toLocaleString()}
                            </h2>
                            <p className="alm-stat-sub">Assigned faculty</p>
                        </div>

                        <div className="alm-stat-icon alm-icon-yellow">
                            <FontAwesomeIcon icon={faChalkboardUser} />
                        </div>
                    </div>

                </div>

                {/* Table card */}
                <section className="adp-card">

                    {/* Toolbar */}
                    <div className="adp-toolbar">
                        <div className="adp-search-wrap">
                            <FontAwesomeIcon icon={faSearch} className="adp-search-icon" />
                            <input
                                type="search"
                                className="adp-search-input"
                                placeholder="Search departments…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button className="adp-btn-primary" onClick={openAdd}>
                            <FontAwesomeIcon icon={faAdd} />
                            Add department
                        </button>
                    </div>

                    {/* Table */}
                    <div className="adp-table-wrap">
                        {filtered.length === 0 ? (
                            <div className="adp-empty">
                                <FontAwesomeIcon icon={faBuilding} className="adp-empty-icon" />
                                <p>No departments match your search.</p>
                            </div>
                        ) : (
                            <table className="adp-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Department</th>
                                        <th>Students</th>
                                        <th>Faculty</th>
                                        <th className="adp-th-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((d, idx) => (
                                        <tr key={d.id}>
                                            <td className="adp-td-num">{idx + 1}</td>
                                            <td>
                                                <div className="adp-dept-cell">
                                                    <div className="adp-dept-icon">
                                                        <i className="fa-solid fa-building" aria-hidden="true" />
                                                    </div>
                                                    <div className="adp-dept-name">{d.name}</div>
                                                </div>
                                            </td>
                                            <td><span className="adp-badge adp-badge-student">{d.studentCount || 0}</span></td>
                                            <td><span className="adp-badge adp-badge-faculty">{d.facultyCount || 0}</span></td>
                                            <td className="adp-td-actions">
                                                <div className="adp-actions-wrap">
                                                    <button
                                                        className="adp-action-btn"
                                                        onClick={() => openView(d)}
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>

                                                    <button
                                                        className="adp-action-btn"
                                                        onClick={() => openEdit(d)}
                                                    >
                                                        <FontAwesomeIcon icon={faPencil} />
                                                    </button>

                                                    <button
                                                        className="adp-action-btn adp-action-btn--danger"
                                                        onClick={() => openDelete(d)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>

            {/* ── Modals ── */}
            {modal && (
                <div className="adp-overlay" onClick={(e) => { if (e.target.classList.contains("adp-overlay")) closeModal(); }}>
                    <div className="adp-modal">

                        {/* ADD */}
                        {modal === "add" && (
                            <>
                                <ModalHeader title="Add department" onClose={closeModal} />
                                <div className="adp-modal-body">
                                    <DeptForm form={form} onChange={handleFormChange} />
                                </div>
                                <div className="adp-modal-footer">
                                    <button className="adp-btn-secondary" onClick={closeModal}>Cancel</button>
                                    <button className="adp-btn-primary" onClick={handleAdd}>
                                        <FontAwesomeIcon icon={faCheck} /> Create department
                                    </button>
                                </div>
                            </>
                        )}

                        {/* EDIT */}
                        {modal === "edit" && (
                            <>
                                <ModalHeader title={`Edit — ${selected.name}`} onClose={closeModal} />
                                <div className="adp-modal-body">
                                    <DeptForm form={form} onChange={handleFormChange} />
                                </div>
                                <div className="adp-modal-footer">
                                    <button className="adp-btn-secondary" onClick={closeModal}>Cancel</button>
                                    <button className="adp-btn-primary" onClick={handleEdit}>
                                        <FontAwesomeIcon icon={faCheck} /> Save changes
                                    </button>
                                </div>
                            </>
                        )}

                        {/* VIEW */}
                        {modal === "view" && selected && (
                            <>
                                <ModalHeader title={selected.name} onClose={closeModal} />
                                <div className="adp-modal-body">
                                    <div className="adp-view-hero">
                                        <div className="adp-view-icon">
                                            <i className="fa-solid fa-building" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <div className="adp-view-deptname">{selected.name}</div>
                                        </div>
                                    </div>

                                    <div className="adp-view-grid">
                                        <div className="adp-view-stat adp-view-stat--green">
                                            <div className="adp-view-stat-label">
                                                <FontAwesomeIcon icon={faUserGraduate} /> Students
                                            </div>
                                            <div className="adp-view-stat-val">{selected.studentCount || 0}</div>
                                        </div>
                                        <div className="adp-view-stat adp-view-stat--blue">
                                            <div className="adp-view-stat-label">
                                                <FontAwesomeIcon icon={faChalkboardUser} /> Faculty
                                            </div>
                                            <div className="adp-view-stat-val">{selected.facultyCount || 0}</div>
                                        </div>
                                    </div>

                                    <p className="adp-view-note">
                                        Counts are managed automatically based on user assignments and can't be edited here.
                                    </p>
                                </div>
                                <div className="adp-modal-footer">
                                    <button className="adp-btn-secondary" onClick={closeModal}>Close</button>
                                    <button className="adp-btn-primary" onClick={() => { closeModal(); openEdit(selected); }}>
                                        <FontAwesomeIcon icon={faPencil} /> Edit name
                                    </button>
                                </div>
                            </>
                        )}

                        {/* DELETE */}
                        {modal === "delete" && selected && (
                            <>
                                <ModalHeader title="Remove department" onClose={closeModal} />
                                <div className="adp-modal-body">
                                    <div className="adp-delete-warning">
                                        <div className="adp-delete-icon-wrap">
                                            <FontAwesomeIcon icon={faTriangleExclamation} className="adp-delete-icon" />
                                        </div>
                                        <div>
                                            <p className="adp-delete-title">Remove "{selected.name}"?</p>
                                            <p className="adp-delete-body">
                                                {(selected.studentCount || 0) + (selected.facultyCount || 0) > 0 ? (
                                                    <>
                                                        This department currently has <strong>{selected.studentCount || 0} students</strong> and{" "}
                                                        <strong>{selected.facultyCount || 0} faculty</strong> linked to it. Their department field
                                                        will keep this text unless updated. This cannot be undone.
                                                    </>
                                                ) : (
                                                    "This cannot be undone."
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="adp-modal-footer">
                                    <button className="adp-btn-secondary" onClick={closeModal}>Keep it</button>
                                    <button className="adp-btn-danger" onClick={handleDelete}>Yes, remove</button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}

            {/* Toast */}
            <div className={`adp-toast${notify.show ? " adp-toast--show" : ""}`} role="status" aria-live="polite">
                <FontAwesomeIcon icon={faCheck} className="adp-toast-icon" />
                {notify.msg}
            </div>
        </>
    );
}

/* ── Shared sub-components ── */

function ModalHeader({ title, onClose }) {
    return (
        <div className="adp-modal-header">
            <h4 className="adp-modal-title">{title}</h4>
            <button className="adp-modal-close" onClick={onClose} aria-label="Close modal">
                <FontAwesomeIcon icon={faXmark} />
            </button>
        </div>
    );
}

function DeptForm({ form, onChange }) {
    return (
        <div className="adp-form-group">
            <label className="adp-form-label">Department name</label>
            <input
                className="adp-form-input"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Computer Science"
                autoFocus
            />
        </div>
    );
}