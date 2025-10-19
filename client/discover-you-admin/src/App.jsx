import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import Webinar from "./pages/Webinar";
import Contest from "./pages/Contest";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserMangement";
import Course from "./pages/Course";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contest" element={<Contest />} />
            <Route path="/webinar" element={<Webinar />} />
            <Route path="/course" element={<Course />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route
              path="*"
              element={<></>}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
