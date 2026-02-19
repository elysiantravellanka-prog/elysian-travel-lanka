import { Suspense } from 'react';
import TourCard from '@/components/public/TourCard';
import dbConnect from '@/lib/db';
import TourPackage from '@/models/TourPackage';
import { Search, SlidersHorizontal, MapPin, Grid3X3, List } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
    title: 'Sri Lanka Tour Packages | Elysian Travels',
    description: 'Browse curated luxury, wildlife, cultural, and honeymoon journeys across Sri Lanka crafted by Elysian Travels.',
    path: '/packages',
    keywords: ['Sri Lanka packages', 'Sri Lanka itineraries', 'Luxury tours Sri Lanka', 'Honeymoon Sri Lanka'],
});

async function getTours(category?: string) {
    await dbConnect();
    const query = category ? { category } : {};
    const tours = await TourPackage.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(tours));
}

const categories = ['All', 'Wildlife', 'Cultural', 'Adventure', 'Beach', 'Family', 'Honeymoon', 'Heritage'];

interface PackagesPageProps {
    searchParams: Promise<{ category?: string }>;
}

async function PackagesContent({ searchParams }: PackagesPageProps) {
    const params = await searchParams;
    const tours = await getTours(params.category);

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Hero */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d1d2e] to-[#0a1628]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a962]/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <Reveal className="text-center max-w-3xl mx-auto">
                        <span className="text-[#c9a962] text-sm tracking-widest uppercase mb-4 block">Experiences</span>
                        <h1 className="font-display text-5xl md:text-6xl text-white mb-6">
                            Curated Journeys
                        </h1>
                        <p className="text-white/50 text-xl">
                            Discover our collection of extraordinary experiences across Sri Lanka
                        </p>
                    </Reveal>

                    {/* Search */}
                    <Reveal className="max-w-2xl mx-auto mt-12" delay={0.08}>
                        <div className="relative glass rounded-full overflow-hidden hover-glow">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search experiences..."
                                className="w-full pl-14 pr-6 py-5 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Filters Bar */}
                    <Reveal className="glass-card p-6 mb-12" amount={0.25}>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            {/* Category Tabs */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => {
                                    const isActive = cat === 'All' ? !params.category : params.category === cat;
                                    return (
                                        <a
                                            key={cat}
                                            href={cat === 'All' ? '/packages' : `/packages?category=${cat}`}
                                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${isActive
                                                    ? 'bg-[#c9a962] text-[#0a1628]'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </a>
                                    );
                                })}
                            </div>

                            {/* View Options */}
                            <div className="flex items-center gap-4">
                                <span className="text-white/40 text-sm">
                                    {tours.length} experience{tours.length !== 1 ? 's' : ''} found
                                </span>
                                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                    <button className="p-2 rounded-lg bg-white/10 text-white">
                                        <Grid3X3 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Tours Grid */}
                    {tours.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tours.map((tour: { _id: string; title: string; slug: string; price: number; duration: string; category: string; description: string; images: string[]; isFeatured: boolean }) => (
                                <TourCard key={tour._id} tour={tour} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-20 text-center">
                            <MapPin className="w-20 h-20 mx-auto text-white/10 mb-6" />
                            <h3 className="text-2xl font-display text-white mb-3">No experiences found</h3>
                            <p className="text-white/50 mb-8">Try adjusting your filters or explore all our journeys</p>
                            <a
                                href="/packages"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <span className="relative z-10">View All Experiences</span>
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function PackagesPage(props: PackagesPageProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <PackagesContent {...props} />
        </Suspense>
    );
}
