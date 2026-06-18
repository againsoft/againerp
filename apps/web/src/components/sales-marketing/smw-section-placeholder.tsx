import type { ReactNode } from "react";

export function SmwSectionPlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex min-h-[240px] flex-col rounded-lg border border-dashed border-input bg-muted/20 p-6"
    >
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="mt-1 max-w-xl text-xs text-muted-foreground">{description}</p>
      {children ? <div className="mt-4 flex-1">{children}</div> : null}
    </div>
  );
}
