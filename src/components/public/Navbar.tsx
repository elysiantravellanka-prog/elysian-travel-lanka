'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Experiences', href: '/packages' },
    { name: 'Destinations', href: '/#destinations' },
    { name: 'Tailor Made', href: '/tailor-made' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Main Navbar */}
            <nav className={`transition-all duration-500 ${scrolled
                ? 'bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/10'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-24">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/logo.png"
                                    alt="Elysian Travels Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-semibold tracking-wide">
                                    <span className="text-white">Elysian</span>
                                    <span className="gradient-text ml-1">Travels</span>
                                </h1>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-10">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-white/70 hover:text-white font-medium text-sm tracking-wide transition-colors relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#c9a962] to-[#e5d4a1] group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                            <Link
                                href="/packages"
                                className="btn-primary text-sm flex items-center gap-2 relative z-10"
                            >
                                <span className="relative z-10">Begin Journey</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-3 rounded-xl glass transition-all hover:bg-white/10"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-2">
                        {navigation.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/packages"
                            onClick={() => setIsOpen(false)}
                            className="block text-center btn-primary mt-4"
                        >
                            Begin Journey
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
