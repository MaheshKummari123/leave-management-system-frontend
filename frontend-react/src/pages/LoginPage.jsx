import { useState } from "react";
import { getUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await getUser({ username, password });
            const user = res.data;

            sessionStorage.setItem("user", JSON.stringify(user));

            if (user.role === "ADMIN") navigate("/admin");
            else if (user.role === "STUDENT") navigate("/student");
            else navigate("/faculty");

        } catch (err) {
            setError("Invalid User or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-bg-shape shape-one"></div>
            <div className="login-bg-shape shape-two"></div>

            <div className="login-card">
                <div className="brand-block">
                    <div className="brand-icon">📋</div>
                    <p className="brand-subtitle">LeaveFlow</p>
                </div>

                <h2 className="welcome-text">Welcome Back</h2>
                <p className="welcome-sub">Sign in to manage your leaves</p>

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleLogin}>

                    <div className="input-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="custom-input"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="input-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="custom-input"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="custom-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>

                    <p className="signup-text">
                        Don't have an Account?{" "}
                        <Link to="/register" className="signup-link">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;