"use client";
import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket: "product-images" | "brand-assets";
  label?: string;
}

export default function ImageUpload({ value, onChange, bucket, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Error uploading image: ' + uploadError.message);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      
      <div className="flex gap-2">
        <input
          type="url"
          className="input flex-1"
          placeholder="Image URL"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
        />
        
        <label className="btn btn-ghost relative cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <span className="ml-2">Upload</span>
        </label>
      </div>

      {preview && (
        <div className="relative h-32 w-32 overflow-hidden rounded-xl border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
            onClick={() => {
              setPreview("");
              onChange("");
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
