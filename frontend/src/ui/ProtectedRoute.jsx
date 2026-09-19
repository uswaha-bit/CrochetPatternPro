import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useSelector((store) => store.user)
  console.log("user status from protected route", isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
