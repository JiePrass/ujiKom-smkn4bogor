"use client";

import Image from "next/image";
import { Gallery, GalleryComment, User } from "@/types/model";
import { Heart, Send, ChevronLeft, ChevronRight, Flag, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toggleLikeGallery, addGalleryComment, reportGalleryComment } from "@/lib/api/gallery";

interface Props {
    gallery: Gallery;
    currentUser: User | null; // bisa null jika belum login
    onClose: () => void;
    onGalleryUpdate?: (updated: Gallery) => void;
}

const REPORT_REASONS = [
    "Spam",
    "Ujaran Kebencian",
    "Informasi Palsu",
    "Mengandung Konten Seksual",
    "Mengandung Kekerasan",
    "Lainnya"
];

export default function GalleryModal({ gallery, currentUser, onClose, onGalleryUpdate }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [comments, setComments] = useState<GalleryComment[]>(gallery.comments || []);
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [showReplies, setShowReplies] = useState<Record<number, boolean>>({});
    const [reportingComment, setReportingComment] = useState<GalleryComment | null>(null);
    const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0]);
    const [liked, setLiked] = useState(currentUser ? gallery.likes?.some((l) => l.userId === currentUser.id) : false);
    const [likesCount, setLikesCount] = useState(gallery.likes?.length || 0);

    const media = gallery.media || [];
    const modalRef = useRef<HTMLDivElement>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % media.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

    // Close modal on outside click
    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node) &&
                (!reportRef.current || !reportRef.current.contains(e.target as Node))
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Add comment or reply
    const handleAddComment = async () => {
        if (!currentUser) return alert("Silakan login untuk menambahkan komentar.");
        if (!commentText.trim()) return;

        const tempId = Date.now();
        const tempComment: GalleryComment = {
            id: tempId,
            galleryId: gallery.id,
            userId: currentUser.id,
            content: commentText,
            parentId: replyTo || null,
            user: currentUser,
            replies: [],
            createdAt: new Date().toISOString(),
        };

        // Optimistic UI
        if (!replyTo) {
            setComments((prev) => [...prev, tempComment]);
        } else {
            setComments((prev) =>
                prev.map((c) =>
                    c.id === replyTo ? { ...c, replies: [...(c.replies || []), tempComment] } : c
                )
            );
        }

        setCommentText("");
        setReplyTo(null);

        try {
            const newComment = await addGalleryComment(gallery.id, {
                content: tempComment.content,
                parentId: tempComment.parentId || undefined,
            });

            setComments((prev) =>
                prev.map((c) =>
                    c.id === tempId
                        ? { ...c, id: newComment.id }
                        : {
                            ...c,
                            replies: c.replies?.map((r) => (r.id === tempId ? { ...r, id: newComment.id } : r)),
                        }
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    // Toggle gallery like
    const handleToggleLike = async () => {
        if (!currentUser) return alert("Silakan login untuk like gallery.");
        try {
            const res = await toggleLikeGallery(gallery.id);
            setLiked(res.liked);
            setLikesCount((prev) => prev + (res.liked ? 1 : -1));

            const updatedLikes = res.liked
                ? [...(gallery.likes || []), { userId: currentUser.id, createdAt: new Date().toISOString(), id: Date.now(), galleryId: gallery.id, user: currentUser }]
                : (gallery.likes || []).filter((l) => l.userId !== currentUser.id);

            onGalleryUpdate?.({ ...gallery, likes: updatedLikes, comments });
        } catch (err) {
            console.error(err);
        }
    };

    // Report comment
    const handleReportClick = (comment: GalleryComment) => {
        if (!currentUser) return alert("Silakan login untuk melaporkan komentar.");
        setReportingComment(comment);
        setReportReason(REPORT_REASONS[0]);
    };

    const handleSubmitReport = async () => {
        if (!reportingComment) return;
        try {
            await reportGalleryComment(reportingComment.id, reportReason);
            alert("Komentar berhasil dilaporkan");
            setReportingComment(null);
        } catch (err) {
            console.error(err);
        }
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals: [number, string][] = [
            [60, "detik"],
            [3600, "menit"],
            [86400, "jam"],
            [604800, "hari"],
            [2419200, "minggu"],
            [29030400, "bulan"]
        ];

        for (let i = intervals.length - 1; i >= 0; i--) {
            if (seconds >= intervals[i][0]) {
                const value = Math.floor(seconds / intervals[i][0]);
                return `${value} ${intervals[i][1]}${value > 1 ? "" : ""} lalu`;
            }
        }
        return "Baru saja";
    };

    console.log("Rendering GalleryModal with gallery:", gallery);

    if (!gallery) return null;

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div ref={modalRef} className="relative w-full m-4 md:m-20 h-[90vh] flex flex-col md:flex-row max-h-screen bg-white" onMouseDown={(e) => e.stopPropagation()}>
                    {/* IMAGE SLIDER */}
                    <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            {media.length > 0 && (
                                <motion.div
                                    key={media[currentIndex]?.id ?? currentIndex}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Image
                                        src={`${media[currentIndex]?.mediaUrl ?? ""}`}
                                        alt={gallery.caption || "Gallery media"}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {media.length > 1 && (
                            <>
                                <button onClick={handlePrev} className="absolute left-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={handleNext} className="absolute right-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition">
                                    <ChevronRight size={24} />
                                </button>
                                <div className="absolute bottom-3 flex gap-1 justify-center w-full">
                                    {media.map((_, i) => (
                                        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === currentIndex ? "bg-white" : "bg-white/40"}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* DETAILS */}
                    <div className="w-full md:w-[380px] flex flex-col border-l max-h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={gallery.user?.profilePicture ? `${gallery.user.profilePicture}` : "/images/default-profile.svg"}
                                    alt={gallery.user?.fullName || "User"}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{gallery.user?.fullName || "User"}</span>
                                    <span className="text-xs text-gray-500">User</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {gallery.caption && (
                                <div className="flex gap-2">
                                    <Image
                                        src={gallery.user?.profilePicture ? `${gallery.user.profilePicture}` : "/images/default-profile.svg"}
                                        alt={gallery.user?.fullName || "User"}
                                        width={32}
                                        height={32}
                                        className="rounded-full aspect-square object-contain"
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-sm">
                                            <span className="font-semibold">{gallery.user?.fullName || "User"} </span>
                                            {gallery.caption}
                                        </div>
                                        <span className="text-xs text-gray-500">{timeAgo(gallery.createdAt)}</span>
                                    </div>
                                </div>
                            )}

                            {comments.length ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="text-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-start w-full">
                                            <div className="flex gap-2 items-start">
                                                <Image
                                                    src={comment.user?.profilePicture
                                                        ? `${comment.user.profilePicture}`
                                                        : "/images/default-profile.svg"}
                                                    alt={comment.user?.fullName || "User"}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full aspect-square object-contain"
                                                />
                                                <div className="flex-1">
                                                    <span className="font-semibold mr-2">{comment.user?.fullName || "User"}</span>
                                                    {comment.content}
                                                    <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                                        <span>{timeAgo(comment.createdAt)}</span>
                                                        {comment.replies?.length ? (
                                                            <button
                                                                onClick={() =>
                                                                    setShowReplies((prev) => ({
                                                                        ...prev,
                                                                        [comment.id]: !prev[comment.id],
                                                                    }))
                                                                }
                                                            >
                                                                {showReplies[comment.id] ? "Hide Replies" : `View Replies (${comment.replies.length})`}
                                                            </button>
                                                        ) : null}
                                                        {currentUser && <button onClick={() => setReplyTo(comment.id)}>Reply</button>}
                                                        {currentUser && (
                                                            <Flag
                                                                className="cursor-pointer text-gray-400 hover:text-red-500"
                                                                size={16}
                                                                onClick={() => handleReportClick(comment)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {showReplies[comment.id] &&
                                            comment.replies?.map((reply) => (
                                                <div className="flex gap-2 ml-4 pl-2 text-sm items-start border-l border-gray-200" key={reply.id}>
                                                    <Image
                                                        src={reply.user?.profilePicture
                                                            ? `${reply.user.profilePicture}`
                                                            : "/images/default-profile.svg"}
                                                        alt={reply.user?.fullName || "User"}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full aspect-square object-contain"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="font-semibold mr-2">{reply.user?.fullName || "User"}</span>
                                                        {reply.content}
                                                        <div className="flex gap-2">
                                                            <span className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</span>
                                                            {currentUser && (
                                                                <Flag
                                                                    className="cursor-pointer text-gray-400 hover:text-red-500"
                                                                    size={16}
                                                                    onClick={() => handleReportClick(comment)}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 italic">Belum ada komentar.</p>
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className="border-t px-4 py-3 flex items-center gap-4 text-gray-700">
                            <div className="flex gap-2 items-center">
                                <Heart
                                    className={`cursor-pointer transition-colors ${liked ? "text-red-500 fill-red-500" : ""} ${!currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={handleToggleLike}
                                />
                                <div className="">{likesCount} likes{likesCount !== 1 ? "s" : ""}</div>
                            </div>
                            <Send className={`cursor-pointer hover:text-gray-900 transition-colors ml-auto ${!currentUser ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handleAddComment} />
                        </div>

                        {/* Comment Input */}
                        {currentUser && (
                            <div className="border-t px-4 py-3 flex gap-2">
                                {replyTo && <span className="text-xs text-gray-500">Replying...</span>}
                                <input
                                    type="text"
                                    placeholder="Tambahkan komentar..."
                                    className="w-full text-sm focus:outline-none"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                />
                                <button className="text-blue-500 font-semibold" onClick={handleAddComment}>Kirim</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {reportingComment && (
                <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-md w-[320px] p-4 flex flex-col gap-4" onMouseDown={() => setReportingComment(null)}>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Laporkan Komentar</span>
                            <X className="cursor-pointer" onClick={() => setReportingComment(null)} />
                        </div>
                        <select
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="border px-2 py-1 rounded-md w-full"
                        >
                            {REPORT_REASONS.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button className="px-3 py-1 text-gray-500" onClick={() => setReportingComment(null)}>
                                Cancel
                            </button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={handleSubmitReport}>
                                Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
