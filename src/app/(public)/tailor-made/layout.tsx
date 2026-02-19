import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
    title: 'Tailor-Made Sri Lanka Trips | Elysian Travels',
    description: 'Design a bespoke Sri Lanka journey with Elysian Travels. Share your preferences and we craft a personalized itinerary.',
    path: '/tailor-made',
    keywords: ['Tailor-made Sri Lanka', 'Custom Sri Lanka itinerary', 'Bespoke travel Sri Lanka'],
});

export default function TailorMadeLayout({ children }: { children: React.ReactNode }) {
    return children;
}
