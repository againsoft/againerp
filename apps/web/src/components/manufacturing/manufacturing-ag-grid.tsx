"use client";

import { AgGridReact } from "ag-grid-react";
import type { AgGridReactProps } from "ag-grid-react";
import { cn } from "@/lib/utils";
import { useIsDark } from "@/lib/use-is-dark";

type Props<TData = unknown> = AgGridReactProps<TData> & {
  wrapperClassName?: string;
};

/** Fixed-height AG Grid shell — avoids 0px flex height (empty-looking tables). */
export function ManufacturingAgGrid<TData = unknown>({
  wrapperClassName,
  className,
  theme = "legacy",
  headerHeight = 36,
  rowHeight = 44,
  animateRows = true,
  defaultColDef,
  ...props
}: Props<TData>) {
  const isDark = useIsDark();

  return (
    <div
      className={cn(
        "ag-theme-quartz control-border h-[min(520px,62vh)] min-h-[400px] w-full overflow-hidden rounded-md bg-card [&_.ag-root-wrapper]:h-full",
        isDark && "ag-theme-quartz-dark",
        wrapperClassName,
        className,
      )}
    >
      <AgGridReact
        theme={theme}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        animateRows={animateRows}
        defaultColDef={{ sortable: true, resizable: true, minWidth: 72, ...defaultColDef }}
        {...props}
      />
    </div>
  );
}
