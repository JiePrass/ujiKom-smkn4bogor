"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface Registration {
    id: number;
    user: { fullName: string; email: string };
}

interface UnmatchedFile {
    filename: string;
    previewUrl: string;
}

interface Props {
    unmatchedFiles: UnmatchedFile[];
    registrations: Registration[];
    mappings: Record<string, number>;
    setMappings: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    onSave: () => void;
}

export default function UnmatchedTable({
    unmatchedFiles,
    registrations,
    mappings,
    setMappings,
    onSave,
}: Props) {
    const selectedUserIds = new Set(Object.values(mappings));

    if (unmatchedFiles.length === 0) return null;

    return (
        <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Unmatched Files</h3>
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Preview</th>
                            <th className="p-2 text-left">Filename</th>
                            <th className="p-2 text-left">Map ke Peserta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unmatchedFiles.map((f) => (
                            <tr key={f.filename} className="border-b">
                                <td className="p-2">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${f.previewUrl}`}
                                        alt={f.filename}
                                        width={120}
                                        height={80}
                                        className="rounded border"
                                    />
                                </td>
                                <td className="p-2">{f.filename}</td>
                                <td className="p-2">
                                    <Select
                                        value={mappings[f.filename]?.toString() || ""}
                                        onValueChange={(val) =>
                                            setMappings((prev) => ({
                                                ...prev,
                                                [f.filename]: Number(val),
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="w-[250px]">
                                            <SelectValue placeholder="Pilih Peserta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {registrations
                                                .filter(
                                                    (reg) =>
                                                        !selectedUserIds.has(reg.id) ||
                                                        mappings[f.filename] === reg.id
                                                )
                                                .map((reg) => (
                                                    <SelectItem key={reg.id} value={reg.id.toString()}>
                                                        {reg.user.fullName} ({reg.user.email})
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Button
                onClick={onSave}
                className="mt-3"
                disabled={
                    unmatchedFiles.length === 0 || unmatchedFiles.some((f) => !mappings[f.filename])
                }
            >
                Simpan Mapping
            </Button>
        </div>
    );
}
