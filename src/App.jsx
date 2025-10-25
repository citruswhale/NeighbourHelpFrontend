import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} /> {/* ✅ Add this */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
