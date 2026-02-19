import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'super-admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface IAdminUserDocument extends IAdminUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminUserSchema = new Schema<IAdminUserDocument>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['admin', 'super-admin'],
            default: 'admin',
        },
    },
    { timestamps: true }
);

// Hash password before saving
AdminUserSchema.pre('save', async function (this: HydratedDocument<IAdminUserDocument>) {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
AdminUserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const AdminUser: Model<IAdminUserDocument> =
    mongoose.models.AdminUser || mongoose.model<IAdminUserDocument>('AdminUser', AdminUserSchema);

export default AdminUser;
