"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageIcon,
  Play,
  Star,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductMedia } from "@/lib/mock-data/products";

type ProductMediaGalleryProps = {
  media: ProductMedia[];
  productName: string;
  className?: string;
  compact?: boolean;
};

export function ProductMediaGallery({
  media,
  productName,
  className,
  compact,
}: ProductMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const active = media[activeIndex];
  const hasMultiple = media.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [media]);

  const goTo = useCallback(
    (index: number) => {
      if (media.length === 0) return;
      setActiveIndex(((index % media.length) + media.length) % media.length);
    },
    [media.length],
  );

  const openLightbox = useCallback((index?: number) => {
    if (index !== undefined) setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, activeIndex, goTo]);

  useEffect(() => {
    if (!lightboxOpen || active?.type !== "video") return;
    const timer = window.setTimeout(() => {
      void videoRef.current?.play().catch(() => undefined);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [lightboxOpen, activeIndex, active?.type]);

  if (!active) return null;

  const imageCount = media.filter((m) => m.type === "image").length;
  const videoCount = media.filter((m) => m.type === "video").length;

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-muted-foreground">Product media</p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {imageCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <ImageIcon className="h-3 w-3" />
              {imageCount}
            </span>
          )}
          {videoCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <Video className="h-3 w-3" />
              {videoCount}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => openLightbox()}
        className={cn(
          "group relative w-full overflow-hidden rounded-lg border bg-muted text-left shadow-sm transition hover:shadow-md",
          compact ? "aspect-[4/3] max-h-44" : "aspect-square rounded-xl",
        )}
        aria-label="Open media viewer"
      >
        {active.type === "video" ? (
          <>
            <img
              src={active.poster ?? active.url}
              alt={active.title ?? productName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
              <span
                className={cn(
                  "flex items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg transition group-hover:scale-105",
                  compact ? "h-10 w-10" : "h-16 w-16",
                )}
              >
                <Play className={cn("fill-current", compact ? "ml-0.5 h-4 w-4" : "ml-1 h-7 w-7")} />
              </span>
            </div>
            {active.duration && (
              <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                {active.duration}
              </span>
            )}
          </>
        ) : (
          <img
            src={active.url}
            alt={active.title ?? productName}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        )}

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <Expand className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
        </span>

        {active.isPrimary && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            <Star className="h-3 w-3 fill-current" />
            Primary
          </span>
        )}

        {active.title && (
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 text-white",
              compact ? "pb-2 pt-6 text-xs font-medium" : "pb-3 pt-8 text-sm font-medium",
            )}
          >
            {active.title}
          </span>
        )}
      </button>

      {hasMultiple && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {media.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              onDoubleClick={() => openLightbox(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-md border-2 transition",
                compact ? "h-11 w-11" : "h-16 w-16 rounded-lg",
                i === activeIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={item.title ?? `Media ${i + 1}`}
              aria-current={i === activeIndex}
            >
              {item.type === "video" ? (
                <>
                  <img
                    src={item.poster ?? item.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </span>
                  {item.duration && (
                    <span className="absolute bottom-0.5 right-0.5 rounded bg-black/75 px-1 text-[9px] font-medium text-white">
                      {item.duration}
                    </span>
                  )}
                </>
              ) : (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              )}
              {item.isPrimary && (
                <Star className="absolute left-0.5 top-0.5 h-3 w-3 fill-amber-400 text-amber-400 drop-shadow" />
              )}
            </button>
          ))}
        </div>
      )}

      {!compact && (
        <p className="text-xs text-muted-foreground">
          Click to expand · double-click thumbnail for fullscreen · variant media updates instantly
        </p>
      )}

      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <Dialog.Title className="sr-only">
              {active.title ?? `${productName} media`}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Product media lightbox viewer
            </Dialog.Description>

            <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {active.title ?? productName}
                </p>
                <p className="text-xs text-white/60">
                  {activeIndex + 1} of {media.length}
                  {active.type === "video" ? " · Video" : " · Image"}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Close viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
              {hasMultiple && (
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <div className="flex max-h-full w-full max-w-5xl items-center justify-center">
                {active.type === "video" ? (
                  <video
                    key={active.id}
                    ref={videoRef}
                    src={active.url}
                    poster={active.poster}
                    controls
                    playsInline
                    className="max-h-[calc(100vh-12rem)] w-full rounded-xl bg-black shadow-2xl"
                  />
                ) : (
                  <img
                    src={active.url}
                    alt={active.title ?? productName}
                    className="max-h-[calc(100vh-12rem)] w-full rounded-xl object-contain shadow-2xl"
                  />
                )}
              </div>

              {hasMultiple && (
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
                  aria-label="Next media"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {hasMultiple && (
              <div className="shrink-0 border-t border-white/10 px-4 py-4 sm:px-6">
                <div className="mx-auto flex max-w-3xl justify-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {media.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-16 sm:w-16",
                        i === activeIndex
                          ? "border-white ring-2 ring-white/30"
                          : "border-transparent opacity-50 hover:opacity-80",
                      )}
                      aria-label={item.title ?? `Media ${i + 1}`}
                    >
                      {item.type === "video" ? (
                        <>
                          <img
                            src={item.poster ?? item.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="h-3.5 w-3.5 fill-white text-white" />
                          </span>
                        </>
                      ) : (
                        <img src={item.url} alt="" className="h-full w-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
