import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { currentUser, hasRole, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </>
  );
};

export default ProtectedRoute;