"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
    setRows(data||[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await supabase.from("categories").insert({ name, description, image_url });
    setName(""); setDescription(""); setImageUrl("");
    load();
  };

  const remove = async (id:string) => {
    if(!confirm("Delete category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="card p-4 grid gap-2 md:grid-cols-3">
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="flex gap-2">
          <input className="input" placeholder="Image URL" value={image_url} onChange={e=>setImageUrl(e.target.value)} />
          <button className="btn btn-primary" onClick={add}>Add</button>
        </div>
      </div>

      <ul className="space-y-2">
        {rows.map(r => (
          <li key={r.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{r.description}</div>
            </div>
            <button className="btn btn-danger" onClick={()=>remove(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
