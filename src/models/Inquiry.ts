import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IInquiry extends Document {
    customerName: string;
    email: string;
    phone: string;
    message: string;
    tourId?: Types.ObjectId;
    tourTitle?: string;
    status: 'New' | 'Contacted' | 'Closed';
    inquiryType: 'booking' | 'contact' | 'tailor-made';
    // Additional fields for tailor-made inquiries
    travelDates?: string;
    paxCount?: number;
    budget?: string;
    interests?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
    {
        customerName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String, required: true },
        tourId: { type: Schema.Types.ObjectId, ref: 'TourPackage' },
        tourTitle: { type: String },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Closed'],
            default: 'New',
        },
        inquiryType: {
            type: String,
            enum: ['booking', 'contact', 'tailor-made'],
            default: 'contact',
        },
        travelDates: { type: String },
        paxCount: { type: Number },
        budget: { type: String },
        interests: [{ type: String }],
    },
    { timestamps: true }
);

const Inquiry: Model<IInquiry> =
    mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
