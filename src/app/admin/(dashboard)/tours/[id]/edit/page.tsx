import { notFound } from 'next/navigation';
import TourForm from '@/components/admin/TourForm';
import { getTourById } from '@/lib/actions/tours';

interface EditTourPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTourPage({ params }: EditTourPageProps) {
    const { id } = await params;
    const tour = await getTourById(id);

    if (!tour) {
        notFound();
    }

    return <TourForm initialData={tour} isEditing />;
}
