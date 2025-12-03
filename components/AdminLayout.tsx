"use client";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import { ReactNode, useEffect, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, hasPasswordInDatabase } = useAdminAuth();
  const [mounted, setMounted] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for store hydration
      await useAdminAuth.persist.rehydrate();
      setMounted(true);
      
      // Check if password exists in database
      const hasPassword = await hasPasswordInDatabase();
      setRequiresAuth(hasPassword);
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
