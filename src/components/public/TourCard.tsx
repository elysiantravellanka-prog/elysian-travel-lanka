import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Star, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

interface TourCardProps {
    tour: {
        _id?: string;
        title: string;
        slug: string;
        price: number;
        duration: string;
        category: string;
        description: string;
        images: string[];
        isFeatured?: boolean;
    };
}

export default function TourCard({ tour }: TourCardProps) {
    return (
        <Reveal>
            <Link href={`/packages/${tour.slug}`} className="group block">
                <div className="glass-card overflow-hidden card-hover transition-transform duration-500 will-change-transform">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {tour.images[0] ? (
                        <Image
                            src={tour.images[0]}
                            alt={tour.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a2942] to-[#0a1628] flex items-center justify-center">
                            <MapPin className="w-16 h-16 text-white/10" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-60" />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                        {tour.category}
                    </span>

                    {/* Featured Badge */}
                    {tour.isFeatured && (
                        <span className="absolute top-4 right-4 px-4 py-1.5 bg-[#c9a962] text-[#0a1628] text-xs font-semibold rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Featured
                        </span>
                    )}

                    {/* Price */}
                    <div className="absolute bottom-4 right-4 glass px-4 py-2 rounded-xl">
                        <span className="text-white/60 text-xs">From</span>
                        <p className="text-lg font-bold gradient-text">${tour.price}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="font-display text-xl text-white group-hover:text-[#c9a962] transition-colors line-clamp-1">
                        {tour.title}
                    </h3>

                    <p className="text-white/50 text-sm mt-3 line-clamp-2 leading-relaxed">
                        {tour.description}
                    </p>

                    <div className="flex items-center gap-4 mt-5 text-sm text-white/50">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#c9a962]" />
                            {tour.duration}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                        <span className="text-sm text-[#c9a962] font-medium">
                            Explore Journey
                        </span>
                        <div className="w-10 h-10 rounded-full bg-[#c9a962]/10 flex items-center justify-center group-hover:bg-[#c9a962] transition-colors">
                            <ArrowRight className="w-4 h-4 text-[#c9a962] group-hover:text-[#0a1628] transition-colors" />
                        </div>
                    </div>
                </div>
                </div>
            </Link>
        </Reveal>
    );
}
