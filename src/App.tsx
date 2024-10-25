import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { UserListPage } from "./Pages/Users/UserListPage/UserListPage.component";
import { UserDetailsPage } from "./Pages/Users/UserDetailsPage/UserDetailsPage.component";
import { NotFoundPage } from "./Pages/ErrorPages/NotFoundPage.component";
import { MessagesPage } from "./Pages/Messages/Message.component";
import { LoginPage } from "./Pages/Admins/LoginPage.component";
import { AuthProvider } from "./providers/AuthProvider/AuthProvider";
import { Navbar } from "./components/Navbar/Navbar.component";
import { Payments } from "./Pages/Payments/Payments";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<UserListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user/:id" element={<UserDetailsPage />} />
            <Route path="/message" element={<MessagesPage />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
