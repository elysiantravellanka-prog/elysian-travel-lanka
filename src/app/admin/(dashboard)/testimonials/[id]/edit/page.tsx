import { notFound } from 'next/navigation';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { getTestimonials } from '@/lib/actions/testimonials';

interface EditTestimonialPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
    const { id } = await params;
    const testimonials = await getTestimonials();
    const found = testimonials.find(t => t._id?.toString() === id);
    if (!found) notFound();

    // Convert to form data format
    const testimonial = {
        _id: found._id?.toString(),
        name: found.name,
        location: found.location,
        rating: found.rating,
        message: found.message,
        image: found.image,
        isApproved: found.isApproved,
    };

    return <TestimonialForm initialData={testimonial} isEditing />;
}
