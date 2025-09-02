'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

export type UserRole = 'client';
export type User = { 
  name?: string; 
  role?: UserRole; 
  department?: string;
};

export const UserContext = createContext<{
  user: User | null,
  setUser: (u: User | null) => void,
  setRole: (role: UserRole) => void,
  setDepartment: (department: string) => void,
  logout: () => void
}>({ user: null, setUser: () => {}, setRole: () => {}, setDepartment: () => {}, logout: () => {} });

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    console.log("UserContext: Initializing...");
    // Initialisation depuis localStorage ou URL (une seule fois)
    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");
    if (auth === "0") {
      console.log("UserContext: Auth=0, clearing user");
      setUser(null);
      localStorage.removeItem("maisys_user");
      return;
    }
    // On tente de charger depuis localStorage seulement si l'utilisateur est complètement authentifié
    const stored = localStorage.getItem("maisys_user");
    console.log("UserContext: Stored user data:", stored);
    if (stored) {
      const parsedUser = JSON.parse(stored);
      console.log("UserContext: Parsed user:", parsedUser);
      // Only restore user if they have both role and name (fully authenticated)
      if (parsedUser.name && parsedUser.role) {
        console.log("UserContext: Restoring fully authenticated user");
        setUser(parsedUser);
        return;
      } else {
        console.log("UserContext: User data incomplete, not restoring");
      }
    }
    // Don't create a fake user automatically - let the user go through onboarding and login
    console.log("UserContext: No valid user data found, starting fresh");
  }, []);

  const setRole = (role: UserRole) => {
    console.log("UserContext: Setting role to", role);
    setUser((u) => {
      const newUser = u ? { ...u, role } : { name: "Client", role };
      localStorage.setItem("maisys_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const setDepartment = (department: string) => {
    console.log("UserContext: Setting department to", department);
    setUser((u) => {
      const newUser: User = u ? { ...u, department } : { department };
      localStorage.setItem("maisys_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = () => {
    console.log("UserContext: Logging out user");
    setUser(null);
    localStorage.removeItem("maisys_user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, setRole, setDepartment, logout }}>
      {children}
    </UserContext.Provider>
  );
}
