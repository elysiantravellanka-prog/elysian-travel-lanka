'use client';

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Plus, X, ImageIcon, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface CloudinaryUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
}

export default function CloudinaryUpload({
    value = [],
    onChange,
    maxFiles = 10
}: CloudinaryUploadProps) {
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const useSignedUpload = !uploadPreset;
    const [error, setError] = useState<string | null>(null);

    const handleUpload = (result: CloudinaryUploadWidgetResults) => {
        if (result?.info && typeof result.info === 'object' && 'secure_url' in result.info) {
            onChange([...value, result.info.secure_url]);
            setError(null);
        }
    };

    const handleError = (err: unknown) => {
        const message = typeof err === 'string' ? err : 'Upload failed. Check your Cloudinary preset.';
        setError(message);
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter(url => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {value.map((url, index) => (
                        <div key={url} className="relative aspect-video rounded-xl overflow-hidden group border border-white/10">
                            <Image
                                src={url}
                                alt={`Image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemove(url)}
                                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {index === 0 && (
                                <span className="absolute top-2 left-2 px-2 py-1 bg-[#c9a962] text-[#0a1628] text-xs font-medium rounded-md">
                                    Main
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {value.length < maxFiles && (
                <CldUploadWidget
                    uploadPreset={uploadPreset ?? ''}
                    signatureEndpoint={useSignedUpload ? '/api/cloudinary-signature' : undefined}
                    options={{
                        maxFiles: maxFiles - value.length,
                        resourceType: 'image',
                        folder: 'vistalanka/tours',
                        ...(cloudName ? { cloudName } : {}),
                        ...(useSignedUpload && apiKey ? { apiKey } : {}),
                    }}
                    onSuccess={handleUpload}
                    onError={handleError}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 transition-all duration-200 group hover:border-[#c9a962] hover:bg-[#c9a962]/5"
                        >
                            <div className="flex flex-col items-center text-white/50 group-hover:text-[#c9a962]">
                                <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[#c9a962]/10 flex items-center justify-center mb-4 transition-colors">
                                    {value.length > 0 ? (
                                        <Plus className="w-8 h-8" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8" />
                                    )}
                                </div>
                                <p className="font-medium">
                                    {value.length > 0 ? 'Add More Images' : 'Upload Images'}
                                </p>
                                <p className="text-sm mt-1">
                                    Click to upload (max {maxFiles} images)
                                </p>
                            </div>
                        </button>
                    )}
                </CldUploadWidget>
            )}

            {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <div>
                        <p className="font-semibold">Upload failed</p>
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
