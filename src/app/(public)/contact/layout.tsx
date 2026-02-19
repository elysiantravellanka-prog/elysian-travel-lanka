import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
    title: 'Contact Elysian Travels | Sri Lanka Luxury Travel',
    description: 'Reach Elysian Travels for bespoke Sri Lanka journeys. Call, email, or send a message to our travel architects.',
    path: '/contact',
    keywords: ['Contact travel agency', 'Sri Lanka travel contact', 'Elysian Travels contact'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
