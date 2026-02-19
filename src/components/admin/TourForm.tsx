'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Loader2, ArrowLeft, Save, GripVertical, Sparkles } from 'lucide-react';
import CloudinaryUpload from './CloudinaryUpload';
import { createTour, updateTour, TourFormData } from '@/lib/actions/tours';
import Link from 'next/link';

const tourSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    price: z.number().min(0, 'Price must be positive'),
    duration: z.string().min(1, 'Duration is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    itinerary: z.array(z.object({
        day: z.number(),
        title: z.string().min(1, 'Day title is required'),
        description: z.string().min(1, 'Day description is required'),
    })),
    inclusions: z.array(z.string()),
    exclusions: z.array(z.string()),
    groupSize: z.string(),
    startLocation: z.string(),
    isFeatured: z.boolean(),
});

const categories = ['Wildlife', 'Cultural', 'Adventure', 'Beach', 'Family', 'Honeymoon', 'Heritage'];

interface TourFormProps {
    initialData?: TourFormData & { _id?: string };
    isEditing?: boolean;
}

export default function TourForm({ initialData, isEditing = false }: TourFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<TourFormData>({
        resolver: zodResolver(tourSchema),
        defaultValues: initialData || {
            title: '',
            price: 0,
            duration: '',
            category: '',
            description: '',
            images: [],
            itinerary: [{ day: 1, title: '', description: '' }],
            inclusions: [''],
            exclusions: [''],
            groupSize: '2-15 persons',
            startLocation: 'Colombo',
            isFeatured: false,
        },
    });

    const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
        control,
        name: 'itinerary',
    });

    const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
        control,
        name: 'inclusions' as 'itinerary',
    });

    const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({
        control,
        name: 'exclusions' as 'itinerary',
    });

    const images = watch('images');

    const onSubmit = async (data: TourFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            data.inclusions = data.inclusions.filter(i => i.trim() !== '');
            data.exclusions = data.exclusions.filter(e => e.trim() !== '');

            const result = isEditing && initialData?._id
                ? await updateTour(initialData._id, data)
                : await createTour(data);

            if (result.success) {
                router.push('/admin/tours');
                router.refresh();
            } else {
                setError(result.error || 'Something went wrong');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/tours"
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                    <ArrowLeft className="w-5 h-5 text-white/60" />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a962] to-[#a88b4a] flex items-center justify-center shadow-lg shadow-[#c9a962]/20">
                        <Sparkles className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">
                            {isEditing ? 'Edit Tour Package' : 'Create New Tour Package'}
                        </h1>
                        <p className="text-white/50 mt-1">
                            {isEditing ? 'Update the tour details below' : 'Fill in the details below to create a new tour'}
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="glass-card border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Tour Title *
                            </label>
                            <input
                                {...register('title')}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none transition-all text-white placeholder-white/30"
                                placeholder="e.g., 7 Days Sri Lanka Wildlife Safari"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Price (USD) *
                            </label>
                            <input
                                {...register('price', { valueAsNumber: true })}
                                type="number"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none transition-all text-white placeholder-white/30"
                                placeholder="e.g., 1299"
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Duration *
                            </label>
                            <input
                                {...register('duration')}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none transition-all text-white placeholder-white/30"
                                placeholder="e.g., 7 Days / 6 Nights"
                            />
                            {errors.duration && (
                                <p className="mt-1 text-sm text-red-400">{errors.duration.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Category *
                            </label>
                            <select
                                {...register('category')}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none transition-all text-white"
                            >
                                <option value="" className="bg-[#1a2744]">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-[#1a2744]">{cat}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Start Location
                            </label>
                            <input
                                {...register('startLocation')}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none transition-all text-white placeholder-white/30"
                                placeholder="e.g., Colombo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Group Size
                            </label>
                            <input
                                {...register('groupSize')}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none transition-all text-white placeholder-white/30"
                                placeholder="e.g., 2-15 persons"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Description *
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none transition-all text-white placeholder-white/30 resize-none"
                                placeholder="Describe the tour experience..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3">
                            <input
                                {...register('isFeatured')}
                                type="checkbox"
                                id="isFeatured"
                                className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#c9a962] focus:ring-[#c9a962]/50"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-white/70">
                                Mark as Featured Tour (shows on homepage)
                            </label>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Tour Images *</h2>
                    <CloudinaryUpload
                        value={images}
                        onChange={(urls) => setValue('images', urls)}
                        maxFiles={10}
                    />
                    {errors.images && (
                        <p className="mt-2 text-sm text-red-400">{errors.images.message}</p>
                    )}
                </div>

                {/* Itinerary */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Day-by-Day Itinerary</h2>
                        <button
                            type="button"
                            onClick={() => appendItinerary({ day: itineraryFields.length + 1, title: '', description: '' })}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#c9a962] bg-[#c9a962]/10 rounded-lg hover:bg-[#c9a962]/20 transition-colors border border-[#c9a962]/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add Day
                        </button>
                    </div>

                    <div className="space-y-4">
                        {itineraryFields.map((field, index) => (
                            <div key={field.id} className="relative p-4 border border-white/10 rounded-xl bg-white/5">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-full font-bold text-sm mt-1">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <input
                                            {...register(`itinerary.${index}.title`)}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30"
                                            placeholder="Day title (e.g., Arrival in Colombo)"
                                        />
                                        <textarea
                                            {...register(`itinerary.${index}.description`)}
                                            rows={2}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30 resize-none"
                                            placeholder="Day description..."
                                        />
                                    </div>
                                    {itineraryFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItinerary(index)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inclusions */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Inclusions</h2>
                            <button
                                type="button"
                                onClick={() => appendInclusion('' as unknown as { day: number; title: string; description: string })}
                                className="p-2 text-[#c9a962] hover:bg-[#c9a962]/10 rounded-lg transition-colors border border-[#c9a962]/20"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {inclusionFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <GripVertical className="w-4 h-4 text-white/30" />
                                    <input
                                        {...register(`inclusions.${index}` as `itinerary.${number}.title`)}
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30"
                                        placeholder="e.g., Airport transfers"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeInclusion(index)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exclusions */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Exclusions</h2>
                            <button
                                type="button"
                                onClick={() => appendExclusion('' as unknown as { day: number; title: string; description: string })}
                                className="p-2 text-[#c9a962] hover:bg-[#c9a962]/10 rounded-lg transition-colors border border-[#c9a962]/20"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {exclusionFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <GripVertical className="w-4 h-4 text-white/30" />
                                    <input
                                        {...register(`exclusions.${index}` as `itinerary.${number}.title`)}
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white placeholder-white/30"
                                        placeholder="e.g., Visa fees"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExclusion(index)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4 sticky bottom-4">
                    <Link
                        href="/admin/tours"
                        className="flex-1 px-6 py-3 text-center font-medium text-white/70 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {isEditing ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {isEditing ? 'Update Tour' : 'Create Tour'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
