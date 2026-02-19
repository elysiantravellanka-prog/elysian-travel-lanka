import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';

export interface IItineraryItem {
    day: number;
    title: string;
    description: string;
}

export interface ITourPackage extends Document {
    title: string;
    slug: string;
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
    createdAt: Date;
    updatedAt: Date;
}

const ItineraryItemSchema = new Schema<IItineraryItem>({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const TourPackageSchema = new Schema<ITourPackage>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        duration: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['Wildlife', 'Cultural', 'Adventure', 'Beach', 'Family', 'Honeymoon', 'Heritage'],
        },
        description: { type: String, required: true },
        images: [{ type: String }],
        itinerary: [ItineraryItemSchema],
        inclusions: [{ type: String }],
        exclusions: [{ type: String }],
        groupSize: { type: String, default: '2-15 persons' },
        startLocation: { type: String, default: 'Colombo' },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Create slug from title before saving
TourPackageSchema.pre('save', function (this: HydratedDocument<ITourPackage>) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

const TourPackage: Model<ITourPackage> =
    mongoose.models.TourPackage || mongoose.model<ITourPackage>('TourPackage', TourPackageSchema);

export default TourPackage;
