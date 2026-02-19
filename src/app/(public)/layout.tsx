import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="bg-[#0a1628] min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
