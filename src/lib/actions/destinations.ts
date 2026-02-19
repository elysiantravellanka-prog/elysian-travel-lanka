'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Destination, { IDestination } from '@/models/Destination';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

export type DestinationFormData = {
    name: string;
    description: string;
    image: string;
    highlights: string[];
};

export async function createDestination(data: DestinationFormData) {
    try {
        await dbConnect();
        const destination = new Destination(data);
        await destination.save();
        revalidatePath('/admin/destinations');
        revalidatePath('/');
        return { success: true, destination: JSON.parse(JSON.stringify(destination)) };
    } catch (error) {
        console.error('Error creating destination:', error);
        return { success: false, error: 'Failed to create destination' };
    }
}

export async function updateDestination(id: string, data: Partial<DestinationFormData>) {
    try {
        await dbConnect();
        const current = await Destination.findById(id);
        if (!current) return { success: false, error: 'Destination not found' };

        if (data.image && data.image !== current.image) {
            const publicId = getPublicIdFromUrl(current.image);
            if (publicId) await deleteImage(publicId);
        }

        const destination = await Destination.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/admin/destinations');
        revalidatePath('/');
        return { success: true, destination: JSON.parse(JSON.stringify(destination)) };
    } catch (error) {
        console.error('Error updating destination:', error);
        return { success: false, error: 'Failed to update destination' };
    }
}

export async function deleteDestination(id: string) {
    try {
        await dbConnect();
        const destination = await Destination.findById(id);
        if (!destination) return { success: false, error: 'Destination not found' };

        const publicId = getPublicIdFromUrl(destination.image);
        if (publicId) await deleteImage(publicId);

        await Destination.findByIdAndDelete(id);
        revalidatePath('/admin/destinations');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting destination:', error);
        return { success: false, error: 'Failed to delete destination' };
    }
}

export async function getDestinations(): Promise<IDestination[]> {
    await dbConnect();
    const destinations = await Destination.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(destinations));
}

export async function getDestinationById(id: string) {
    await dbConnect();
    const destination = await Destination.findById(id).lean();
    return destination ? JSON.parse(JSON.stringify(destination)) : null;
}
