"use client";

import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Props = {
  title: string;
  subtitle?: string;
  createHref?: string;
  createLabel?: string;
  onCreate?: () => void;
  showImportExport?: boolean;
};

export function CrmPageHeader({
  title,
  subtitle,
  createHref,
  createLabel = "Create",
  onCreate,
  showImportExport = true,
}: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[11px] text-muted-foreground">CRM</p>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {showImportExport ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-9"
              onClick={() => toast.info("Import wizard — prototype")}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Import
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="min-h-9">
                  <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.success("Export CSV — prototype")}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Export Excel — prototype")}>Excel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
        {onCreate ? (
          <Button type="button" size="sm" className="min-h-9" onClick={onCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {createLabel}
          </Button>
        ) : createHref ? (
          <Button asChild size="sm" className="min-h-9">
            <Link href={createHref}>
              <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              {createLabel}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
