import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminForgotPassword from "./pages/auth/AdminForgotPassword";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
