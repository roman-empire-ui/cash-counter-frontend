import { useContext } from "react";
import { GlobalContext } from "./globalContext";
import ErrorPage from "../pages/ErrorPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthUser, loading } = useContext(GlobalContext);

  if (loading) return <div>Loading...</div>; // wait for context to restore

  if (!isAuthUser) return <ErrorPage />;

  return children;
};

export default ProtectedRoute;
