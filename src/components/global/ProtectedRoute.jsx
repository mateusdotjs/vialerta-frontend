import { useContext } from "react";
import { userContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { loggedIn, loading } = useContext(userContext);

  if (loading == true || loading == undefined) {
    return <Loading />;
  } else {
    if (loggedIn) return children;
    else return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;