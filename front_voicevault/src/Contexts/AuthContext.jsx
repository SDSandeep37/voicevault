import { createContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    handleApiCall();
  }, []);
  const handleApiCall = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/user/session`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const userDetials = await response.json();
        const userr = userDetials.user;
        setUser(userr);
      } else {
        setUser(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Auth Context error ", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/user/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (response.ok) {
        setUser(null);
        alert("Logout successful");
        // window.location.href = "/login";
        navigate("/login");
        //remove all the local storage data
        localStorage.clear();
      } else {
        alert("Logout failed! Refresh the page and try again.");
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <UserAuthContext.Provider
      value={{ user, loading, logout, refreshUser: handleApiCall }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}
