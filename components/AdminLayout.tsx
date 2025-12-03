"use client";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import { ReactNode, useEffect, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated } = useAdminAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for store hydration before checking authentication
    useAdminAuth.persist.rehydrate();
    setMounted(true);
  }, []);

  // Show loading state while hydrating
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication after hydration
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
