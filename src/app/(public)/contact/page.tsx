'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Check, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { createInquiry } from '@/lib/actions/inquiries';

interface ContactFormData {
    customerName: string;
    email: string;
    phone: string;
    message: string;
}

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        const result = await createInquiry({
            ...data,
            inquiryType: 'contact',
        });

        if (result.success) {
            setIsSuccess(true);
            reset();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Hero */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d1d2e] to-[#0a1628]" />
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#c9a962]/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-[#c9a962] text-sm tracking-widest uppercase mb-4 block">Get in Touch</span>
                        <h1 className="font-display text-5xl md:text-6xl text-white mb-6">
                            Let&apos;s Start a Conversation
                        </h1>
                        <p className="text-white/50 text-xl">
                            Have questions about our experiences? We&apos;d love to hear from you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div>
                            <h2 className="font-display text-3xl text-white mb-8">Reach Out to Us</h2>
                            <p className="text-white/50 mb-12 leading-relaxed">
                                Our travel architects are ready to help you plan your perfect Sri Lankan escape.
                                Connect with us through any of the channels below.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: MapPin, title: 'Visit Us', content: '123 Galle Road, Colombo 03, Sri Lanka' },
                                    { icon: Phone, title: 'Call Us', content: '+94 777 123 456', href: 'tel:+94777123456' },
                                    { icon: Mail, title: 'Email Us', content: 'hello@elysiantravels.com', href: 'mailto:hello@elysiantravels.com' },
                                    { icon: Clock, title: 'Working Hours', content: 'Mon - Fri: 9AM - 6PM · Sat: 9AM - 2PM' },
                                ].map((item, index) => (
                                    <div key={index} className="gradient-border p-6 flex items-start gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-[#c9a962]/10 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-6 h-6 text-[#c9a962]" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                                            {item.href ? (
                                                <a href={item.href} className="text-white/50 hover:text-[#c9a962] transition-colors">
                                                    {item.content}
                                                </a>
                                            ) : (
                                                <p className="text-white/50">{item.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            {isSuccess ? (
                                <div className="glass-card p-12 text-center">
                                    <div className="w-20 h-20 rounded-full bg-[#c9a962]/20 flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-10 h-10 text-[#c9a962]" />
                                    </div>
                                    <h3 className="font-display text-2xl text-white mb-3">Message Sent!</h3>
                                    <p className="text-white/50 mb-8">
                                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="btn-primary inline-flex items-center gap-2"
                                    >
                                        <span className="relative z-10">Send Another Message</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="glass-card p-8 md:p-10">
                                    <h2 className="font-display text-2xl text-white mb-8">Send a Message</h2>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Your Name</label>
                                            <input
                                                {...register('customerName', { required: 'Name is required' })}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="John Smith"
                                            />
                                            {errors.customerName && (
                                                <p className="mt-2 text-sm text-red-400">{errors.customerName.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Email Address</label>
                                            <input
                                                {...register('email', { required: 'Email is required' })}
                                                type="email"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                                            <input
                                                {...register('phone', { required: 'Phone is required' })}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                                                placeholder="+1 234 567 8900"
                                            />
                                            {errors.phone && (
                                                <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-white/70 text-sm mb-2">Message</label>
                                            <textarea
                                                {...register('message', { required: 'Message is required' })}
                                                rows={5}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors resize-none"
                                                placeholder="How can we help you?"
                                            />
                                            {errors.message && (
                                                <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full btn-primary inline-flex items-center justify-center gap-3 disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Send Message</span>
                                                    <ArrowUpRight className="w-5 h-5 relative z-10" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
