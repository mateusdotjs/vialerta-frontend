import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  let location = useLocation();

  async function login(email, password) {
    setError(null);
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setUser({ id: data.userId, name: data.userName });
    setLoggedIn(data.auth);
    setLoading(false);
    return navigate("/");
  }

  async function logout() {
    setError(null);
    setLoading(true);
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      setError("Erro, tente novamente.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setLoggedIn(false);
  }

  async function createUser(name, email, password) {
    setError(null);
    setLoading(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/register",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setUser({ id: data.userId, name: data.userName });
    setLoggedIn(data.auth);
    setLoading(false);
    return navigate("/");
  }

  useEffect(() => {
    async function checkLogin() {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/user", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);

      if (data.auth) {
        setUser({ id: data.userId, name: data.userName });
        setLoggedIn(true);
      }
      setLoading(false);
    }

    setLoading(true);
    checkLogin();
  }, []);

  useEffect(() => {
    setError(null);
  }, [location]);

  return (
    <userContext.Provider
      value={{
        user,
        login,
        loggedIn,
        logout,
        createUser,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
