"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data: session, status, update } = useSession();
  const [localUser, setLocalUser] = useState(null);
  const router = useRouter();

  // Read local user from localStorage on client side
  useEffect(() => {
    // Check all possible role-based storage keys
    const parentData = localStorage.getItem("parent");
    const sitterData = localStorage.getItem("sitter");
    const adminData = localStorage.getItem("admin");

    if (parentData) {
      setLocalUser(JSON.parse(parentData));
    } else if (sitterData) {
      setLocalUser(JSON.parse(sitterData));
    } else if (adminData) {
      setLocalUser(JSON.parse(adminData));
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localUser && !session) return;
    try {
      const role = localUser?.role || session?.user?.role;

      const endpoints = {
        admin: "/api/admin/profile",
        sitter: "/api/babysitters/profile",
        parent: "/api/parent/profile"
      };

      const endpoint = endpoints[role];
      const res = await fetch(endpoint);

      const data = await res.json();

      // Handle different response structures
      const userProfile = data.parent || data.sitter || data.admin || data.account;
      if (!userProfile) return;

      if (session) {
        // Google user — only allowed for parent role
        if (session.user.role !== "parent") {
          toast.error("Google sign-in only available for parents");
          await signOut({ callbackUrl: "/login" });
          return;
        }

        await update({
          ...session,
          user: {
            ...session.user,
            name: userProfile.fullName || session.user.name,
            image: userProfile.picture || session.user.image,
            role: "parent", // Force parent role for Google users
          },
        });
      } else {
        // Credentials user — update localStorage + state
        const role = userProfile?.role;
        localStorage.setItem(role, JSON.stringify(userProfile));
        setLocalUser(userProfile);
      }
    } catch (err) {
      toast.error(err.message || "Failed to refresh user data");
    }
  }, [session, update, localUser]);

  // The unified user — Google session takes priority (ONLY for parent role)
  const user = session?.user
    ? {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: "parent", // Google users are always parents
      provider: "google",
      fullData: session.user, // Complete session data
    }
    : localUser
      ? {
        name: localUser?.fullName || "User",
        email: localUser?.parent?.email,
        image: localUser?.picture || localUser?.profilePhoto,
        role: localUser?.role,
        provider: "credentials",
        fullData: localUser, // Complete backend data
      }
      : null;

  const isLoading = status === "loading";
  const isLoggedIn = !!user;

  const logout = async () => {
    if (session) {
      await signOut({ callbackUrl: "/" });
    }

    // Remove all role-based localStorage items
    localStorage.removeItem("parent");
    localStorage.removeItem("sitter");
    localStorage.removeItem("admin");

    setLocalUser(null);

    // Clear httpOnly cookie
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      toast.error(err.message || "Failed to log out");
    }

    router.push("/");
    router.refresh();
  };

  const loginLocal = (backendData) => {
    // Extract role from the nested account object
    const role = backendData?.account?.role;

    // Store complete backend response in appropriate localStorage key
    localStorage.setItem(role, JSON.stringify(backendData?.account));

    // Update state with complete data
    setLocalUser(backendData?.account);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        logout,
        loginLocal,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};