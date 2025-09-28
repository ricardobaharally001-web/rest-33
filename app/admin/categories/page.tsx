"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Edit2, Trash2, Save, X } from "lucide-react";

export default function CategoriesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
      if (error) {
        console.error("Error loading categories:", error);
        alert("Error loading categories: " + error.message);
      } else {
        setRows(data || []);
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name) {
      alert("Please enter a category name");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.from("categories").insert({ 
        name, 
        description, 
        image_url 
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
      description: row.description,
      image_url: row.image_url
    });
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .update(editForm)
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      
      {/* Add new category form */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">Add New Category</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input 
            className="input" 
            placeholder="Category Name *" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            className="input" 
            placeholder="Description" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
        </div>
        <ImageUpload
          value={image_url}
          onChange={setImageUrl}
          bucket="brand-assets"
          label="Category Image"
        />
        <button 
          className="btn btn-primary" 
          onClick={add} 
          disabled={loading || !name}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </div>

      {/* Categories list */}
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.id} className="card p-4">
            {editingId === r.id ? (
              // Edit mode
              <div className="space-y-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    className="input"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                  <input
                    className="input"
                    value={editForm.description || ""}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>
                <ImageUpload
                  value={editForm.image_url || ""}
                  onChange={(url) => setEditForm({...editForm, image_url: url})}
                  bucket="brand-assets"
                  label="Category Image"
                />
                <div className="flex gap-2">
                  <button 
                    className="btn btn-primary flex items-center gap-2" 
                    onClick={saveEdit}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button 
                    className="btn btn-ghost flex items-center gap-2" 
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {r.image_url && (
                    <img src={r.image_url} alt={r.name} className="h-12 w-12 rounded object-cover" />
                  )}
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{r.description}</div>
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
