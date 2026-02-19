import { notFound } from 'next/navigation';
import DestinationForm from '@/components/admin/DestinationForm';
import { getDestinationById } from '@/lib/actions/destinations';

interface EditDestinationPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
    const { id } = await params;
    const destination = await getDestinationById(id);
    if (!destination) notFound();
    return <DestinationForm initialData={destination} isEditing />;
}
