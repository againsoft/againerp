"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { forecastByMonth, type SmwOpportunity } from "@/lib/mock-data/smw-opportunities";

type Props = {
  opportunities: SmwOpportunity[];
};

export function OpportunityForecastView({ opportunities }: Props) {
  const data = forecastByMonth(opportunities);

  return (
    <div className="rounded-lg border border-input bg-card p-4">
      <h2 className="text-sm font-semibold">Forecast by close month</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">Weighted pipeline (৳K) · AI trend overlay</p>
      <div className="mt-4 h-72 w-full min-h-[288px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={40} unit="K" />
            <Tooltip formatter={(v) => [`৳${Number(v ?? 0)}K`, ""]} />
            <Bar dataKey="weighted" name="Weighted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="weighted"
              name="AI trend"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((row) => (
          <li key={row.month} className="rounded-md border border-input px-3 py-2 text-xs">
            <span className="font-medium">{row.month}</span>
            <span className="ml-2 tabular-nums text-muted-foreground">
              ৳{row.weighted}K · {row.count} deals
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
