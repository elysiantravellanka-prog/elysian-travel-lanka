import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImage = async (publicId: string): Promise<boolean> => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return false;
    }
};

export const deleteMultipleImages = async (publicIds: string[]): Promise<boolean> => {
    try {
        await cloudinary.api.delete_resources(publicIds);
        return true;
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        return false;
    }
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
    try {
        const regex = /\/v\d+\/(.+)\./;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};

export default cloudinary;
