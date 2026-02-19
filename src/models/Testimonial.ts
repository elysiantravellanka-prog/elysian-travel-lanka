import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
    name: string;
    location: string;
    rating: number;
    message: string;
    image?: string;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        message: { type: String, required: true },
        image: { type: String },
        isApproved: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
    mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
