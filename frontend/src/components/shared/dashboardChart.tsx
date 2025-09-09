"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactElement } from "react";

interface DashboardChartProps {
    title: string;
    description?: string;
    config: ChartConfig;
    children: ReactElement;
    trend?: { percent: number; up: boolean };
}

export default function DashboardChart({
    title,
    description,
    config,
    children,
    trend,
}: DashboardChartProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    {trend && (
                        <div
                            className={`flex items-center gap-1 text-sm font-medium ${trend.up ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {trend.up ? (
                                <TrendingUp className="h-4 w-4" />
                            ) : (
                                <TrendingDown className="h-4 w-4" />
                            )}
                            {trend.percent}%
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config}>{children}</ChartContainer>
            </CardContent>
        </Card>
    );
}
