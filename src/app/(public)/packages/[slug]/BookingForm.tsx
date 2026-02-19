'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send, Check, Calendar } from 'lucide-react';
import { createInquiry } from '@/lib/actions/inquiries';

const bookingSchema = z.object({
    customerName: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    message: z.string().min(10, 'Please provide some details about your trip'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    tourId: string;
    tourTitle: string;
}

export default function BookingForm({ tourId, tourTitle }: BookingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
    });

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);

        const result = await createInquiry({
            ...data,
            tourId,
            tourTitle,
            inquiryType: 'booking',
        });

        if (result.success) {
            setIsSuccess(true);
            reset();
        }
        setIsSubmitting(false);
    };

    if (isSuccess) {
        return (
            <div className="glass-card p-4 sm:p-6 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#c9a962]/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Check className="w-7 h-7 sm:w-8 sm:h-8 text-[#c9a962]" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-base sm:text-lg">Inquiry Sent!</h3>
                <p className="text-xs sm:text-sm text-white/60">
                    Thank you for your interest. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#c9a962] hover:underline"
                >
                    Send another inquiry
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a962]" />
                <h3 className="font-semibold text-white text-sm sm:text-base">Book This Tour</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                <div>
                    <input
                        {...register('customerName')}
                        placeholder="Your Name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white text-sm placeholder:text-white/30"
                    />
                    {errors.customerName && (
                        <p className="mt-1 text-xs text-red-400">{errors.customerName.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white text-sm placeholder:text-white/30"
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register('phone')}
                        placeholder="Phone Number"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white text-sm placeholder:text-white/30"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <textarea
                        {...register('message')}
                        rows={3}
                        placeholder="Tell us about your trip (dates, travelers, special requests...)"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#c9a962]/50 focus:border-[#c9a962] outline-none text-white text-sm resize-none placeholder:text-white/30"
                    />
                    {errors.message && (
                        <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#c9a962] to-[#a88b4a] text-[#0a1628] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                            Send Inquiry
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
