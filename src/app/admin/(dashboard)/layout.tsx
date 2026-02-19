'use client';

import { SessionProvider } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="min-h-screen bg-[#0a1628]">
                {/* Noise Overlay for premium texture */}
                <div className="noise-overlay" />
                <AdminSidebar />
                {/* Main Content */}
                <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 transition-all duration-300">
                    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1920px]">
                        {children}
                    </div>
                </main>
            </div>
        </SessionProvider>
    );
}

