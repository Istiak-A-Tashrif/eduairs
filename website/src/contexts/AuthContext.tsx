import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  id: number;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
}

interface AuthContextType {
  currentUser: User | null;
  roles: Role[];
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/profile`);
      setCurrentUser(response.data.user);
      setRoles(response.data.user.roles);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
        email,
        password
      });
      setCurrentUser(response.data.user);
      setToken(response.data.token);
      setRoles(response.data.roles);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    password_confirmation: string
  ): Promise<any> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/register`, {
        name,
        email,
        password,
        password_confirmation
      });
      setCurrentUser(response.data.user);
      setToken(response.data.token);
      setRoles([{ id: 1, name: 'user' }]); // Default role with assumed structure
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  const logout = async (): Promise<void> => {
    if (token) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/logout`);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    setCurrentUser(null);
    setToken(null);
    setRoles([]);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const hasRole = (role: string): boolean => {
    return roles.some(item => item.name === role);
  };

  const value: AuthContextType = {
    currentUser,
    roles,
    hasRole,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};