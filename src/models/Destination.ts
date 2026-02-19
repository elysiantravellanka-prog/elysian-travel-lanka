import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDestination extends Document {
    name: string;
    description: string;
    image: string;
    highlights: string[];
    createdAt: Date;
    updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        highlights: [{ type: String }],
    },
    { timestamps: true }
);

const Destination: Model<IDestination> =
    mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);

export default Destination;
