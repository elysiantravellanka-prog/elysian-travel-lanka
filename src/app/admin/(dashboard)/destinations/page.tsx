import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { getDestinations, deleteDestination } from '@/lib/actions/destinations';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

async function DestinationsContent() {
    const destinations = await getDestinations();

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteDestination(id);
        revalidatePath('/admin/destinations');
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Destinations</h1>
                    <p className="text-white/50 mt-1">Manage popular destinations</p>
                </div>
                <Link
                    href="/admin/destinations/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-xl font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Destination
                </Link>
            </div>

            {destinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((destination) => (
                        <div key={destination._id?.toString()} className="glass-card overflow-hidden card-hover group">
                            <div className="relative aspect-video">
                                {destination.image ? (
                                    <Image
                                        src={destination.image}
                                        alt={destination.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <MapPin className="w-12 h-12 text-white/20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-white text-lg">{destination.name}</h3>
                                <p className="text-white/50 text-sm mt-1 line-clamp-2">{destination.description}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {destination.highlights.slice(0, 3).map((h, i) => (
                                        <span key={i} className="px-2 py-1 bg-[#c9a962]/10 text-[#c9a962] text-xs rounded-full border border-[#c9a962]/20">{h}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                    <Link
                                        href={`/admin/destinations/${destination._id}/edit`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#c9a962] bg-[#c9a962]/10 rounded-lg hover:bg-[#c9a962]/20 transition-colors border border-[#c9a962]/20"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <form action={handleDelete}>
                                        <input type="hidden" name="id" value={destination._id?.toString()} />
                                        <button type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
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
                    <MapPin className="w-16 h-16 mx-auto text-white/20 mb-4" />
                    <h3 className="text-lg font-semibold text-white">No destinations yet</h3>
                    <p className="text-white/50 mt-1">Start by adding popular destinations.</p>
                    <Link
                        href="/admin/destinations/new"
                        className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-xl font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add First Destination
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function DestinationsPage() {
    return (
        <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl animate-pulse" />}>
            <DestinationsContent />
        </Suspense>
    );
}
