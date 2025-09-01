import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminForgotPassword from "./pages/auth/AdminForgotPassword";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import AboutUs from "./pages/AboutUs";
import Contact  from "./pages/Contact#";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;


