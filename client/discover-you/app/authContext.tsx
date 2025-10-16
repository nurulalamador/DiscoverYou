import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>();
  const [updateCourse, setUpdateCourse] = useState(0);
  const [updateShowcase, setUpdateShowcase] = useState(0);
  const [updateMessage, setUpdateMessage] = useState(0);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      user, 
      setUser,
      updateCourse,
      setUpdateCourse,
      updateShowcase,
      setUpdateShowcase,
      updateMessage,
      setUpdateMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth () {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
