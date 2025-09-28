"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name:"", description:"", price_cents:0, stock:0, image_url:"", category_id:"", is_active:true });

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: true });
    setRows(data||[]);
    const { data: c } = await supabase.from("categories").select("*");
    setCats(c||[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await supabase.from("products").insert(form);
    setForm({ name:"", description:"", price_cents:0, stock:0, image_url:"", category_id:"", is_active:true });
    load();
  };

  const remove = async (id:string) => {
    if(!confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="card p-4 grid gap-2 md:grid-cols-3">
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <input type="number" className="input" placeholder="Price cents" value={form.price_cents} onChange={e=>setForm({...form,price_cents:parseInt(e.target.value||'0')})} />
        <input type="number" className="input" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value||'0')})} />
        <select className="input" value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}>
          <option value="">Select category</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input className="input" placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
          <button className="btn btn-primary" onClick={add}>Add</button>
        </div>
      </div>

      <ul className="space-y-2">
        {rows.map(r => (
          <li key={r.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">${(r.price_cents/100).toFixed(2)}</div>
            </div>
            <button className="btn btn-danger" onClick={()=>remove(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
