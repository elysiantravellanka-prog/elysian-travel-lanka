import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Check, X, ChevronRight, Phone, Mail, ArrowLeft } from 'lucide-react';
import { getTourBySlug } from '@/lib/actions/tours';
import BookingForm from './BookingForm';
import { buildMetadata, buildTourMetadata } from '@/lib/seo';

interface TourDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTourBySlug(slug);

    if (!tour) {
        return buildMetadata({
            title: 'Experience Not Found | Elysian Travels',
            description: 'The requested journey could not be found.',
            path: `/packages/${slug}`,
        });
    }

    return buildTourMetadata({
        title: tour.title,
        description: tour.description,
        slug: tour.slug || slug,
        category: tour.category,
        duration: tour.duration,
        images: tour.images,
    });
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
    const { slug } = await params;
    const tour = await getTourBySlug(slug);

    if (!tour) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Hero Image Gallery */}
            <section className="relative">
                <div className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] relative">
                    <Image
                        src={tour.images[0] || 'https://images.unsplash.com/photo-1588598198321-9735fd510175'}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/50 to-transparent" />
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                        <Link 
                            href="/packages" 
                            className="inline-flex items-center gap-2 text-white/70 hover:text-[#c9a962] text-sm mb-3 sm:mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Packages
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">
                            <Link href="/packages" className="hover:text-white transition-colors">Packages</Link>
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{tour.category}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">{tour.title}</h1>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-white/70 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#c9a962]" />
                                {tour.duration}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-[#c9a962]" />
                                {tour.startLocation}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-[#c9a962]" />
                                {tour.groupSize}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Thumbnails */}
            {tour.images.length > 1 && (
                <section className="border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {tour.images.map((img: string, index: number) => (
                                <div
                                    key={index}
                                    className="relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-[#c9a962] transition-all"
                                >
                                    <Image src={img} alt={`${tour.title} ${index + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <section className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                        {/* Left Column - Details */}
                        <div className="flex-1 order-2 lg:order-1">
                            {/* Tabs */}
                            <div className="glass-card overflow-hidden">
                                <div className="border-b border-white/10 overflow-x-auto">
                                    <nav className="flex min-w-max">
                                        <button className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-[#c9a962] border-b-2 border-[#c9a962] whitespace-nowrap">
                                            Overview
                                        </button>
                                        <button className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-white/50 hover:text-white whitespace-nowrap">
                                            Itinerary
                                        </button>
                                        <button className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-white/50 hover:text-white whitespace-nowrap">
                                            Inclusions
                                        </button>
                                    </nav>
                                </div>

                                <div className="p-4 sm:p-6">
                                    {/* Overview */}
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-display font-semibold text-white mb-3 sm:mb-4">Tour Overview</h2>
                                        <p className="text-white/60 leading-relaxed whitespace-pre-line text-sm sm:text-base">{tour.description}</p>
                                    </div>

                                    {/* Itinerary */}
                                    {tour.itinerary.length > 0 && (
                                        <div className="mt-6 sm:mt-8">
                                            <h2 className="text-lg sm:text-xl font-display font-semibold text-white mb-4 sm:mb-6">Day-by-Day Itinerary</h2>
                                            <div className="space-y-4 sm:space-y-6">
                                                {tour.itinerary.map((item: { day: number; title: string; description: string }, index: number) => (
                                                    <div key={index} className="flex gap-3 sm:gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#c9a962] to-[#a88b4a] text-[#0a1628] flex items-center justify-center font-bold text-sm sm:text-base">
                                                                {item.day}
                                                            </div>
                                                            {index < tour.itinerary.length - 1 && (
                                                                <div className="w-0.5 h-full bg-white/10 mx-auto mt-2" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 pb-4 sm:pb-6">
                                                            <h3 className="font-semibold text-white text-sm sm:text-base">{item.title}</h3>
                                                            <p className="text-white/50 mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Inclusions & Exclusions */}
                                    <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                        {tour.inclusions.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                                                    What&apos;s Included
                                                </h3>
                                                <ul className="space-y-2">
                                                    {tour.inclusions.map((item: string, index: number) => (
                                                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {tour.exclusions.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                                                    What&apos;s Not Included
                                                </h3>
                                                <ul className="space-y-2">
                                                    {tour.exclusions.map((item: string, index: number) => (
                                                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                                                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Booking */}
                        <div className="w-full lg:w-80 xl:w-96 order-1 lg:order-2">
                            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
                                {/* Price Card */}
                                <div className="glass-card p-4 sm:p-6">
                                    <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                                        <span className="text-2xl sm:text-3xl font-bold gradient-text">${tour.price}</span>
                                        <span className="text-white/50 text-sm">/ person</span>
                                    </div>
                                    <div className="space-y-2 sm:space-y-3 text-sm text-white/60">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a962]" />
                                            {tour.duration}
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a962]" />
                                            {tour.groupSize}
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a962]" />
                                            Starts from {tour.startLocation}
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Form */}
                                <BookingForm tourId={tour._id} tourTitle={tour.title} />

                                {/* Contact */}
                                <div className="glass-card p-4 sm:p-6 bg-gradient-to-br from-[#1a2744] to-[#0d1d2e]">
                                    <h3 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">Need Help?</h3>
                                    <p className="text-white/50 text-xs sm:text-sm mb-3 sm:mb-4">
                                        Our travel experts are here to help you plan the perfect trip.
                                    </p>
                                    <div className="space-y-2 sm:space-y-3">
                                        <a href="tel:+94777123456" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/70 hover:text-[#c9a962] transition-colors">
                                            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                            +94 777 123 456
                                        </a>
                                        <a href="mailto:hello@elysiantravels.com" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/70 hover:text-[#c9a962] transition-colors">
                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                            hello@elysiantravels.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
