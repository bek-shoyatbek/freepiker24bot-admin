import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { UserListPage } from "./Pages/Users/UserListPage/UserListPage.component";
import { UserDetailsPage } from "./Pages/Users/UserDetailsPage/UserDetailsPage.component";
import { NotFoundPage } from "./Pages/ErrorPages/NotFoundPage.component";
import { UnauthorizedPage } from "./Pages/ErrorPages/UnuathorizedPage.component";
import { MessagesPage } from "./Pages/Messages/Message.component";
import { LoginPage } from "./Pages/Admins/LoginPage.component";

function App() {
  return (
    <Router>
      <div>
        <nav className="main-nav">
          <Link to="/home" className="nav-link">
            Home
          </Link>
          <Link to="/message" className="nav-link">
            Message
          </Link>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<UserListPage />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
          <Route path="/message" element={<MessagesPage />} />
          <Route path="/authorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
