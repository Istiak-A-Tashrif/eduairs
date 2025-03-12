import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProductListing from "./pages/ProductListing";
import ProductCreate from "./pages/ProductCreate";
import ProductEdit from "./pages/ProductEdit";
import ProductDetail from "./pages/ProductDetail";
import AdminPanel from "./pages/AdminPanel";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Register from "./pages/Registert";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Route>
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/products/create" element={<ProductCreate />} />
            <Route path="/products/:id/edit" element={<ProductEdit />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
};

export default App;
