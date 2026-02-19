import { Suspense } from 'react';
import { MessageSquare, Trash2, Users, Mail, Phone, Clock, Calendar } from 'lucide-react';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '@/lib/actions/inquiries';
import { revalidatePath } from 'next/cache';
import { InquiryStatusSelect } from './inquiry-status-select';

function StatusBadge({ status }: { status: string }) {
    const styles = {
        New: 'bg-[#c9a962]/20 text-[#c9a962] border border-[#c9a962]/30',
        Contacted: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        Closed: 'bg-white/10 text-white/60 border border-white/20',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.New}`}>{status}</span>;
}

function TypeBadge({ type }: { type: string }) {
    const styles = {
        booking: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        contact: 'bg-[#c9a962]/20 text-[#c9a962] border border-[#c9a962]/30',
        'tailor-made': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[type as keyof typeof styles] || styles.contact}`}>{type}</span>;
}

async function InquiriesContent() {
    const inquiries = await getInquiries();

    async function handleStatusChange(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const status = formData.get('status') as 'New' | 'Contacted' | 'Closed';
        await updateInquiryStatus(id, status);
        revalidatePath('/admin/inquiries');
    }

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteInquiry(id);
        revalidatePath('/admin/inquiries');
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Inquiries</h1>
                <p className="text-white/50 mt-1">Manage customer inquiries and bookings</p>
            </div>

            {inquiries.length > 0 ? (
                <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                        <div key={inquiry._id?.toString()} className="glass-card p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a962]/20 to-[#a88b4a]/20 flex items-center justify-center flex-shrink-0 border border-[#c9a962]/30">
                                        <Users className="w-6 h-6 text-[#c9a962]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-lg">{inquiry.customerName}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <TypeBadge type={inquiry.inquiryType} />
                                            <StatusBadge status={inquiry.status} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <form action={handleStatusChange}>
                                        <input type="hidden" name="id" value={inquiry._id?.toString()} />
                                        <InquiryStatusSelect defaultValue={inquiry.status} />
                                    </form>
                                    <form action={handleDelete}>
                                        <input type="hidden" name="id" value={inquiry._id?.toString()} />
                                        <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Mail className="w-4 h-4" />
                                    <a href={`mailto:${inquiry.email}`} className="hover:text-[#c9a962] transition-colors">{inquiry.email}</a>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Phone className="w-4 h-4" />
                                    <a href={`tel:${inquiry.phone}`} className="hover:text-[#c9a962] transition-colors">{inquiry.phone}</a>
                                </div>
                                <div className="flex items-center gap-2 text-white/40">
                                    <Clock className="w-4 h-4" />
                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {inquiry.tourTitle && (
                                <div className="mt-3 text-sm text-white/60">
                                    <strong className="text-[#c9a962]">Tour:</strong> {inquiry.tourTitle}
                                </div>
                            )}

                            {inquiry.travelDates && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
                                    <Calendar className="w-4 h-4" />
                                    {inquiry.travelDates} • {inquiry.paxCount} persons • {inquiry.budget}
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-white/70">{inquiry.message}</p>
                            </div>

                            {inquiry.interests && inquiry.interests.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {inquiry.interests.map((interest, i) => (
                                        <span key={i} className="px-2 py-1 bg-[#c9a962]/10 text-[#c9a962] text-xs rounded-full border border-[#c9a962]/20">{interest}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto text-white/20 mb-4" />
                    <h3 className="text-lg font-semibold text-white">No inquiries yet</h3>
                    <p className="text-white/50 mt-1">Inquiries from customers will appear here.</p>
                </div>
            )}
        </div>
    );
}

export default function InquiriesPage() {
    return (
        <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl animate-pulse" />}>
            <InquiriesContent />
        </Suspense>
    );
}
