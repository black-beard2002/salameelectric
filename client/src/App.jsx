import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/auth"; // Import your Zustand auth store
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Offers from "./pages/Offers";
import Category from "./pages/Category";
import CategoriesPage from "./pages/Categories";
import Welcome from "./pages/Welcome";
import RootLayout from "./layouts/RootLayout";

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuthStore(); 

  useEffect(() => {
    if (user) {
      // Optionally, you could fetch additional user info or refresh the session here.
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<RootLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/offers" element={<Offers />} />
            <Route path="/app/categories/:id" element={<Category />} />
            <Route path="/app/about" element={<About />} />
            <Route path="/app/categories" element={<CategoriesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
