"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Edit2, Trash2, Save, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ 
    name: "", 
    description: "", 
    price_cents: 0, 
    stock: 0, 
    image_url: "", 
    category_id: "", 
    is_active: true 
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      
      const { data: categories, error: catsError } = await supabase
        .from("categories")
        .select("*");
      
      if (productsError) {
        console.error("Products error:", productsError);
      }
      if (catsError) {
        console.error("Categories error:", catsError);
      }
      
      setRows(products || []);
      setCats(categories || []);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name || form.price_cents < 0) {
      alert("Please enter product name and valid price");
      return;
    }
    
    setLoading(true);
    try {
      const dataToSave = {
        name: form.name,
        description: form.description || null,
        price_cents: form.price_cents,
        stock: form.stock,
        image_url: form.image_url || null,
        category_id: form.category_id || null,
        is_active: form.is_active
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(dataToSave)
          .eq("id", editingId);
        
        if (error) {
          console.error("Update error:", error);
          alert("Error updating product: " + error.message);
        } else {
          setEditingId(null);
        }
      } else {
        const { error } = await supabase
          .from("products")
          .insert(dataToSave);
        
        if (error) {
          console.error("Insert error:", error);
          alert("Error adding product: " + error.message);
        }
      }
      
      setForm({ 
        name: "", 
        description: "", 
        price_cents: 0, 
        stock: 0, 
        image_url: "", 
        category_id: "", 
        is_active: true 
      });
      await load();
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price_cents: product.price_cents,
      stock: product.stock,
      image_url: product.image_url || "",
      category_id: product.category_id || "",
      is_active: product.is_active
    });
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ 
      name: "", 
      description: "", 
      price_cents: 0, 
      stock: 0, 
      image_url: "", 
      category_id: "", 
      is_active: true 
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Delete error:", error);
        alert("Error deleting product: " + error.message);
      } else {
        await load();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Link>
        <h1 className="text-2xl font-bold">Manage Products</h1>
      </div>
      
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <input 
            className="input" 
            placeholder="Product Name *" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
          <input 
            className="input" 
            placeholder="Description" 
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
          />
          <div>
            <label className="label text-xs mb-1">Price ($)</label>
            <input 
              type="number" 
              className="input" 
              placeholder="Price" 
              value={(form.price_cents / 100).toFixed(2)} 
              onChange={e => setForm({...form, price_cents: Math.round(parseFloat(e.target.value || '0') * 100)})} 
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="label text-xs mb-1">Stock Quantity</label>
            <input 
              type="number" 
              className="input" 
              placeholder="Stock" 
              value={form.stock} 
              onChange={e => setForm({...form, stock: parseInt(e.target.value || '0')})} 
              min="0"
            />
          </div>
          <select 
            className="input" 
            value={form.category_id} 
            onChange={e => setForm({...form, category_id: e.target.value})}
          >
            <option value="">Select category</option>
            {cats.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.is_active} 
              onChange={e => setForm({...form, is_active: e.target.checked})} 
            />
            <span>Active (visible in store)</span>
          </label>
        </div>
        
        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm({...form, image_url: url})}
          bucket="product-images"
          label="Product Image"
        />
        
        <div className="flex gap-2">
          <button 
            className="btn btn-primary" 
            onClick={save} 
            disabled={loading || !form.name}
          >
            {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button 
              className="btn btn-ghost" 
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {rows.map(r => (
          <div key={r.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {r.image_url && r.image_url !== '/placeholder.svg' && (
                <img 
                  src={r.image_url} 
                  alt={r.name} 
                  className="h-16 w-16 rounded object-cover" 
                />
              )}
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  ${(r.price_cents / 100).toFixed(2)} · Stock: {r.stock}
                  {!r.is_active && <span className="ml-2 text-red-500">(Inactive)</span>}
                </div>
                <div className="text-xs text-slate-500">
                  {cats.find(c => c.id === r.category_id)?.name || "No category"}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-ghost" 
                onClick={() => startEdit(r)}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => remove(r.id)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
