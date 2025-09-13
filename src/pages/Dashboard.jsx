import Logo from "@/components/common/Logo";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const authState = useAuthContext();
  const { logout } = useAuth();

  console.log("Dashboard Auth State:", authState);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <Logo />
      <h1 className="text-3xl font-bold text-center">
        Welcome to Your Dashboard
      </h1>
      <button
        className="flex gap-2 items-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer"
        onClick={logout}
      >
        Logout <LogOut size={12} />
      </button>
    </div>
  );
};

export default Dashboard;