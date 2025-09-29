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
import MessagesPage from "@/pages/Dashboard/MessagesPage";
import MyPosts from "@/pages/Dashboard/MyPosts";
import CreateItemListing from "@/pages/Dashboard/CreateItemListing";
import AdminLogin from "@/pages/auth/AdminLogin";
import AdminForgotPassword from "@/pages/auth/AdminForgotPassword";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Login from "@/pages/auth/Login";
import OAuthCallback from "@/pages/auth/OAuthCallback";
import OAuthError from "@/pages/auth/OAuthError";
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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/auth/error" element={<OAuthError />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/api-test" element={<ApiTest />} />

            {/* Protected Routes */}
            <Route path="/admin/dashboard" element={ <ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/super-admin/dashboard" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/items" element={<ProtectedRoute><ItemListing /></ProtectedRoute>} />
            <Route path="/items/:itemId" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
            <Route path="/seller/:sellerId" element={<ProtectedRoute><SellerProfile /></ProtectedRoute>} />
            <Route path="/roommates" element={<ProtectedRoute><RoommateListing /></ProtectedRoute>} />
            <Route path="/roommates/:roommateId" element={<ProtectedRoute><RoommateDetail /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
            <Route path="/create-item" element={<ProtectedRoute><CreateItemListing /></ProtectedRoute>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;