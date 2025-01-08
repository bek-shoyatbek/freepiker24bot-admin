import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { UserListPage } from "./pages/users/UserListPage/UserListPage.component";
import { UserDetailsPage } from "./pages/users/UserDetailsPage/UserDetailsPage.component";
import { NotFoundPage } from "./pages/errors/NotFoundPage.component";
import { MessagesPage } from "./pages/messages/Message.component";
import { LoginPage } from "./pages/auth/LoginPage.component";
import { AuthProvider } from "./providers/AuthProvider/AuthProvider";
import { Navbar } from "./components/Navbar/Navbar.component";
import { UserPlan } from "./pages/user-plans/UserPlan";

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
            <Route path="/user-plans" element={<UserPlan />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
