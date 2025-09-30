import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [isAuthUser, setIsAuthUser] = useState(false);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Add loading

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token && parsed?.email) {
          setUser(parsed);
          setIsRegistered(true);
          setIsAuthUser(true);
        }
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("user");
      }
    }
    setLoading(false); // ✅ Finish loading
  }, []);

  useEffect(() => {
    if (user) {
      const plainUser = {
        name: user.name,
        email: user.email,
        token: user.token,
      };
      localStorage.setItem("user", JSON.stringify(plainUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('user')
    setIsAuthUser(false)
    setUser(null)
  }

  return (
    <GlobalContext.Provider
      value={{
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        isRegistered,
        setIsRegistered,
        loading, 
        logout
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
