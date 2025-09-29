import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase";

type AdminAuthState = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<boolean>;
  checkPassword: (password: string) => Promise<boolean>;
};

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      
      login: async (password: string) => {
        try {
          const isValid = await get().checkPassword(password);
          if (isValid) {
            set({ isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },
      
      logout: () => {
        set({ isAuthenticated: false });
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
      
      changePassword: async (newPassword: string) => {
        try {
          const { error } = await supabase
            .from("site_settings")
            .upsert({ key: "admin_password", value: newPassword }, { onConflict: "key" });
          
          if (error) {
            console.error("Password change error:", error);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("Password change error:", error);
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
