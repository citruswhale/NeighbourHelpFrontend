import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";
import ServiceProfile from "./pages/ServiceProfile";

function App() {
    const token = localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/dashboard" /> : <AuthPage />}/>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />}/>
                <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/" />}/>
                <Route path="/service/:serviceId" element={token ? <ServiceProfile /> : <Navigate to="/" />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
