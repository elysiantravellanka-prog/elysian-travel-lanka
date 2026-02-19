import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Star, Edit, Trash2, MapPin, Check, X } from 'lucide-react';
import { getTestimonials, deleteTestimonial, updateTestimonial } from '@/lib/actions/testimonials';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

async function TestimonialsContent() {
    const testimonials = await getTestimonials();

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteTestimonial(id);
        revalidatePath('/admin/testimonials');
    }

    async function handleApproval(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const isApproved = formData.get('isApproved') === 'true';
        await updateTestimonial(id, { isApproved: !isApproved });
        revalidatePath('/admin/testimonials');
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Testimonials</h1>
                    <p className="text-white/50 mt-1">Manage customer reviews</p>
                </div>
                <Link href="/admin/testimonials/new" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-xl font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all">
                    <Plus className="w-5 h-5" />
                    Add Testimonial
                </Link>
            </div>

            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial._id?.toString()} className={`glass-card p-6 ${testimonial.isApproved ? '' : 'border-[#c9a962]/50'}`}>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-white/10 flex-shrink-0 overflow-hidden border border-white/20">
                                    {testimonial.image ? (
                                        <Image src={testimonial.image} alt={testimonial.name} width={56} height={56} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#c9a962] to-[#a88b4a]">
                                            <span className="text-[#0a1628] font-bold text-lg">{testimonial.name.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-white">{testimonial.name}</h3>
                                        {!testimonial.isApproved && (
                                            <span className="px-2 py-1 bg-[#c9a962]/20 text-[#c9a962] text-xs rounded-full border border-[#c9a962]/30">Pending</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/50">
                                        <MapPin className="w-3 h-3" />
                                        {testimonial.location}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-[#c9a962] fill-[#c9a962]' : 'text-white/20'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/60 mt-4 text-sm leading-relaxed">{testimonial.message}</p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                <form action={handleApproval} className="flex-1">
                                    <input type="hidden" name="id" value={testimonial._id?.toString()} />
                                    <input type="hidden" name="isApproved" value={String(testimonial.isApproved)} />
                                    <button type="submit" className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${testimonial.isApproved ? 'text-[#c9a962] bg-[#c9a962]/10 hover:bg-[#c9a962]/20 border border-[#c9a962]/20' : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20'}`}>
                                        {testimonial.isApproved ? <><X className="w-4 h-4" /> Unapprove</> : <><Check className="w-4 h-4" /> Approve</>}
                                    </button>
                                </form>
                                <Link href={`/admin/testimonials/${testimonial._id}/edit`} className="px-4 py-2 text-sm font-medium text-[#c9a962] bg-[#c9a962]/10 rounded-lg hover:bg-[#c9a962]/20 transition-colors border border-[#c9a962]/20">
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <form action={handleDelete}>
                                    <input type="hidden" name="id" value={testimonial._id?.toString()} />
                                    <button type="submit" className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <Star className="w-16 h-16 mx-auto text-white/20 mb-4" />
                    <h3 className="text-lg font-semibold text-white">No testimonials yet</h3>
                    <p className="text-white/50 mt-1">Add customer reviews to build trust.</p>
                    <Link href="/admin/testimonials/new" className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-xl font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all">
                        <Plus className="w-5 h-5" />
                        Add First Testimonial
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function TestimonialsPage() {
    return (
        <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl animate-pulse" />}>
            <TestimonialsContent />
        </Suspense>
    );
}
