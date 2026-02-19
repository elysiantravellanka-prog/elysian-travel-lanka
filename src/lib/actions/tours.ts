'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import TourPackage, { ITourPackage, IItineraryItem } from '@/models/TourPackage';
import { deleteMultipleImages, getPublicIdFromUrl } from '@/lib/cloudinary';

export type TourFormData = {
    title: string;
    price: number;
    duration: string;
    category: string;
    description: string;
    images: string[];
    itinerary: IItineraryItem[];
    inclusions: string[];
    exclusions: string[];
    groupSize: string;
    startLocation: string;
    isFeatured: boolean;
};

export async function createTour(data: TourFormData) {
    try {
        await dbConnect();

        const tour = new TourPackage(data);
        await tour.save();

        revalidatePath('/admin/tours');
        revalidatePath('/');
        revalidatePath('/packages');

        return { success: true, tour: JSON.parse(JSON.stringify(tour)) };
    } catch (error) {
        console.error('Error creating tour:', error);
        return { success: false, error: 'Failed to create tour' };
    }
}

export async function updateTour(id: string, data: Partial<TourFormData>) {
    try {
        await dbConnect();

        // Get current tour to compare images
        const currentTour = await TourPackage.findById(id);
        if (!currentTour) {
            return { success: false, error: 'Tour not found' };
        }

        // Find removed images and delete from Cloudinary
        if (data.images) {
            const removedImages = currentTour.images.filter(
                (img: string) => !data.images!.includes(img)
            );

            if (removedImages.length > 0) {
                const publicIds = removedImages
                    .map((url: string) => getPublicIdFromUrl(url))
                    .filter((id: string | null): id is string => id !== null);

                if (publicIds.length > 0) {
                    await deleteMultipleImages(publicIds);
                }
            }
        }

        // Update slug if title changed
        if (data.title && data.title !== currentTour.title) {
            (data as TourFormData & { slug: string }).slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const tour = await TourPackage.findByIdAndUpdate(id, data, { new: true });

        revalidatePath('/admin/tours');
        revalidatePath('/');
        revalidatePath('/packages');
        revalidatePath(`/packages/${tour?.slug}`);

        return { success: true, tour: JSON.parse(JSON.stringify(tour)) };
    } catch (error) {
        console.error('Error updating tour:', error);
        return { success: false, error: 'Failed to update tour' };
    }
}

export async function deleteTour(id: string) {
    try {
        await dbConnect();

        const tour = await TourPackage.findById(id);
        if (!tour) {
            return { success: false, error: 'Tour not found' };
        }

        // Delete all images from Cloudinary
        if (tour.images.length > 0) {
            const publicIds = tour.images
                .map((url: string) => getPublicIdFromUrl(url))
                .filter((id: string | null): id is string => id !== null);

            if (publicIds.length > 0) {
                await deleteMultipleImages(publicIds);
            }
        }

        await TourPackage.findByIdAndDelete(id);

        revalidatePath('/admin/tours');
        revalidatePath('/');
        revalidatePath('/packages');

        return { success: true };
    } catch (error) {
        console.error('Error deleting tour:', error);
        return { success: false, error: 'Failed to delete tour' };
    }
}

export async function getTours(): Promise<ITourPackage[]> {
    await dbConnect();
    const tours = await TourPackage.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(tours));
}

export async function getTourById(id: string) {
    await dbConnect();
    const tour = await TourPackage.findById(id).lean();
    return tour ? JSON.parse(JSON.stringify(tour)) : null;
}

export async function getTourBySlug(slug: string) {
    await dbConnect();
    const tour = await TourPackage.findOne({ slug }).lean();
    return tour ? JSON.parse(JSON.stringify(tour)) : null;
}

export async function getFeaturedTours() {
    await dbConnect();
    const tours = await TourPackage.find({ isFeatured: true }).limit(6).lean();
    return JSON.parse(JSON.stringify(tours));
}
