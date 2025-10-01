"use client";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import { ReactNode, useEffect, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, initialize } = useAdminAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initialize().then(() => {
        setInitialized(true);
      });
    }
  }, [initialize, initialized]);

  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
