"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default function Storefront() {
  const [categories, setCategories] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  useEffect(() => {
    const query = supabase.from("products").select("*").eq("is_active", true);
    (async () => {
      let req = supabase.from("products").select("*").eq("is_active", true);
      if (active) req = req.eq("category_id", active);
      const { data } = await req;
      setProducts((data || []).filter(p => p.name.toLowerCase().includes(q.toLowerCase())));
    })();
  }, [active, q]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto">
        <button className={`btn btn-ghost ${!active ? "underline" : ""}`} onClick={() => setActive(null)}>All</button>
        {categories.map(c => (
          <button key={c.id} className={`btn btn-ghost ${active === c.id ? "underline" : ""}`} onClick={() => setActive(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      <input className="input" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
