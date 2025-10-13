import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>();
  const [updateCourseTab, setUpdateCourseTab] = useState(0);
  const [updateShowcaseTab, setUpdateShowcaseTab] = useState(0);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      user, 
      setUser,
      updateCourseTab,
      setUpdateCourseTab,
      updateShowcaseTab,
      setUpdateShowcaseTab
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
