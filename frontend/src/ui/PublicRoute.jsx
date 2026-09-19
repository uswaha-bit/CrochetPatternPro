import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function PublicRoute({ children }) {
  const { isLoggedIn, _id } = useSelector((store) => store.user);
  console.log("user status from public route", isLoggedIn);

   if (isLoggedIn && _id) {
    return <Navigate to={`/user/${_id}`} replace />;
  }


  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
