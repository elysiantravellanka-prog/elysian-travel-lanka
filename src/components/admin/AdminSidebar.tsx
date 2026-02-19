'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
    LayoutDashboard,
    Map,
    MapPin,
    MessageSquare,
    Star,
    LogOut,
    Menu,
    X,
    ChevronDown,
    User,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Tour Packages', href: '/admin/tours', icon: Map },
    { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/admin/login' });
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo.png"
                                alt="Elysian Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-white">Elysian</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-full w-64 glass border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{
                    background: 'linear-gradient(180deg, rgba(13, 29, 46, 0.95) 0%, rgba(10, 22, 40, 0.98) 100%)',
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/logo.png"
                                alt="Elysian Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-white">Elysian</h1>
                            <p className="text-xs text-white/50">Admin Portal</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] shadow-lg shadow-[#c9a962]/30'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-white/10">
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962] to-[#a88b4a] flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#0a1628]" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-white">
                                        {session?.user?.name || 'Admin'}
                                    </p>
                                    <p className="text-xs text-white/50 truncate">
                                        {session?.user?.email}
                                    </p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 glass rounded-xl border border-white/10 overflow-hidden">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
