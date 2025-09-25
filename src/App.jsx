import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext.jsx";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ItemListing from "@/pages/Dashboard/ItemListing";
import ItemDetail from "@/pages/Dashboard/ItemDetail";
import SellerProfile from "@/pages/Dashboard/SellerProfile";
import RoommateListing from "@/pages/Dashboard/RoommateListing";
import RoommateDetail from "@/pages/Dashboard/RoommateDetail";
import AdminLogin from "@/pages/auth/AdminLogin";
import AdminForgotPassword from "@/pages/auth/AdminForgotPassword";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import ApiTest from '@/components/test/ApiTest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 1 minute
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/api-test" element={<ApiTest />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/items" element={<ProtectedRoute><ItemListing /></ProtectedRoute>} />
            <Route path="/items/:itemId" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
            <Route path="/seller/:sellerId" element={<ProtectedRoute><SellerProfile /></ProtectedRoute>} />
            <Route path="/roommates" element={<ProtectedRoute><RoommateListing /></ProtectedRoute>} />
            <Route path="/roommates/:roommateId" element={<ProtectedRoute><RoommateDetail /></ProtectedRoute>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;