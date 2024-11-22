import React from "react";
import { Navigate } from "react-router-dom";

export const UserProtect = ({ isModified, children }) => {
  if (!isModified) {
    return <Navigate to="/subscription" replace />;
  }
  return children;
};
export const UserPlansProtect = ({ plansData, children }) => {
    if (!plansData) {
      return <Navigate to="/subscription" replace />;
    }
    return children;
  };

  export const SuccessProtect = ({ successAck, children }) => {
    if (!successAck) {
      return <Navigate to="/subscription" replace />;
    }
    return children;
  };




