import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import AdminLogin from "./components/auth/AdminLogin";
import AdminForgotPassword from "./components/auth/AdminForgotPassword";
import AdminPasswordReset from "./components/auth/AdminPasswordReset";
import ForgotPassword from "./pages/auth/ForgotPassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminPasswordReset />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
