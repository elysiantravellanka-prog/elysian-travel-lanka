import Link from 'next/link';
import { Sparkles, Phone, Mail, MapPin, ArrowUpRight, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const quickLinks = [
    { name: 'Experiences', href: '/packages' },
    { name: 'Destinations', href: '/#destinations' },
    { name: 'Tailor Made', href: '/tailor-made' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

const experiences = [
    { name: 'Wildlife Safari', href: '/packages?category=Wildlife' },
    { name: 'Cultural Heritage', href: '/packages?category=Cultural' },
    { name: 'Beach Retreats', href: '/packages?category=Beach' },
    { name: 'Adventure Tours', href: '/packages?category=Adventure' },
    { name: 'Wellness Escapes', href: '/packages?category=Honeymoon' },
];

export default function Footer() {
    return (
        <footer className="relative bg-[#0a1628] pt-24 pb-8 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c9a962]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#c9a962]/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Newsletter Section */}
                <div className="glass-card p-8 md:p-12 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#c9a962]/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="font-display text-3xl text-white mb-2">Begin Your Journey</h3>
                            <p className="text-white/60">Subscribe for exclusive travel inspirations and offers</p>
                        </div>
                        <form className="flex w-full md:w-auto gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-72 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                            />
                            <button type="submit" className="btn-primary whitespace-nowrap flex items-center gap-2">
                                Subscribe
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a962] to-[#a88b4a] flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-[#0a1628]" />
                            </div>
                            <div>
                                <h2 className="font-display text-2xl font-semibold">
                                    <span className="text-white">Elysian</span>
                                    <span className="gradient-text ml-1">Travels</span>
                                </h2>
                            </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-6">
                            Crafting extraordinary journeys through the enchanting landscapes of Sri Lanka.
                            Where every destination becomes a cherished memory.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#c9a962] hover:border-[#c9a962]/50 transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/50 hover:text-[#c9a962] transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-4 h-[1px] bg-[#c9a962] transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Experiences */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Experiences</h3>
                        <ul className="space-y-3">
                            {experiences.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/50 hover:text-[#c9a962] transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-4 h-[1px] bg-[#c9a962] transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Get in Touch</h3>
                        <div className="space-y-4">
                            <a href="tel:+94777123456" className="flex items-center gap-4 text-white/50 hover:text-[#c9a962] transition-colors text-sm">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-[#c9a962]" />
                                </div>
                                +94 777 123 456
                            </a>
                            <a href="mailto:hello@elysiantravels.com" className="flex items-center gap-4 text-white/50 hover:text-[#c9a962] transition-colors text-sm">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-[#c9a962]" />
                                </div>
                                hello@elysiantravels.com
                            </a>
                            <div className="flex items-start gap-4 text-white/50 text-sm">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-[#c9a962]" />
                                </div>
                                <span>123 Galle Road, Colombo 03, Sri Lanka</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} Elysian Travels. Crafted with passion.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-white/40">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
