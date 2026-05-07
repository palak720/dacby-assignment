import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        Story Board
      </Link>

      <nav className="navlinks">
        <NavLink to="/">Stories</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/bookmarks">Bookmarks</NavLink>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
            <span className="user-pill">{user?.name}</span>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

