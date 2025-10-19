import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, XCircle } from "lucide-react";

interface ReportsTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reports: any[];
    onDelete: (commentId: number) => void;
    onReject: (reportId: number) => void;
}

export default function ReportsCommentTable({ reports, onDelete, onReject }: ReportsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User yang Direport</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead>Komentar</TableHead>
                    <TableHead>Tanggal Report</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports.map((report) => (
                    <TableRow key={report.id}>
                        <TableCell>{report.comment?.user?.fullName || "Unknown"}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell className="max-w-xs whitespace-pre-wrap break-words">
                            {report.comment?.content || "-"}
                        </TableCell>
                        <TableCell>
                            {new Date(report.createdAt).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => onDelete(report.commentId)}
                                title="Hapus Komentar"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => onReject(report.id)}
                                title="Tolak Report"
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
