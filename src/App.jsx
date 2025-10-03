import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext.jsx";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/pages/ErrorBoundary";
import RouteErrorBoundary from "@/pages/RouteErrorBoundary";
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
import AdminUsers from "@/pages/admin/Users";
import AdminUserDetail from "@/pages/admin/UserDetail";
import AdminVerifications from "@/pages/admin/Verifications";
import AdminVerificationDetail from "@/pages/admin/VerificationDetail";
import AdminMarket from "@/pages/admin/Market";
import AdminMarketDetail from "@/pages/admin/MarketDetail";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";
import AllUsers from "@/pages/super-admin/AllUsers";
import UserDetail from "@/pages/super-admin/UserDetail";
import AllCampuses from "@/pages/super-admin/AllCampuses";
import CreateCampus from "@/pages/super-admin/CreateCampus";
import CampusDetail from "@/pages/super-admin/CampusDetail";
import Settings from "@/pages/Dashboard/settings/Settings";
import ProfileSetupFlow from "@/pages/profile/ProfileSetupFlow";
import Profile from "@/pages/profile/UserProfilePage";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Login from "@/pages/auth/Login";
import OAuthCallback from "@/pages/auth/OAuthCallback";
import OAuthError from "@/pages/auth/OAuthError";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import ApiTest from "@/components/test/ApiTest";

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
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <RouteErrorBoundary>
                    <Home />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <RouteErrorBoundary>
                    <AdminLogin />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <RouteErrorBoundary>
                    <ForgotPassword />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <RouteErrorBoundary>
                    <ResetPassword />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/login"
                element={
                  <RouteErrorBoundary>
                    <Login />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/auth/callback"
                element={
                  <RouteErrorBoundary>
                    <OAuthCallback />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/auth/error"
                element={
                  <RouteErrorBoundary>
                    <OAuthError />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/about"
                element={
                  <RouteErrorBoundary>
                    <AboutUs />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/admin/forgot-password"
                element={
                  <RouteErrorBoundary>
                    <AdminForgotPassword />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/register"
                element={
                  <RouteErrorBoundary>
                    <Register />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/contact"
                element={
                  <RouteErrorBoundary>
                    <Contact />
                  </RouteErrorBoundary>
                }
              />
              <Route
                path="/api-test"
                element={
                  <RouteErrorBoundary>
                    <ApiTest />
                  </RouteErrorBoundary>
                }
              />

              {/* Protected Routes */}
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AdminDashboard />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AdminUsers />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:userId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AdminUserDetail />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verifications"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AdminVerifications />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verifications/:verificationId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AdminVerificationDetail />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/market"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AdminMarket />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/market/:listingId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AdminMarketDetail />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* Super Admin Routes */}
              <Route
                path="/super-admin/dashboard"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <SuperAdminDashboard />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/users"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AllUsers />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/users/:userId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <UserDetail />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/campuses"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <AllCampuses />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/campuses/create"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <CreateCampus />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/campuses/:campusId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <CampusDetail />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* User Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <Dashboard />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <ItemListing />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items/:itemId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <ItemDetail />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/:sellerId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <SellerProfile />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roommates"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <RoommateListing />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roommates/:roommateId"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <RoommateDetail />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <MessagesPage />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-posts"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <MyPosts />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-item"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <CreateItemListing />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* Profile & Settings Routes */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <Settings />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile-setup"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <ProfileSetupFlow />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary>
                      <Profile />
                    </RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
