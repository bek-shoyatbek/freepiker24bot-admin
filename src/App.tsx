import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { UserListPage } from "./components/Users/UserListPage/UserListPage.component";
import { UserDetailsPage } from "./components/Users/UserDetailsPage.component";
import MessagesComponent from "./components/Messages/Message.component";

function App() {
  return (
    <Router>
      <div>
        <nav className="main-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/message" className="nav-link">
            Message
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<UserListPage />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
          <Route path="/message" element={<MessagesComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
