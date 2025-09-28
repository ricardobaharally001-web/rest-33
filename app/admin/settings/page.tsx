"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [values, setValues] = useState<any>({ business_name: "", logo_url: "", theme: "light", whatsapp_number: "" });
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: any = {}; (data||[]).forEach((r:any)=>map[r.key]=r.value);
      setValues({ ...values, ...map });
    })();
  }, []);

  const upsert = async (key:string, value:any) => {
    await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  };

  const save = async (e:any) => {
    e.preventDefault();
    await Promise.all(Object.entries(values).map(([k,v])=>upsert(k, v)));
    alert("Saved");
  };

  return (
    <form onSubmit={save} className="space-y-4 max-w-xl">
      <div>
        <label className="label">Business name</label>
        <input className="input" value={values.business_name||""} onChange={e=>setValues({...values, business_name: e.target.value})} />
      </div>
      <div>
        <label className="label">Logo URL</label>
        <input className="input" value={values.logo_url||""} onChange={e=>setValues({...values, logo_url: e.target.value})} />
      </div>
      <div>
        <label className="label">Theme</label>
        <select className="input" value={values.theme||"light"} onChange={e=>setValues({...values, theme: e.target.value})}>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </div>
      <div>
        <label className="label">WhatsApp number (digits only, with country code)</label>
        <input className="input" value={values.whatsapp_number||""} onChange={e=>setValues({...values, whatsapp_number: e.target.value})} />
      </div>
      <button className="btn btn-primary">Save</button>
    </form>
  );
}
