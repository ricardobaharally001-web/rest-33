"use client";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
