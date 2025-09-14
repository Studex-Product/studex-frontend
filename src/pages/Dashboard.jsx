import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthContext } from "@/hooks/useAuthContext";

const Dashboard = () => {
  const authState = useAuthContext();
  console.log("Dashboard Auth State:", authState);

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-3xl font-bold text-center">
        Welcome to Your Dashboard
      </h1>
    </div>
    </DashboardLayout>
  );
};

export default Dashboard;