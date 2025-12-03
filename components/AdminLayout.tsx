"use client";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import { ReactNode, useEffect, useState, useRef } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, hasPasswordInDatabase } = useAdminAuth();
  const [mounted, setMounted] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(true);
  const [checking, setChecking] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for store hydration
      await useAdminAuth.persist.rehydrate();
      
      // Check if password exists in database
      const hasPassword = await hasPasswordInDatabase();
      setRequiresAuth(hasPassword);
      
      // Clear authentication on first load of this session if password exists
      // Use sessionStorage to track if we've already cleared it this session
      if (hasPassword) {
        const sessionCleared = sessionStorage.getItem('admin-auth-cleared');
        if (!sessionCleared) {
          // Clear any persisted authentication state
          useAdminAuth.getState().logout();
          // Mark that we've cleared it this session
          sessionStorage.setItem('admin-auth-cleared', 'true');
        }
      }
      
      setMounted(true);
      setChecking(false);
    };
    
    checkAuth();
  }, [hasPasswordInDatabase]);

  // Show loading state while hydrating and checking
  if (!mounted || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If password exists in database, require authentication
  // If no password exists, allow access (for initial setup)
  if (requiresAuth && !isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
