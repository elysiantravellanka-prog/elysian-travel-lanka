'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Testimonial, { ITestimonial } from '@/models/Testimonial';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

export type TestimonialFormData = {
    name: string;
    location: string;
    rating: number;
    message: string;
    image?: string;
    isApproved?: boolean;
};

export async function createTestimonial(data: TestimonialFormData) {
    try {
        await dbConnect();
        const testimonial = new Testimonial(data);
        await testimonial.save();
        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true, testimonial: JSON.parse(JSON.stringify(testimonial)) };
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return { success: false, error: 'Failed to create testimonial' };
    }
}

export async function updateTestimonial(id: string, data: Partial<TestimonialFormData>) {
    try {
        await dbConnect();
        const current = await Testimonial.findById(id);
        if (!current) return { success: false, error: 'Testimonial not found' };

        if (data.image && current.image && data.image !== current.image) {
            const publicId = getPublicIdFromUrl(current.image);
            if (publicId) await deleteImage(publicId);
        }

        const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true, testimonial: JSON.parse(JSON.stringify(testimonial)) };
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return { success: false, error: 'Failed to update testimonial' };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await dbConnect();
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) return { success: false, error: 'Testimonial not found' };

        if (testimonial.image) {
            const publicId = getPublicIdFromUrl(testimonial.image);
            if (publicId) await deleteImage(publicId);
        }

        await Testimonial.findByIdAndDelete(id);
        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return { success: false, error: 'Failed to delete testimonial' };
    }
}

export async function getTestimonials(): Promise<ITestimonial[]> {
    await dbConnect();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(testimonials));
}

export async function getApprovedTestimonials(): Promise<ITestimonial[]> {
    await dbConnect();
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(testimonials));
}
