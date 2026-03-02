"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface SignupDataPoint {
  date: string
  count: number
}

interface AdminChartSignupsProps {
  data: SignupDataPoint[]
}

const chartConfig = {
  count: {
    label: "Inscriptions",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function AdminChartSignups({ data }: AdminChartSignupsProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Inscriptions</CardTitle>
        <CardDescription>Nouveaux comptes créés — 30 derniers jours</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
              }
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} width={28} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" })
                  }
                />
              }
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillSignups)"
              stroke="var(--primary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
