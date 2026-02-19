'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Inquiry, { IInquiry } from '@/models/Inquiry';

export type InquiryFormData = {
    customerName: string;
    email: string;
    phone: string;
    message: string;
    tourId?: string;
    tourTitle?: string;
    inquiryType: 'booking' | 'contact' | 'tailor-made';
    travelDates?: string;
    paxCount?: number;
    budget?: string;
    interests?: string[];
};

export async function createInquiry(data: InquiryFormData) {
    try {
        await dbConnect();
        const inquiry = new Inquiry(data);
        await inquiry.save();
        revalidatePath('/admin/inquiries');
        revalidatePath('/admin');
        return { success: true, inquiry: JSON.parse(JSON.stringify(inquiry)) };
    } catch (error) {
        console.error('Error creating inquiry:', error);
        return { success: false, error: 'Failed to submit inquiry' };
    }
}

export async function updateInquiryStatus(id: string, status: 'New' | 'Contacted' | 'Closed') {
    try {
        await dbConnect();
        const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
        revalidatePath('/admin/inquiries');
        revalidatePath('/admin');
        return { success: true, inquiry: JSON.parse(JSON.stringify(inquiry)) };
    } catch (error) {
        console.error('Error updating inquiry:', error);
        return { success: false, error: 'Failed to update inquiry' };
    }
}

export async function deleteInquiry(id: string) {
    try {
        await dbConnect();
        await Inquiry.findByIdAndDelete(id);
        revalidatePath('/admin/inquiries');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        return { success: false, error: 'Failed to delete inquiry' };
    }
}

export async function getInquiries(): Promise<IInquiry[]> {
    await dbConnect();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(inquiries));
}

export async function getInquiryById(id: string) {
    await dbConnect();
    const inquiry = await Inquiry.findById(id).lean();
    return inquiry ? JSON.parse(JSON.stringify(inquiry)) : null;
}
