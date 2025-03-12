import { useState, useEffect } from "react";
import API from "../utils/api";
import Swal from "sweetalert2";
import notify from "../utils/toastUtils";

interface User {
  id: number;
  name: string;
  email: string;
  roles: { name: string }[];
  created_at: string;
}

interface Statistics {
  totalUsers: number;
  totalProducts: number;
}

interface UserResponse {
  data: User[];
  last_page: number;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, statsResponse] = await Promise.all([
          API.get<UserResponse>(`/admin/users?page=${currentPage}`),
          API.get<Statistics>("/admin/statistics"),
        ]);

        setStatistics({
          totalUsers: statsResponse.data.totalUsers,
          totalProducts: statsResponse.data.totalProducts,
        });

        setUsers(usersResponse.data.data);
        setTotalPages(usersResponse.data.last_page);

        setError(null);
      } catch (err) {
        setError("Failed to fetch admin data. Please try again later.");
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [currentPage]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await API.post(`/users/${userId}/roles`, { role: newRole });

      notify.success("User Role Updated Successfully");

      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return { ...user, roles: [{ ...user.roles[0], name: newRole }] };
          }
          return user;
        })
      );
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed to update user role. ",
        text: error.response?.data?.message || "Please try again.",
      });
      console.error("Role update error:", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            Total Users
          </h2>
          <p className="text-3xl font-bold">{statistics.totalUsers}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-green-700 mb-2">
            Total Products
          </h2>
          <p className="text-3xl font-bold">{statistics.totalProducts}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.roles.map((role) => role.name).join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={user.roles[0]?.name || "User"}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <div className="text-lg font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;