import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Standard page content wrapper — padding + offline data attributes */
export function EssMobilePage({ children, className }: Props) {
  return (
    <div className={className ?? "space-y-4 p-4"} data-ess-page>
      {children}
    </div>
  );
}
