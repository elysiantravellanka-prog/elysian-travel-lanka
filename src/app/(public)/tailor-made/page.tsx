'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { createInquiry } from '@/lib/actions/inquiries';

interface TailorMadeFormData {
    customerName: string;
    email: string;
    phone: string;
    travelDates: string;
    paxCount: number;
    budget: string;
    message: string;
}

const interestOptions = [
    'Wildlife & Safari',
    'Cultural Heritage',
    'Beach & Relaxation',
    'Adventure Sports',
    'Food & Cuisine',
    'Tea Plantations',
    'Ancient Temples',
    'Ayurveda & Wellness',
];

const budgetOptions = [
    'Economy ($500-$1000)',
    'Standard ($1000-$2000)',
    'Premium ($2000-$3500)',
    'Luxury ($3500+)',
];

export default function TailorMadePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TailorMadeFormData>();

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const onSubmit = async (data: TailorMadeFormData) => {
        setIsSubmitting(true);

        const result = await createInquiry({
            ...data,
            paxCount: Number(data.paxCount),
            interests: selectedInterests,
            inquiryType: 'tailor-made',
        });

        if (result.success) {
            setIsSuccess(true);
            reset();
            setSelectedInterests([]);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Hero */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d1d2e] to-[#0a1628]" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#c9a962]/5 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-[#c9a962]/5 rounded-full blur-3xl animate-float delay-300" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-3 glass px-5 py-2.5 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-[#c9a962]" />
                            <span className="text-white/70 text-sm tracking-wide">Bespoke Travel Design</span>
                        </div>
                        <h1 className="font-display text-5xl md:text-6xl text-white mb-6">
                            Your Dream Journey,
                            <span className="block gradient-text">Crafted Just for You</span>
                        </h1>
                        <p className="text-white/50 text-xl">
                            Tell us about your ideal vacation and our travel architects will design
                            a personalized experience that exceeds your expectations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    {isSuccess ? (
                        <div className="glass-card p-16 text-center">
                            <div className="w-24 h-24 rounded-full bg-[#c9a962]/20 flex items-center justify-center mx-auto mb-8">
                                <Check className="w-12 h-12 text-[#c9a962]" />
                            </div>
                            <h3 className="font-display text-3xl text-white mb-4">Request Submitted!</h3>
                            <p className="text-white/50 text-lg max-w-md mx-auto mb-8">
                                Thank you for sharing your travel dreams. Our team will craft
                                a personalized itinerary and contact you within 48 hours.
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <span className="relative z-10">Plan Another Journey</span>
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-8 md:p-12">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                {/* Personal Info */}
                                <div>
                                    <h2 className="font-display text-2xl text-white mb-6">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                                            <input
                                                {...register('customerName', { required: 'Name is required' })}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="John Smith"
                                            />
                                            {errors.customerName && <p className="mt-2 text-sm text-red-400">{errors.customerName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Email *</label>
                                            <input
                                                {...register('email', { required: 'Email is required' })}
                                                type="email"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-white/70 text-sm mb-2">Phone *</label>
                                            <input
                                                {...register('phone', { required: 'Phone is required' })}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="+1 234 567 8900"
                                            />
                                            {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Details */}
                                <div>
                                    <h2 className="font-display text-2xl text-white mb-6">Trip Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Travel Dates *</label>
                                            <input
                                                {...register('travelDates', { required: 'Travel dates are required' })}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="e.g., March 15-25, 2024"
                                            />
                                            {errors.travelDates && <p className="mt-2 text-sm text-red-400">{errors.travelDates.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Number of Travelers *</label>
                                            <input
                                                {...register('paxCount', { required: 'Number of travelers is required' })}
                                                type="number"
                                                min="1"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="e.g., 4"
                                            />
                                            {errors.paxCount && <p className="mt-2 text-sm text-red-400">{errors.paxCount.message}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-white/70 text-sm mb-2">Budget Range *</label>
                                            <select
                                                {...register('budget', { required: 'Budget is required' })}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                            >
                                                <option value="" className="bg-[#0a1628]">Select your budget</option>
                                                {budgetOptions.map((budget) => (
                                                    <option key={budget} value={budget} className="bg-[#0a1628]">{budget}</option>
                                                ))}
                                            </select>
                                            {errors.budget && <p className="mt-2 text-sm text-red-400">{errors.budget.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Interests */}
                                <div>
                                    <h2 className="font-display text-2xl text-white mb-2">Your Interests</h2>
                                    <p className="text-white/40 text-sm mb-6">Select all that apply</p>
                                    <div className="flex flex-wrap gap-3">
                                        {interestOptions.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleInterest(interest)}
                                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedInterests.includes(interest)
                                                        ? 'bg-[#c9a962] text-[#0a1628]'
                                                        : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <h2 className="font-display text-2xl text-white mb-6">Tell Us More</h2>
                                    <textarea
                                        {...register('message', { required: 'Please describe your dream trip' })}
                                        rows={5}
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors resize-none"
                                        placeholder="Describe your dream trip... What experiences are you looking for? Any special requirements or preferences?"
                                    />
                                    {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary inline-flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Submit Trip Request</span>
                                            <ArrowUpRight className="w-5 h-5 relative z-10" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
