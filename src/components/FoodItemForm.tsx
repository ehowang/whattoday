"use client";

import { useState } from "react";

interface Props {
  onAdd: (name: string, imageUrl: string | null) => void;
}

export default function FoodItemForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        setPreview(data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit() {
    if (!name.trim()) return;
    const finalUrl = imageUrl.trim() || null;
    onAdd(name.trim(), finalUrl);
    setName("");
    setImageUrl("");
    setPreview(null);
  }

  return (
    <div className="space-y-3 bg-casino-darker rounded-lg p-3">
      <input
        type="text"
        placeholder="Food name"
        value={name}
        maxLength={100}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-casino-dark border border-casino-gold/30 rounded px-3 py-2
                   text-sm text-white placeholder-gray-500 focus:outline-none focus:border-casino-gold"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setImageMode("url")}
          className={`text-xs px-3 py-1 rounded ${
            imageMode === "url" ? "bg-casino-gold text-black" : "bg-casino-dark text-gray-400"
          }`}
        >
          URL
        </button>
        <button
          onClick={() => setImageMode("upload")}
          className={`text-xs px-3 py-1 rounded ${
            imageMode === "upload" ? "bg-casino-gold text-black" : "bg-casino-dark text-gray-400"
          }`}
        >
          Upload
        </button>
      </div>

      {imageMode === "url" ? (
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setPreview(e.target.value || null);
          }}
          className="w-full bg-casino-dark border border-casino-gold/30 rounded px-3 py-2
                     text-sm text-white placeholder-gray-500 focus:outline-none focus:border-casino-gold"
        />
      ) : (
        <label className="block">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            className="text-sm text-gray-400 file:mr-3 file:py-1 file:px-3
                       file:rounded file:border-0 file:text-xs
                       file:bg-casino-gold file:text-black file:cursor-pointer"
          />
          {uploading && <span className="text-xs text-casino-gold">Uploading...</span>}
        </label>
      )}

      {preview && (
        <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded" />
      )}

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="w-full bg-casino-green text-black font-bold text-sm py-2 rounded
                   hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        ADD FOOD
      </button>
    </div>
  );
}
