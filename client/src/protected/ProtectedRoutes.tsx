import type { NoAuthRouteProps } from "../types/component.types";
import { useSelector } from "react-redux";
import type { Rootstate } from "../store/store";
import { Navigate } from "react-router-dom";

export const NoAuthRoute = ({ element }: NoAuthRouteProps) => {
  const user = useSelector((state: Rootstate) => {
    if (state.user.user) return state.user.user;
    return null;
  });

  if (user) {
    return <Navigate to={"/"} />;
  }

  return element;
};

export const AuthRoute = ({ element }: NoAuthRouteProps) => {
  const user = useSelector((state: Rootstate) => {
    if (state.user.user) return state.user.user;
    return null;
  });

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return element;
};