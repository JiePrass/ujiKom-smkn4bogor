/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import {
    getDataSummary,
    getDataEventsperMonth,
    getDataAttendeesperMonth,
    getDataTopEvents,
} from "@/lib/api/dashboard";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";  

export default function AdminDashboardPage() {
    const [summary, setSummary] = useState<any>(null);
    const [eventsPerMonth, setEventsPerMonth] = useState<any[]>([]);
    const [attendeesPerMonth, setAttendeesPerMonth] = useState<any[]>([]);
    const [topEvents, setTopEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [s, e, a, t] = await Promise.all([
                getDataSummary(),
                getDataEventsperMonth(),
                getDataAttendeesperMonth(),
                getDataTopEvents(),
            ]);

            setSummary(s);
            setEventsPerMonth(e);
            setAttendeesPerMonth(a);
            setTopEvents(t);
        } catch (error) {
            console.error("Gagal mengambil data dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chartConfig = {
        month: {
            label: "Month",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    console.log("Events per Month:", eventsPerMonth);

    if (loading) {
        return <p className="text-muted-foreground">Memuat data dashboard...</p>;
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary?.totalEvents || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Registrasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary?.totalRegistrations || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Hadir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary?.totalAttendees || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Event Terdekat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {summary?.nearestEvent ? (
                            <div>
                                <p className="font-semibold">{summary.nearestEvent.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(summary.nearestEvent.date).toLocaleDateString("id-ID")}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">Tidak ada event mendatang</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bar Chart</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={eventsPerMonth}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => monthNames[value - 1]}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="events" fill="var(--color-desktop)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 leading-none font-medium">
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground leading-none">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>

            {/* Chart: Events per Month */}
            <Card>
                <CardHeader>
                    <CardTitle>Jumlah Event per Bulan</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={eventsPerMonth}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="events" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart: Attendees per Month */}
            <Card>
                <CardHeader>
                    <CardTitle>Jumlah Peserta Hadir per Bulan</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendeesPerMonth}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="attendees" fill="#16a34a" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart: Top Events */}
            <Card>
                <CardHeader>
                    <CardTitle>10 Event dengan Peserta Terbanyak</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topEvents} layout="vertical">
                            <XAxis type="number" />
                            <YAxis dataKey="title" type="category" width={150} />
                            <Tooltip />
                            <Bar dataKey="participants" fill="#dc2626" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
