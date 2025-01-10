import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import { useCategoryStore } from "./store/category";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Offers from "./pages/Offers";
import Category from "./pages/Category";
import CategoriesPage from "./pages/Categories";
import Welcome from "./pages/Welcome";
import RootLayout from "./layouts/RootLayout";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, fetchCategories]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
};

function App() {
  const { checkAuthState } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAuthState();
      setIsLoading(false);
    };
    init();
  }, [checkAuthState]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Welcome />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="offers" element={<Offers />} />
            <Route path="categories/:id" element={<Category />} />
            <Route path="about" element={<About />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
