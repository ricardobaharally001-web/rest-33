"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { useAdminAuth } from "@/lib/admin-auth";

export default function SettingsPage() {
  const { changePassword } = useAdminAuth();
  const [values, setValues] = useState<any>({ 
    business_name: "", 
    logo_url: "", 
    theme: "light", 
    whatsapp_number: "" 
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("*");
        if (error) {
          console.error("Load error:", error);
          return;
        }
        const map: any = {}; 
        (data || []).forEach((r: any) => map[r.key] = r.value);
        setValues((prev: any) => ({ ...prev, ...map }));
      } catch (err) {
        console.error("Settings error:", err);
      }
    })();
  }, []);

  const upsert = async (key: string, value: any) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    
    if (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  };

  const save = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Promise.all(
        Object.entries(values).map(([k, v]) => upsert(k, v))
      );
      alert("Settings saved successfully!");
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Error saving settings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords don't match");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      setPasswordLoading(false);
      return;
    }

    try {
      const success = await changePassword(newPassword);
      if (success) {
        setPasswordMessage("Password changed successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage("Failed to change password");
      }
    } catch (error) {
      setPasswordMessage("Error changing password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="btn btn-ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
          <h1 className="text-2xl font-bold">Site Settings</h1>
        </div>
        
        {/* Site Settings */}
        <form onSubmit={save} className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div>
            <label className="label">Business Name</label>
            <input 
              className="input" 
              value={values.business_name || ""} 
              onChange={e => setValues({...values, business_name: e.target.value})} 
              placeholder="Your business name"
            />
          </div>
          
          <ImageUpload
            value={values.logo_url || ""}
            onChange={(url) => setValues({...values, logo_url: url})}
            bucket="brand-assets"
            label="Logo"
          />
          
          <div>
            <label className="label">Theme</label>
            <select 
              className="input" 
              value={values.theme || "light"} 
              onChange={e => setValues({...values, theme: e.target.value})}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div>
            <label className="label">WhatsApp Number</label>
            <input 
              className="input" 
              value={values.whatsapp_number || ""} 
              onChange={e => setValues({...values, whatsapp_number: e.target.value})} 
              placeholder="15551234567 (with country code, no spaces)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include country code without + or spaces (e.g., 15551234567 for US)
            </p>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          
          <div>
            <label className="label">New Admin Password</label>
            <input 
              type="password"
              className="input" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              placeholder="Enter new password"
              disabled={passwordLoading}
            />
          </div>
          
          <div>
            <label className="label">Confirm New Password</label>
            <input 
              type="password"
              className="input" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Confirm new password"
              disabled={passwordLoading}
            />
          </div>
          
          {passwordMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              passwordMessage.includes("success") 
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}>
              {passwordMessage}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={passwordLoading || !newPassword || !confirmPassword}
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
