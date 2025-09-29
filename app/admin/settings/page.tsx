"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [values, setValues] = useState<any>({ 
    business_name: "", 
    logo_url: "", 
    theme: "light", 
    whatsapp_number: "" 
  });
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

  return (
    <form onSubmit={save} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Link>
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>
      
      <div className="card p-6 space-y-4">
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
      </div>
    </form>
  );
}
