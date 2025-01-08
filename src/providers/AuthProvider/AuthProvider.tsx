import { useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Axios } from "../../api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    Axios.defaults.headers.common["Content-Type"] = "application/json";
    if (token) {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete Axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await Axios.post("/auth/login", { username, password });
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
