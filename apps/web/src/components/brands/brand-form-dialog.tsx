"use client";

import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { WordPressClassicEditor } from "@/components/products/wordpress-classic-editor";
import { MediaField } from "@/components/media/media-field";
import { SlugInput } from "@/components/ui/slug-input";
import type { Brand } from "@/lib/mock-data/brands";
import { validateSlug } from "@/lib/url-slug/validate-slug";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  brand?: Brand | null;
  onSave: (data: Partial<Brand>) => void;
  onLiveChange?: (data: Partial<Brand> & { id: string }) => void;
};

export function BrandFormDialog({
  open,
  onOpenChange,
  mode = "create",
  brand,
  onSave,
  onLiveChange,
}: Props) {
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [active, setActive] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [bannerUrl, setBannerUrl] = useState<string | undefined>();
  const [logoMediaId, setLogoMediaId] = useState<string | undefined>();
  const [bannerMediaId, setBannerMediaId] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setDescription(brand?.description ?? "");
      setSlug(brand?.slug ?? "");
      setActive(brand?.active ?? true);
      setLogoUrl(brand?.logoUrl);
      setBannerUrl(brand?.bannerUrl);
      setLogoMediaId(brand?.logoMediaId);
      setBannerMediaId(brand?.bannerMediaId);
    }
  }, [open, brand]);

  const pushLiveChange = useCallback(
    (next: { active?: boolean }) => {
      if (mode === "edit" && brand?.id && onLiveChange) {
        onLiveChange({
          id: brand.id,
          active: next.active ?? active,
        });
      }
    },
    [brand, active, mode, onLiveChange],
  );

  const handleActiveChange = (value: boolean) => {
    setActive(value);
    pushLiveChange({ active: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const slugValidation = validateSlug(slug, brand?.id ? { id: brand.id } : undefined);
    if (slug.trim() && !slugValidation.isValid) {
      toast.error(slugValidation.message ?? "Invalid slug");
      return;
    }
    const fd = new FormData(e.currentTarget);
    onSave({
      name: String(fd.get("name") ?? ""),
      slug,
      websiteUrl: String(fd.get("websiteUrl") ?? "") || undefined,
      active,
      description,
      metaTitle: String(fd.get("metaTitle") ?? ""),
      metaDescription: String(fd.get("metaDescription") ?? ""),
      metaKeywords: String(fd.get("metaKeywords") ?? ""),
      logoUrl,
      bannerUrl,
      logoMediaId,
      bannerMediaId,
    });
    toast.success(mode === "create" ? "Brand created (mock)" : "Brand updated (mock)");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] w-[min(640px,95vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-input bg-background shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b border-input px-5 py-4">
            <Dialog.Title className="text-base font-semibold">
              {mode === "create" ? "Add Brand" : "Edit Brand"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className="rounded-md p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  General
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name" required>
                    <Input
                      name="name"
                      required
                      defaultValue={brand?.name}
                      placeholder="UrbanWear"
                    />
                  </Field>
                  <Field label="Website">
                    <Input
                      name="websiteUrl"
                      type="url"
                      defaultValue={brand?.websiteUrl}
                      placeholder="https://brand.example.com"
                    />
                  </Field>
                  <Field label="Slug" hint="SEO URL" required className="sm:col-span-2">
                    <SlugInput
                      value={slug}
                      onChange={setSlug}
                      excludeId={brand?.id}
                      urlPrefix={<span className="shrink-0 text-muted-foreground">/</span>}
                      required
                      placeholder="urbanwear"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </h3>
                <WordPressClassicEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Brand page description…"
                  minRows={5}
                  aiContext="brand.description"
                  aiVariables={{ brand_name: brand?.name ?? "" }}
                />
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  SEO
                </h3>
                <div className="space-y-3">
                  <Field label="Meta title">
                    <Input name="metaTitle" defaultValue={brand?.metaTitle} placeholder="UrbanWear — Shop Online" />
                  </Field>
                  <Field label="Meta description">
                    <Textarea
                      name="metaDescription"
                      rows={2}
                      defaultValue={brand?.metaDescription}
                      placeholder="Shop UrbanWear products…"
                    />
                  </Field>
                  <Field label="Meta keywords">
                    <Input
                      name="metaKeywords"
                      defaultValue={brand?.metaKeywords}
                      placeholder="urbanwear, fashion"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Media
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Logo">
                    <MediaField
                      value={logoUrl}
                      mediaId={logoMediaId}
                      onChange={(item) => {
                        setLogoMediaId(item?.id);
                        setLogoUrl(item?.url);
                      }}
                      aspect="square"
                      emptyLabel="Add logo"
                      modalTitle="Select brand logo"
                    />
                  </Field>
                  <Field label="Banner">
                    <MediaField
                      value={bannerUrl}
                      mediaId={bannerMediaId}
                      onChange={(item) => {
                        setBannerMediaId(item?.id);
                        setBannerUrl(item?.url);
                      }}
                      aspect="banner"
                      emptyLabel="Add banner"
                      modalTitle="Select brand banner"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Settings
                </h3>
                <p className="mb-2 text-[11px] text-muted-foreground">
                  Changes apply live to the grid — no need to save first.
                </p>
                <Switch
                  checked={active}
                  onCheckedChange={handleActiveChange}
                  label="Status"
                  description="On = Active (brand live) · Off = Inactive (hidden from storefront)"
                />
              </section>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-input px-5 py-3">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {mode === "create" ? "Create brand" : "Save changes"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
        {hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
