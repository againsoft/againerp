"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import {
  createUploadedMediaItemsFromFiles,
  filterMediaLibraryItems,
  type MediaLibraryItem,
} from "@/lib/mock-data/media-library";
import { filterByMediaUsage, useMediaUsageMap, type MediaUsageFilter } from "@/lib/media/media-usage";
import { useMediaStore } from "@/lib/store/media-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MediaLibraryBrowser } from "@/components/media/media-library-browser";

export default function MediaPage() {
  const items = useMediaStore((state) => state.items);
  const prependItems = useMediaStore((state) => state.prependItems);
  const patchMediaItem = useMediaStore((state) => state.patchMediaItem);

  const [query, setQuery] = useState("");
  const [usageFilter, setUsageFilter] = useState<MediaUsageFilter>("all");
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const usageMap = useMediaUsageMap();

  const filtered = useMemo(() => {
    const searched = filterMediaLibraryItems(items, { query });
    return filterByMediaUsage(searched, usageMap, usageFilter);
  }, [items, query, usageMap, usageFilter]);

  const handleItemClick = (item: MediaLibraryItem) => {
    setFocusedId(item.id);
    setSelectedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
    );
  };

  const applyImportedItems = (imported: MediaLibraryItem[]) => {
    prependItems(imported);
    setActiveTab("library");
    if (imported[0]) {
      setFocusedId(imported[0].id);
      setSelectedIds([imported[0].id]);
    }
  };

  const handleUpload = (files: FileList) => {
    const { items, rejected } = createUploadedMediaItemsFromFiles(files);
    if (rejected.length) {
      toast.error(
        `${rejected.length} file${rejected.length === 1 ? "" : "s"} blocked — unsafe file type.`,
      );
    }
    if (items.length) applyImportedItems(items);
  };

  const handleImport = (imported: MediaLibraryItem[]) => {
    applyImportedItems(imported);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">Media</p>
          <h1 className="page-title">Media Library</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Browse all media, preview attachments, and edit title, file name, and alt text live.
          </p>
        </div>
        <Button size="sm" onClick={() => setActiveTab("upload")}>
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-input bg-background p-4">
        <MediaLibraryBrowser
          items={filtered}
          query={query}
          onQueryChange={setQuery}
          usageFilter={usageFilter}
          onUsageFilterChange={setUsageFilter}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedIds={selectedIds}
          focusedId={focusedId}
          onItemClick={handleItemClick}
          onItemUpdate={patchMediaItem}
          mode="multiple"
          onUpload={handleUpload}
          onImport={handleImport}
        />
      </div>
    </div>
  );
}
