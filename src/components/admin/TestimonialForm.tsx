'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowLeft, Save, ImageIcon, X, Star } from 'lucide-react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { createTestimonial, updateTestimonial } from '@/lib/actions/testimonials';

interface FormData {
    name: string;
    location: string;
    rating: number;
    message: string;
    image?: string;
    isApproved: boolean;
}

interface TestimonialFormProps {
    initialData?: FormData & { _id?: string };
    isEditing?: boolean;
}

export default function TestimonialForm({ initialData, isEditing = false }: TestimonialFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: initialData?.name || '',
            location: initialData?.location || '',
            rating: initialData?.rating || 5,
            message: initialData?.message || '',
            image: initialData?.image || '',
            isApproved: initialData?.isApproved ?? true,
        },
    });

    const image = watch('image');
    const rating = watch('rating');

    const onSubmit = async (data: FormData) => {
        if (!data.name || !data.location || !data.message) return;

        setIsSubmitting(true);
        const result = isEditing && initialData?._id
            ? await updateTestimonial(initialData._id, data)
            : await createTestimonial(data);

        if (result.success) {
            router.push('/admin/testimonials');
            router.refresh();
        }
        setIsSubmitting(false);
    };

    const handleUpload = (result: CloudinaryUploadWidgetResults) => {
        if (result?.info && typeof result.info === 'object' && 'secure_url' in result.info) {
            setValue('image', result.info.secure_url);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/testimonials" className="p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                    <ArrowLeft className="w-5 h-5 text-white/60" />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a962] to-[#a88b4a] flex items-center justify-center shadow-lg shadow-[#c9a962]/20">
                        <Star className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
                        <p className="text-white/50 mt-1">{isEditing ? 'Update the testimonial details below' : 'Fill in the details to add a new testimonial'}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="glass-card p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Customer Name *</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30"
                                placeholder="e.g., John Smith"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Location *</label>
                            <input
                                {...register('location', { required: 'Location is required' })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30"
                                placeholder="e.g., New York, USA"
                            />
                            {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Rating *</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setValue('rating', star)} className="p-1 hover:scale-110 transition-transform">
                                    <Star className={`w-8 h-8 ${star <= rating ? 'text-[#c9a962] fill-[#c9a962]' : 'text-white/20'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Review Message *</label>
                        <textarea
                            {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } })}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30 resize-none"
                            placeholder="Customer's review..."
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Photo (Optional)</label>
                        {image ? (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden group border-2 border-[#c9a962]/30">
                                <Image src={image} alt="Customer" fill className="object-cover" />
                                <button type="button" onClick={() => setValue('image', '')} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        ) : (
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                options={{ maxFiles: 1, folder: 'vistalanka/testimonials' }}
                                onSuccess={handleUpload}
                            >
                                {({ open }) => (
                                    <button type="button" onClick={() => open()} className="w-24 h-24 border-2 border-dashed border-white/20 rounded-full hover:border-[#c9a962] hover:bg-[#c9a962]/5 transition-all flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-white/30" />
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <input {...register('isApproved')} type="checkbox" id="isApproved" className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#c9a962] focus:ring-[#c9a962]/50" />
                        <label htmlFor="isApproved" className="text-sm font-medium text-white/70">Approve and show on website</label>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/admin/testimonials" className="flex-1 px-6 py-3 text-center font-medium text-white/70 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">Cancel</Link>
                    <button type="submit" disabled={isSubmitting} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all disabled:opacity-70">
                        {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> {isEditing ? 'Update' : 'Create'}</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
