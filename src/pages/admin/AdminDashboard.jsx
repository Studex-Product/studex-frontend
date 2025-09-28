import React from "react";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import UsersIcon from "@/assets/icons/users-icon.svg";
import ShopIcon from "@/assets/icons/shop-icon.svg";

const AdminDashboard = () => {
  // Mock data - replace with actual API calls
  const statsData = {
    totalUsers: {
      value: "1200",
      change: "+2%",
      period: "this month",
      isPositive: true
    },
    totalRevenue: {
      value: "$5,600",
      change: "-5%",
      period: "this month",
      isPositive: false
    }
  };

  const conversionData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    datasets: {
      buyer: [280, 320, 250, 200, 300, 280, 350, 320, 280, 250, 300, 320],
      student: [200, 250, 180, 150, 220, 200, 280, 260, 230, 200, 250, 280]
    }
  };

  const recentActivity = [
    {
      id: 1,
      title: "New Account Verification",
      description: "Kathryn is awaiting her roommate profile verification",
      time: "1 hr ago",
      type: "verification"
    },
    {
      id: 2,
      title: "Product Verification",
      description: "Sade posted new products on the marketplace",
      time: "6 hrs ago",
      type: "product"
    },
    {
      id: 3,
      title: "Premium User",
      description: "Charles upgraded his account to premium",
      time: "12 hrs ago",
      type: "premium"
    },
    {
      id: 4,
      title: "App Rating",
      description: "Sandy rated the app 5 on playstore",
      time: "22 hrs ago",
      type: "rating"
    },
    {
      id: 5,
      title: "Account Report",
      description: "John reported a roommate account",
      time: "2 days ago",
      type: "report"
    }
  ];

  const users = [
    {
      id: 1,
      name: "Adelakun Taiwo",
      userId: "EKSU/24/2861",
      location: "Ikeja, Lagos",
      role: "Seller",
      status: "Active",
      dateJoined: "12/04/2025",
      avatar: "AT"
    },
    {
      id: 2,
      name: "James Charles",
      userId: "LASU/21/6651",
      location: "VI, Lagos",
      role: "Student",
      status: "Active",
      dateJoined: "12/06/2025",
      avatar: "JC"
    },
    {
      id: 3,
      name: "Kathryn Bernado",
      userId: "UNLAG/23/1281",
      location: "Ife,Osun",
      role: "Buyer",
      status: "Suspended",
      dateJoined: "12/07/2025",
      avatar: "KB"
    },
    {
      id: 4,
      name: "Julia Montes",
      userId: "LASU/21/0024",
      location: "Ikeja, Lagos",
      role: "Seller",
      status: "Active",
      dateJoined: "12/05/2025",
      avatar: "JM"
    },
    {
      id: 5,
      name: "Daniel Padilla",
      userId: "OOU/24/1208",
      location: "Ikeja, Lagos",
      role: "Student",
      status: "Active",
      dateJoined: "12/04/2025",
      avatar: "DP"
    },
    {
      id: 6,
      name: "James Reid",
      userId: "OAU/20/1407",
      location: "Ikeja, Lagos",
      role: "Student",
      status: "Active",
      dateJoined: "12/04/2025",
      avatar: "JR"
    },
    {
      id: 7,
      name: "Isabella Manovan",
      userId: "OSU/22/1456",
      location: "Ikeja, Lagos",
      role: "Student",
      status: "Suspended",
      dateJoined: "12/04/2025",
      avatar: "IM"
    },
    {
      id: 8,
      name: "Lara Raj",
      userId: "UNLAG/19/9983",
      location: "Ikeja, Lagos",
      role: "Buyer",
      status: "Active",
      dateJoined: "12/04/2025",
      avatar: "LR"
    }
  ];

  return (
    <AdminDashboardLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card 1 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <img src={UsersIcon} alt="Users" className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{statsData.totalUsers.value}</p>
              <div className="flex items-center text-sm">
                <span className={`flex items-center ${statsData.totalUsers.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {statsData.totalUsers.isPositive ? '↗' : '↘'} {statsData.totalUsers.change}
                </span>
                <span className="text-gray-500 ml-1">{statsData.totalUsers.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Users Card 2 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <img src={UsersIcon} alt="Users" className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{statsData.totalUsers.value}</p>
              <div className="flex items-center text-sm">
                <span className={`flex items-center ${statsData.totalUsers.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {statsData.totalUsers.isPositive ? '↗' : '↘'} {statsData.totalUsers.change}
                </span>
                <span className="text-gray-500 ml-1">{statsData.totalUsers.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{statsData.totalRevenue.value}</p>
              <div className="flex items-center text-sm">
                <span className={`flex items-center ${statsData.totalRevenue.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {statsData.totalRevenue.isPositive ? '↗' : '↘'} {statsData.totalRevenue.change}
                </span>
                <span className="text-gray-500 ml-1">{statsData.totalRevenue.period}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* App Conversion Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">App Conversion</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Buyer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Student / Roommate</span>
              </div>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Last 30Days</option>
                <option>Last 7 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Chart visualization will be implemented here</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">280</p>
              <p className="text-sm text-gray-500">Other users</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">{user.avatar}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.dateJoined}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;