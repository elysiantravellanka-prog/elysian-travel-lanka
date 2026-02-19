import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Star, MapPin, Clock, Users, Shield, Heart, Compass, Quote, Sparkles } from 'lucide-react';
import TourCard from '@/components/public/TourCard';
import Reveal from '@/components/ui/Reveal';
import ScrollytellingSection from '@/components/ui/ScrollytellingSection';
import { MarqueeScroll, ParallaxText, SplitRevealText } from '@/components/ui/ScrollMarquee';
import dbConnect from '@/lib/db';
import TourPackage from '@/models/TourPackage';
import Destination from '@/models/Destination';
import Testimonial from '@/models/Testimonial';
import { buildMetadata, siteSeo } from '@/lib/seo';

export const metadata = buildMetadata({
    title: siteSeo.defaultTitle,
    description: siteSeo.defaultDescription,
    path: '/',
    keywords: ['Private Tours', 'Luxury Sri Lanka Holidays', 'Sri Lanka Experiences'],
});

async function getHomeData() {
    await dbConnect();

    const [featuredTours, destinations, testimonials] = await Promise.all([
        TourPackage.find({ isFeatured: true }).limit(6).lean(),
        Destination.find().limit(6).lean(),
        Testimonial.find({ isApproved: true }).limit(6).lean(),
    ]);

    return {
        featuredTours: JSON.parse(JSON.stringify(featuredTours)),
        destinations: JSON.parse(JSON.stringify(destinations)),
        testimonials: JSON.parse(JSON.stringify(testimonials)),
    };
}

const features = [
    {
        icon: Compass,
        title: 'Curated Journeys',
        description: 'Handcrafted itineraries designed by travel experts with deep local knowledge.',
    },
    {
        icon: Shield,
        title: 'Seamless Experience',
        description: '24/7 concierge support ensuring your journey is effortlessly extraordinary.',
    },
    {
        icon: Heart,
        title: 'Authentic Connections',
        description: 'Immersive experiences that connect you with local culture and traditions.',
    },
    {
        icon: Users,
        title: 'Private Luxury',
        description: 'Exclusive access to hidden gems and premium accommodations.',
    },
];

const stats = [
    { value: '500+', label: 'Journeys Crafted' },
    { value: '50+', label: 'Destinations' },
    { value: '12', label: 'Years Excellence' },
    { value: '98%', label: 'Guest Satisfaction' },
];

export default async function HomePage() {
    const { featuredTours, destinations, testimonials } = await getHomeData();

    return (
        <>

            {/* Hero Section with Video Background */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="video-bg"
                        poster="https://www.authenticindiatours.com/app/uploads/2022/05/Best-places-to-visit-in-Sri-Lanka-1400x550-c-default.jpg"
                    >
                        <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-a-tropical-beach-2543/1080p.mp4" type="video/mp4" />
                    </video>
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/50" />
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#c9a962]/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-[#c9a962]/5 rounded-full blur-3xl animate-float delay-300" />

                {/* Content */}
                <div className="relative z-20 max-w-7xl mx-auto px-6 py-32">
                    <Reveal className="max-w-3xl" amount={0.35}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-3 glass px-5 py-2.5 rounded-full mb-8 animate-fade-in-up">
                            <span className="w-2 h-2 bg-[#c9a962] rounded-full animate-pulse" />
                            <span className="text-white/70 text-sm tracking-wide">Luxury Travel Experiences</span>
                        </div>

                        {/* Heading */}
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 animate-fade-in-up delay-100">
                            Discover the
                            <span className="block gradient-text">Extraordinary</span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-xl mb-12 animate-fade-in-up delay-200">
                            Embark on a journey through Sri Lanka&apos;s most enchanting landscapes.
                            Where ancient wonders meet pristine shores.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up delay-300">
                            <Link href="/packages" className="btn-primary inline-flex items-center justify-center gap-3">
                                <span className="relative z-10">Explore Journeys</span>
                                <ArrowRight className="w-5 h-5 relative z-10" />
                            </Link>
                            <Link href="/tailor-made" className="btn-secondary inline-flex items-center justify-center gap-3">
                                <Play className="w-5 h-5" />
                                <span>Watch Film</span>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 md:gap-12 animate-fade-in-up delay-400">
                            {stats.map((stat, index) => (
                                <Reveal key={index} delay={index * 0.08} variant="fade" className="text-center">
                                    <p className="text-3xl md:text-4xl font-display gradient-text">{stat.value}</p>
                                    <p className="text-white/40 text-sm mt-1 tracking-wide">{stat.label}</p>
                                </Reveal>
                            ))}
                        </div>
                    </Reveal>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
                    <div className="scroll-indicator" />
                </div>
            </section>

            {/* Marquee Scroll Section */}
            <MarqueeScroll
                items={["Sri Lanka", "Ancient Temples", "Pristine Beaches", "Tea Plantations", "Wildlife", "Adventure", "Luxury"]}
                className="bg-[#0a1628] border-y border-white/5"
                speed={1.5}
                direction="left"
            />

            {/* Destinations Section */}
            <section id="destinations" className="py-32 relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#c9a962]/5 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <Reveal className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
                        <div>
                            <span className="text-[#c9a962] text-sm tracking-widest uppercase mb-4 block">Destinations</span>
                            <h2 className="font-display text-4xl md:text-5xl text-white">
                                Explore Paradise
                            </h2>
                        </div>
                        <Link href="/packages" className="flex items-center gap-2 text-white/60 hover:text-[#c9a962] transition-colors group">
                            View all destinations
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Reveal>

                    {destinations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {destinations.map((destination: { _id: string; name: string; description: string; image: string }, index: number) => (
                                <Reveal key={destination._id} delay={index * 0.08} className="contents">
                                    <Link
                                        href={`/packages?destination=${destination.name}`}
                                        className={`group relative rounded-3xl overflow-hidden card-hover ${index === 0 ? 'md:col-span-2 md:row-span-2 aspect-[16/10]' : 'aspect-[4/3]'
                                            }`}
                                    >
                                        <Image
                                            src={destination.image || 'https://images.unsplash.com/photo-1586182987320-87888e0cb005?q=80&w=800'}
                                            alt={destination.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                            <h3 className={`font-display text-white ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'} mb-2`}>
                                                {destination.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[#c9a962] text-sm">
                                                <span>Explore</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-16 text-center">
                            <MapPin className="w-16 h-16 mx-auto text-white/20 mb-6" />
                            <p className="text-white/50 text-lg">Destinations coming soon</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Experiences */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0d1d2e]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c9a962]/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <Reveal className="text-center mb-16">
                        <span className="text-[#c9a962] text-sm tracking-widest uppercase mb-4 block">Experiences</span>
                        <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                            Curated Journeys
                        </h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Handpicked adventures designed for discerning travelers seeking extraordinary experiences
                        </p>
                    </Reveal>

                    {featuredTours.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredTours.map((tour: { _id: string; title: string; slug: string; price: number; duration: string; category: string; description: string; images: string[]; isFeatured: boolean }) => (
                                    <TourCard key={tour._id} tour={tour} />
                                ))}
                            </div>
                            <div className="text-center mt-16">
                                <Link href="/packages" className="btn-primary inline-flex items-center gap-3">
                                    <span className="relative z-10">View All Experiences</span>
                                    <ArrowRight className="w-5 h-5 relative z-10" />
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="glass-card p-16 text-center">
                            <Clock className="w-16 h-16 mx-auto text-white/20 mb-6" />
                            <p className="text-white/50 text-lg">Experiences coming soon</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Scrollytelling Experience Section */}
            <ScrollytellingSection />

            {/* Parallax Text Section */}
            <ParallaxText
                text="Beyond Ordinary"
                subtext="Step into a world where every moment is crafted to perfection. Your extraordinary journey awaits."
                className="bg-[#0a1628]"
            />

            {/* Why Choose Us */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <Reveal className="space-y-6">
                            <span className="text-[#c9a962] text-sm tracking-widest uppercase block">Why Elysian</span>
                            <h2 className="font-display text-4xl md:text-5xl text-white">
                                The Art of
                                <span className="block gradient-text">Exceptional Travel</span>
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed">
                                We don&apos;t just plan trips – we craft transformative journeys that
                                leave lasting impressions. Every detail is meticulously designed to
                                exceed your expectations.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                {features.map((feature, index) => (
                                    <Reveal key={index} delay={index * 0.07} className="gradient-border p-6 group hover-lift">
                                        <div className="w-12 h-12 rounded-2xl bg-[#c9a962]/10 flex items-center justify-center mb-4 group-hover:bg-[#c9a962]/20 transition-colors">
                                            <feature.icon className="w-6 h-6 text-[#c9a962]" />
                                        </div>
                                        <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                                    </Reveal>
                                ))}
                            </div>
                        </Reveal>

                        {/* Right Image Grid */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-[#c9a962]/20 to-transparent rounded-3xl blur-2xl" />
                            <div className="relative grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                                        <Image
                                            src="https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=center,quality=60,width=400,height=265,dpr=2/tour_img/570202505e9ed4292d4a1da698f523c5718b507e5629a6edc1359b3dce71698a.jpg"
                                            alt="Sigiriya Lion Rock fortress in Sri Lanka"
                                            width={400}
                                            height={533}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="aspect-square rounded-2xl overflow-hidden">
                                        <Image
                                            src="/images/nine-arch-bridge.jpg"
                                            alt="Nine Arch Bridge in Ella, Sri Lanka"
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="aspect-square rounded-2xl overflow-hidden">
                                        <Image
                                            src="https://www.trawell.in/admin/images/upload/1894272Yala_Jeep_Safari.jpg"
                                            alt="Wild elephants at Yala National Park Sri Lanka"
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                                        <Image
                                            src="https://greenholidaytravel.com/wp-content/uploads/2023/07/nuwara-eliya-tea-picker.jpg"
                                            alt="Lush Ceylon tea plantation hills in Nuwara Eliya"
                                            width={400}
                                            height={533}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Split Reveal Text Section */}
            <section className="py-32 relative overflow-hidden bg-[#0a1628]">
                <div className="max-w-7xl mx-auto px-6">
                    <SplitRevealText
                        lines={[
                            { text: "Where Dreams" },
                            { text: "Take Flight", highlight: true },
                            { text: "And Memories" },
                            { text: "Last Forever", highlight: true },
                        ]}
                        className="text-center"
                    />
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d1d2e] via-[#0a1628] to-[#0d1d2e]" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <Reveal className="text-center mb-16">
                        <span className="text-[#c9a962] text-sm tracking-widest uppercase mb-4 block">Testimonials</span>
                        <h2 className="font-display text-4xl md:text-5xl text-white">
                            Guest Stories
                        </h2>
                    </Reveal>

                    {testimonials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((testimonial: { _id: string; name: string; location: string; rating: number; message: string; image?: string }, idx: number) => (
                                <Reveal key={testimonial._id} delay={idx * 0.08} className="glass-card p-8 card-hover">
                                    <Quote className="w-10 h-10 text-[#c9a962]/30 mb-6" />
                                    <p className="text-white/70 leading-relaxed mb-8">{testimonial.message}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a962] to-[#a88b4a] flex items-center justify-center">
                                            {testimonial.image ? (
                                                <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="object-cover" />
                                            ) : (
                                                <span className="text-[#0a1628] font-bold">{testimonial.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{testimonial.name}</h4>
                                            <p className="text-white/40 text-sm">{testimonial.location}</p>
                                        </div>
                                        <div className="ml-auto flex gap-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-[#c9a962] fill-[#c9a962]" />
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-16 text-center">
                            <Star className="w-16 h-16 mx-auto text-white/20 mb-6" />
                            <p className="text-white/50 text-lg">Guest stories coming soon</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Marquee */}
            <MarqueeScroll
                items={["Begin Your Journey", "Start Exploring", "Book Now", "Experience Luxury", "Create Memories"]}
                className="bg-gradient-to-b from-[#0d1d2e] to-[#0a1628] border-y border-white/5"
                speed={1}
                direction="right"
            />

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/mirissa-beach-sunset.jpg"
                        alt="Golden sunset over Mirissa beach Sri Lanka"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/90 to-[#0a1628]/70" />
                </div>

                <Reveal className="max-w-4xl mx-auto px-6 text-center relative">
                    <Sparkles className="w-12 h-12 text-[#c9a962] mx-auto mb-8 animate-float" />
                    <h2 className="font-display text-4xl md:text-6xl text-white mb-6">
                        Ready to Begin Your
                        <span className="block gradient-text">Journey?</span>
                    </h2>
                    <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
                        Let our travel architects craft your perfect Sri Lankan escape.
                        Every journey begins with a single step.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact" className="btn-primary inline-flex items-center gap-3">
                            <span className="relative z-10">Start Planning</span>
                            <ArrowRight className="w-5 h-5 relative z-10" />
                        </Link>
                        <Link href="/tailor-made" className="btn-secondary inline-flex items-center gap-3">
                            Create Bespoke Trip
                        </Link>
                    </div>
                </Reveal>
            </section>
        </>
    );
}
