import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

interface EventType {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price: number;
    flyerUrl: string;
    participantCount: number;
    createdBy: {
        id: number;
        fullName: string;
        email: string;
    };
}

interface RegistrationModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    event: EventType | null;
    handleSubmit: () => Promise<void>;
    submitting: boolean;
    setPaymentProof: (file: File | null) => void;
}

export default function RegistrationModal({ isModalOpen, setIsModalOpen, event, handleSubmit, submitting, setPaymentProof }: RegistrationModalProps) {
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Formulir Pendaftaran</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>Apakah Anda yakin ingin mendaftar event ini?</p>

                    {event?.price && event.price > 0 && (
                        <div>
                            <label className="block mb-2 font-medium">Upload Bukti Pembayaran</label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Mendaftar..." : "Daftar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}