import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Map, Edit, Trash2, Star, DollarSign, Clock } from 'lucide-react';
import { getTours, deleteTour } from '@/lib/actions/tours';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

async function ToursContent() {
    const tours = await getTours();

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteTour(id);
        revalidatePath('/admin/tours');
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Tour Packages</h1>
                    <p className="text-white/50 mt-1">Manage your tour packages</p>
                </div>
                <Link
                    href="/admin/tours/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-xl font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add New Tour
                </Link>
            </div>

            {/* Tours Grid */}
            {tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <div
                            key={tour._id?.toString()}
                            className="glass-card overflow-hidden card-hover group"
                        >
                            {/* Image */}
                            <div className="relative aspect-video">
                                {tour.images[0] ? (
                                    <Image
                                        src={tour.images[0]}
                                        alt={tour.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <Map className="w-12 h-12 text-white/20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {tour.isFeatured && (
                                    <span className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] text-xs font-medium rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        Featured
                                    </span>
                                )}
                                <span className="absolute top-3 left-3 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
                                    {tour.category}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-semibold text-white text-lg line-clamp-1">
                                    {tour.title}
                                </h3>
                                <p className="text-white/50 text-sm mt-1 line-clamp-2">
                                    {tour.description}
                                </p>

                                <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4 text-[#c9a962]" />
                                        ${tour.price}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-[#c9a962]" />
                                        {tour.duration}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                    <Link
                                        href={`/admin/tours/${tour._id}/edit`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#c9a962] bg-[#c9a962]/10 rounded-lg hover:bg-[#c9a962]/20 transition-colors border border-[#c9a962]/20"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <form action={handleDelete}>
                                        <input type="hidden" name="id" value={tour._id?.toString()} />
                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <Map className="w-16 h-16 mx-auto text-white/20 mb-4" />
                    <h3 className="text-lg font-semibold text-white">No tours yet</h3>
                    <p className="text-white/50 mt-1">Get started by creating your first tour package.</p>
                    <Link
                        href="/admin/tours/new"
                        className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-xl font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create Your First Tour
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function ToursPage() {
    return (
        <Suspense fallback={
            <div className="space-y-6">
                <div className="h-16 bg-white/5 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        }>
            <ToursContent />
        </Suspense>
    );
}
