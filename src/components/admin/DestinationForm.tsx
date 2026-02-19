'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Loader2, ArrowLeft, Save, ImageIcon, X, MapPin } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { createDestination, updateDestination, DestinationFormData } from '@/lib/actions/destinations';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    image: z.string().min(1, 'Image is required'),
    highlights: z.array(z.object({ value: z.string() })),
});

interface DestinationFormProps {
    initialData?: DestinationFormData & { _id?: string };
    isEditing?: boolean;
}

interface CloudinaryResult {
    info: { secure_url: string };
}

export default function DestinationForm({ initialData, isEditing = false }: DestinationFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cloudinary's widget sometimes leaves body scrolling locked; ensure we always reset.
    const restoreScroll = () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    };

    useEffect(() => {
        return () => restoreScroll();
    }, []);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            image: initialData?.image || '',
            highlights: initialData?.highlights?.map(h => ({ value: h })) || [{ value: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'highlights' });
    const image = watch('image');

    const onSubmit = async (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);
        const formData: DestinationFormData = {
            ...data,
            highlights: data.highlights.map(h => h.value).filter(h => h.trim() !== ''),
        };

        const result = isEditing && initialData?._id
            ? await updateDestination(initialData._id, formData)
            : await createDestination(formData);

        if (result.success) {
            router.push('/admin/destinations');
            router.refresh();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/destinations" className="p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                    <ArrowLeft className="w-5 h-5 text-white/60" />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a962] to-[#a88b4a] flex items-center justify-center shadow-lg shadow-[#c9a962]/20">
                        <MapPin className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">{isEditing ? 'Edit Destination' : 'Add Destination'}</h1>
                        <p className="text-white/50 mt-1">{isEditing ? 'Update the destination details below' : 'Fill in the details to add a new destination'}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="glass-card p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Name *</label>
                        <input {...register('name')} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30" placeholder="e.g., Sigiriya" />
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Description *</label>
                        <textarea {...register('description')} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30 resize-none" placeholder="Describe this destination..." />
                        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Image *</label>
                        {image ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden group border border-white/10">
                                <Image src={image} alt="Destination" fill className="object-cover" />
                                <button type="button" onClick={() => setValue('image', '')} className="absolute top-3 right-3 p-2 bg-red-500/90 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                options={{ maxFiles: 1, folder: 'vistalanka/destinations' }}
                                onSuccess={(result: unknown) => {
                                    const cloudinaryResult = result as CloudinaryResult;
                                    if (cloudinaryResult?.info?.secure_url) {
                                        setValue('image', cloudinaryResult.info.secure_url);
                                        restoreScroll();
                                    }
                                }}
                                onError={() => restoreScroll()}
                                onQueuesEnd={() => restoreScroll()}
                            >
                                {({ open }) => (
                                    <button type="button" onClick={() => open()} className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-[#c9a962] hover:bg-[#c9a962]/5 transition-all">
                                        <ImageIcon className="w-12 h-12 mx-auto text-white/30 mb-2" />
                                        <p className="text-white/50">Click to upload image</p>
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
                        {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image.message}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-white/70">Highlights</label>
                            <button type="button" onClick={() => append({ value: '' })} className="text-sm text-[#c9a962] hover:text-[#e5d4a1] flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <input {...register(`highlights.${index}.value`)} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30" placeholder="e.g., Ancient Rock Fortress" />
                                    {fields.length > 1 && (
                                        <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/admin/destinations" className="flex-1 px-6 py-3 text-center font-medium text-white/70 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">Cancel</Link>
                    <button type="submit" disabled={isSubmitting} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all disabled:opacity-70">
                        {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> {isEditing ? 'Update' : 'Create'}</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
