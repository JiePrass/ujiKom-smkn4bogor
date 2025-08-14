import Image from "next/image";
import { getEventById } from "@/lib/api/event";
import { notFound } from "next/navigation";

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
    const slugParts = params.slug.split("-");
    const id = Number(slugParts[slugParts.length - 1]); // Ambil ID dari slug

    if (isNaN(id)) return notFound();

    try {
        const event = await getEventById(id);

        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <p className="text-gray-600">{event.date}</p>
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${event.flyerUrl}`}
                    alt={event.title}
                    className="mt-4 w-full max-h-[500px] object-contain"
                    width={800}
                    height={500}
                />
                <p className="mt-4">{event.description}</p>
            </div>
        );
    } catch (error) {
        console.error("Error fetching event:", error);
        return notFound();
    }
}
