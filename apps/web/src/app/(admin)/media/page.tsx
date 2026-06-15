"use client";

import { useState } from "react";
import { Folder, Image as ImageIcon, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockMedia = Array.from({ length: 24 }, (_, i) => ({
  id: `media_${i}`,
  name: `asset-${i + 1}.jpg`,
  folder: i % 3 === 0 ? "Products" : i % 3 === 1 ? "Banners" : "Blog",
  url: `https://picsum.photos/seed/media${i}/300/300`,
  type: i % 5 === 0 ? "video" : "image",
}));

export default function MediaPage() {
  const [query, setQuery] = useState("");
  const filtered = mockMedia.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">Media</p>
          <h1 className="page-title">Media Library</h1>
        </div>
        <Button size="sm"><Upload className="h-4 w-4" /> Bulk Upload</Button>
      </div>
      <div className="flex gap-4">
        <aside className="hidden w-48 shrink-0 rounded-lg border p-3 md:block">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Folders</p>
          {["All", "Products", "Banners", "Blog"].map((f) => (
            <button
              key={f}
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Folder className="h-4 w-4" /> {f}
            </button>
          ))}
        </aside>
        <div className="min-w-0 flex-1">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search media…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                className="group overflow-hidden rounded-lg border text-left hover:ring-2 hover:ring-primary"
              >
                <div className="relative aspect-square bg-muted">
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                  {m.type === "video" && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[10px] text-white">
                      VIDEO
                    </span>
                  )}
                </div>
                <p className="truncate p-2 text-xs">{m.name}</p>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            WordPress-style library · reusable media picker popup (prototype)
          </p>
        </div>
      </div>
    </div>
  );
}
