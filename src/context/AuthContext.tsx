import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from "react";
import { useNavigate } from "react-router-dom";

// Define the User interface to match backend response
export interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
  bio?: string;
  qualification?: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

// Create the AuthContext with an undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// AuthProvider component to wrap the application and provide authentication state
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // On component mount, check for existing user data in localStorage to maintain login state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user", error);
      }
    }
    setLoading(false);
  }, []);

  // Function to handle user login, storing user data in localStorage and updating state
  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/dashboard");
  };

  // Function to handle user logout, clearing localStorage and updating state
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };
  // Provide the user, login, logout, and loading state to the context consumers
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
