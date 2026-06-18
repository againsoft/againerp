"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SMW_SETTINGS_SECTIONS, type SmwSettingsSection } from "@/lib/mock-data/smw-settings";
import { cn } from "@/lib/utils";

type Props = { active: SmwSettingsSection };

export function SmwSettingsNav({ active }: Props) {
  const searchParams = useSearchParams();

  const href = (section: SmwSettingsSection) => {
    const params = new URLSearchParams(searchParams.toString());
    if (section === "general") params.delete("section");
    else params.set("section", section);
    const q = params.toString();
    return q ? `/sales-marketing/settings?${q}` : "/sales-marketing/settings";
  };

  return (
    <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto border-b border-input pb-0">
      {SMW_SETTINGS_SECTIONS.map((s) => (
        <Link
          key={s.id}
          href={href(s.id)}
          className={cn(
            "shrink-0 border-b-2 px-3 py-2 text-xs font-medium transition-colors",
            active === s.id
              ? "border-violet-600 text-violet-700 dark:text-violet-300"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {s.label}
        </Link>
      ))}
    </nav>
  );
}
