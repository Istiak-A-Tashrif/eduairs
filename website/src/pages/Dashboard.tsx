import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../utils/api';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  myProducts: number;
}

const Dashboard = () => {
  const { currentUser, roles } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    myProducts: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get<DashboardStats>('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading || !currentUser || !roles) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-blue-700">Welcome back, {currentUser?.name}!</h2>
          <p className="text-gray-600 mt-2">
            You are logged in as: <span className="font-medium">{roles[0]?.name}</span>
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-purple-700">Product Statistics</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/products" className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition">
            View Products
          </Link>
          {roles?.some(role => role.name === "Admin") && (
            <Link to="/products/create" className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition">
              Add New Product
            </Link>
          )}
          {roles?.some(role => role.name === "Admin") && (
            <Link to="/admin" className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition">
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;