import { Suspense } from 'react';
import { Map, MapPin, MessageSquare, TrendingUp, Users, Clock, Sparkles } from 'lucide-react';
import dbConnect from '@/lib/db';
import TourPackage from '@/models/TourPackage';
import Destination from '@/models/Destination';
import Inquiry from '@/models/Inquiry';

async function getStats() {
    await dbConnect();

    const [totalTours, totalDestinations, totalInquiries, newInquiries, recentInquiries] = await Promise.all([
        TourPackage.countDocuments(),
        Destination.countDocuments(),
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: 'New' }),
        Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return {
        totalTours,
        totalDestinations,
        totalInquiries,
        newInquiries,
        recentInquiries,
    };
}

function StatsCard({
    title,
    value,
    icon: Icon,
    gradient
}: {
    title: string;
    value: number;
    icon: React.ElementType;
    gradient: string;
}) {
    return (
        <div className="glass-card p-6 card-hover">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/50">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        New: 'bg-[#c9a962]/20 text-[#c9a962] border border-[#c9a962]/30',
        Contacted: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        Closed: 'bg-white/10 text-white/60 border border-white/20',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.New}`}>
            {status}
        </span>
    );
}

async function DashboardContent() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a962] to-[#a88b4a] flex items-center justify-center shadow-lg shadow-[#c9a962]/20">
                    <Sparkles className="w-6 h-6 text-[#0a1628]" />
                </div>
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
                    <p className="text-white/50 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatsCard
                    title="Total Tours"
                    value={stats.totalTours}
                    icon={Map}
                    gradient="bg-gradient-to-br from-[#c9a962] to-[#a88b4a]"
                />
                <StatsCard
                    title="Destinations"
                    value={stats.totalDestinations}
                    icon={MapPin}
                    gradient="bg-gradient-to-br from-[#1B4965] to-[#2E6180]"
                />
                <StatsCard
                    title="Total Inquiries"
                    value={stats.totalInquiries}
                    icon={MessageSquare}
                    gradient="bg-gradient-to-br from-[#0d1d2e] to-[#1a2744]"
                />
                <StatsCard
                    title="New Inquiries"
                    value={stats.newInquiries}
                    icon={TrendingUp}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
            </div>

            {/* Recent Inquiries */}
            <div className="glass-card overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Recent Inquiries</h2>
                </div>
                <div className="overflow-x-auto">
                    {stats.recentInquiries.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <table className="w-full hidden md:table">
                                <thead>
                                    <tr className="text-left text-sm text-white/40 border-b border-white/10">
                                        <th className="px-6 py-4 font-medium">Customer</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Type</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentInquiries.map((inquiry) => (
                                        <tr key={inquiry._id?.toString()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962]/20 to-[#a88b4a]/20 flex items-center justify-center border border-[#c9a962]/30">
                                                        <Users className="w-5 h-5 text-[#c9a962]" />
                                                    </div>
                                                    <span className="font-medium text-white">{inquiry.customerName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-white/60">{inquiry.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="capitalize text-white/60">{inquiry.inquiryType}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={inquiry.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3 p-4">
                                {stats.recentInquiries.map((inquiry) => (
                                    <div key={inquiry._id?.toString()} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962]/20 to-[#a88b4a]/20 flex items-center justify-center border border-[#c9a962]/30 flex-shrink-0">
                                                    <Users className="w-5 h-5 text-[#c9a962]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate">{inquiry.customerName}</p>
                                                    <p className="text-sm text-white/50 truncate">{inquiry.email}</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={inquiry.status} />
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                                            <span className="capitalize text-sm text-white/60">{inquiry.inquiryType}</span>
                                            <div className="flex items-center gap-2 text-white/40 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/20" />
                            <p className="text-white/40">No inquiries yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="space-y-8">
                <div className="h-16 bg-white/5 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
                <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
