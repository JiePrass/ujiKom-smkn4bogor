/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import {
    getDataSummary,
    getDataEventsperMonth,
    getDataAttendeesperMonth,
    getDataTopEvents,
} from "@/lib/api/dashboard";

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Calendar,
    CheckCircle,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import SummaryCard from "@/components/shared/cards/sumCard";
import EventCard from "@/components/shared/cards/eventCard";

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

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];                    

    const calcTrend = (data: any[], key: string) => {
        if (!data || data.length < 2) return { percent: 0, up: true };
        const last = data[data.length - 1][key];
        const prev = data[data.length - 2][key];
        if (!prev) return { percent: 0, up: true };
        const diff = ((last - prev) / prev) * 100;
        return { percent: Math.round(diff), up: diff >= 0 };
    };

    const eventTrend = calcTrend(eventsPerMonth, "events");
    const attendeeTrend = calcTrend(attendeesPerMonth, "attendees");

    const sumItems = [
        {
            title: "Total Event",
            value: summary?.totalEvents || 0,
            icon: Calendar,
            trend: eventTrend,
        },
        {
            title: "Total Registrasi",
            value: summary?.totalRegistrations || 0,
            icon: Users,
            trend: { percent: 0, up: true }, // sementara statis
        },
        {
            title: "Total Kehardiran",
            value: summary?.totalAttendees || 0,
            icon: CheckCircle,
            trend: attendeeTrend,
        },
    ];

    const chartConfig = {
        month: {
            label: "Month",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig;

    if (loading) {
        return <p className="text-muted-foreground">Memuat data dashboard...</p>;
    }

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Kolom kiri */}
            <div className="col-span-8 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sumItems.map((item, idx) => (
                        <SummaryCard
                            key={idx}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                            trend={item.trend}
                        />
                    ))}
                </div>

                {/* Chart: Events per Month */}
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Jumlah Event per Bulan</CardTitle>
                            <CardDescription>Tahun {new Date().getFullYear()}</CardDescription>
                        </div>
                        <div className="flex items-center text-sm">
                            {eventTrend.up ? (
                                <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                            ) : (
                                <TrendingDown className="text-red-500 mr-1 h-4 w-4" />
                            )}
                            {eventTrend.percent}%
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart data={eventsPerMonth.slice(-8)}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => monthNames[value - 1]}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => String(Math.round(v))}
                                    width={10}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="events" fill="#2563eb" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Kolom kanan */}
            <div className="col-span-4 space-y-6">
                {/* Nearest Event */}
                {summary?.nearestEvent && (
                    <div>
                        <EventCard
                            event={summary.nearestEvent}
                            isAdmin={true}
                            onEventUpdated={fetchData}
                        />
                    </div>
                )}

                {/* Chart: Attendees per Month */}
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Jumlah Peserta Hadir per Bulan</CardTitle>
                        <div className="flex items-center text-sm">
                            {attendeeTrend.up ? (
                                <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
                            ) : (
                                <TrendingDown className="text-red-500 mr-1 h-4 w-4" />
                            )}
                            {attendeeTrend.percent}%
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart data={attendeesPerMonth.slice(-6)} layout="vertical">
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    type="number"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => String(Math.round(v))}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => monthNames[value - 1]}
                                    width={24}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="attendees" fill="#16a34a" radius={6} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Chart: Top Events */}
            <Card className="col-span-12">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>10 Event dengan Peserta Terbanyak</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart data={topEvents}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                type="category"
                                dataKey="title"
                                tick={{ fontSize: 12 }}
                                interval={0}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="number"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => String(Math.round(v))}
                                width={10}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="participants" fill="#dc2626" radius={6} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
