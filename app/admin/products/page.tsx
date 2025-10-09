"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Edit2, Trash2, Save, X, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";

export default function ProductsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  }, [searchQuery, rows]);

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
      price_cents: product.price_cents, // Already stored as whole dollars
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
    <AdminLayout>
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Link>
        <h1 className="text-2xl font-bold">Manage Products</h1>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <input
              type="text"
              className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {filteredRows.length} of {rows.length} products
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Product Name *" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>
          <div className="sm:col-span-2">
            <input 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Description" 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">PRICE ($) - Enter whole dollars only</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Price (e.g., 1500 for $1,500)" 
              value={form.price_cents} 
              onChange={e => setForm({...form, price_cents: parseInt(e.target.value || '0')})} 
              step="1"
              min="0"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Enter whole dollars only (no cents). Example: 1500 for $1,500
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">STOCK QUANTITY</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Stock" 
              value={form.stock} 
              onChange={e => setForm({...form, stock: parseInt(e.target.value || '0')})} 
              min="0"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">CATEGORY</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={form.category_id} 
              onChange={e => setForm({...form, category_id: e.target.value})}
            >
              <option value="">Select category</option>
              {cats.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={form.is_active} 
                onChange={e => setForm({...form, is_active: e.target.checked})} 
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active (visible in store)</span>
            </label>
          </div>
        </div>
        
        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm({...form, image_url: url})}
          bucket="product-images"
          label="Product Image"
        />
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button 
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={save} 
            disabled={loading || !form.name}
          >
            {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button 
              className="w-full sm:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors duration-200" 
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredRows.length === 0 && searchQuery ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400">
            No products found matching "{searchQuery}"
          </div>
        ) : (
          filteredRows.map(r => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start sm:items-center gap-4 flex-1">
                {r.image_url && r.image_url !== '/placeholder.svg' && (
                  <img 
                    src={r.image_url} 
                    alt={r.name} 
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0" 
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{r.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    ${r.price_cents.toLocaleString()} · Stock: {r.stock}
                    {!r.is_active && <span className="ml-2 text-red-500">(Inactive)</span>}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {cats.find(c => c.id === r.category_id)?.name || "No category"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 justify-end sm:justify-start">
                <button 
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200" 
                  onClick={() => startEdit(r)}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md transition-colors duration-200 disabled:opacity-50" 
                  onClick={() => remove(r.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
      </div>
    </AdminLayout>
  );
}
