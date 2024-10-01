import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="main-nav">
      <Link to="/home" className="nav-link">
        Home
      </Link>
      <Link to="/message" className="nav-link">
        Message
      </Link>
      <Link to="/login" className="nav-link">
        Login
      </Link>
    </nav>
  );
};
