import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase";

type AdminAuthState = {
  isAuthenticated: boolean;
  loginTimestamp: number | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  checkPassword: (password: string) => Promise<boolean>;
  hasPasswordInDatabase: () => Promise<boolean>;
};

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loginTimestamp: null,
      
      login: async (password: string) => {
        try {
          const isValid = await get().checkPassword(password);
          if (isValid) {
            set({ isAuthenticated: true, loginTimestamp: Date.now() });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },
      
      logout: () => {
        set({ isAuthenticated: false, loginTimestamp: null });
      },
      
      checkPassword: async (password: string) => {
        try {
          const { data, error } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "admin_password")
            .single();
          
          if (error || !data) {
            // If no password is set, use default password
            return password === "admin123";
          }
          
          return data.value === password;
        } catch (error) {
          console.error("Password check error:", error);
          return false;
        }
      },
      
      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          // First verify the current password
          const isValid = await get().checkPassword(currentPassword);
          if (!isValid) {
            return false;
          }
          
          // Update the password
          const { error } = await supabase
            .from("site_settings")
            .upsert({ key: "admin_password", value: newPassword }, { onConflict: "key" });
          
          if (error) {
            console.error("Password change error:", error);
            return false;
          }
          
          // Log out all users when password is changed for security
          set({ isAuthenticated: false, loginTimestamp: null });
          
          return true;
        } catch (error) {
          console.error("Password change error:", error);
          return false;
        }
      },
      
      hasPasswordInDatabase: async () => {
        try {
          const { data, error } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "admin_password")
            .single();
          
          return !error && data && data.value;
        } catch (error) {
          console.error("Error checking password:", error);
          return false;
        }
      }
    }),
    { 
      name: "admin-auth",
      skipHydration: true 
    }
  )
);
