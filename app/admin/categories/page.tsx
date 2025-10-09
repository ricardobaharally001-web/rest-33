"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Edit2, Trash2, Save, X, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";

export default function CategoriesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error loading categories:", error);
      } else {
        setRows(data || []);
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => { load(); }, []);

  // Filter categories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  }, [searchQuery, rows]);

  const add = async () => {
    if (!name) {
      alert("Please enter a category name");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.from("categories").insert({ 
        name, 
        description: description || null, 
        image_url: image_url || null
      });
      
      if (error) {
        console.error("Insert error:", error);
        alert("Error adding category: " + error.message);
      } else {
        setName(""); 
        setDescription(""); 
        setImageUrl("");
        await load();
      }
    } catch (err) {
      console.error("Add error:", err);
      alert("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (row: any) => {
    setEditingId(row.id);
    setEditForm({
      name: row.name,
      description: row.description || "",
      image_url: row.image_url || ""
    });
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: editForm.name,
          description: editForm.description || null,
          image_url: editForm.image_url || null
        })
        .eq("id", editingId);
      
      if (error) {
        console.error("Update error:", error);
        alert("Error updating category: " + error.message);
      } else {
        setEditingId(null);
        await load();
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category? Products in this category will have no category.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) {
        console.error("Delete error:", error);
        alert("Error deleting category: " + error.message);
      } else {
        await load();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting category");
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
        <h1 className="text-2xl font-bold">Manage Categories</h1>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <input
              type="text"
              className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {filteredRows.length} of {rows.length} categories
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Category</h2>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Category Name *" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <div className="sm:col-span-2">
            <input 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
        </div>
        <ImageUpload
          value={image_url}
          onChange={setImageUrl}
          bucket="brand-assets"
          label="Category Image"
        />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button 
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={add} 
            disabled={loading || !name}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRows.length === 0 && searchQuery ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400">
            No categories found matching "{searchQuery}"
          </div>
        ) : (
          filteredRows.map(r => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            {editingId === r.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <input
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Category Name"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description"
                      value={editForm.description || ""}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                    />
                  </div>
                </div>
                <ImageUpload
                  value={editForm.image_url || ""}
                  onChange={(url) => setEditForm({...editForm, image_url: url})}
                  bucket="brand-assets"
                  label="Category Image"
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button 
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                    onClick={saveEdit}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button 
                    className="w-full sm:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2" 
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {r.image_url && r.image_url !== '/placeholder.svg' && (
                    <img src={r.image_url} alt={r.name} className="h-12 w-12 rounded object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">{r.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">{r.description}</div>
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
            )}
          </div>
          ))
        )}
      </div>
      </div>
    </AdminLayout>
  );
}
