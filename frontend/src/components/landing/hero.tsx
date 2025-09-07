import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export function HeroSection() {
    return (
        <section className="relative mt-15">
            {/* Background */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Image
                    src="/images/hero-bg.png"
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-28 pb-12">
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg max-w-3xl">
                    Lorem ipsum dolor sit amet consectetur. Euismod.
                </h1>
                <p className="mt-4 text-sm md:text-base text-white/90 max-w-md">
                    Lorem ipsum dolor sit amet consectetur. Mattis sapien eget mi mi adipiscing scelerisque vitae
                </p>
                <div className="mt-6 flex gap-3">
                    <Button asChild>
                        <Link href="/" aria-label="Daftar Sekarang">
                            Daftar Sekarang
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/" aria-label="Jelajahi Event">
                            Jelajahi Event
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Card Section */}
            <div className="relative z-20 max-w-5xl bg-white mx-auto px-4 pt-4 rounded-t-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left Cards */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-50 rounded-lg h-full flex flex-col justify-between shadow p-4">
                            <h3 className="font-semibold text-xl">Lorem Ipsum</h3>
                            <p className="text-sm text-gray-600">
                                Lorem ipsum dolor sit amet consectetur. In purus maecenas sollicitudin ac. At ultrices quis ut
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg h-full flex flex-col justify-between shadow p-4">
                            <h3 className="font-semibold text-xl">Lorem Ipsum</h3>
                            <p className="text-sm text-gray-600">
                                Lorem ipsum dolor sit amet consectetur. In purus maecenas sollicitudin ac. At ultrices quis ut
                            </p>
                        </div>
                    </div>

                    {/* Middle Image */}
                    <div className="relative w-full h-72 md:h-108 rounded-lg overflow-hidden">
                        <Image
                            src="/images/hero-middle.png"
                            alt="Kegiatan lomba"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Right Image */}
                    <div className="relative w-full h-72 md:h-108 rounded-lg overflow-hidden">
                        <Image
                            src="/images/hero-middle.png"
                            alt="Suasana belajar"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
