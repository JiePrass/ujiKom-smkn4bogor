import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface SummaryTrend {
    percent: number
    up: boolean
}

interface SummaryCardProps {
    title: string
    value: number
    icon: LucideIcon
    trend?: SummaryTrend
}

export default function SummaryCard({ title, value, icon: Icon, trend }: SummaryCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Icon className="h-6 w-6" />
                    <CardTitle>{title}</CardTitle>
                </div>

                {trend && (
                    <Badge
                        variant="secondary"
                        className={`flex items-center space-x-1 ${trend.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                    >
                        {trend.up ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{trend.percent}%</span>
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}
