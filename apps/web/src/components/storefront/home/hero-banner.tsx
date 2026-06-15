"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/lib/mock-data/storefront-home";

type HeroBannerProps = {
  slides: HeroSlide[];
};

export function HeroBanner({ slides }: HeroBannerProps) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden rounded-xl bg-muted" aria-label="Featured promotions">
      <div className="relative aspect-[2/1] sm:aspect-[3/1]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent",
                s.theme === "light" && "from-black/50 via-black/25",
              )}
            />
          </div>
        ))}

        <div className="absolute inset-0 flex items-end p-4 sm:items-center sm:p-6">
          <div className="max-w-md text-white">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80 sm:text-xs">{slide.eyebrow}</p>
            <h1 className="mt-1.5 text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">{slide.title}</h1>
            <p className="mt-2 text-xs text-white/85 sm:text-sm">{slide.subtitle}</p>
            <Button asChild size="sm" className="mt-3 bg-white text-xs text-black hover:bg-white/90">
              <Link href={slide.href}>{slide.cta}</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-1 sm:bottom-6 sm:right-6">
          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 shadow" onClick={prev} aria-label="Previous slide">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 shadow" onClick={next} aria-label="Next slide">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
